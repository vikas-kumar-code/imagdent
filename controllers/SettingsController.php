<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class SettingsController extends Controller
{

    public $enableCsrfValidation = false;

    public function init()
    {
        parent::init();
        Yii::$app->response->format = Response::FORMAT_JSON;
        \Yii::$app->user->enableSession = false;
        $_POST = json_decode(file_get_contents('php://input'), true);
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        if ($_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
            $behaviors['authenticator'] = [
                'except' => [],
                'class' => CompositeAuth::className(),
                'authMethods' => [
                    HttpBearerAuth::className(),
                    //QueryParamAuth::className(),
                ],
            ];
        }
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
        ];
        $behaviors['access'] = [
            'class' => \yii\filters\AccessControl::className(),
            'only' => [],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Settings', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    public function actionAddBanner()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $model = new \app\models\Banners;
                $POST['Banners'] = $_POST['fields'];
                if (isset($POST['Banners']['id']) && !empty($POST['Banners']['id'])) {
                    $find = $model->find()->where(['id'=>$POST['Banners']['id']])->one();
                    $find->load($POST);
                    if (isset($POST['Banners']['file']) && !empty($POST['Banners']['file'])) {
                        if(strpos($POST['Banners']['file']['file_name'], "temp") != false){
                            $new_file_name = mt_rand(111111, 999999) . "." . $POST['Banners']['file']['extension'];
                            copy($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Banners']['file']['file_name'], $_SERVER['DOCUMENT_ROOT'] . "/images/" . $new_file_name);
                            $find->file_name = $new_file_name;
                            unlink($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Banners']['file']['file_name']);
                        }
                    }
                    if ($find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Banner image has been updated successfully.',
                        ];
                    }
                    else{
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }
                }
                else if ($model->load($POST)){
                    if (isset($POST['Banners']['file']) && !empty($POST['Banners']['file'])) {
                        if(strpos($POST['Banners']['file']['file_name'], "temp") != false){
                            $new_file_name = mt_rand(111111, 999999) . "." . $POST['Banners']['file']['extension'];
                            copy($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Banners']['file']['file_name'], $_SERVER['DOCUMENT_ROOT'] . "/images/" . $new_file_name);
                            $model->file_name = $new_file_name;
                            unlink($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Banners']['file']['file_name']);
                        }
                    }
                    if ($model->save()) {
                        return [
                            'success' => true,
                            'message' => 'Banner image has been added successfully.',
                        ];
                    }
                    else{
                        return [
                            'error' => true,
                            'message' => $model->getErrors(),
                        ];
                    }
                }
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
    }

    public function actionListBanners($pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'id' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sequence' => [
                    'asc' => ['sequence' => SORT_ASC],
                    'desc' => ['sequence' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['sequence' => SORT_ASC],
        ]);

        $model = new \app\models\Banners;
        $query = $model->find();

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'banners' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'banners' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGetBanner($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Banners;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'banner' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Plan not found!',
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        } else {
            return [
                'error' => true,
                'message' => 'Plan not found!',
            ];
        }
    }

    public function actionDeleteBanner()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Banners;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find) {
                    $file_name = $find->file_name;
                    if(file_exists($_SERVER['DOCUMENT_ROOT'] . "/images/" . $file_name)){
                        unlink($_SERVER['DOCUMENT_ROOT'] . "/images/" . $file_name);
                    }
                    if($find->delete()){
                        return [
                            'success' => true,
                            'message' => 'Banner has been deleted successfully.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Banner not found!',
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        } else {
            return [
                'error' => true,
                'message' => 'Banner not found!',
            ];
        }
    }

    public function actionUpdateSequence()
    {
        //print_r($_POST);die();
        if (isset($_POST['banners']) && !empty($_POST['banners'])) {
            try {
                $update = 0;
                foreach($_POST['banners'] as $key=>$val){
                    $model = new \app\models\Banners;
                    $find = $model->find()->where(['id' => $val['id']])->one();
                    if($find){
                        $find->sequence = $key;
                        if($find->save()){
                            $update++;
                        }
                    }
                }
                if($update > 0){
                    return [
                        'success' => true,
                        'message' => 'Sequence updated successfully.',
                    ];
                }

            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }

        } else {
            return [
                'error' => true,
                'message' => 'Banner not found!',
            ];
        }

    }
}
