<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class SlotController extends Controller
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
            'except' => ['list'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Time Slots', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Slot~Time Slots~add~/admin/time-slots~fa fa-clock
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            try {
                $model = new \app\models\Slots;
                $POST['Slots'] = $_POST['fields'];
                date_default_timezone_set('America/Los_Angeles');
                $POST['Slots']['from_time'] = date('H:i', strtotime($POST['Slots']['from_time']));
                $POST['Slots']['to_time'] = date('H:i', strtotime($POST['Slots']['to_time'])); 
                if(!isset($POST['Slots']['location_id'])){
                    $POST['Slots']['location_id'] = $POST['Slots']['location_id']['value'];
                }                
                if (isset($POST['Slots']['id']) && !empty($POST['Slots']['id'])) {
                    $find = $model->find()->where(['!=', 'id', $POST['Slots']['id']])->andWhere(['day_index' => $POST['Slots']['day_index'], 'from_time' => $POST['Slots']['from_time'], 'location_id' => $POST['Slots']['location_id']])->one();
                    if ($find) {
                        return [
                            'error' => true,
                            'message' => 'Slot starts from ' . $POST['Slots']['from_time'] . ' already exists.',
                        ];
                    } else {
                        $find = $model->find()->where(['id' => $POST['Slots']['id']])->one();
                        if ($find && $find->load($POST) && $find->save()) {
                            return [
                                'success' => true,
                                'message' => 'Slot has been updated successfully.',
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => $find->getErrors(),
                            ];
                        }
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    $find = $model->find()->where(['day_index' => $POST['Slots']['day_index'], 'from_time' => $POST['Slots']['from_time'], 'location_id' => $POST['Slots']['location_id']])->one();
                    if ($find) {
                        return [
                            'error' => true,
                            'message' => 'Slot starts from ' . $POST['Slots']['from_time'] . ' already exists.',
                        ];
                    } else if ($model->save()) {
                        return [
                            'success' => true,
                            'message' => 'Slot has been added successfully.',
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

    //Label~Module~Action~Url~Icon:List slots~Time Slots~list~/admin/time-slots~fa fa-clock
    public function actionList($pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'from_time' => [
                    'asc' => ['from_time' => SORT_ASC],
                    'desc' => ['from_time' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['from_time' => SORT_ASC],
        ]);

        $model = new \app\models\Slots;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if (!empty($GET['SearchForm']) && $search->load($GET)) {            
            if (!empty($search->location_id)) {
                $query->andWhere(['location_id' => $search->location_id]);
            } 
            if (!empty($search->day_index)) {
                $query->andWhere(['day_index' => $search->day_index]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'slots' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'slots' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Slot~Time Slots~get~/admin/time-slots~fa fa-clock
    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Slots;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                //echo $find->createCommand()->getRawSql();die;
                if ($find) {
                    $record = [
                        'id' => $find['id'],
                        'day_index' => $find['day_index'],
                        'from_time' => date("Y-m-d ") . $find['from_time'],
                        'to_time' => date("Y-m-d ") . $find['to_time'],
                        'location_id' => $find['location_id'],
                    ];
                    return [
                        'success' => true,
                        'slot' => $record,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Slot not found!',
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
                'message' => 'Slot Type not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Slot~Time Slots~delete~/admin/time-slots~fa fa-clock
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $find = \app\models\Cases::find()->where(['slot_id'=>$_POST['id']])->andWhere(['>=','appointment_date',date('Y-m-d H:i:s')])->one();
                if($find){
                    $transaction->commit();
                    return [
                        'error' => true,
                        'message' => 'This slot is being used for future case.',
                    ];
                }
                else{
                    $model = new \app\models\Slots;
                    \app\models\Cases::updateAll(['slot_id' => null], ['slot_id' => $_POST['id']]);
                    $find = $model->find()->where(['id' => $_POST['id']])->one();
                    if ($find && $find->delete()) {
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Slot has been deleted successfully.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Slot Type not found!',
                        ];
                    }
                }
            } catch (\Exception $e) {
                $transaction->rollBack();
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
