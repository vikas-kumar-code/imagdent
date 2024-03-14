<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\swiftmailer\Mailer;
//use yii\swiftmailer\Mailer;
use yii\web\Controller;
use yii\web\Response;
use kartik\mpdf\Pdf;

class CaseController extends Controller
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
            'only' => [],
            'except' => ['get-logs', 'send-invoice', 'fetch-case-delivered-content', 'send-delivery-email'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Cases', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Case~Cases~add~/admin/cases~fa fa-medkit
    public function actionAdd($export = false, $format = null)
    {
        if (isset($_POST) && !empty($_POST)) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $patient_name = $patient_email = $doctor_name = $doctor_email = "";
                $model = new \app\models\Cases;
                $POST['Cases'] = $_POST['fields'];
                if (isset($POST['Cases']['appointment_date']) && !empty($POST['Cases']['appointment_date'])) {
                    $POST['Cases']['appointment_date'] = $POST['Cases']['appointment_date'];
                }
                if (isset($POST['Cases']['clinic_id'])) {
                    $POST['Cases']['clinic_id'] = $POST['Cases']['clinic_id']['value'];
                }
                if (isset($POST['Cases']['location_id'])) {
                    $POST['Cases']['location_id'] = $POST['Cases']['location_id']['value'];
                }
                if (isset($POST['Cases']['patient_id'])) {
                    $patient_name = $POST['Cases']['patient_id']['label'];
                    $patient_email = $POST['Cases']['patient_id']['email'];
                    $POST['Cases']['patient_id'] = $POST['Cases']['patient_id']['value'];
                }
                if (isset($POST['Cases']['user_id'])) {
                    $doctor_name = $POST['Cases']['user_id']['label'];
                    $doctor_email = $POST['Cases']['user_id']['email'];
                    $POST['Cases']['user_id'] = $POST['Cases']['user_id']['value'];
                }
                if (isset($POST['Cases']['total_price'])) {
                    $POST['Cases']['total_price'] = $POST['Cases']['total_price'];
                }
                if (isset($POST['Cases']['referral_note'])) {
                    $POST['Cases']['referral_note'] = $POST['Cases']['referral_note'];
                }
                if (isset($POST['Cases']['selectedTeeth']) && is_array($POST['Cases']['selectedTeeth']) && !empty($POST['Cases']['selectedTeeth'])) {
                    if (count($POST['Cases']['selectedTeeth']) > 0) {
                        $POST['Cases']['teeth'] = implode(',', $POST['Cases']['selectedTeeth']);
                    }
                } else {
                    $POST['Cases']['teeth'] = NULL;
                }
                if (isset($POST['Cases']['diagnosis_codes']) && is_array($POST['Cases']['diagnosis_codes']) && !empty($POST['Cases']['diagnosis_codes'])) {
                    $diagnosis_codes = [];
                    foreach ($POST['Cases']['diagnosis_codes'] as $code) {
                        $diagnosis_codes[] = $code["value"];
                    }
                    if (count($diagnosis_codes) > 0) {
                        $POST['Cases']['diagnosis_codes'] = implode(',', $diagnosis_codes);
                    }
                } else {
                    $POST['Cases']['diagnosis_codes'] = NULL;
                }
                //print_r($POST['Cases']); die;
                if (isset($POST['Cases']['id']) && !empty($POST['Cases']['id'])) {
                    $find = $model->find()->where(['id' => $POST['Cases']['id']])->one();
                    $old_user_id = $find->user_id;
                    if ($find && $find->load($POST)) {
                        $find->c_id = $find->location_id . '-' . $find->id;
                        if ($find->save()) {
                            $tmodel = new \app\models\TreatmentTeam;
                            $tfind = $tmodel->findOne(['case_id' => $find->id, 'user_id' => $find->user_id]);
                            if (!$tfind) {
                                $tmodel = new \app\models\TreatmentTeam;
                                $tmodel->case_id = $find->id;
                                $tmodel->user_id = $find->user_id;
                                $tmodel->added_by = Yii::$app->user->identity->id;
                                if ($tmodel->validate()) {
                                    $tmodel->save();
                                }
                            }
                            if ($old_user_id != $find->user_id) {
                                $tmodel = new \app\models\TreatmentTeam;
                                $tfind = $tmodel->findOne(['case_id' => $find->id, 'user_id' => $old_user_id]);
                                if ($tfind) {
                                    $tfind->delete();
                                }
                            }

                            if (isset($POST['Cases']['selectedServices']) && !empty($POST['Cases']['selectedServices'])) {
                                $services = [];
                                foreach ($POST['Cases']['selectedServices'] as $service) {
                                    if (isset($service['id'])) {
                                        $smodel = new \app\models\CaseServices;
                                        $sfind = $smodel->findOne(['service_id' => $service['id'], 'case_id' => $find->id]);
                                        if ($sfind) {
                                            $sfind->case_id = $find->id;
                                            $sfind->price = $service['price'];
                                            $sfind->service_id = $service['id'];
                                            $sfind->location_id = $find->location_id;
                                            $sfind->who_will_pay = $service['who_will_pay'];
                                            $sfind->note = $service['note'];
                                            $sfind->sub_total = $sfind->price - $sfind->discount;
                                            if ($sfind->validate()) {
                                                $sfind->save();
                                                $services[] = $service['id'];
                                            }
                                        } else {
                                            $smodel = new \app\models\CaseServices;
                                            $smodel->case_id = $find->id;
                                            $smodel->price = $service['price'];
                                            $smodel->service_id = $service['id'];
                                            $smodel->location_id = $find->location_id;
                                            $smodel->who_will_pay = $service['who_will_pay'];
                                            $smodel->note = $service['note'];
                                            $smodel->sub_total = $smodel->price;
                                            if ($smodel->validate()) {
                                                $smodel->save();
                                                $services[] = $service['id'];
                                            } else {

                                                return [
                                                    'error' => true,
                                                    'message' => $smodel->getErrors(),
                                                ];
                                            }
                                        }
                                    }
                                }

                                if (!empty($services)) {
                                    \app\models\CaseServices::deleteAll([
                                        'AND',
                                        ['case_id' => $POST['Cases']['id']],
                                        ['not in', 'service_id', $services]
                                    ]);
                                }
                                Yii::$app->common->updateBalance($find->id);
                            } else {
                                \app\models\CaseServices::deleteAll(['case_id' => $find->id]);
                            }
                            if (isset($POST['Cases']['notes']) && !empty($POST['Cases']['notes'])) {
                                $nmodel = new \app\models\Notes;
                                $nmodel->case_id = $find->id;
                                $nmodel->note_type = 0;
                                $nmodel->notes = $POST['Cases']['notes'];
                                $nmodel->added_by = Yii::$app->user->identity->id;
                                if ($nmodel->validate()) {
                                    $nmodel->save();
                                } else {
                                    return [
                                        'error' => true,
                                        'message' => $nmodel->getErrors(),
                                    ];
                                }
                            }
                            Yii::$app->common->addLog($find->id, "Case has been updated");
                            if ($find) {
                                $afind = $model->find()->joinWith(['patient', 'doctor', 'services.service', 'location', 'slot'])->where(['cases.id' => $POST['Cases']['id']])->one();
                                $data['records'] = $afind;
                                $content = $this->renderPartial('case-receipt', $data);
                                $this->generatePdf('case-receipt-' . $find->id . '-' . $find->patient_id, 'Case Receipt', $content);

                                $response = [
                                    'success' => true,
                                    'file' => true
                                ];
                                $dmodel = new \app\models\Documents;
                                if (isset($find->id) && !empty($find->id)) {
                                    $name = "case-receipt-" . $find->id . "-" . $find->patient_id . ".pdf";
                                    $dfind = $dmodel->findOne(['document_name' => $name]);
                                    if (isset($dfind) && !empty($dfind)) {
                                        $dfind->user_id = 0;
                                        $dfind->clinic_id = 0;
                                        $dfind->patient_id = $find->patient_id;
                                        $dfind->case_id = $find->id;
                                        $dfind->case_file = 0;
                                        $dfind->document_type_id = 0;
                                        $dfind->document_name = "case-receipt-" . $find->id . "-" . $find->patient_id . ".pdf";
                                        $dfind->document_name_original = "case-receipt";
                                        $dfind->extension = "pdf";
                                        $dfind->uploaded_by = Yii::$app->user->identity->id;
                                        $dfind->save();
                                    } else {
                                        $dmodel->user_id = 0;
                                        $dmodel->clinic_id = 0;
                                        $dmodel->patient_id = $find->patient_id;
                                        $dmodel->case_id = $find->id;
                                        $dmodel->case_file = 1;
                                        $dmodel->document_type_id = 0;
                                        $dmodel->document_name = "case-receipt-" . $find->id . "-" . $find->patient_id . ".pdf";
                                        $dmodel->document_name_original = "case-receipt";
                                        $dmodel->extension = "pdf";
                                        $dmodel->uploaded_by = Yii::$app->user->identity->id;
                                        $dmodel->save();
                                    }
                                }
                            }
                            $transaction->commit();
                            return [
                                'success' => true,
                                'caseId' => $find->id,
                                'message' => 'Case has been updated successfully.',
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
                            'message' => "Case not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    if ($model->save()) {
                        $model->c_id = $model->location_id . '-' . $model->id;
                        $model->created_by = Yii::$app->user->identity->id;
                        $model->save();

                        $tmodel = new \app\models\TreatmentTeam;
                        $tmodel->case_id = $model->id;
                        $tmodel->user_id = $model->user_id;
                        $tmodel->added_by = Yii::$app->user->identity->id;
                        if ($tmodel->validate()) {
                            $tmodel->save();
                        }
                        if (isset($POST['Cases']['selectedServices']) && !empty($POST['Cases']['selectedServices'])) {
                            $services = [];
                            foreach ($POST['Cases']['selectedServices'] as $service) {
                                $smodel = new \app\models\CaseServices;
                                $smodel->case_id = $model->id;
                                $smodel->price = $service['price'];
                                $smodel->service_id = $service['id'];
                                $smodel->location_id = $model->location_id;
                                $smodel->who_will_pay = $service['who_will_pay'];
                                $smodel->note = $service['note'];
                                $smodel->discount = $service['discount'];
                                $smodel->sub_total = $service['price'] - $service['discount'];
                                if ($smodel->validate()) {
                                    $smodel->save();
                                    $services[] = $service['name'];
                                }
                            }
                            Yii::$app->common->updateBalance($model->id);
                        }

                        if (isset($POST['Cases']['notes']) && !empty($POST['Cases']['notes'])) {
                            $nmodel = new \app\models\Notes;
                            $nmodel->case_id = $model->id;
                            $nmodel->note_type = 0;
                            $nmodel->notes = $POST['Cases']['notes'];
                            $nmodel->added_by = Yii::$app->user->identity->id;
                            if ($nmodel->validate()) {
                                $nmodel->save();
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $nmodel->getErrors(),
                                ];
                            }
                        }

                        //Creating Invoice
                        $maxId = \app\models\Invoices::find()->max("id") + 1;
                        $model = \app\models\Cases::find()->where(['id' => $model->id])->one();
                        if ($model) {
                            $imodel = new \app\models\Invoices;
                            $imodel->invoice_id = $model->location_id . '-' . $model->id . '-' . $maxId;
                            $imodel->case_id = $model->id;
                            $imodel->location_id = $model->location_id;
                            $imodel->user_id = $model->user_id;
                            $imodel->amount = $model->doctor_balance;
                            $imodel->sub_total = $imodel->amount;
                            $imodel->balance_amount = $imodel->sub_total;
                            if ($imodel->validate()) {
                                $imodel->save();

                                $maxId = \app\models\Invoices::find()->max("id") + 1;
                                $imodel = new \app\models\Invoices;
                                $imodel->invoice_id = $model->location_id . '-' . $model->id . '-' . $maxId;
                                $imodel->case_id = $model->id;
                                $imodel->location_id = $model->location_id;
                                $imodel->patient_id = $model->patient_id;
                                $imodel->amount = $model->patient_balance;
                                $imodel->sub_total = $imodel->amount;
                                $imodel->balance_amount = $imodel->sub_total;
                                if ($imodel->validate()) {
                                    $imodel->save();
                                } else {
                                    return [
                                        'error' => true,
                                        'message' => $imodel->getErrors(),
                                    ];
                                }
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $imodel->getErrors(),
                                ];
                            }

                            Yii::$app->common->addLog($model->id, "Case has been created");
                            $template = \app\models\EmailTemplates::findOne(['id' => 12]);
                            //Sending to Patient
                            // $data = [
                            //     'template_id' => 12,
                            //     'to' => $patient_email,
                            //     'case_id' => $model->id,
                            //     'body' => $template,
                            //     'subject' => $template->subject,
                            //     'services' => implode(', ', $services),
                            //     'patient_name' => $patient_name,
                            //     'name' => $patient_name,

                            // ];
                            // if (isset($patient_email) && !empty($patient_email)) {
                            //     Yii::$app->common->sendEmail($data);
                            // }

                            //Sending to Doctor
                            $data = [
                                'template_id' => 12,
                                'to' => $doctor_email,
                                'case_id' => $model->id,
                                'body' => $template,
                                'subject' => $template->subject,
                                'services' => implode(', ', $services),
                                'patient_name' => $patient_name,
                                'name' => $doctor_name
                            ];
                            Yii::$app->common->sendEmail($data);
                            if (isset($POST['Cases']['patient_id']['HomePhone']) && !empty($POST['Cases']['patient_id']['HomePhone'])) {
                                $sms = str_replace('[name]', $POST['Cases']['patient_id']['label'], $template->sms);
                                $sms = str_replace('[appointment_date]', date("d M, Y", strtotime($model->appointment_date)), $sms);
                                Yii::$app->sms->compose()->setTo($POST['Cases']['patient_id']['HomePhone'])->setMessage($sms)->send();
                            } else if (isset($POST['Cases']['patient_id']['WorkPhone']) && !empty($POST['Cases']['patient_id']['WorkPhone'])) {
                                $sms = str_replace('[name]', $POST['Cases']['patient_id']['label'], $template->sms);
                                $sms = str_replace('[appointment_date]', date("d M, Y", strtotime($model->appointment_date)), $sms);
                                Yii::$app->sms->compose()->setTo($POST['Cases']['patient_id']['WorkPhone'])->setMessage($sms)->send();
                            }

                            $data['records'] = $model;
                            $data['location_name'] = $POST['Cases']['location_id'];

                            $content = $this->renderPartial('case-receipt', $data);
                            $this->generatePdf('case-receipt-' . $model->id . '-' . $POST['Cases']['patient_id'], 'Case Receipt', $content);
                            $response = [
                                'success' => true,
                                'file' => true
                            ];

                            $dmodel = new \app\models\Documents;
                            $dmodel->user_id = 0;
                            $dmodel->clinic_id = 0;
                            $dmodel->patient_id = (int) $POST['Cases']['patient_id'];
                            $dmodel->case_id = $model->id;
                            $dmodel->case_file = 0;
                            $dmodel->document_type_id = "0";
                            $dmodel->document_name = "case-receipt-" . $model->id . "-" . $POST['Cases']['patient_id'] . ".pdf";
                            $dmodel->document_name_original = "case-receipt";
                            $dmodel->extension = "pdf";
                            $dmodel->size = 0;
                            $dmodel->uploaded_by = Yii::$app->user->identity->id;
                            $dmodel->save();
                            $transaction->commit();
                            return [
                                'success' => true,
                                'caseId' => $model->id,
                                'message' => 'Case has been added successfully.',
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => 'Case not found and payment did not get processed.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => $model->getErrors(),
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

    //Label~Module~Action~Url~Icon:Reschedule Appointment~Cases~reschedule-appointment~/admin/cases~fa fa-medkit
    public function actionRescheduleAppointment()
    {
        if (isset($_POST) && !empty($_POST)) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\Cases;
                $POST['Cases'] = $_POST['fields'];
                $POST['Cases']['location_id'] = $POST['Cases']['location_id']['value'];
                if (isset($POST['Cases']['new_appointment_date']) && !empty($POST['Cases']['new_appointment_date'])) {
                    $POST['Cases']['appointment_date'] = $POST['Cases']['new_appointment_date'];
                }
                $find = $model->find()->joinWith(['services.service', 'patient', 'team.user'])->where(['cases.id' => $POST['Cases']['id']])->one();
                $find->status = 0;
                if ($find && $find->load($POST) && $find->save()) {
                    Yii::$app->common->addLog($find->id, "Appointment rescheduled.");

                    $teamMembers = $find->team;
                    $serviceNames = [];
                    if (isset($find->services) && !empty($find->services)) {
                        foreach ($find->services as $s) {
                            $serviceNames[] = $s->service->name;
                        }
                    }

                    $data['records'] = $model->find()->joinWith(['services.service', 'patient', 'doctor d', 'team.user', 'location', 'slot', 'location.state ls'])->where(['cases.id' => $POST['Cases']['id']])->asArray()->one();
                    $dmodel = new \app\models\Documents;
                    $file_exists = $dmodel->find()->where(['LIKE', 'document_name', 'case-receipt'])->andWhere(['case_id' => $find->id])->count();
                    if ($file_exists > 0) {
                        $file_name = "case-receipt-" . ($file_exists + 1) . "-" . $find->id . "-" . $find->patient_id;
                        $original_file_name = "case-receipt-" . ($file_exists + 1);
                    } else {
                        $file_name = "case-receipt";
                        $original_file_name = "case-receipt";
                    }
                    $content = $this->renderPartial('case-receipt', $data);
                    $this->generatePdf($file_name, 'Case Receipt', $content);

                    $dmodel->case_id = $find->id;
                    $dmodel->case_file = 0;
                    $dmodel->document_type_id = "0";
                    $dmodel->document_name = $file_name . ".pdf";
                    $dmodel->document_name_original = $original_file_name;
                    $dmodel->extension = "pdf";
                    $dmodel->uploaded_by = Yii::$app->user->identity->id;
                    $dmodel->save();

                    $template = \app\models\EmailTemplates::findOne(['id' => 13]);
                    if (isset($teamMembers) && !empty($teamMembers)) {
                        $patientNameEmail = ucwords($find->patient->last_name . " " . $find->patient->first_name[0]);
                        foreach ($teamMembers as $member) {
                            $data = [
                                'template_id' => 13,
                                'to' => $member->user->email,
                                //'to'=>'opnsrc.devlpr@gmail.com',
                                'case_id' => $find->c_id,
                                'body' => $template,
                                'subject' => $template->subject,
                                'services' => implode(', ', $serviceNames),
                                'patient_name' => $patientNameEmail,
                                'name' => $member->user->first_name,

                            ];
                            Yii::$app->common->sendEmail($data);
                        }
                    }
                    $transaction->commit();
                    return [
                        'success' => true,
                        'message' => 'Appointment has been rescheduled.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => $find->getErrors(),
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

    //Label~Module~Action~Url~Icon:List Cases~Cases~list~/admin/cases~fa fa-medkit
    public function actionList($pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'location' => [
                    'asc' => ['locations.publish_name' => SORT_ASC],
                    'desc' => ['locations.publish_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'appointment_date' => [
                    'asc' => ['appointment_date' => SORT_ASC],
                    'desc' => ['appointment_date' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'name' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'clinic' => [
                    'asc' => ['clinics.name' => SORT_ASC],
                    'desc' => ['clinics.name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'price' => [
                    'asc' => ['total_price' => SORT_ASC],
                    'desc' => ['total_price' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'status' => [
                    'asc' => ['status' => SORT_ASC],
                    'desc' => ['status' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->joinWith([
            'patient',
            'user' => function ($q) {
                $q->select(Yii::$app->params['user_table_select_columns_new']);
            },
            'clinic',
            'location'
        ]);
        if (!in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            $query->andWhere([
                'or',
                ['cases.id' => \app\models\TreatmentTeam::find()->select(['case_id'])->where(['user_id' => Yii::$app->user->identity->id])],
                ['cases.created_by' => Yii::$app->user->identity->id]
            ]);
        }
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->location_id)) {
                if (!empty($search->location_id['value'])) {
                    $query->andWhere(['cases.location_id' => $search->location_id['value']]);
                } else {
                    $query->andWhere(['cases.location_id' => explode(",", Yii::$app->user->identity->locations)]);
                }
            }
            if (!empty($search->user_id)) {
                $query->andWhere(['cases.user_id' => $search->user_id['value']]);
            }
            if (!empty($search->clinic_id)) {
                $query->andWhere(['cases.clinic_id' => $search->clinic_id['value']]);
            }
            if (!empty($search->case_id)) {
                $query->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
            }
            if (isset($search->status)) {
                $statusId = [];
                foreach ($search->status as $status) {
                    $statusId[] = $status['value'];
                }
                $query->andWhere(['cases.status' => $statusId]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'cases.appointment_date', $from],
                    ['<=', 'cases.appointment_date', $to],
                ]);
            }
            if (!empty($search->name)) {
                $query->andWhere([
                    'or',
                    ['LIKE', 'patients.first_name', $search->name],
                    ['LIKE', 'patients.last_name', $search->name],
                    ['LIKE', 'patients.middle_name', $search->name],
                ]);
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
                'cases' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'cases' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Case Details~Cases~get-case-details~/admin/cases~fa fa-medkit
    public function actionGetCaseDetails($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Cases;
                $find = $model->find()->joinWith([
                    'patient.statedetails ps',
                    'user u' => function ($q) {
                        $q->select(Yii::$app->params['user_table_select_columns_new']);
                    },
                    'user.bstate us',
                    'clinic.statedetails',
                    'location.state as ls',
                    'caseServices.service',
                    'slot',
                    'documents' => function ($q) {
                        $q->orderBy(['documents.id' => SORT_ASC]);
                    },
                    'documents.uploadedby ub',
                    'team.user',
                    'notes.addedby n',
                    'invoices',
                    'invoices.payments pi',
                    'logs.addedby ab'
                ])->where(['cases.id' => $id])->asArray()->one();
                //=>function($query){$query->where(['invoices.status'=>1]);

                if ($find) {
                    return [
                        'success' => true,
                        'case' => $find
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Case not found!',
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
                'message' => 'Case not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Case~Cases~delete~/admin/cases~fa fa-medkit
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\Cases;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find) {
                    $case_id = $find->id;
                    if ($find->delete()) {
                        \app\models\CaseServices::deleteAll(['case_id' => $case_id]);
                        \app\models\CaseLog::deleteAll(['case_id' => $case_id]);
                        \app\models\Invoices::deleteAll(['case_id' => $case_id]);
                        \app\models\Payments::deleteAll(['case_id' => $case_id]);
                        \app\models\TreatmentTeam::deleteAll(['case_id' => $case_id]);
                        \app\models\Documents::deleteAll(['case_id' => $case_id]);
                        \app\models\Notes::deleteAll(['case_id' => $case_id]);
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Case has been deleted successfully.',
                        ];
                    }
                } else {
                    $transaction->rollBack();
                    return [
                        'error' => true,
                        'message' => 'Case not found!',
                    ];
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
                'message' => 'Clinic not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Manage Partner~Cases~add-team~/admin/cases~fa fa-medkit
    public function actionAddTeam()
    {
        if (isset($_POST) && !empty($_POST)) {
            $POST = $_POST['fields'];
            $transaction = Yii::$app->db->beginTransaction();
            try {
                if (isset($POST['team'])) {
                    $added_updated = 0;
                    $teamArr = [];
                    foreach ($POST['team'] as $key => $team) {
                        $teamArr[] = $team['value'];
                        $find = \app\models\TreatmentTeam::findOne(['case_id' => $POST['case_id'], 'user_id' => $team['value']]);
                        if (!$find) {
                            $model = new \app\models\TreatmentTeam;
                            $model->case_id = $POST['case_id'];
                            $model->user_id = $team['value'];
                            $model->added_by = Yii::$app->user->identity->id;
                            $cmodel = \app\models\Cases::findOne(['id' => $POST['case_id']]);
                            if ($model->validate()) {
                                $model->save();
                                $added_updated++;
                                $template = \app\models\EmailTemplates::findOne(['id' => 7]);
                                $data = [
                                    'template_id' => 7,
                                    'to' => explode('-', $team['label'], 2)[1],
                                    'body' => $template,
                                    'subject' => $template->subject,
                                    'name' => explode('-', $team['label'], 2)[0],
                                    'case_id' => $model->case_id,
                                    'patient_name' => ucwords($cmodel->patient->last_name . " " . $cmodel->patient->first_name[0]),
                                    'imaging_coordinator_name' => $cmodel->user->first_name,
                                    'imaging_coordinator_email' => $cmodel->user->email,
                                ];
                                Yii::$app->common->sendEmail($data);
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $model->getErrors(),
                                ];
                            }
                        }
                    }
                    if ($added_updated >= 0) {
                        \app\models\TreatmentTeam::deleteAll([
                            'and',
                            ['not in', 'user_id', $teamArr],
                            ['=', 'case_id', $POST['case_id']],
                        ]);
                        $cmodel = \app\models\Cases::findOne(['id' => $POST['case_id']]);
                        $cmodel->user_id = $teamArr[0];
                        $cmodel->save();
                        $ifind = \app\models\Invoices::find()->where(['case_id' => $POST['case_id']])->andWhere(['IS NOT', 'user_id', null])->one();
                        //echo $ifind->createCommand()->getRawSql();die;
                        if ($ifind) {
                            $ifind->user_id = $teamArr[0];
                            $ifind->save();
                        }
                        $pfind = \app\models\Payments::find()->where(['case_id' => $POST['case_id']])->andWhere(['IS NOT', 'user_id', null])->one();
                        if ($pfind) {
                            $pfind->user_id = $teamArr[0];
                            $pfind->save();
                        }
                        Yii::$app->common->addLog($POST['case_id'], "Team member updated to this case.");
                        $transaction->commit();
                        return [
                            'success' => true,
                            'message' => 'Team has been saved successfully.',
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
                'message' => 'Case not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Add Case Documents~Cases~add-documents~/admin/cases~fa fa-medkit
    public function actionAddDocuments()
    {
        $response = [];
        if (isset($_POST['documents']) && !empty($_POST['documents'])) {
            $dmodel = new \app\models\Documents;
            $files = [];
            foreach ($_POST['documents'] as $document) {
                $dfind = $dmodel->findOne(['document_name' => $document['document_name'], 'case_id' => $_POST['caseId'], 'case_file' => $_POST['case_file']]);
                if (!$dfind) {
                    $new_file_name = mt_rand(111111, 999999) . "-" . $_POST['caseId'] . "." . $document['extension'];
                    //if(strpos($attachment, "temp") != false){
                    copy($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name'], $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $new_file_name);
                    $dmodel = new \app\models\Documents;
                    $dmodel->document_name = $new_file_name;
                    $dmodel->document_name_original = $document['document_name_original'];
                    $dmodel->extension = $document['extension'];
                    $dmodel->case_id = $_POST['caseId'];
                    $dmodel->case_file = $_POST['case_file'];
                    $dmodel->document_type_id = $document['document_type_id'];
                    $dmodel->uploaded_by = Yii::$app->user->identity->id;
                    if ($dmodel->validate()) {
                        $files[] = $new_file_name;
                        $dmodel->save();
                        unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name']);
                        Yii::$app->common->addLog($_POST['caseId'], "Document has been added to the case.");
                        $response = [
                            'success' => true,
                            'message' => "Documents added successfully"
                        ];
                    }
                } else {
                    $files[] = $document['document_name'];
                }
            }
            if (!empty($files)) {
                \app\models\Documents::deleteAll(
                    [
                        'and',
                        'case_id = :case_id',
                        'case_file = :case_file',
                        ['not in', 'document_name', $files],
                    ],
                    [':case_id' => $_POST['caseId'], ':case_file' => $_POST['case_file']]
                );
            }
        } else {
            \app\models\Documents::deleteAll(['case_id' => $_POST['caseId']]);
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Delete Document~Cases~delete-document~/admin/cases~fa fa-medkit
    public function actionDeleteDocument()
    {
        if (isset($_POST['file_name']) && !empty($_POST['file_name'])) {
            try {
                if (strpos($_POST['file_name'], "temp") != false) {
                    if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $_POST['file_name'])) {
                        unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $_POST['file_name']);
                    }
                    return [
                        'success' => true,
                        'message' => 'Document has been deleted successfully.',
                    ];
                } else {
                    $model = new \app\models\Documents;
                    $find = $model->find()->where(['document_name' => $_POST['file_name']])->one();
                    $case_id = $find->case_id;
                    if ($find && $find->delete()) {
                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/documents/" . $_POST['file_name'])) {
                            unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/" . $_POST['file_name']);
                        }
                        Yii::$app->common->addLog($case_id, "Document has been deleted from the case.");
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

    public function actionGetSelectedServiceDetail($case_id, $id)
    {
        try {
            $model = new \app\models\CaseServices;
            $find = $model->find()->joinWith(['service', 'locations', 'cases.clinic'])->where(['case_id' => $case_id, 'case_services.id' => $id])->asArray()->one();
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

    //update clinic doctor
    public function actionUpdateClinicDoctor()
    {
        $transaction = Yii::$app->db->beginTransaction();
        if (isset($_POST) && !empty($_POST)) {
            $POST['Cases'] = $_POST['fields'];
            $find = \app\models\Cases::findOne(['id' => $POST['Cases']['case_id']]);
            if ($find) {
                $oldUserId = $find->user_id;
                $find->user_id = $POST['Cases']['user_id']['value'];
                $find->clinic_id = $POST['Cases']['clinic_id']['value'];
                if ($find->validate() && $find->save()) {
                    $tfind = \app\models\TreatmentTeam::findOne(['case_id' => $POST['Cases']['case_id'], 'user_id' => $oldUserId]);
                    if ($tfind) {
                        $tfind->user_id = $POST['Cases']['user_id']['value'];
                        $tfind->save();
                    }
                    $ifind = \app\models\Invoices::find()->where(['case_id' => $POST['Cases']['case_id']])->andWhere(['IS NOT', 'user_id', null])->one();
                    if ($ifind) {
                        $ifind->user_id = $POST['Cases']['user_id']['value'];
                        $ifind->save();
                    }
                    $pfind = \app\models\Payments::find()->where(['case_id' => $POST['Cases']['case_id']])->andWhere(['IS NOT', 'user_id', null])->one();
                    if ($pfind) {
                        $pfind->user_id = $POST['Cases']['user_id']['value'];
                        $pfind->save();
                    }
                    Yii::$app->common->addLog($POST['Cases']['case_id'], "Doctor changed to this case.");
                    $transaction->commit();
                    return [
                        'success' => true,
                        'message' => 'Updated successfully.',
                    ];
                } else {
                    $transaction->rollBack();
                    return [
                        'error' => true,
                        'message' => $find->getErrors(),
                    ];
                }
            } else {
                $transaction->rollBack();
                return [
                    'error' => true,
                    'message' => 'No Case Found!',
                ];
            }
        } else {
            $transaction->rollBack();
            return [
                'error' => true,
                'message' => 'Invalid request!',
            ];
        }
    }

    public function actionFetchCaseDeliveredContent($case_id, $template_id = null)
    {
        if (isset($case_id) && !empty($case_id)) {
            try {
                $model = new \app\models\Cases;
                $find = $model->find()->joinWith([
                    'user u' => function ($q) {
                        $q->select(Yii::$app->params['user_table_select_columns_new']);
                    },
                    'caseServices.service'
                ])->where(['cases.id' => $case_id])->one();

                if ($find) {
                    $template = \app\models\EmailTemplates::findOne(['id' => $template_id ? $template_id : 9]);
                    $doctorFullName = $find->user->first_name . " " . $find->user->middle_name . " " . $find->user->last_name . " " . $find->user->suffix;
                    $patientFullName = $find->patient->prefix . " " . $find->patient->first_name . " " . $find->patient->middle_name . " " . $find->patient->last_name . " " . $find->patient->suffix;
                    $coordinatorName = Yii::$app->user->identity->prefix . " " . Yii::$app->user->identity->first_name . " " . Yii::$app->user->identity->middle_name . " " . Yii::$app->user->identity->last_name . " " . Yii::$app->user->identity->suffix;
                    $doctorEmail = [];
                    foreach ($find->team as $team) {
                        $doctorEmail[] = $team['user']['email'];
                    }
                    $services = [];
                    foreach ($find->caseServices as $service) {
                        $services[] = $service['service']['name'];
                    }
                    $content = str_replace('[name]', $doctorFullName, $template->content);
                    $content = str_replace('[case_id]', $find->c_id, $content);
                    $patientNameEmail = ucwords($find->patient->last_name . " " . $find->patient->first_name[0]);
                    $content = str_replace('[patient_name]', $patientNameEmail, $content);
                    $content = str_replace('[services]', implode(', ', $services), $content);
                    $content = str_replace('[imaging_coordinator_name]', $coordinatorName, $content);
                    $content = str_replace('[imaging_coordinator_email]', Yii::$app->user->identity->email, $content);

                    return [
                        'success' => true,
                        'content' => $content,
                        'to' => implode(",", $doctorEmail)
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Case not found!',
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
                'message' => 'Case not found!',
            ];
        }
    }

    public function actionSendDeliveryEmail()
    {
        if (isset($_POST) && !empty($_POST)) {
            $model = new \app\models\Cases;
            $find = $model->find()->joinWith([
                'user u' => function ($q) {
                    $q->select(Yii::$app->params['user_table_select_columns_new']);
                }
            ])->where(['cases.id' => $_POST['fields']['case_id']])->one();
            $doctorEmail = [];
            foreach ($find->team as $team) {
                $doctorEmail[] = $team['user']['email'];
            }
            $ccEmailArr = [];
            if (isset($_POST['fields']['cc']) && !empty($_POST['fields']['cc'])) {
                $ccEmailArr = explode(",", $_POST['fields']['cc']);
                foreach ($ccEmailArr as $key => $val) {
                    $ccEmailArr[$key] = trim($val);
                }
            }
            $template = \app\models\EmailTemplates::findOne(['id' => $_POST['fields']['template_id']]);
            $data = [
                'template_id' => $_POST['fields']['template_id'],
                //'to'=>"support@imagdent.com",
                // 'to' => "opnsrc.devlpr@gmail.com",
                'to' => $doctorEmail,
                'cc' => $ccEmailArr,
                'body' => $template,
                'notes' => $_POST['fields']['notes'],
                'subject' => $template->subject,
            ];
            if (Yii::$app->common->sendEmail($data)) {
                return [
                    'success' => true,
                    'message' => "We have received your message and will get back to you shortly.",
                ];
            }
        } else {
            return [
                'error' => true,
                'message' => 'Invalid request!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Change Payee~Cases~change-payee~/admin/cases~fa fa-medkit
    public function actionChangePayee()
    {
        if (isset($_POST) && !empty($_POST)) {
            $POST['CaseServices'] = $_POST['fields'];
            $model = new \app\models\CaseServices;
            $find = $model->findOne(['id' => $POST['CaseServices']['id']]);
            if ($find && $find->load($POST) && $find->save()) {
                $cmodel = new \app\models\Cases;
                $cfind = $cmodel->findOne(['id' => $find->case_id]);
                if ($cfind) {
                    $cfind->clinic_id = $POST['CaseServices']['clinic_id']['value'];
                    if ($cfind->save()) {
                        Yii::$app->common->updateBalance($find->case_id);
                    }
                }
                Yii::$app->common->addLog($find->case_id, "Payee has been changed.");
                return [
                    'success' => true,
                    'message' => "Payee has been changed successfully.",
                ];
            }
        } else {
            return [
                'error' => true,
                'message' => 'Invalid request!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Add Service~Cases~add-service~/admin/cases~fa fa-medkit
    public function actionAddService()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $POST['CaseServices'] = $_POST['fields'];
                if (isset($POST['CaseServices']['service_id']) && !empty($POST['CaseServices']['service_id'])) {
                    $model = new \app\models\CaseServices;
                    $find = $model->findOne(['case_id' => $POST['CaseServices']['case_id'], 'service_id' => $POST['CaseServices']['service_id']['value']]);
                    if ($find) {
                        return [
                            'error' => true,
                            'message' => "Service already found for this case.",
                        ];
                    } else {
                        $model = new \app\models\CaseServices;
                        $model->case_id = $POST['CaseServices']['case_id'];
                        $model->service_id = $POST['CaseServices']['service_id']['value'];
                        $model->location_id = $POST['CaseServices']['service_id']['location_id'];
                        $model->price = $POST['CaseServices']['service_id']['price'];
                        $model->who_will_pay = $POST['CaseServices']['who_will_pay'];
                        $model->sub_total = $model->price;
                        if ($model->validate() && $model->save()) {
                            //$this->updateTotalPrice($model->case_id);
                            Yii::$app->common->updateBalance($model->case_id);
                            Yii::$app->common->addLog($model->case_id, "Service has been added to the case.");
                            return [
                                'success' => true,
                                'message' => 'Service has been added successfully.',
                            ];
                        } else {
                            print_r($model->getErrors());
                        }
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

    //Label~Module~Action~Url~Icon:Add Discount~Cases~add-discount~/admin/cases~fa fa-medkit
    public function actionAddDiscount()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $POST['CaseServices'] = $_POST['fields'];
                if (isset($POST['CaseServices']['service_id']) && !empty($POST['CaseServices']['service_id'])) {
                    $model = new \app\models\CaseServices;
                    $find = $model->findOne(['case_id' => $POST['CaseServices']['case_id'], 'service_id' => $POST['CaseServices']['service_id']]);
                    if ($find && $find->load($POST)) {
                        if ($find->discount > $find->price || $find->discount < 0) {
                            return [
                                'error' => true,
                                'message' => "Discount can not be less than zero and greater than service price.",
                            ];
                        } else {
                            $find->sub_total = $find->price - $find->discount;
                            $find->scenario = 'add-discount';
                            if ($find->validate() && $find->save()) {
                                //$this->updateTotalPrice($find->case_id);
                                Yii::$app->common->updateBalance($find->case_id);
                                Yii::$app->common->addLog($find->case_id, "Discount applied to this case.", $find->reason);
                                return [
                                    'success' => true,
                                    'message' => 'Discount applied successfully.',
                                ];
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $find->getErrors(),
                                ];
                            }
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => "Service not found.",
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

    //Label~Module~Action~Url~Icon:Receive Payment~Cases~receive-payment~/admin/cases~fa fa-medkit
    public function actionReceivePayment()
    {
        if (isset($_POST) && !empty($_POST)) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $POST['Payments'] = $_POST['fields'];
                $POST['Payments']['received_by'] = Yii::$app->user->identity->id;
                $POST['Payments']['manual'] = $POST['Payments']['manual'] ? 1 : 0;
                if (isset($POST['Payments']['received_on']) && !empty($POST['Payments']['received_on'])) {
                    $POST['Payments']['added_on'] = date("Y-m-d H:i:s", strtotime($POST['Payments']['received_on']));
                }
                $imodel = new \app\models\Invoices;
                $model = new \app\models\Payments;
                if (isset($POST['Payments']['user_id']) && !empty($POST['Payments']['user_id'])) {
                    $ifind = $imodel->find()->where(['case_id' => $POST['Payments']['case_id'], 'user_id' => $POST['Payments']['user_id'], 'status' => 0])->one();
                    $invoice_layout = "send-invoice-doctor";
                } else if (isset($POST['Payments']['patient_id']) && !empty($POST['Payments']['patient_id'])) {
                    $ifind = $imodel->find()->where(['case_id' => $POST['Payments']['case_id'], 'patient_id' => $POST['Payments']['patient_id'], 'status' => 0])->one();
                    $invoice_layout = "send-invoice-patient";
                }
                //echo $ifind->createCommand()->getRawSql();die;
                if ($ifind) {
                    if ($ifind->balance_amount >= (float) $POST['Payments']['amount']) {
                        $model->case_id = $ifind->case_id;
                        $model->paid_amount = (float) $POST['Payments']['amount'];
                        $model->remaining_amount = $ifind->balance_amount - (float) $POST['Payments']['amount'];
                        $model->invoice_id = $ifind->id;
                        $model->location_id = $ifind->location_id;
                        $model->actual_invoice_id = $ifind->invoice_id;
                        $model->user_id = $ifind->user_id;
                        $model->patient_id = $ifind->patient_id;
                        $model->mode = (int) $POST['Payments']['mode'];
                        if ($model->mode == 1) {
                            $model->cheque_number = $POST['Payments']['cheque_number'];
                        }
                        $model->manual = $POST['Payments']['manual'];
                        $model->received_by = $POST['Payments']['received_by'];

                        // mode 6 is for 0 amount. 
                        if ($model->mode > 1 && !$model->manual) {
                            if (isset($POST['Payments']['token']) && isset($POST['Payments']['token'])) {
                                require dirname(dirname(dirname(__FILE__))) . "/api/web/gateway/vendor/autoload.php";
                                require dirname(dirname(dirname(__FILE__))) . "/api/web/gateway/BridgeCommSDK.php";
                                $request = new \BridgeCommRequest();
                                $request->TransactionID = mt_rand();
                                $request->RequestType = "004";
                                $request->ClientIdentifier = "SOAP";
                                $request->PrivateKey = "ba8nSz4cEZ5pMTYP";
                                $request->AuthenticationTokenId = $POST['Payments']['token'];

                                $request->requestMessage = new \RequestMessage();
                                $request->requestMessage->Amount = 690;
                                $request->requestMessage->InvoiceNum = $model->invoice_id;
                                $request->requestMessage->TransIndustryType = "EC";
                                $request->requestMessage->TransactionType = "SALE";
                                $request->requestMessage->AcctType = "R";
                                $request->requestMessage->HolderType = "P";
                                $request->requestMessage->IsoCurrencyCode = "USD";

                                $conn = new \BridgeCommConnection();
                                $response = $conn->processRequest("https://rhuat.bridgepaynetsecuretest.com/paymentservice/requesthandler.svc", $request);
                                $tmodel = new \app\models\Transactions;
                                $transactions['Transactions'] = (array) $response->responseMessage;
                                $transactions['Transactions']['TransactionID'] = $response->TransactionID;
                                $transactions['Transactions']['RequestType'] = $response->RequestType;
                                $transactions['Transactions']['ResponseCode'] = $response->ResponseCode;
                                $transactions['Transactions']['ResponseDescription'] = $response->ResponseDescription;
                                if ($tmodel->load($transactions) && $tmodel->save()) {
                                    if ($model->save()) {
                                        $ifind->balance_amount = $ifind->balance_amount - (float) $POST['Payments']['amount'];
                                        if ($ifind->balance_amount == 0) {
                                            $ifind->status = 1;
                                        }
                                        $ifind->save();
                                        Yii::$app->common->addLog($model->case_id, "Payment of $" . $POST['Payments']['amount'] . " received for this case.");
                                        $transaction->commit();
                                        return [
                                            'success' => true,
                                            'message' => 'Payment has been received successfully.',
                                        ];
                                    } else {
                                        return [
                                            'error' => true,
                                            'message' => $ifind->getErrors(),
                                        ];
                                    }
                                }
                            }
                        } else if ($model->load($POST) && $model->validate()) {
                            $model->save();
                            $ifind->balance_amount = $ifind->balance_amount - (float) $POST['Payments']['amount'];
                            if ($ifind->balance_amount == 0) {
                                $ifind->status = 1;
                            }
                            $ifind->save();
                            Yii::$app->common->addLog($ifind->case_id, "Payment of $" . $POST['Payments']['amount'] . " received for this case.");
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Payment has been received successfully.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => "Payment should not be greater than $" . $ifind->balance_amount,
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => "Payment has already been received for this case.",
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

    //Label~Module~Action~Url~Icon:Remove Payment~Cases~remove-payment~/admin/cases~fa fa-medkit
    public function actionRemovePayment()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $model = new \app\models\Payments;
                $find = $model->find()->where(['case_id' => $_POST['fields']['case_id'], 'id' => $_POST['fields']['id']])->one();
                $amount = $find->paid_amount;
                $case_id = $find->case_id;
                $invoice_id = $find->actual_invoice_id;
                if ($find && $find->delete()) {
                    $imodel = new \app\models\Invoices;
                    $ifind = $imodel->find()->where(['invoice_id' => $invoice_id])->one();
                    $ifind->balance_amount = $ifind->balance_amount + $amount;
                    $ifind->status = 0;
                    $ifind->save();
                    Yii::$app->common->addLog($case_id, "Payment of $" . $amount . " has been removed.");
                    return [
                        'success' => true,
                        'message' => 'Payment has been removed successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => "Payment not found or you are not authorized to do this action.",
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

    public function actionAddNote()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $POST['notes'] = $_POST['fields'];
                $nmodel = new \app\models\Notes;
                $nmodel->case_id = $POST['notes']['case_id'];
                $nmodel->note_type = 0;
                $nmodel->notes = $POST['notes']['notes'];
                $nmodel->added_by = Yii::$app->user->identity->id;
                if ($nmodel->validate() && $nmodel->save()) {
                    Yii::$app->common->addLog($nmodel->case_id, "Note has been added to this case.", $nmodel->notes);
                    return [
                        'success' => true,
                        'message' => 'Note has been added successfully.',
                    ];
                } else {
                    print_r($nmodel->getErrors());
                }
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
    }


    public function actionGetNotes($case_id)
    {
        try {
            $model = new \app\models\Notes;
            $find = $model->find()->joinWith(['addedby'])->where(['case_id' => $case_id])->asArray()->all();
            if ($find) {
                return [
                    'success' => true,
                    'notes' => $find,
                ];
            } else {
                return [
                    'error' => true,
                    'message' => 'No Note found for this case!',
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionGetPayments($case_id)
    {
        try {
            $model = new \app\models\Invoices;
            $find = $model->find()->joinWith(['payments'])->where(['invoices.case_id' => $case_id])->orderBy('received_on desc')->asArray()->all();
            return [
                'success' => true,
                'payments' => $find,
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionDeleteNote($id)
    {
        try {
            $model = new \app\models\Notes;
            $find = $model->findOne(['id' => $id, 'added_by' => Yii::$app->user->identity->id]);
            $case_id = $find->case_id;
            if ($find && $find->delete()) {
                Yii::$app->common->addLog($case_id, "Note has been removed from this case.");
                return [
                    'success' => true,
                    'message' => 'Note has been deleted successfully',
                ];
            } else {
                return [
                    'error' => true,
                    'message' => 'Invalid request!',
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionDeleteService($case_id, $service_id)
    {
        try {
            $model = new \app\models\CaseServices;
            $find = $model->findOne(['case_id' => $case_id, 'service_id' => $service_id]);
            if ($find && $find->delete()) {
                Yii::$app->common->updateBalance($case_id);
                Yii::$app->common->addLog($case_id, "Service has been removed from this case.");
                return [
                    'success' => true,
                    'message' => 'Service has been removed successfully',
                ];
            } else {
                return [
                    'error' => true,
                    'message' => 'Invalid request!',
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionGetLogs($case_id)
    {
        try {
            $model = new \app\models\CaseLog;
            $find = $model->find()->joinWith(['addedby'])->where(['case_id' => $case_id])->orderBy('added_on desc')->asArray()->all();
            if ($find) {
                return [
                    'success' => true,
                    'logs' => $find,
                ];
            } else {
                return [
                    'error' => true,
                    'message' => 'Activities not found for this case!',
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    /* public function updateTotalPrice($case_id){
        $total = \app\models\CaseServices::find()->where(['case_id'=>$case_id])->sum('sub_total');
        $find = \app\models\Cases::findOne(['id'=>$case_id]);
        if($find){
            $find->total_price = $total;
            $find->save();
        }
    } */



    /* public function addLog($case_id, $title, $message = null){
        $model = new \app\models\CaseLog;
        $model->case_id = $case_id;
        $model->added_by = Yii::$app->user->identity->id;
        $model->title = $title;
        $model->message = $message;
        if($model->validate()){
            $model->save();
        }
    } */

    //Label~Module~Action~Url~Icon:Change Status~Cases~change-status~/admin/cases~fa fa-medkit
    public function actionChangeStatus()
    {
        try {
            $POST['Cases'] = $_POST['fields'];
            $model = new \app\models\Cases;
            if ($model->load($POST)) {
                $find = $model->find()->where(['id' => $POST['Cases']['id']])->one();
                if ($find) {
                    if ($find->status == 0) {
                        $find->status = 1;
                        $find->patient_checked_in = date("Y-m-d H:i:s");
                        $logTitle = "Action: Patient checked in.";
                    } else if ($find->status == 1) {
                        $find->status = 2;
                        if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                            $logTitle = "Action: Patient paper work has been skipped.";
                        } else {
                            $logTitle = "Action: Patient paper work has been uploaded.";
                        }
                    } else if ($find->status == 2) {
                        if (\app\models\CaseServices::find()->where(['case_id' => $find->id, 'who_will_pay' => 1])->count() > 0) {
                            $totalPayments = \app\models\Invoices::find()->where(['case_id' => $find->id, 'status' => 1, 'patient_id' => $find->patient_id])->count();
                            $amountDue = \app\models\Invoices::find()->select(['sub_total'])->where(['case_id' => $find->id, 'status' => 0, 'patient_id' => $find->patient_id])->one();
                            if ($totalPayments > 0 || ($amountDue && $amountDue->sub_total == 0)) {
                                $find->status = 3;
                                $logTitle = "Action: Payment accepted.";
                                if ($amountDue && $amountDue->sub_total == 0) {
                                    $_POST = [];
                                    $_POST['fields'] = [];
                                    $_POST['fields']['case_id'] = $find->id;
                                    $_POST['fields']['patient_id'] = $find->patient_id;
                                    $_POST['fields']['amount'] = $amountDue->sub_total;
                                    $_POST['fields']['mode'] = 6;
                                    $_POST['fields']['manual'] = 1;
                                    $response = $this->actionReceivePayment();
                                }
                            } else {
                                return [
                                    'error' => true,
                                    'message' => 'Please make sure we received the payment from patient.',
                                    'skip' => false
                                ];
                            }
                        } else {
                            if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                                $find->status = 3;
                                $logTitle = "Action: Payment skipped as there is no payment due from patient.";
                            } else {
                                return [
                                    'error' => true,
                                    'message' => 'Please make sure we received the payment.',
                                ];
                            }
                        }
                    } else if ($find->status == 3) {
                        $find->status = 4;
                        if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                            $logTitle = "Action: Record is not captured because it is not required.";
                        } else {
                            $logTitle = "Action: Record has been captured.";
                        }
                    } else if ($find->status == 4) {
                        $find->status = 5;
                        if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                            $logTitle = "Action: Re-formatted files not needed.";
                        } else {
                            $logTitle = "Action: Re-formatted files have been uploaded.";
                        }
                    } else if ($find->status == 5) {
                        $find->status = 6;
                        if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                            $logTitle = "Action: Radiologist not needed.";
                        } else {
                            $logTitle = "Action: Ready for radiologist.";
                        }
                    } else if ($find->status == 6) {
                        $find->status = 7;
                        if (isset($POST['Cases']['skip']) && $POST['Cases']['skip'] == "Y") {
                            $logTitle = "Action: Radiologist report not needed.";
                        } else {
                            $logTitle = "Action: Rad report completed.";
                        }
                    } else if ($find->status == 7) {
                        $find->status = 8;
                        $logTitle = "Action: Case completed.";
                    }
                    if ($find->save()) {
                        Yii::$app->common->addLog($find->id, $logTitle);
                        return [
                            'success' => true,
                            'status' => $find->status,
                            'message' => 'Task completed successfully.',
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Cancel Appointment~Cases~cancel-appointment~/admin/cases~fa fa-medkit
    public function actionCancelAppointment()
    {
        try {
            $model = new \app\models\Cases;
            if (isset($_POST) && !empty($_POST)) {
                $find = $model->find()->joinWith(['services.service', 'patient', 'team.user'])->where(['cases.id' => $_POST['case_id']])->one();
                if ($find) {
                    $teamMembers = $find->team;
                    $find->status = 9;
                    $find->slot_id = NULL;
                    if ($find->save()) {
                        Yii::$app->common->addLog($find->id, "Appointment has been cancelled.");
                        $serviceNames = [];
                        if (isset($find->services) && !empty($find->services)) {
                            foreach ($find->services as $s) {
                                $serviceNames[] = $s->service->name;
                            }
                        }
                        $template = \app\models\EmailTemplates::findOne(['id' => 14]);
                        if (isset($teamMembers) && !empty($teamMembers)) {
                            $patientNameEmail = ucwords($find->patient->last_name . " " . $find->patient->first_name[0]);
                            foreach ($teamMembers as $member) {
                                $data = [
                                    'template_id' => 12,
                                    'to' => $member->user->email,
                                    'case_id' => $find->c_id,
                                    'body' => $template,
                                    'subject' => $template->subject,
                                    'services' => implode(', ', $serviceNames),
                                    'patient_name' => $patientNameEmail,
                                    'name' => $member->user->first_name,

                                ];
                                Yii::$app->common->sendEmail($data);
                            }
                        }
                        return [
                            'success' => true,
                            'status' => $find->status,
                            'message' => 'Appointment has been cancelled successully.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Case not found.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'There is some problem is the request.',
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

    public function actionSendInvoice()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $data = [];
                $model = new \app\models\Invoices;
                $query = $model->find()->joinWith(['case.patient', 'case.user', 'case.location'])->where(['case_id' => $_POST['case_id']]);
                if (isset($_POST['user_id'])) {
                    $query->andWhere(['invoices.user_id' => $_POST['user_id']]);
                    $invoice_layout = "send-invoice-doctor";
                } else if (isset($_POST['patient_id'])) {
                    $query->andWhere(['invoices.patient_id' => $_POST['patient_id']]);
                    $invoice_layout = "send-invoice-patient";
                }
                $find = $query->one();
                if ($find) {
                    $data['record'] = $find;
                    //dd($data['record']);
                    $content = $this->renderPartial($invoice_layout, $data);
                    $pdf = new Pdf([
                        // set to use core fonts only
                        'mode' => Pdf::MODE_CORE,
                        // A4 paper format
                        'format' => Pdf::FORMAT_A4,
                        // portrait orientation
                        'orientation' => Pdf::ORIENT_PORTRAIT,
                        // stream to browser inline
                        //'destination' => Pdf::DEST_BROWSER, 
                        'destination' => Pdf::DEST_FILE,
                        'filename' => $_SERVER['DOCUMENT_ROOT'] . "/api/web/invoice/" . $find->invoice_id . ".pdf",
                        // your html content input
                        'content' => $content,
                        // format content from your own css file if needed or use the
                        // enhanced bootstrap css built by Krajee for mPDF formatting 
                        'cssFile' => '@vendor/kartik-v/yii2-mpdf/src/assets/kv-mpdf-bootstrap.min.css',
                        // any css to be embedded if required
                        'cssInline' => '.kv-heading-1{font-size:18px}',
                        // set mPDF properties on the fly
                        'options' => ['title' => 'Krajee Report Title'],
                        // call mPDF methods on the fly
                        'methods' => [
                            // 'SetHeader' => ['Krajee Report Header'],
                            // 'SetFooter' => ['{PAGENO}'],
                        ]
                    ]);
                    $pdf->render();
                    return [
                        'success' => true,
                        'message' => 'Task completed successfully.',
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
    public function generatePdf($filename, $title, $content)
    {
        //$content = $this->renderPartial($filename,$data);
        $pdf = new \kartik\mpdf\Pdf([
            // set to use core fonts only
            'mode' => \kartik\mpdf\Pdf::MODE_CORE,
            // A4 paper format
            'format' => \kartik\mpdf\Pdf::FORMAT_A4,
            // portrait orientation
            'orientation' => \kartik\mpdf\Pdf::ORIENT_PORTRAIT,
            // stream to browser inline
            //'destination' => \kartik\mpdf\Pdf::DEST_BROWSER, 
            'destination' => \kartik\mpdf\Pdf::DEST_FILE,
            'filename' => $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $filename . ".pdf",
            // your html content input
            'content' => $content,
            // format content from your own css file if needed or use the
            // enhanced bootstrap css built by Krajee for mPDF formatting 
            'cssFile' => '@vendor/kartik-v/yii2-mpdf/src/assets/kv-mpdf-bootstrap.min.css',
            // any css to be embedded if required
            //'defaultFontSize' => '1',
            'cssInline' => '.kv-heading-1{font-size:15px}',
            // set mPDF properties on the fly
            'options' => ['title' => 'Krajee Report Title'],
            // call mPDF methods on the fly
            'methods' => [
                'SetTitle' => $title . ' - iMagdent.com',
                'SetAuthor' => 'Mitiz Technologies',
                'SetCreator' => 'Mitiz Technologies',
                // 'SetHeader'=>['iMagDent - '.$title], 
                // 'SetFooter'=>['{PAGENO}'],
            ]
        ]);
        //print_r($data);die();
        $pdf->render();
    }
}
