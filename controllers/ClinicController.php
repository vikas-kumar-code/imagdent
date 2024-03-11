<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
//use yii\swiftmailer\Mailer;
use yii\web\Controller;
use yii\web\Response;

class ClinicController extends Controller
{

    public $enableCsrfValidation = false;

    public function init()
    {
        parent::init();
        Yii::$app->response->format = Response::FORMAT_JSON;
        \Yii::$app->user->enableSession = false;
        $_POST = json_decode(file_get_contents('php://input'), true);
        //$_GET['fields'] = json_decode($_GET['fields'], true);
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        if ($_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
            $behaviors['authenticator'] = [
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
            'except' => ['list'],
            'only' => [],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Clinics', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Clinic~Clinics~add~/admin/clinics~fa fa-clinic-medical
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\Clinics;
                $POST['Clinics'] = $_POST['fields'];  
                $POST['Clinics']['country'] = isset($_POST['fields']['country']['value'])?$_POST['fields']['country']['value']:NULL;                
                $POST['Clinics']['state'] = isset($_POST['fields']['state']['value'])?$_POST['fields']['state']['value']:NULL; 

                if (isset($POST['Clinics']['id']) && !empty($POST['Clinics']['id'])) {
                    $find = $model->find()->where(['id' => $POST['Clinics']['id']])->one();
                    if ($find && $find->load($POST)) {                        
                        if ($find->save()) {                            
                            if (isset($_POST['documents']) && !empty($_POST['documents'])) {
                                $dmodel = new \app\models\Documents;
                                $files = [];
                                foreach ($_POST['documents'] as $document) {
                                    $dfind = $dmodel->findOne(['document_name' => $document['document_name'], 'clinic_id' => $find->id]);
                                    if (!$dfind) {
                                        $new_file_name = mt_rand(111111, 999999) . "-" . $find->id . "." . $document['extension'];
                                        //if(strpos($attachment, "temp") != false){
                                        copy($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name'], $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $new_file_name);
                                        $dmodel = new \app\models\Documents;
                                        $dmodel->document_name = $new_file_name;
                                        $dmodel->document_name_original = $document['document_name_original'];
                                        $dmodel->extension = $document['extension'];
                                        $dmodel->clinic_id = $find->id;
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
                                    \app\models\Documents::deleteAll([
                                        'and', 'clinic_id = :clinic_id',
                                        ['not in', 'document_name', $files],
                                    ],
                                        [':clinic_id' => $find->id]);
                                }
                            } else {
                                \app\models\Documents::deleteAll(['clinic_id' => $find->id]);
                            }
                            if(isset($_POST['contacts']) && !empty($_POST['contacts'])){
                                $notes = [];
                                foreach ($_POST['contacts'] as $contact) {
                                    if(isset($contact['id'])){
                                        $cmodel = new \app\models\ClinicContact;
                                        $cfind = $cmodel->findOne(['id' => $contact['id']]);
                                        if($cfind){
                                            // echo isset($contact['contact_prefix'])?$contact['contact_prefix']:NULL;die;

                                            $cfind->contact_prefix = isset($contact['contact_prefix'])?$contact['contact_prefix']:NULL;
                                            $cfind->contact_fname = isset($contact['contact_fname'])?$contact['contact_fname']:NULL;
                                            $cfind->contact_mname = isset($contact['contact_mname'])?$contact['contact_mname']:NULL;
                                            $cfind->contact_lname = isset($contact['contact_lname'])?$contact['contact_lname']:NULL;
                                            $cfind->contact_suffix = isset($contact['contact_suffix'])?$contact['contact_suffix']:NULL;
                                            $cfind->contact_role = isset($contact['contact_role'])?$contact['contact_role']:NULL;
                                            $cfind->contact_email = isset($contact['contact_email'])?$contact['contact_email']:NULL;
                                            $cfind->contact_phone = isset($contact['contact_phone'])?$contact['contact_phone']:NULL;
                                            $cfind->contact_phone_ext = isset($contact['contact_phone_ext'])?$contact['contact_phone_ext']:NULL;
                                            $cfind->contact_fax = isset($contact['contact_fax'])?$contact['contact_fax']:NULL;
                                            if($cfind->validate()){
                                                $cfind->save();
                                            }
                                        }
                                        $contacts[] = $contact['id'];
                                    }
                                    else{
                                        $cmodel = new \app\models\ClinicContact;
                                        $cmodel->clinic_id = $find->id;
                                        $cmodel->contact_prefix = isset($contact['contact_prefix'])?$contact['contact_prefix']:NULL;
                                        $cmodel->contact_fname = isset($contact['contact_fname'])?$contact['contact_fname']:NULL;
                                        $cmodel->contact_mname = isset($contact['contact_mname'])?$contact['contact_mname']:NULL;
                                        $cmodel->contact_lname = isset($contact['contact_lname'])?$contact['contact_lname']:NULL;
                                        $cmodel->contact_suffix = isset($contact['contact_suffix'])?$contact['contact_suffix']:NULL;
                                        $cmodel->contact_role = isset($contact['contact_role'])?$contact['contact_role']:NULL;
                                        $cmodel->contact_email = isset($contact['contact_email'])?$contact['contact_email']:NULL;
                                        $cmodel->contact_phone = isset($contact['contact_phone'])?$contact['contact_phone']:NULL;
                                        $cmodel->contact_phone_ext = isset($contact['contact_phone_ext'])?$contact['contact_phone_ext']:NULL;
                                        $cmodel->contact_fax = isset($contact['contact_fax'])?$contact['contact_fax']:NULL;
                                        //$nmodel->added_by = Yii::$app->user->identity->id;
                                        if ($cmodel->validate()) {
                                            $cmodel->save();
                                            $contacts[] = $cmodel->id;
                                        }else{
                                            return [
                                                'error' => true,
                                                'message' => $cmodel->getErrors(),
                                            ];
                                        }
                                    }
                                    
                                }
                                if (!empty($contacts)) {
                                    \app\models\ClinicContact::deleteAll([
                                        'and', 'clinic_id = :clinic_id',
                                        ['not in', 'id', $contacts],
                                    ],
                                        [':clinic_id' => $find->id]);
                                }
                            }else {
                                \app\models\ClinicContact::deleteAll(['clinic_id' => $find->id]);
                            }
                            if (isset($_POST['notes']) && !empty($_POST['notes'])) {                                
                                $notes = [];
                                foreach ($_POST['notes'] as $note) {
                                    if(isset($note['id'])){
                                        $nmodel = new \app\models\Notes;
                                        $nfind = $nmodel->findOne(['id' => $note['id']]);
                                        if($nfind){
                                            $nfind->note_type = $note['note_type'];
                                            $nfind->notes = $note['notes'];
                                            if($nfind->validate()){
                                                $nfind->save();
                                            }
                                        }
                                        $notes[] = $note['id'];
                                    }
                                    else{
                                        $nmodel = new \app\models\Notes;
                                        $nmodel->clinic_id = $find->id;
                                        $nmodel->note_type = $note['note_type'];
                                        $nmodel->notes = $note['notes'];
                                        $nmodel->added_by = Yii::$app->user->identity->id;
                                        if ($nmodel->validate()) {
                                            $nmodel->save();
                                            $notes[] = $nmodel->id;
                                        }else{
                                            return [
                                                'error' => true,
                                                'message' => $nmodel->getErrors(),
                                            ];
                                        }
                                    }
                                    
                                }
                                if (!empty($notes)) {
                                    \app\models\Notes::deleteAll([
                                        'and', 'clinic_id = :clinic_id',
                                        ['not in', 'id', $notes],
                                    ],
                                        [':clinic_id' => $find->id]);
                                }
                            } else {
                                \app\models\Notes::deleteAll(['clinic_id' => $find->id]);
                            }
                            $transaction->commit();
                            return [
                                'success' => true,                                
                                'message' => 'Clinic has been updated successfully.',
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
                            'message' => "Clinic not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    
                    if ($model->save()) {
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
                                $dmodel->clinic_id = $model->id;
                                $dmodel->document_type_id = $document['document_type_id'];
                                $dmodel->uploaded_by = Yii::$app->user->identity->id;
                                if ($dmodel->validate()) {
                                    $files[] = $new_file_name;
                                    $dmodel->save();
                                    unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name']);
                                }
                            }
                        }
                        
                        if (isset($_POST['contacts']) && !empty($_POST['contacts'])) {
                            $cmodel = new \app\models\ClinicContact;
                            foreach ($_POST['contacts'] as $contact) {                                
                                $cmodel->clinic_id = $model->id;
                                $cmodel->contact_prefix = $contact['contact_prefix'];
                                $cmodel->contact_fname = $contact['contact_fname'];
                                $cmodel->contact_mname = $contact['contact_mname'];
                                $cmodel->contact_lname = $contact['contact_lname'];
                                $cmodel->contact_suffix = $contact['contact_suffix'];
                                $cmodel->contact_role = $contact['contact_role'];
                                $cmodel->contact_email = $contact['contact_email'];
                                $cmodel->contact_phone = $contact['contact_phone'];
                                $cmodel->contact_phone_ext = $contact['contact_phone_ext'];
                                $cmodel->contact_fax = $contact['contact_fax'];

                                //$cmodel->added_by = Yii::$app->user->identity->id;
                                if ($cmodel->validate()) {
                                    $cmodel->save();
                                }
                            }
                        }
                        if (isset($_POST['notes']) && !empty($_POST['notes'])) {
                            $nmodel = new \app\models\Notes;
                            $files = [];
                            foreach ($_POST['notes'] as $note) {                                
                                $nmodel->clinic_id = $model->id;
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
                            'message' => 'Clinic has been added successfully.',
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
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                /*'contact_name' => [
                    'asc' => ['contact_name' => SORT_ASC],
                    'desc' => ['contact_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],*/
            ],
            'defaultOrder' => ['name' => SORT_DESC],
        ]);

        $model = new \app\models\Clinics;
        $query = $model->find()->where(['deleted' => 'N']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'clinics.name', $search->name]);
            }  
            if (!empty($search->contact_name)) {
                $query->andWhere(['LIKE', 'clinics.contact_name', $search->contact_name]);
            }  
            if (!empty($search->email)) {
                $query->andWhere(['LIKE', 'clinics.contact_email', $search->email]);
            }  
            if (!empty($search->phone)) {
                $query->andWhere(['LIKE', 'clinics.contact_phone', preg_replace('/[^\p{L}\p{N}]/', '', $search->phone)]);
            }            
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'clinics' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'clinics' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Clinic Details~Clinics~get~/admin/clinics~fa fa-clinic-medical
    public function actionGetOne($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Clinics;
                $find = $model->find()->with(['documents.uploadedby','contacts','notes','countrydetails','statedetails'])->where(['clinics.id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'clinic' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Clinic not found!',
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
                'message' => 'Clinic not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Clinic~Clinics~delete~/admin/clinics~fa fa-clinic-medical
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Clinics;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find) {                    
                    $find->deleted = 'Y';
                    if ($find->update()) {
                        return [
                            'success' => true,
                            'message' => 'Clinic has been deleted successfully.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Clinic not found!',
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
                'message' => 'Clinic not found!',
            ];
        }
    }
    //Label~Module~Action~Url~Icon:Delete Document~Clinics~delete-document~/admin/clinics~fa fa-clinic-medical
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
                $find = \app\models\Clinics::find()->select(['clinics.country','clinics.state','city','zip','clinics.id'])->joinWith(['countrydetails cd','statedetails sd'])->where(['zip'=>$zipcode])->groupBy('zip')->asArray()->one();
                if($find){
                    return [
                        'success' => true,
                        'clinic' => $find,
                    ];
                }
                else{
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
