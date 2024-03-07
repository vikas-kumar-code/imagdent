<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class PatientController extends Controller
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
            'except' => ['get', 'search-zipcode'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Patients', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Update Patient~Patients~add~/admin/patients~fa fa-users
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\Patients;
                $POST['Patients'] = $_POST['fields'];
                $POST['Patients']['Country'] = isset($_POST['fields']['Country']['value']) ? $_POST['fields']['Country']['value'] : NULL;
                $POST['Patients']['State'] = isset($_POST['fields']['State']['value']) ? $_POST['fields']['State']['value'] : NULL;
                if (isset($POST['Patients']['coustom_BirthDate']) && !empty($POST['Patients']['coustom_BirthDate'])) {
                    $POST['Patients']['BirthDate'] =  $POST['Patients']['coustom_BirthDate'];
                }
                if (isset($POST['Patients']['BirthDate']) && !empty($POST['Patients']['BirthDate'])) {
                    $date_of_birth = date_create($POST['Patients']['BirthDate']);
                    $current_date = date_create(date("Y-m-d"));
                    $difference = date_diff($current_date, $date_of_birth);
                    if ($difference->y > 0) {
                        $POST['Patients']['Age'] = $difference->y;
                    }
                }
                if (isset($POST['Patients']['sms_consent_date']) && !empty($POST['Patients']['sms_consent_date'])) {
                    $POST['Patients']['sms_consent_date'] =  date("Y-m-d", strtotime($POST['Patients']['sms_consent_date']));
                }
                if (isset($POST['Patients']['email_consent_date']) && !empty($POST['Patients']['email_consent_date'])) {
                    $POST['Patients']['email_consent_date'] =  date("Y-m-d", strtotime($POST['Patients']['email_consent_date']));
                }
                $POST['Patients']['added_by'] =  Yii::$app->user->identity->id;
                if (isset($POST['Patients']['id']) && !empty($POST['Patients']['id'])) {
                    $find = $model->find()->where(['id' => $POST['Patients']['id']])->one();
                    if ($find && $find->load($POST)) {
                        if (isset($POST['Patients']['file']) && !empty($POST['Patients']['file'])) {
                            if (strpos($POST['Patients']['file']['file_name'], "temp") != false) {
                                $new_file_name = mt_rand(111111, 999999) . "." . $POST['Patients']['file']['extension'];
                                if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name'])) {
                                    copy($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name'], $_SERVER['DOCUMENT_ROOT'] . "/images/" . $new_file_name);
                                    $find->image = $new_file_name;
                                    unlink($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name']);
                                }
                            }
                        }
                        if ($find->save()) {
                            if (isset($_POST['documents']) && !empty($_POST['documents'])) {
                                $dmodel = new \app\models\Documents;
                                $files = [];
                                foreach ($_POST['documents'] as $document) {
                                    $dfind = $dmodel->findOne(['document_name' => $document['document_name'], 'patient_id' => $find->id]);
                                    if (!$dfind) {
                                        $new_file_name = mt_rand(111111, 999999) . "-" . $find->id . "." . $document['extension'];
                                        //if(strpos($attachment, "temp") != false){
                                        copy($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name'], $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $new_file_name);
                                        $dmodel = new \app\models\Documents;
                                        $dmodel->document_name = $new_file_name;
                                        $dmodel->document_name_original = $document['document_name_original'];
                                        $dmodel->extension = $document['extension'];
                                        $dmodel->patient_id = $find->id;
                                        $dmodel->document_type_id = $document['document_type_id'];
                                        $dmodel->uploaded_by = Yii::$app->user->identity->id;
                                        if ($dmodel->validate()) {
                                            $files[] = $new_file_name;
                                            $dmodel->save();
                                            unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name']);
                                        }
                                    } else {
                                        $files[] = $document['document_name'];
                                    }
                                }
                                if (!empty($files)) {
                                    \app\models\Documents::deleteAll(
                                        [
                                            'and', 'patient_id = :patient_id',
                                            ['not in', 'document_name', $files],
                                        ],
                                        [':patient_id' => $find->id]
                                    );
                                }
                            } else {
                                \app\models\Documents::deleteAll(['patient_id' => $find->id]);
                            }
                            if (isset($_POST['notes']) && !empty($_POST['notes'])) {
                                $notes = [];
                                foreach ($_POST['notes'] as $note) {
                                    if (isset($note['id'])) {
                                        $nmodel = new \app\models\Notes;
                                        $nfind = $nmodel->findOne(['id' => $note['id']]);
                                        if ($nfind) {
                                            $nfind->note_type = $note['note_type'];
                                            $nfind->notes = $note['notes'];
                                            if ($nfind->validate()) {
                                                $nfind->save();
                                            }
                                        }
                                        $notes[] = $note['id'];
                                    } else {
                                        $nmodel = new \app\models\Notes;
                                        $nmodel->patient_id = $find->id;
                                        $nmodel->note_type = $note['note_type'];
                                        $nmodel->notes = $note['notes'];
                                        $nmodel->added_by = Yii::$app->user->identity->id;
                                        if ($nmodel->validate()) {
                                            $nmodel->save();
                                            $notes[] = $nmodel->id;
                                        } else {
                                            return [
                                                'error' => true,
                                                'message' => $nmodel->getErrors(),
                                            ];
                                        }
                                    }
                                }
                                if (!empty($notes)) {
                                    \app\models\Notes::deleteAll(
                                        [
                                            'and', 'patient_id = :patient_id',
                                            ['not in', 'id', $notes],
                                        ],
                                        [':patient_id' => $find->id]
                                    );
                                }
                            } else {
                                \app\models\Notes::deleteAll(['patient_id' => $find->id]);
                            }
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Patient has been updated successfully.',
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
                            'message' => "Patient not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    $model->save();
                    if (isset($POST['Patients']['file']) && !empty($POST['Patients']['file'])) {
                        if (strpos($POST['Patients']['file']['file_name'], "temp") != false) {
                            $new_file_name = mt_rand(111111, 999999) . "." . $POST['Patients']['file']['extension'];
                            if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name'])) {
                                copy($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name'], $_SERVER['DOCUMENT_ROOT'] . "/images/" . $new_file_name);
                                $model->image = $new_file_name;
                                $model->save();
                                unlink($_SERVER['DOCUMENT_ROOT'] . "/images/temp/" . $POST['Patients']['file']['file_name']);
                            }
                        }
                    }
                    if (isset($_POST['documents']) && !empty($_POST['documents'])) {
                        $dmodel = new \app\models\Documents;
                        $files = [];
                        foreach ($_POST['documents'] as $document) {
                            $new_file_name = mt_rand(111111, 999999) . "-" . $model->id . "." . $document['extension'];
                            //if(strpos($attachment, "temp") != false){
                            copy($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name'], $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $new_file_name);
                            $dmodel->document_name = $new_file_name;
                            $dmodel->document_name_original = $document['document_name_original'];
                            $dmodel->extension = $document['extension'];
                            $dmodel->patient_id = $model->id;
                            $dmodel->document_type_id = $document['document_type_id'];
                            $dmodel->uploaded_by = Yii::$app->user->identity->id;
                            if ($dmodel->validate()) {
                                $files[] = $new_file_name;
                                $dmodel->save();
                                unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name']);
                            }
                        }
                    }
                    if (isset($_POST['notes']) && !empty($_POST['notes'])) {
                        $nmodel = new \app\models\Notes;
                        $files = [];
                        foreach ($_POST['notes'] as $note) {
                            $nmodel->patient_id = $model->id;
                            $nmodel->notes = $note['notes'];
                            $nmodel->note_type = $note['note_type'];
                            $nmodel->added_by = Yii::$app->user->identity->id;
                            if ($nmodel->validate()) {
                                $nmodel->save();
                            }
                        }
                    }
                    $transaction->commit();
                    return [
                        'success' => true,
                        'message' => 'Patient has been added successfully.',
                        'patientDetails' => \app\models\Patients::find()->where(['id' => $model->id])->asArray()->one()
                    ];
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

    //Label~Module~Action~Url~Icon:List Patient~Patients~list~/admin/patients~fa fa-users
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
                'name' => [
                    'asc' => ['first_name' => SORT_ASC],
                    'desc' => ['first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['id' => SORT_DESC],
        ]);

        $model = new \app\models\Patients;
        $query = $model->find()->joinWith(['countrydetails', 'statedetails']);
        $search = new \app\models\SearchForm;
        $getAll = false;
        if (isset($_GET['getAll'])) {
            $getAll = true;
        }
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->first_name)) {
                $query->andWhere(['LIKE', 'first_name', $search->first_name]);
            }
            if (!empty($search->last_name)) {
                $query->andWhere(['LIKE', 'last_name', $search->last_name]);
            }
            if (!empty($search->City)) {
                $query->andWhere(['LIKE', 'City', $search->City]);
            }
            if (!empty($search->phone)) {
                $query->andWhere([
                    'or',
                    ['LIKE', 'WorkPhone', $search->phone],
                    ['LIKE', 'HomePhone', $search->phone],
                ]);
            }
            if (!empty($search->middle_name)) {
                $query->andWhere(['LIKE', 'middle_name', $search->middle_name]);
            }
            if (!empty($search->state)) {
                $query->andWhere(['LIKE', 'State', $search->state['value']]);
            }
            if (!empty($search->BirthDate)) {
                $query->andWhere(['BirthDate' => $search->BirthDate]);
            }
            if (!empty($search->Zipcode)) {
                $query->andWhere(['LIKE', 'Zipcode', $search->Zipcode]);
            }
        }
        
        if (!in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            if (!isset($_GET['getAll'])) {
                $query->andWhere(['added_by' => Yii::$app->user->identity->id]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'patients' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'patients' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }


    //Label~Module~Action~Url~Icon:Search Patient~Patients~search~/admin/patients~fa fa-users
    public function actionSearch($pageSize = 50)
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

        $model = new \app\models\Patients;
        $query = $model->find()->joinWith(['countrydetails', 'statedetails']);
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        $search_fields = 0;
        if (!empty($GET['SearchForm']) && $search->load($GET)) {
            if (isset($search->first_name) && !empty($search->first_name)) {
                $query->andWhere(['LIKE', 'first_name', $search->first_name]);
                $search_fields++;
            }
            if (isset($search->last_name) && !empty($search->last_name)) {
                $query->andWhere(['LIKE', 'last_name', $search->last_name]);
                $search_fields++;
            }
            if (isset($search->City) && !empty($search->City)) {
                $query->andWhere(['LIKE', 'City', $search->City]);
                $search_fields++;
            }
            if (isset($search->phone) && !empty($search->phone)) {
                $query->andWhere([
                    'or',
                    ['LIKE', 'WorkPhone', $search->phone],
                    ['LIKE', 'HomePhone', $search->phone],
                ]);
                $search_fields++;
            }
            if (isset($search->middle_name) && !empty($search->middle_name)) {
                $query->andWhere(['LIKE', 'middle_name', $search->middle_name]);
                $search_fields++;
            }
            if (isset($search->Zipcode) && !empty($search->Zipcode)) {
                $query->andWhere(['LIKE', 'Zipcode', $search->Zipcode]);
                $search_fields++;
            }
            if (isset($search->state) && !empty($search->state)) {
                $query->andWhere(['LIKE', 'State', $search->state['value']]);
                $search_fields++;
            }
            if (isset($search->sex) && !empty($search->sex)) {
                $query->andWhere(['Sex' => $search->sex]);
                $search_fields++;
            }
            if (isset($search->BirthDate) && !empty($search->BirthDate)) {
                $search->BirthDate =  date("Y-m-d", strtotime($search->BirthDate));
                $query->andWhere(['BirthDate' => $search->BirthDate]);
                $search_fields++;
            }
            if (isset($search->SocialSecurityNumber) && !empty($search->SocialSecurityNumber)) {
                $query->andWhere(['SocialSecurityNumber' => $search->SocialSecurityNumber]);
                $search_fields++;
            }
            if (isset($search->id) && !empty($search->id)) {
                $query->andWhere(['id' => $search->id]);
                $search_fields++;
            }
        }
        if ($search_fields > 0) {
            $countQuery = clone $query;

            $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
            $pages->pageSize = $pageSize;
            $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
            if ($find) {
                $response = [
                    'success' => true,
                    'patients' => $find,
                    'pages' => $pages,
                ];
            } else {
                $response = [
                    'success' => true,
                    'patients' => [],
                    'pages' => $pages,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'patients' => [],
            ];
        }

        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Patient Details~Patients~get~/admin/patients~fa fa-users
    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Patients;
                $find = $model->find()->with(['documents.uploadedby', 'notes', 'countrydetails', 'statedetails'])->where(['patients.id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'patient' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Patient not found!',
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
                'message' => 'Patient not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Patient~Patients~delete~/admin/patients~fa fa-users
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\Patients;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                $casesmodel = new \app\models\Cases;
                $checkstatus = $casesmodel->find()->where(['>', 'status', 0])
                    ->andWhere(['patient_id' =>  $_POST['id']])->count();
                if ($checkstatus > 0) {
                    return [
                        'error' => true,
                        'message' => 'Patient has already been checked-in, delete operation can not be performed!',
                    ];
                } else {
                    if ($find && $find->delete()) {
                        $casearray = $casesmodel->find()->Where(['patient_id' =>  $_POST['id']])->all();
                        foreach ($casearray as $case) {
                            \app\models\Cases::deleteAll(['patient_id' => $case->patient_id]);
                            \app\models\CaseServices::deleteAll(['case_id' => $case->id]);
                            \app\models\CaseLog::deleteAll(['case_id' => $case->id]);
                            \app\models\Invoices::deleteAll(['case_id' => $case->id]);
                            \app\models\Payments::deleteAll(['case_id' => $case->id]);
                            \app\models\TreatmentTeam::deleteAll(['case_id' => $case->id]);
                            \app\models\Documents::deleteAll(['case_id' => $case->id]);
                            \app\models\Notes::deleteAll(['case_id' => $case->id]);
                        }
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Patient has been deleted successfully.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Patient not found!',
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
                'message' => 'Patient not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Patient's Document~Patients~delete-document~/admin/patients~fa fa-users
    public function actionDeleteDocument()
    {
        if (isset($_POST['file_name']) && !empty($_POST['file_name'])) {
            try {
                if (strpos($_POST['file_name'], "temp") != false) {
                    unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $_POST['file_name']);
                    return [
                        'success' => true,
                        'message' => 'Document has been deleted successfully.',
                    ];
                } else {
                    $model = new \app\models\Documents;
                    $find = $model->find()->where(['document_name' => $_POST['file_name']])->one();
                    if ($find && $find->delete()) {
                        unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/" . $_POST['file_name']);
                        return [
                            'success' => true,
                            'message' => 'Document has been deleted successfully.',
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

    public function actionSearchZipcode($zipcode)
    {
        if (isset($zipcode) && !empty($zipcode)) {
            try {
                $find = \app\models\Patients::find()->select(['patients.Country', 'patients.State', 'City', 'Zipcode', 'patients.id'])->joinWith(['countrydetails', 'statedetails'])->where(['Zipcode' => $zipcode])->groupBy('Zipcode')->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'patient' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
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
