<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class PlanController extends Controller
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
                        return Yii::$app->common->checkPermission('Membership Plans', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $connection = Yii::$app->db;
            $transaction = $connection->beginTransaction();
            $scenario = [];
            try {
                $model = new \app\models\Plans;
                $id = isset($_POST['id']) ? $_POST['id'] : "";
                $POST['Plans'] = $_POST['fields'];
                if (isset($id) && !empty($id)) {
                    $find = $model->find()->where(['id' => $id])->one();
                    if ($find && $find->load($POST) && $find->save()) {
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Plan has been updated successfully.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => "Plan not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    if ($model->save()) {
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Plan has been added successfully.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => $model->getErrors(),
                    ];
                }
            } catch (\Exception $e) {
                $transaction->rollBack();
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
                'id' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'duration' => [
                    'asc' => ['duration' => SORT_ASC],
                    'desc' => ['duration' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['duration' => SORT_ASC],
        ]);

        $model = new \app\models\Plans;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'name', $search->name]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'plans' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'plans' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Plans;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'plan' => $find,
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

    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Plans;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Plan has been deleted successfully.',
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
}
