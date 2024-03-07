<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;
use yii\helpers\ArrayHelper;


/**
 * Scheduler controller for the `Clinic` module
 */
class SchedulerController extends Controller
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
            'except' => ['get-case-list'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Scheduler', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Scheduler List~Scheduler~get-case-list~/admin/scheduler~fa fa-calendar
    public function actionGetCaseList()
    {
        $response = $find = [];
        $model = new \app\models\Cases;
        $models = new \app\models\UnAvailability;
        //get list from cases table
        $query = $model->find()->joinWith([
            'patient', 'user' => function ($q) {
                $q->select(Yii::$app->params['user_table_select_columns_new']);
            },
            'clinic', 'location', 'slot'
        ])->where(['IS NOT', 'appointment_date', NULL])->andWhere(['NOT',['cases.status'=> [9]]]);
        if (!in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            $query->andWhere(['cases.user_id' => Yii::$app->user->identity->id]);
        }

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->location_id)) {
                $query->andWhere(['cases.location_id' => $search->location_id]);
            }
            if (!empty($search->currentDate) && !empty($search->view)) {
                $year = date('Y', strtotime($search->currentDate));
                $month = date('m', strtotime($search->currentDate));
                $day = date('d', strtotime($search->currentDate));
                $yearWeek = date('oW', strtotime($search->currentDate));
                if ($search->view == 'Day') {
                    $query->andWhere(['YEAR(appointment_date)' => $year])->andWhere(['MONTH(appointment_date)' => $month])->andWhere(['DAY(appointment_date)' => $day]);
                }
                if ($search->view == 'Week') {
                    $query->andWhere(['YEARWEEK(appointment_date)' => $yearWeek]);
                }
                if ($search->view == 'Month') {
                    $query->andWhere(['YEAR(appointment_date)' => $year])->andWhere(['MONTH(appointment_date)' => $month]);
                }
            }
        }
        $find = $query->asArray()->all();
        //echo $query->createCommand()->getRawSql();die;
        //get list from un availability table
        $schedule = $models->find()->joinWith(['user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'location'])->where(['!=', 'appointment_date', 'NULL'])->andWhere(['!=', 'from_time', 'NULL'])->andWhere(['!=', 'to_time', 'NULL']);
        if (!in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            $schedule->andWhere(['un_availability.user_id' => Yii::$app->user->identity->id]);
        }

        if ($search->load($GET)) {
            if (!empty($search->location_id)) {
                $schedule->andWhere(['un_availability.location_id' => $search->location_id]);
            }
        }
        $blocked = $schedule->asArray()->all();
        $newFind = [];
        foreach($find as $f){
            if(isset($f['slot']) && is_array($f['slot'])){
                $newFind[] = $f;
            }
        }
        $response = [
            'success' => true,
            'cases' => $newFind,
            'blocked' => $blocked,
        ];
        return $response;
    }

    //Label~Module~Action~Url~Icon:Scheduler Save Un Availability~Scheduler~save-un-availability~/admin/scheduler~fa fa-calendar
    public function actionSaveUnAvailability()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            $transaction = \Yii::$app->db->beginTransaction();
             try {
                $model = new \app\models\UnAvailability;
                $POST['UnAvailability'] = $_POST['fields'];
                $POST['UnAvailability']['user_id'] = Yii::$app->user->identity->id;
                $POST['UnAvailability']['appointment_date'] = date('Y-m-d', strtotime($POST['UnAvailability']['appointment_date']));
                $POST['UnAvailability']['from_time'] = date('H:i', strtotime($POST['UnAvailability']['from_time']));

                if ($POST['UnAvailability']['to_time'] == '00:00:00') {
                    $POST['UnAvailability']['to_time'] = date('H:i', strtotime('23:59:00'));
                } else {
                    $POST['UnAvailability']['to_time'] = date('H:i', strtotime($POST['UnAvailability']['to_time']));
                }
                $case = new \app\models\Cases;
                //check data inside cases table
                $case_dtls = $case->find()->joinWith(['slot'])->where(['appointment_date' => $POST['UnAvailability']['appointment_date'], 'cases.location_id' => $POST['UnAvailability']['location_id']])->all();

                if (isset($POST['UnAvailability']['id']) && !empty($POST['UnAvailability']['id'])) {
                    $find = $model->find()->where(['id' => $POST['UnAvailability']['id']])->one();
                    if ($find && $find->load($POST)) {
                        //check data inside un availability table
                        $exist_dtls = $model->find()->where(['appointment_date' => $POST['UnAvailability']['appointment_date'], 'location_id' => $POST['UnAvailability']['location_id']])->andWhere(['!=', 'id', $POST['UnAvailability']['id']])->all();
                        if (!empty($case_dtls)) {
                            foreach ($case_dtls as $case_dtl) {
                                if (!empty($POST['UnAvailability']['from_time']) && !empty($POST['UnAvailability']['to_time'])) {
                                    if (date('H:i', strtotime($case_dtl->slot->from_time)) == $POST['UnAvailability']['from_time']) {
                                        $transaction->rollBack();
                                        return [
                                            'error' => true, 'message' => 'Start time already exists on Date ' . $POST['UnAvailability']['appointment_date'],
                                        ];
                                    } 
                                }
                            }
                            if ($find->save()) {
                                $transaction->commit();
                                return [
                                    'success' => true,
                                    'message' => 'Event updated successfully.',
                                ];
                            }
                        } else if (!empty($exist_dtls)) {
                            foreach ($exist_dtls as $exist_dtl) {
                                if (date('H:i', strtotime($exist_dtl->from_time)) == $POST['UnAvailability']['from_time']) {
                                    $transaction->rollBack();
                                    return [
                                        'error' => true, 'message' => 'Start time already exists on Date ' . $POST['UnAvailability']['appointment_date'],
                                    ];
                                } else {
                                    if (date('H:i', strtotime($exist_dtl->from_time)) != $POST['UnAvailability']['from_time'] && date('H:i', strtotime($exist_dtl->from_time)) < $POST['UnAvailability']['from_time']) {
                                        $time_ranges  = [];
                                        $format = 'H:i';
                                        $step = 900;
                                        $first_time = date('H:i', strtotime($exist_dtl->from_time));
                                        $second_time = date('H:i', strtotime($exist_dtl->to_time));
                                        $start = strtotime($first_time) - strtotime('TODAY');
                                        $end = strtotime($second_time) - strtotime('TODAY');
                                        foreach (range($start, $end, $step) as $increment) {
                                            $increment = gmdate('H:i', $increment);

                                            list($hour, $minutes) = explode(':', $increment);

                                            $date = new \DateTime($hour . ':' . $minutes);
                                            $date->modify("-1 second");
                                            $time_ranges[] = $date->format($format);
                                        }

                                        if (in_array($POST['UnAvailability']['from_time'], $time_ranges)) {
                                            $transaction->rollBack();
                                            return [
                                                'error' => true,
                                                'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                            ];
                                        } else if ($find->save()) {
                                            $transaction->commit();
                                            return [
                                                'success' => true,
                                                'message' => 'Event updated successfully.',
                                            ];
                                        }
                                    } else if (date('H:i', strtotime($exist_dtl->from_time)) > $POST['UnAvailability']['from_time']) {
                                        $time_ranges  = [];
                                        $format = 'H:i';
                                        $step = 900;
                                        $first_time = date('H:i', strtotime($exist_dtl->from_time));//10:30
                                        $second_time = date('H:i', strtotime($exist_dtl->to_time));//11:00
                                        $start = strtotime($first_time) - strtotime('TODAY');//37800 11:30
                                        $end = strtotime($second_time) - strtotime('TODAY');//12:00
                                        foreach (range($start, $end, $step) as $increment) {
                                            $increment = gmdate('H:i', $increment);

                                            list($hour, $minutes) = explode(':', $increment);

                                            $date = new \DateTime($hour . ':' . $minutes);
                                            $date->modify("-1 second");
                                            $time_ranges[] = $date->format($format);
                                        }
                                        //10:30 10:45 11:00
                                        //dd($time_ranges);
                                        if (in_array($POST['UnAvailability']['from_time'], $time_ranges)) {
                                            $transaction->rollBack();
                                            return [
                                                'error' => true,
                                                'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                            ];
                                        } else if (in_array($POST['UnAvailability']['to_time'], $time_ranges)) {
                                            $transaction->rollBack();
                                            return [
                                                'error' => true,
                                                'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                            ];
                                        } else if ($find->save()) {
                                            $transaction->commit();
                                            return [
                                                'success' => true,
                                                'message' => 'Event updated successfully.',
                                            ];
                                        }
                                    }
                                }
                            }
                        } else if ($find->save()) {
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Event updated successfully.',
                            ];
                        }
                    } else {
                        $transaction->rollBack();
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    //check data inside un availability table
                    $exist_dtls = $model->find()->where(['appointment_date' => $POST['UnAvailability']['appointment_date'], 'location_id' => $POST['UnAvailability']['location_id']])->all();
                    if (!empty($case_dtls)) {
                        foreach ($case_dtls as $case_dtl) {
                            if (!empty($POST['UnAvailability']['from_time']) && !empty($POST['UnAvailability']['to_time'])) {
                                if ($case_dtl->slot != null && date('H:i', strtotime($case_dtl->slot->from_time)) == $POST['UnAvailability']['from_time']) {
                                    return [
                                        'error' => true, 'message' => 'Start time already occupied for the ' . $POST['UnAvailability']['appointment_date'],
                                    ];
                                } 
                            }
                        }
                        if ($model->save()) {
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Slot has been blocked successfully.',
                            ];
                        }
                    } else if (!empty($exist_dtls)) {
                        foreach ($exist_dtls as $exist_dtl) {
                            if (date('H:i', strtotime($exist_dtl->from_time)) == $POST['UnAvailability']['from_time']) {
                                return [
                                    'error' => true, 'message' => 'Start time already exists on Date ' . $POST['UnAvailability']['appointment_date'],
                                ];
                            } else {
                                if (date('H:i', strtotime($exist_dtl->from_time)) != $POST['UnAvailability']['from_time']) {
                                    $time_ranges  = [];
                                    $format = 'H:i';
                                    $step = 900;
                                    $first_time = date('H:i', strtotime($exist_dtl->from_time));
                                    $second_time = date('H:i', strtotime($exist_dtl->to_time));
                                    $start = strtotime($first_time) - strtotime('TODAY');
                                    $end = strtotime($second_time) - strtotime('TODAY');
                                    foreach (range($start, $end, $step) as $increment) {
                                        $increment = gmdate('H:i', $increment);

                                        list($hour, $minutes) = explode(':', $increment);

                                        $date = new \DateTime($hour . ':' . $minutes);

                                        $time_ranges[] = $date->format($format);
                                    }
                                    
                                    if (in_array($POST['UnAvailability']['from_time'], $time_ranges)) {
                                        return [
                                            'error' => true,
                                            'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                        ];
                                    } else if ($model->save()) {
                                        $transaction->commit();
                                        return [
                                            'success' => true,
                                            'message' => 'Slot has been blocked successfully.',
                                        ];
                                    }
                                } else if (date('H:i', strtotime($exist_dtl->from_time)) > $POST['UnAvailability']['from_time']) {
                                    $time_ranges  = [];
                                    $format = 'H:i';
                                    $step = 900;
                                    $first_time = date('H:i', strtotime($exist_dtl->from_time));
                                    $second_time = date('H:i', strtotime($exist_dtl->to_time));
                                    $start = strtotime($first_time) - strtotime('TODAY');
                                    $end = strtotime($second_time) - strtotime('TODAY');
                                    foreach (range($start, $end, $step) as $increment) {
                                        $increment = gmdate('H:i', $increment);

                                        list($hour, $minutes) = explode(':', $increment);

                                        $date = new \DateTime($hour . ':' . $minutes);

                                        $time_ranges[] = $date->format($format);
                                    }

                                    if (in_array($POST['UnAvailability']['from_time'], $time_ranges)) {
                                        $transaction->rollBack();
                                        return [
                                            'error' => true,
                                            'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                        ];
                                    } else if (in_array($POST['UnAvailability']['to_time'], $time_ranges)) {
                                        $transaction->rollBack();
                                        return [
                                            'error' => true,
                                            'message' => 'Blocked slot already exists on Date ' . $POST['UnAvailability']['appointment_date'] . ' And try to change slot start time',
                                        ];
                                    } else if ($find->save()) {
                                        $transaction->commit();
                                        return [
                                            'success' => true,
                                            'message' => 'Event updated successfully.',
                                        ];
                                    }
                                }
                            }
                        }
                    } else if ($model->save()) {
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Slot has been blocked successfully.',
                        ];
                    } else {

                        $transaction->rollBack();
                        return [
                            'error' => true,
                            'message' => $model->getErrors(),
                        ];
                    }
                } else {
                    $transaction->rollBack();
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

    //Label~Module~Action~Url~Icon:Scheduler List~Scheduler~get-un-availability~/admin/scheduler~fa fa-calendar
    public function actionGetUnAvailability()
    {
        $response = [];
        $model = new \app\models\UnAvailability;
        $query = $model->find()->joinWith(['user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }])->where(['!=', 'appointment_date', 'NULL']);
        if (Yii::$app->user->identity->role_id != 1) {
            $query->andWhere(['un_availability.user_id' => Yii::$app->user->identity->id]);
        }
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->location_id)) {
                $query->andWhere(['un_availability.location_id' => $search->location_id]);
            }
        }
        $find = $query->asArray()->all();
        $response = [
            'success' => true,
            'cases' => $find,
        ];
        return $response;
    }

    //Label~Module~Action~Url~Icon:Scheduler Delete~Scheduler~delete-un-availability~/admin/scheduler~fa fa-calendar
    public function actionDeleteUnAvailability()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {

                $model = new \app\models\UnAvailability;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Event deleted successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Un Availability Type not found!',
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
    //Label~Module~Action~Url~Icon:Scheduler Blocked list~Scheduler~get-blocked-list~/admin/scheduler~fa fa-calendar

    public function actionGetBlockedList($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\UnAvailability;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'form' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Un Availability not found!',
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
                'message' => 'Un Availability not found!',
            ];
        }
    }
}
