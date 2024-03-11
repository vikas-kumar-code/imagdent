<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

/**

 * Service controller for the `Services` module

 */

class ServiceController extends Controller
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
                    //'except' => ['list'],
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Services', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Service~Services~add~/admin/services~fa fa-hand-holding-usd
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            try {
                $model = new \app\models\Services;
                $POST['Services'] = $_POST['fields'];
                if (isset($POST['Services']['locations']) && !empty($POST['Services']['locations'])) {
                    $locations = [];
                    foreach ($POST['Services']['locations'] as $key => $val) {
                        $locations[$key] = $val['value'];
                    }
                    $POST['Services']['locations'] = implode(",", $locations);
                }
                if (isset($POST['Services']['id']) && !empty($POST['Services']['id'])) {
                    $find = $model->find()->where(['id' => $POST['Services']['id']])->one();
                    if ($find) {
                        $find->load($POST);
                        $find->updated_on = date("Y-m-d H:i:s");
                        if ($find->save()) {
                            return [
                                'success' => true,
                                'message' => 'Service has been updated successfully.',
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => $find->getErrors(),
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => "Service not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    if ($model->save()) {
                        return [
                            'success' => true,
                            'message' => 'Service has been added successfully.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => $model->getErrors(),
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

    public function actionList($pageSize = 50)
    {

        $response = [];
        $data = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['services.name' => SORT_ASC],
                    'desc' => ['services.name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'code' => [
                    'asc' => ['code' => SORT_ASC],
                    'desc' => ['code' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);

        $model = new \app\models\Services;
        $query = $model->find()->joinWith(['locations', 'parent p']); //->where(['!=','services.parent_id',0])

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'services.name', $search->name]);
            }
            if (!empty($search->code)) {
                $query->andWhere(['LIKE', 'services.code', $search->code]);
            }
            if (!empty($search->ada_code)) {
                $query->andWhere(['LIKE', 'services.ada_code', $search->ada_code]);
            }
            if (!empty($search->cpt_code)) {
                $query->andWhere(['LIKE', 'services.cpt_code', $search->cpt_code]);
            }
            if (!empty($search->parent_id)) {
                $query->andWhere(['services.parent_id' => $search->parent_id]);
            }
        }

        $countQuery = clone $query;
        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'services' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'services' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGetOne($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Services;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'service' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Service not found!',
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

    //Label~Module~Action~Url~Icon:Delete Service~Services~delete~/admin/services~fa fa-hand-holding-usd
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Services;
                $find = $model->find()->joinWith(['child as c'])->where(['services.id' => $_POST['id']])->one();
                if ($find) {
                    if (empty($find->child)) {
                        if ($find->delete()) {
                            $price_model =  new \app\models\LocationPrice;
                            $find_price = $price_model->find()->where(['service_id' => $_POST['id']])->all();
                            if (count($find_price)) {
                                $price_model->deleteAll(['service_id' => $_POST['id']]);
                            }
                            return [
                                'success' => true,
                                'message' => 'Service has been deleted successfully.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Can not be deleted as this server contains other servives.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Service not found!',
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

                'message' => 'Service not found!',

            ];
        }
    }

    public function actionAddPrice()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $service_id = $_POST['service_id'];
                $locations = $_POST['locations'];
                $locationArr = [];
                foreach ($locations as $key => $value) {
                    if (isset($value) && !empty($value)) {
                        $model = new \app\models\LocationPrice;
                        $find = $model->find()->where(['service_id' => $service_id, 'location_id' => $key])->one();
                        if ($find) {
                            $find->price = (isset($value['price']) && !empty($value['price']) ? $value['price'] : "");
                            $find->status = $value['status'];
                            if ($find->validate()) {
                                $i++;
                                $find->save();
                                $locationArr[] = $find->location_id;
                            } else {
                                print_r($find->getErrors());
                                die;
                            }
                        } else {
                            $model->location_id = $key;
                            $model->service_id = $service_id;
                            $model->price = (isset($value['price']) && !empty($value['price']) ? $value['price'] : "");
                            $model->status = $value['status'];
                            if ($model->validate()) {
                                $i++;
                                $model->save();
                                $locationArr[] = $model->location_id;
                            } else {
                                print_r($model->getErrors());
                                die;
                            }
                        }
                    }
                }

                if (!empty($locationArr)) {
                    \app\models\LocationPrice::deleteAll([
                        'and',
                        ['not in', 'location_id', $locationArr],
                        ['=', 'service_id', $service_id],
                    ]);
                    return [
                        'success' => true,
                        'message' => 'Price has been added successfully.',
                    ];
                } else {
                    return [
                        'success' => true,
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
                'message' => 'No price set for any location.Try Again!',
            ];
        }
    }

    public function actionGetPrice()
    {
        if (isset($_GET['service_id']) && !empty($_GET['service_id'])) {
            try {
                $model = new \app\models\LocationPrice;
                $find = $model->find()->where(['service_id' => $_GET['service_id']])->asArray()->all();
                if ($find) {
                    return [
                        'success' => true,
                        'priceList' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'priceList' => null,
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

    public function actionUpdateAppearance()
    {

        if (isset($_POST) && !empty($_POST)) {
            try {
                $i = 0;
                foreach ($_POST['fields'] as $key => $val) {
                    $model = new \app\models\Services;
                    $find = $model->findOne(['id' => $key]);
                    if ($find) {
                        $find->sequence = $val;
                        $find->save();
                        $i++;
                    }
                }
                if ($i > 0) {
                    return [
                        'success' => true,
                        'message' => 'Sequence has been updated successfully.',
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
}
