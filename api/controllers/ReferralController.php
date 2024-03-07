<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class ReferralController extends Controller
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
                        return Yii::$app->common->checkPermission('Referrals', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    public function actionList($patient_id = "", $referred_to = "", $pageSize = 50, $status = 2)
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
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Referrals;
        $query = $model->find()->joinWith(['patient.documents', 'clinic', 'location', 'referredto', 'slot', 'referredfrom rfrom']);
        if ($status == 2) {
            $query->where(['or',
                ['=', 'referrals.status', 2],
                ['=', 'referrals.status', 5],
                ['=', 'referrals.status', 6],
                ['=', 'referrals.status', 7],
                ['=', 'referrals.status', 8],
            ]);
        } else {
            $query->where(['referrals.status' => $status]);
        }
        if (!empty($patient_id)) {
            $query->andWhere(['patient_id' => $patient_id]);
        } else if (!empty($referred_to)) {
            $query->andWhere(['referred_to' => $referred_to]);
        }

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = json_decode($_GET['fields'], true);
        if ($search->load($GET)) {
            if (!empty($search->referred_from)) {
                $query->andWhere(['referred_from' => $search->referred_from]);
            }
            if (!empty($search->first_name)) {
                $query->andWhere(['patients.FirstName' => $search->first_name]);
            }
            if (!empty($search->last_name)) {
                $query->andWhere(['patients.LastName' => $search->last_name]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $response = [
                'success' => true,
                'referrals' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'referrals' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionPendingApprovals($pageSize = 50)
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
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Referrals;
        $query = $model->find()->with(['patient.documents', 'clinic', 'location', 'referredto', 'slot', 'referredfrom'])->where(['status' => 1])->andWhere(['referred_from' => Yii::$app->user->identity->id]);

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
                'referrals' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'referrals' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionRejectedReferrals($pageSize = 50)
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
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Referrals;
        $query = $model->find()->with(['patient.documents', 'clinic', 'location', 'referredto', 'slot', 'referredfrom'])->where(['status' => 3, 'referred_by' => Yii::$app->user->identity->id]);

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
                'referrals' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'referrals' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Referrals;
                $find = $model->find()->with(['patient.documents', 'clinic', 'location', 'referredto.role', 'referredfrom.role', 'slot'])->where(['referrals.id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'referral' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Referral not found!',
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
                'message' => 'Referral not found!',
            ];
        }
    }

    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Referrals;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Referral has been deleted successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Referral not found!',
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
                'message' => 'Referral not found!',
            ];
        }
    }

    public function actionApprove()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Referrals;
                $find = $model->find()->with(['referredby', 'referredfrom'])->where(['id' => $_POST['id'], 'status' => 1, 'referred_from' => Yii::$app->user->identity->id])->one();
                if ($find) {
                    $find->status = 2;
                    if ($find->save()) {
                        $referralDetails = $find;
                        $template = \app\models\EmailTemplates::findOne(['id' => 5]);
                        $data = [
                            'template_id' => 5,
                            'to' => $referralDetails->referredby->email,
                            'name' => $referralDetails->referredby->name,
                            'referred_from' => $referralDetails->referredfrom->name,
                            'body' => $template,
                            'subject' => $template->subject,
                        ];
                        if (Yii::$app->common->sendEmail($data)) {
                            return [
                                'success' => true,
                                'message' => 'Referral has been approved successfully.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }

                } else {
                    return [
                        'error' => true,
                        'message' => 'Referral not found!',
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
                'message' => 'Referral not found!',
            ];
        }
    }

    public function actionReject()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Referrals;
                $find = $model->find()->with(['referredby', 'referredfrom'])->where(['id' => $_POST['id'], 'status' => 1, 'referred_from' => Yii::$app->user->identity->id])->one();
                if ($find) {
                    $find->reason_for_rejection = $_POST['reason_for_rejection'];
                    $find->status = 3;
                    if ($find->save()) {
                        $referralDetails = $find;
                        $template = \app\models\EmailTemplates::findOne(['id' => 4]);
                        $data = [
                            'template_id' => 4,
                            'to' => $referralDetails->referredby->email,
                            'name' => $referralDetails->referredby->name,
                            'referred_from' => $referralDetails->referredfrom->name,
                            'body' => $template,
                            'subject' => $template->subject,
                        ];
                        if (Yii::$app->common->sendEmail($data)) {
                            return [
                                'success' => true,
                                'message' => 'Referral has been rejected successfully.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }

                } else {
                    return [
                        'error' => true,
                        'message' => 'Referral not found!',
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
                'message' => 'Referral not found!',
            ];
        }
    }

    public function actionDiscard()
    {
        if (isset($_POST['referrals']) && !empty($_POST['referrals'])) {
            try {
                \app\models\Referrals::updateAll(['status' => 4], ['in', 'id', $_POST['referrals']]);
                return [
                    'success' => true,
                    'message' => 'Referral has been discarded successfully.',
                ];
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        } else {
            return [
                'error' => true,
                'message' => 'Referral not found!',
            ];
        }
    }

    public function actionChangeStatus()
    {
        if (isset($_POST) && !empty($_POST)) {
            $POST = $_POST['fields'];
            try {
                $find = \app\models\Referrals::findOne(['id' => $POST['referral_id']]);
                if ($find) {
                    $find->status = $POST['status'];
                    $find->treatment_summary = isset($POST['treatment_summary']) ? $POST['treatment_summary'] : null;
                    if ($find->save()) {
                        $model = new \app\models\ReferralVersions;
                        $model->referral_id = $POST['referral_id'];
                        $model->referral_details = json_encode($POST['referral_details']);
                        $model->notes = $POST['notes'];
                        $model->updated_by = Yii::$app->user->identity->id;
                        if ($model->save()) {
                            return [
                                'success' => true,
                                'message' => 'Status has been updated successfully.',
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => $model->getErrors(),
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }

                } else {
                    return [
                        'error' => true,
                        'message' => 'Referral not found!',
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
                'message' => 'Referral not found!',
            ];
        }
    }
}
