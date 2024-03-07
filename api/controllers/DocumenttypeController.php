<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class DocumenttypeController extends Controller
{

    public $enableCsrfValidation = false;

    public function init()
    {
        parent::init();
        Yii::$app->response->format = Response::FORMAT_JSON;
        \Yii::$app->user->enableSession = false;
        $_POST = json_decode(file_get_contents('php://input'), true);
        $_GET['SearchForm'] = json_decode($_GET['fields'], true);
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
            'except' => ['list'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Document Types', $action->id);
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
                $model = new \app\models\DocumentTypes;
                $POST['DocumentTypes'] = $_POST['fields'];
                if (isset($POST['DocumentTypes']['id']) && !empty($POST['DocumentTypes']['id'])) {
                    $find = $model->find()->where(['id' => $POST['DocumentTypes']['id']])->one();
                    if ($find && $find->load($POST) && $find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Document Type has been updated successfully.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    if ($model->save()) {
                        return [
                            'success' => true,
                            'message' => 'Document Type has been added successfully.',
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
                'name' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);

        $model = new \app\models\DocumentTypes;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        if ($search->load($_GET)) {
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
                'types' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'types' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\DocumentTypes;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'document' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Document Type not found!',
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
                'message' => 'Document Type not found!',
            ];
        }
    }

    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\DocumentTypes;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Document Type has been deleted successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Document Type not found!',
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
                'message' => 'Document Type not found!',
            ];
        }
    }
}
