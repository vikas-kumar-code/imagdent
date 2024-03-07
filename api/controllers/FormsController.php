<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class FormsController extends Controller
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
                        return Yii::$app->common->checkPermission('Forms', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $model = new \app\models\Questions;
                $POST['Questions'] = $_POST['fields'];
                if ($model->load($POST)) {
                    if (isset($POST['Questions']['id'])){
                        $find = $model->find()->where(['id' => $POST['Questions']['id']])->one();
                        if ($find && $find->load($POST) && $find->save()) {
                            return [
                                'success' => true,
                                'message' => 'Form updated successfully.'
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => $find->getErrors()
                            ];
                        }
                    } else if ($model->save()) {
                        return [
                            'success' => true,
                            'message' => 'Form saved successfully.'
                        ];
                } else {
                    return [
                        'error' => true,
                        'message' => $model->getErrors()
                    ];
                    }
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
                'message' => 'Invalid request!'
            ];
        }
    }


    public function actionList($pageSize = 50)
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
            ],
            'defaultOrder' => ['id' => SORT_ASC],
        ]);

        $model = new \app\models\Questions;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        /* $GET['SearchForm'] = json_decode($_GET['fields'], true);
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'name', $search->name]);
            }
        } */

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'forms' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'forms' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Questions;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    $find['form_json'] = json_decode($find['form_json']);
                    return [
                        'success' => true,
                        'form' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Form not found!',
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
    }

    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Questions;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Form has been deleted successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Form not found!',
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
                'message' => 'Form not found!',
            ];
        }
    }
}
