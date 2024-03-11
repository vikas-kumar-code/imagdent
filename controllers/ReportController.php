<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;


class ReportController extends Controller
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
            //'except' => ['all-clinics'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Reports', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    public function generatePdfNew($filename, $title, $content)
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
            'destination' => \kartik\mpdf\Pdf::DEST_STRING,
            //'destination' => \kartik\mpdf\Pdf::DEST_BROWSER,
            //'filename' => $_SERVER['DOCUMENT_ROOT'] . "/api/web/reports/" . $filename . ".pdf",
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
                //'SetHeader' => ['iMagDent - ' . $title],
                //'SetFooter' => ['{PAGENO}'],
            ],
            'marginLeft' => 3,
            'marginRight' => 3,
            'marginTop' => 10,
        ]);
        echo base64_encode($pdf->render());
        die;
    }

    public function generatePdfInvoice($filename, $title, $content)
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
            'destination' => \kartik\mpdf\Pdf::DEST_STRING,
            //'destination' => \kartik\mpdf\Pdf::DEST_BROWSER,
            //'filename' => $_SERVER['DOCUMENT_ROOT'] . "/api/web/reports/" . $filename . ".pdf",
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
                //'SetHeader' => ['iMagDent - ' . $title],
                'SetFooter' => ['
                <table width="100%">
                    <tr>
                        <td style="font-size:11px;">
                            You can make your payment online by logging into your account on our <br>
                            portal at www.imagdent.com, by returning the upper portion of this <br>
                            invoice with your payment or over the phone by calling (531) 867-4273.
                        </td>
                        <td style="text-align:right;font-size:10px;">
                            PAGE {PAGENO} OF {nb}
                        </td>
                    </tr>
                </table>
                '],
            ],
            'marginLeft' => 8,
            'marginRight' => 8,
            'marginTop' => 15,
            'marginBottom' => 25,
        ]);
        echo base64_encode($pdf->render());
        die;
    }

    //Label~Module~Action~Url~Icon:End Of Day~Financial Reports~end-of-day~/admin/financial-report/end-of-day~fa fa-circle
    public function actionEndOfDay($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'patient' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'appointment_date' => [
                    'asc' => ['cases.appointment_date' => SORT_ASC],
                    'desc' => ['cases.appointment_date' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'patient_checked_in' => [
                    'asc' => ['cases.patient_checked_in' => SORT_ASC],
                    'desc' => ['cases.patient_checked_in' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'amount' => [
                    'asc' => ['amount' => SORT_ASC],
                    'desc' => ['amount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sub_total' => [
                    'asc' => ['payments.sub_total' => SORT_ASC],
                    'desc' => ['payments.sub_total' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'discount' => [
                    'asc' => ['discount' => SORT_ASC],
                    'desc' => ['discount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'mode' => [
                    'asc' => ['mode' => SORT_ASC],
                    'desc' => ['mode' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['patient_checked_in' => SORT_DESC],
        ]);

        $model = new \app\models\Invoices;
        $query = $model->find()->joinWith(['case.user as cu' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'location', 'case.patient', 'case.services.service', 'payments'])->where(['>', 'invoices.amount', 0]);
        $groupQuery = $model->find()->joinWith(['case', 'payments']);

        $totalPatientArQuery = $model->find()->joinWith(['case', 'payments'])->where(['>', 'invoices.amount', 0])->andWhere(['!=', 'invoices.patient_id', 'NULL']);
        $totalDoctorArQuery = $model->find()->joinWith(['case', 'payments'])->where(['>', 'invoices.amount', 0])->andWhere(['!=', 'invoices.user_id', 'NULL']);
        $arPaymentsCollectedQuery = $model->find()->joinWith(['case.user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'case', 'payments', 'payments.receivedBy prb' => function ($q) {
            $q->select(['username','id']);
        }, 'location'])->where(['>', 'invoices.amount', 0]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = json_decode($_GET['fields'], true);

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id['value']]);
                $groupQuery->andWhere(['invoices.location_id' => $search->location_id['value']]);
                $totalPatientArQuery->andWhere(['invoices.location_id' => $search->location_id['value']]);
                $totalDoctorArQuery->andWhere(['invoices.location_id' => $search->location_id['value']]);
                $arPaymentsCollectedQuery->andWhere(['invoices.location_id' => $search->location_id['value']]);
            }
            if (isset($search->case_id) && !empty($search->case_id)) {
                $query->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
                $groupQuery->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
                $totalPatientArQuery->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
                $totalDoctorArQuery->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
                $arPaymentsCollectedQuery->andWhere(['LIKE', 'cases.c_id', $search->case_id]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $groupQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $totalPatientArQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $totalDoctorArQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $arPaymentsCollectedQuery->andWhere([
                    'AND',
                    ['<', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['>=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $to],
                ]);
            } 
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        //echo $query->createCommand()->getRawSql();die;

        $groupPayments = $groupQuery->select(['payments.case_id', 'payments.id', 'payments.mode', 'sum(payments.paid_amount) as total'])->groupBy("payments.mode")->asArray()->all();
        $totalPatientAr = $totalPatientArQuery->sum('invoices.balance_amount');
        $totalDoctorAr = $totalDoctorArQuery->sum('invoices.balance_amount');
        $arPaymentsCollected = $arPaymentsCollectedQuery->asArray()->all();
        $arPaymentsCollectedTotal = 0;
        if (!empty($arPaymentsCollected)) {
            foreach ($arPaymentsCollected as $arpayment) {
                $arPaymentsCollectedTotal = $arPaymentsCollectedTotal + array_sum(array_column($arpayment['payments'], 'paid_amount'));
            }
        }
        if ($find || $arPaymentsCollected) {
            $data['location'] = $find;
            $data['records'] = $find;
            $data['groupPayments'] = $groupPayments;
            $data['totalPatientAr'] = $totalPatientAr == null ? 0.00 : $totalPatientAr;
            $data['totalDoctorAr'] = $totalDoctorAr == null ? 0.00 : $totalDoctorAr;
            $data['arPaymentsCollected'] = $arPaymentsCollected;
            $data['arPaymentsCollectedTotal'] = $arPaymentsCollectedTotal == 0 ? 0.00 : $arPaymentsCollectedTotal;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('end-of-day', $data);
                    $this->generatePdfNew('end-of-the-day', 'End Of Day', $content);
                }
            } else {
                $response = [
                    'success' => true,
                    'invoices' => $find,
                    'groupPayments' => $groupPayments,
                    'totalPatientAr' => $totalPatientAr == null ? 0.00 : $totalPatientAr,
                    'totalDoctorAr' => $totalDoctorAr == null ? 0.00 : $totalDoctorAr,
                    'arPaymentsCollected' => $arPaymentsCollected,
                    'arPaymentsCollectedTotal' => $arPaymentsCollectedTotal == 0 ? 0.00 : $arPaymentsCollectedTotal,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'invoices' => [],
                'groupPayments' => [],
                'totalPatientAr' => 0.00,
                'totalDoctorAr' => 0.00,
                'arPaymentsCollected' => [],
                'arPaymentsCollectedTotal' => 0.00
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:A/R Collected~Financial Reports~ar-collected~/admin/financial-report/ar-collected~fa fa-circle
    public function actionArCollected($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'patient' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'received_on' => [
                    'asc' => ['received_on' => SORT_ASC],
                    'desc' => ['received_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'amount' => [
                    'asc' => ['amount' => SORT_ASC],
                    'desc' => ['amount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sub_total' => [
                    'asc' => ['payments.sub_total' => SORT_ASC],
                    'desc' => ['payments.sub_total' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'discount' => [
                    'asc' => ['discount' => SORT_ASC],
                    'desc' => ['discount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'mode' => [
                    'asc' => ['mode' => SORT_ASC],
                    'desc' => ['mode' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['received_on' => SORT_DESC],
        ]);
        $model = new \app\models\Invoices;

        $query = $model->find()->joinWith(['case.user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'case', 'payments', 'payments.receivedBy prb' => function ($q) {
            $q->select(['id','username']);
        }, 'location'])->where(['>', 'invoices.amount', 0]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['<', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['>=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        $arPaymentsCollectedTotal = 0;
        if (!empty($find)) {
            foreach ($find as $arpayment) {
                $arPaymentsCollectedTotal = $arPaymentsCollectedTotal + array_sum(array_column($arpayment['payments'], 'paid_amount'));
            }
        }
        if ($find) {
            $data['location'] = $find;
            $data['records'] = $find;
            $data['arPaymentsCollectedTotal'] = $arPaymentsCollectedTotal == null ? 0.00 : $arPaymentsCollectedTotal;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('ar-collected', $data);
                    $this->generatePdfNew('ar-collected', 'A/R Collected', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'invoices' => $find,
                    'arPaymentsCollectedTotal' => $arPaymentsCollectedTotal == null ? 0.00 : $arPaymentsCollectedTotal,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'invoices' => [],
                'groupPayments' => [],
                'arPaymentsCollectedTotal' => 0.00
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Online Transactions~Financial Reports~online-transactions~/admin/financial-report/online-transactions~fa fa-circle
    public function actionOnlineTransactions($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'patient' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'received_on' => [
                    'asc' => ['received_on' => SORT_ASC],
                    'desc' => ['received_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'amount' => [
                    'asc' => ['amount' => SORT_ASC],
                    'desc' => ['amount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sub_total' => [
                    'asc' => ['payments.sub_total' => SORT_ASC],
                    'desc' => ['payments.sub_total' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'patient_checked_in' => [
                    'asc' => ['cases.patient_checked_in' => SORT_ASC],
                    'desc' => ['cases.patient_checked_in' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'discount' => [
                    'asc' => ['discount' => SORT_ASC],
                    'desc' => ['discount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'mode' => [
                    'asc' => ['mode' => SORT_ASC],
                    'desc' => ['mode' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['patient_checked_in' => SORT_DESC],
        ]);

        $model = new \app\models\Invoices;
        $query = $model->find()->joinWith(['location', 'case.user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'case.patient', 'case.services.service', 'case', 'payments' => function ($q) {
            $q->where(['not in', 'payments.mode', [0,1,6]]);
        }])->where(['not in', 'payments.mode', [0,1,6]]);

        $groupQuery = $model->find()->joinWith(['case', 'payments']);

        $totalPatientArQuery = $model->find()->joinWith(['case', 'payments'])->where(['>', 'invoices.amount', 0])->andWhere(['!=', 'invoices.patient_id', 'NULL']);

        $totalDoctorArQuery = $model->find()->joinWith(['case', 'payments'])->where(['>', 'invoices.amount', 0])->andWhere(['!=', 'invoices.user_id', 'NULL']);

        $arPaymentsCollectedQuery = $model->find()->joinWith(['case.user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'case', 'payments', 'payments.receivedBy prb' => function ($q) {
            $q->select(['username','id']);
        }, 'location'])->where(['>', 'invoices.amount', 0]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id]);
                $groupQuery->andWhere(['invoices.location_id' => $search->location_id]);
                $totalPatientArQuery->andWhere(['invoices.location_id' => $search->location_id]);
                $totalDoctorArQuery->andWhere(['invoices.location_id' => $search->location_id]);
                $arPaymentsCollectedQuery->andWhere(['invoices.location_id' => $search->location_id]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $groupQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $totalPatientArQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $totalDoctorArQuery->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
                $arPaymentsCollectedQuery->andWhere([
                    'AND',
                    ['<', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['>=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(payments.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        
        $groupPayments = $groupQuery->select(['payments.id', 'payments.mode', 'payments.case_id','sum(payments.paid_amount) as total'])->where(['not in', 'payments.mode', [0,1,6]])->groupBy("payments.mode")->asArray()->all();
        $totalPatientAr = $totalPatientArQuery->sum('invoices.balance_amount');
        $totalDoctorAr = $totalDoctorArQuery->sum('invoices.balance_amount');
        $arPaymentsCollected = $arPaymentsCollectedQuery->asArray()->all();
        $arPaymentsCollectedTotal = 0;
        if (!empty($arPaymentsCollected)) {
            foreach ($arPaymentsCollected as $arpayment) {
                $arPaymentsCollectedTotal = $arPaymentsCollectedTotal + array_sum(array_column($arpayment['payments'], 'paid_amount'));
            }
        }
        
        if ($find) {
            $data['records'] = $find;
            $data['groupPayments'] = $groupPayments;
            $data['totalPatientAr'] = $totalPatientAr == null ? 0.00 : $totalPatientAr;
            $data['totalDoctorAr'] = $totalDoctorAr == null ? 0.00 : $totalDoctorAr;
            $data['arPaymentsCollected'] = $arPaymentsCollected;
            $data['arPaymentsCollectedTotal'] = $arPaymentsCollectedTotal == null ? 0.00 : $arPaymentsCollectedTotal;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('online-transactions', $data);
                    $this->generatePdfNew('online-transactions', 'Online Transactions', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'invoices' => $find,
                    'groupPayments' => $groupPayments,
                    'totalPatientAr' => $totalPatientAr == null ? 0.00 : $totalPatientAr,
                    'totalDoctorAr' => $totalDoctorAr == null ? 0.00 : $totalDoctorAr,
                    'arPaymentsCollected' => $arPaymentsCollected,
                    'arPaymentsCollectedTotal' => $arPaymentsCollectedTotal == null ? 0.00 : $arPaymentsCollectedTotal,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'invoices' => [],
                'groupPayments' => [],
                'totalPatientAr' => 0.00,
                'totalDoctorAr' => 0.00,
                'arPaymentsCollected' => [],
                'arPaymentsCollectedTotal' => 0.00,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Patient Ar~Financial Reports~patient-ar~/admin/financial-report/patient-ar~fa fa-circle
    public function actionPatientAr($export = false, $format = null)
    {
        $response = [];
        $data = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'patient' => [
                    'asc' => ['patients.last_name' => SORT_ASC],
                    'desc' => ['patients.last_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['icu.first_name' => SORT_ASC],
                    'desc' => ['icu.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'invoice_id' => [
                    'asc' => ['invoice_id' => SORT_ASC],
                    'desc' => ['invoice_id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['patient' => SORT_ASC],
        ]);
        $model = new \app\models\Patients;
        $query = $model->find()->joinWith(['invoices' => function ($q) {
            $q->where(['> ','balance_amount',0]);
        }, 'invoices.case.user icu'])->where(['cases.status' => 8]);
        //echo $query->createCommand()->getRawSql();die;
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = json_decode($_GET['fields'], true);

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(invoices.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(invoices.added_on, "%Y-%m-%d")', $to],
                ]);
            }
            if (isset($search->patient_id)) {
                $data['patient_name'] = $search->patient_id['label'];
                $query->andWhere(['patients.id' => $search->patient_id['value']]);
            }
            if (isset($search->user_id)) {
                $data['user_name'] = $search->user_id['label'];
                $query->andWhere(['users.id' => $search->user_id['value']]);
            }
        }
        $find = $query->orderBy($sort->orders)->all();
        //echo $query->createCommand()->getRawSql();die;
        $patientAr = [];
        $patientArTotal = 0;
        foreach ($find as $key => $val) {
            $patientAr[$key]['id'] = $val->id;
            $patientAr[$key]['prefix'] = $val->prefix;
            $patientAr[$key]['first_name'] = $val->first_name;
            $patientAr[$key]['last_name'] = $val->last_name;
            $patientAr[$key]['middle_name'] = $val->middle_name;
            $patientAr[$key]['suffix'] = $val->suffix;
            foreach ($val->invoices as $k => $v) {
                $zeroToThirty = false;
                $thirtyfirstToSixty = false;
                $sixtyoneToNinty = false;
                $nintyPlus = false;

                $todayDate = date('Y-m-d');
                $thirtythDate = date('Y-m-d', strtotime($todayDate . ' - 30 days'));

                $thirtyfirstDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 31 days'));
                $sixtyDate = date('Y-m-d', strtotime($thirtyfirstDate . ' - 30 days'));

                $sixtyoneDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 61 days'));
                $nintyDate = date('Y-m-d', strtotime($sixtyoneDate . ' - 30 days'));

                $nintyoneDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 91 days'));

                $userDateandTime = explode(' ', $v->added_on);
                $userDate = $userDateandTime[0];

                if ($this->check_in_range($todayDate, $thirtythDate, $userDate)) {
                    $zeroToThirty = true;
                }
                if ($this->check_in_range($thirtyfirstDate, $sixtyDate, $userDate)) {
                    $thirtyfirstToSixty = true;
                }
                if ($this->check_in_range($sixtyoneDate, $nintyDate, $userDate)) {
                    $sixtyoneToNinty = true;
                }
                if ($this->check_in_range($nintyoneDate, null, $userDate)) {
                    $nintyPlus = true;
                }
                if ($v->case->status == 8) {
                    $patientArTotal = $patientArTotal + $v->balance_amount;
                }
                    $patientAr[$key]['invoices'][$k]['invoice_id'] = $v->invoice_id;
                    $patientAr[$key]['invoices'][$k]['balance_amount'] = $v->balance_amount;
                    $patientAr[$key]['invoices'][$k]['added_on'] = $v->added_on;
                    $patientAr[$key]['invoices'][$k]['zerotothirty'] = $zeroToThirty;
                    $patientAr[$key]['invoices'][$k]['thirtyfirstToSixty'] = $thirtyfirstToSixty;
                    $patientAr[$key]['invoices'][$k]['sixtyoneToNinty'] = $sixtyoneToNinty;
                    $patientAr[$key]['invoices'][$k]['nintyPlus'] = $nintyPlus;
                    $patientAr[$key]['invoices'][$k]['patient_checked_in'] = $v->case->patient_checked_in;
                    $patientAr[$key]['invoices'][$k]['case_status'] = $v->case->status;
                    $patientAr[$key]['invoices'][$k]['user']['first_name'] = $v->case->user->first_name;
                    $patientAr[$key]['invoices'][$k]['user']['last_name'] = $v->case->user->last_name;
            }
        }
        if ($patientAr) {
            $data['records'] = $patientAr;
            $data['patientArTotal'] = $patientArTotal;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('patient-ar', $data);
                    $this->generatePdfNew('patient-ar', 'Patient A/R', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'patients' => $patientAr,
                    'patientArTotal' => $patientArTotal
                ];
            }
        } else {
            $response = [
                'success' => true,
                'patients' => [],
                'patientArTotal' => 0.00
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Doctor Ar~Financial Reports~doctor-ar~/admin/financial-report/doctor-ar~fa fa-circle
    public function actionDoctorAr($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'doctor' => [
                    'asc' => ['users.last_name' => SORT_ASC],
                    'desc' => ['users.last_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'patient' => [
                    'asc' => ['icp.first_name' => SORT_ASC],
                    'desc' => ['icp.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'invoice_id' => [
                    'asc' => ['invoice_id' => SORT_ASC],
                    'desc' => ['invoice_id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['doctor' => SORT_ASC],
        ]);

        $model = new \app\models\User;
        $query = $model->find()->joinWith(['invoices' => function ($q) {
            $q->where(['>','balance_amount', 0]);
        }, 'invoices.case.patient icp'])->andWhere(['cases.status'=> 8]);
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = json_decode($_GET['fields'], true);

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(invoices.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(invoices.added_on, "%Y-%m-%d")', $to],
                ]);
            }
            if (isset($search->user_id)) {
                $data['user_name'] = $search->user_id['label'];
                $query->andWhere(['users.id' => $search->user_id['value']]);
            }
        }
        $find = $query->orderBy($sort->orders)->all();
        //echo $query->createCommand()->getRawSql();die;
        $doctorAr = [];
        $doctorArTotal = 0;
        foreach ($find as $key => $val) {
            $doctorAr[$key]['id'] = $val->id;
            $doctorAr[$key]['prefix'] = $val->prefix;
            $doctorAr[$key]['first_name'] = $val->first_name;
            $doctorAr[$key]['last_name'] = $val->last_name;
            $doctorAr[$key]['middle_name'] = $val->middle_name;
            $doctorAr[$key]['suffix'] = $val->suffix;
            foreach ($val->invoices as $k => $v) {

                $zeroToThirty = false;
                $thirtyfirstToSixty = false;
                $sixtyoneToNinty = false;
                $nintyPlus = false;

                $todayDate = date('Y-m-d');
                $thirtythDate = date('Y-m-d', strtotime($todayDate . ' - 30 days'));

                $thirtyfirstDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 31 days'));
                $sixtyDate = date('Y-m-d', strtotime($thirtyfirstDate . ' - 30 days'));

                $sixtyoneDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 61 days'));
                $nintyDate = date('Y-m-d', strtotime($sixtyoneDate . ' - 30 days'));

                $nintyoneDate = date('Y-m-d', strtotime(date('Y-m-d') . ' - 91 days'));

                $userDateandTime = explode(' ', $v->added_on);
                $userDate = $userDateandTime[0];

                if ($this->check_in_range($todayDate, $thirtythDate, $userDate)) {
                    $zeroToThirty = true;
                }
                if ($this->check_in_range($thirtyfirstDate, $sixtyDate, $userDate)) {
                    $thirtyfirstToSixty = true;
                }
                if ($this->check_in_range($sixtyoneDate, $nintyDate, $userDate)) {
                    $sixtyoneToNinty = true;
                }
                if ($this->check_in_range($nintyoneDate, null, $userDate)) {
                    $nintyPlus = true;
                }
                if ($v->case->status == 8) {
                    $doctorArTotal = $doctorArTotal + $v->balance_amount;
                }
                    $doctorAr[$key]['invoices'][$k]['invoice_id'] = $v->invoice_id;
                    $doctorAr[$key]['invoices'][$k]['balance_amount'] = $v->balance_amount;
                    $doctorAr[$key]['invoices'][$k]['added_on'] = $v->added_on;
                    $doctorAr[$key]['invoices'][$k]['zerotothirty'] = $zeroToThirty;
                    $doctorAr[$key]['invoices'][$k]['thirtyfirstToSixty'] = $thirtyfirstToSixty;
                    $doctorAr[$key]['invoices'][$k]['sixtyoneToNinty'] = $sixtyoneToNinty;
                    $doctorAr[$key]['invoices'][$k]['nintyPlus'] = $nintyPlus;
                    $doctorAr[$key]['invoices'][$k]['case_id'] = $v->case_id;
                    $doctorAr[$key]['invoices'][$k]['patient_checked_in'] = $v->case->patient_checked_in;
                    $doctorAr[$key]['invoices'][$k]['case_status'] = $v->case->status;
                    $doctorAr[$key]['invoices'][$k]['patient']['prefix'] = $v->case->patient->prefix;
                    $doctorAr[$key]['invoices'][$k]['patient']['first_name'] = $v->case->patient->first_name;
                    $doctorAr[$key]['invoices'][$k]['patient']['last_name'] = $v->case->patient->last_name;
                    $doctorAr[$key]['invoices'][$k]['patient']['suffix'] = $v->case->patient->suffix;
            }
        }
        if ($doctorAr) {
            $data['records'] = $doctorAr;
            $data['doctorArTotal'] = $doctorArTotal;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('doctor-ar', $data);
                    $this->generatePdfNew('doctor-ar', 'Doctor A/R', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'users' => $doctorAr,
                    'doctorArTotal' => $doctorArTotal
                ];
            }
        } else {
            $response = [
                'success' => true,
                'users' => [],
                'doctorArTotal' => 0.00
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:New Users~Non-Financial Reports~users~/admin/non-financial-report/new-users~fa fa-circle
    public function actionUsers($export = false, $format = null)
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
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'email' => [
                    'asc' => ['users.email' => SORT_ASC],
                    'desc' => ['users.email' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'username' => [
                    'asc' => ['username' => SORT_ASC],
                    'desc' => ['username' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['users.added_on' => SORT_ASC],
                    'desc' => ['users.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\User;
        $query = $model->find()->select(['prefix', 'users.email', 'first_name', 'middle_name', 'last_name', 'suffix', 'username', 'users.phone', 'users.mobile', 'users.added_on', 'locations'])->where(['deleted' => 'N']);
        //'role_id'=>[3,4,6,13]

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $search->location_id['value'] . ',users.locations)'));
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(users.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(users.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('new-users', $data);
                    $this->generatePdfNew('new-users', 'New Users', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'users' => $find
                ];
            }
        } else {
            $response = [
                'success' => true,
                'users' => []
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Doctors~Non-Financial Reports~doctors~/admin/non-financial-report/doctors~fa fa-circle
    public function actionDoctors($export = false, $format = null)
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
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'email' => [
                    'asc' => ['users.email' => SORT_ASC],
                    'desc' => ['users.email' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'username' => [
                    'asc' => ['username' => SORT_ASC],
                    'desc' => ['username' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['users.added_on' => SORT_ASC],
                    'desc' => ['users.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\User;
        $query = $model->find()->select(['prefix', 'users.email', 'first_name', 'middle_name', 'last_name', 'suffix', 'username', 'users.phone', 'users.mobile', 'users.added_on', 'locations'])->where(['deleted' => 'N', 'role_id' => [3, 4, 6, 13, 15]]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $search->location_id['value'] . ',users.locations)'));
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(users.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(users.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('doctors', $data);
                    $this->generatePdfNew('doctors', 'Doctors', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'doctors' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'doctors' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:New Patients~Non-Financial Reports~new-patients~/admin/non-financial-report/new-patients~fa fa-circle
    public function actionNewPatients($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'dob' => [
                    'asc' => ['patients.BirthDate' => SORT_ASC],
                    'desc' => ['patients.BirthDate' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'age' => [
                    'asc' => ['patients.Age' => SORT_ASC],
                    'desc' => ['patients.Age' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'city' => [
                    'asc' => ['patients.City' => SORT_ASC],
                    'desc' => ['patients.City' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'state' => [
                    'asc' => ['patients.State' => SORT_ASC],
                    'desc' => ['patients.State' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sex' => [
                    'asc' => ['patients.Sex' => SORT_ASC],
                    'desc' => ['patients.Sex' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['cases.added_on' => SORT_ASC],
                    'desc' => ['cases.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->joinWith(['patient.statedetails']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andWhere(['location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->groupBy('cases.patient_id')->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('new-patients', $data);
                    $this->generatePdfNew('new-patients', 'New Patients', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'patients' => $find,
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

    //Label~Module~Action~Url~Icon:Existing Patients~Non-Financial Reports~existing-patients~/admin/non-financial-report/existing-patients~fa fa-circle
    public function actionExistingPatients($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'dob' => [
                    'asc' => ['patients.BirthDate' => SORT_ASC],
                    'desc' => ['patients.BirthDate' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'age' => [
                    'asc' => ['patients.Age' => SORT_ASC],
                    'desc' => ['patients.Age' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'city' => [
                    'asc' => ['patients.City' => SORT_ASC],
                    'desc' => ['patients.City' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'state' => [
                    'asc' => ['patients.State' => SORT_ASC],
                    'desc' => ['patients.State' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sex' => [
                    'asc' => ['patients.Sex' => SORT_ASC],
                    'desc' => ['patients.Sex' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['cases.added_on' => SORT_ASC],
                    'desc' => ['cases.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->select(['count(cases.added_on) as total_cases', 'cases.added_on', 'cases.patient_id', 'cases.location_id'])->joinWith(['patient.statedetails'])->having(['>', 'total_cases', 2]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andHaving(['location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andHaving([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->groupBy('patient_id')->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('existing-patients', $data);
                    $this->generatePdfNew('existing-patients', 'Existing Patients', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'patients' => $find,
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

    //Label~Module~Action~Url~Icon:Top Doctors~Non-Financial Reports~top-doctors~/admin/non-financial-report/top-doctors~fa fa-circle
    public function actionTopDoctors($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'email' => [
                    'asc' => ['users.email' => SORT_ASC],
                    'desc' => ['users.email' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'username' => [
                    'asc' => ['username' => SORT_ASC],
                    'desc' => ['username' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'totalCases' => [
                    'asc' => ['total_cases' => SORT_ASC],
                    'desc' => ['total_cases' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['cases.added_on' => SORT_ASC],
                    'desc' => ['cases.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['totalCases' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->select(['count(*) as total_cases', 'users.*', 'cases.*'])->joinWith(['doctor']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andHaving(['location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andHaving([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->groupBy('user_id')->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('top-doctors', $data);
                    $this->generatePdfNew('top-doctors', 'Top Doctors', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'doctors' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'doctors' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Top Clinics~Non-Financial Reports~top-clinics~/admin/non-financial-report/top-clinics~fa fa-circle
    public function actionTopClinics($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'email' => [
                    'asc' => ['users.email' => SORT_ASC],
                    'desc' => ['users.email' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'totalCases' => [
                    'asc' => ['total_cases' => SORT_ASC],
                    'desc' => ['total_cases' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['cases.added_on' => SORT_ASC],
                    'desc' => ['cases.added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['totalCases' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->select(['count(*) as total_cases', 'clinics.*', 'cases.*'])->joinWith(['clinic']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andHaving(['location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andHaving([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->groupBy('clinic_id')->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('top-clinics', $data);
                    $this->generatePdfNew('top-clinics', 'Top Clinics', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'clinics' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'clinics' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Top Services~Non-Financial Reports~top-services~/admin/non-financial-report/top-services~fa fa-circle
    public function actionTopServices($export = false, $format = null)
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
                'price' => [
                    'asc' => ['services.price' => SORT_ASC],
                    'desc' => ['services.price' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'totalTimes' => [
                    'asc' => ['total_times' => SORT_ASC],
                    'desc' => ['total_times' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['totalTimes' => SORT_DESC],
        ]);

        $model = new \app\models\CaseServices;
        $query = $model->find()->select(['count(*) as total_times', 'case_services.*', 'services.*', 'cases.*'])->joinWith(['service', 'case']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andHaving(['cases.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andHaving([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->groupBy('service_id')->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('top-services', $data);
                    $this->generatePdfNew('top-services', 'Top Services', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'services' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'services' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Cancelled Appointments~Non-Financial Reports~cancelled-appointments~/admin/non-financial-report/cancelled-appointments~fa fa-circle
    public function actionCancelledAppointments($export = false, $format = null)
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
                'patient-name' => [
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
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Cases;
        $query = $model->find()->joinWith(['patient', 'user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'clinic', 'location'])->where(['cases.status' => 9]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andHaving(['location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andHaving([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.added_on, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('cancelled-appointments', $data);
                    $this->generatePdfNew('cancelled-appointments', 'Cancelled Appointments', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'cases' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'cases' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Production~Financial Reports~production~/admin/financial-report/production~fa fa-circle
    public function actionProduction($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $model = new \app\models\CaseServices;
        $query = $model->find()->select(['count(*) as total_times', 'case_services.*', 'services.*'])->joinWith(['service', 'case']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                //$query->andWhere(new \yii\db\Expression('FIND_IN_SET('.$search->location_id['value'].',users.locations)'));   
                $query->andWhere(['cases.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
            }
        }

        $find = $query->groupBy('service_id')->asArray()->all();
        //echo $query->createCommand()->getRawSql();die;
        if ($find) {
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('production', $data);
                    $this->generatePdfNew('production', 'Production Report', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'services' => $find,
                ];
            }
        } else {
            $response = [
                'success' => true,
                'services' => [],
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Credit Card~Non-Financial Reports~credit-card~/admin/non-financial-report/credit-card~fa fa-circle
    public function actionCreditCard($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'patient' => [
                    'asc' => ['patients.first_name' => SORT_ASC],
                    'desc' => ['patients.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'doctor' => [
                    'asc' => ['users.first_name' => SORT_ASC],
                    'desc' => ['users.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'amount' => [
                    'asc' => ['amount' => SORT_ASC],
                    'desc' => ['amount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'sub_total' => [
                    'asc' => ['payments.sub_total' => SORT_ASC],
                    'desc' => ['payments.sub_total' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'discount' => [
                    'asc' => ['discount' => SORT_ASC],
                    'desc' => ['discount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'mode' => [
                    'asc' => ['mode' => SORT_ASC],
                    'desc' => ['mode' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Invoices;
        $query = $model->find()->joinWith(['location', 'case.user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'case.patient', 'case.services.service', 'case', 'payments' => function ($q) {
            $q->where(['not in', 'payments.mode', [0,1,6]]);
        }])->where(['not in', 'payments.mode', [0,1,6]]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['payments.location_id' => $search->location_id]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);
            }
        }
        $find = $query->orderBy($sort->orders)->groupBy('payments.case_id')->asArray()->all();
        //echo $query->createCommand()->getRawSql();die;
        $totalPayments = 0;
        if (!empty($find)) {
            foreach ($find as $invoice) {
                $totalPayments = $totalPayments + array_sum(array_column($invoice['payments'], 'paid_amount'));
            }
        }
        if ($find) {
            $data['records'] = $find;
            $data['totalPayments'] = $totalPayments ? $totalPayments : 0.00;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('credit-card', $data);
                    $this->generatePdfNew('credit-card', 'Credit Card', $content);
                    $response = [
                        'success' => true,
                        'file' => true
                    ];
                }
            } else {
                $response = [
                    'success' => true,
                    'invoices' => $find,
                    'totalPayments' => $totalPayments ? $totalPayments : 0.00
                ];
            }
        } else {
            $response = [
                'success' => true,
                'invoices' => [],
                'totalPayments' => 0.00,
            ];
        }
        return $response;
    }

    public function actionInvoice($export = false, $format = null)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'doctor' => [
                    'asc' => ['users.last_name' => SORT_ASC],
                    'desc' => ['users.last_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'patient' => [
                    'asc' => ['icp.first_name' => SORT_ASC],
                    'desc' => ['icp.first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'invoice_id' => [
                    'asc' => ['invoice_id' => SORT_ASC],
                    'desc' => ['invoice_id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['doctor' => SORT_ASC],
        ]);

        $model = new \app\models\User;
        $query = $model->find()->joinWith(['bstate', 'invoices' => function ($q) {
            $q->where(['> ','balance_amount',0]);
        }, 'invoices.case.patient icp', 'invoices.case.location', 'invoices.case.services.service', 'invoices.case'])->where(['=', 'cases.status', 8]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = json_decode($_GET['fields'], true);

        if ($search->load($GET)) {
            if (isset($search->location_id)) {
                $data['location_name'] = $search->location_id['label'];
                $query->andWhere(['invoices.location_id' => $search->location_id['value']]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(cases.patient_checked_in, "%Y-%m-%d")', $to],
                ]);     
            } 
            if (isset($search->user_id)) {
                $data['user_name'] = $search->user_id['label'];
                $query->andWhere(['users.id' => $search->user_id['value']]);
            }
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        //echo $query->createCommand()->getRawSql();die;
        if ($find) {
            $data['location'] = $find;
            $data['records'] = $find;
            if ($export === "true") {
                if ($format == "pdf") {
                    $content = $this->renderPartial('invoice', $data);
                    $this->generatePdfInvoice('invoice', 'Invoice', $content);
                }
            } else {
                $response = [
                    'success' => true,
                    'users' => $find
                ];
            }
        } else {
            $response = [
                'success' => true,
                'users' => []
            ];
        }
        return $response;
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
            'filename' => $_SERVER['DOCUMENT_ROOT'] . "/api/web/reports/" . $filename . ".pdf",
            // your html content input
            'content' => $content,
            // format content from your own css file if needed or use the
            // enhanced bootstrap css built by Krajee for mPDF formatting 
            'cssFile' => '@vendor/kartik-v/yii2-mpdf/src/assets/kv-mpdf-bootstrap.min.css',
            'marginLeft' => 0,
            'marginTop' => 0,
            'marginRight' => 0,
            'marginBottom' => 0,
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
                'SetHeader' => ['iMagDent - ' . $title],
                'SetFooter' => ['{PAGENO}'],
            ]
        ]);
        //print_r($data);die();
        $pdf->render();
    }

    public function check_in_range($start_date, $end_date, $date_from_user)
    {
        $start_ts = strtotime($start_date);
        $user_ts = strtotime($date_from_user);
        $end_ts = strtotime($end_date);
        return (($user_ts <= $start_ts) && ($user_ts >= $end_ts));
    }
}