<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

/**
 * Clinic controller for the `Clinic` module
 */
class PaymentController extends Controller
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
                        return Yii::$app->common->checkPermission('Payments', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:List Payments~Payments~list~/admin/payments~fa fa-chart-bar
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
                'amount' => [
                    'asc' => ['amount' => SORT_ASC],
                    'desc' => ['amount' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'received_on' => [
                    'asc' => ['received_on' => SORT_ASC],
                    'desc' => ['received_on' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'invoice' => [
                    'asc' => ['invoice_id' => SORT_ASC],
                    'desc' => ['invoice_id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['received_on' => SORT_DESC],
        ]);

        $model = new \app\models\Invoices;
        $query = $model->find()->joinWith(['user' => function ($q) {
            $q->select(Yii::$app->params['user_table_select_columns_new']);
        }, 'location', 'case.patient']);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];

        if ($search->load($GET)) {
            if (!empty($search->clinic_id)) {
                $query->andWhere(['clinics.clinic_id' => $search->clinic_id]);
            }
            if (isset($search->invoice_id) && !empty($search->invoice_id)) {
                $query->andWhere(['invoices.invoice_id' => $search->invoice_id]);
            }
            if (isset($search->status)) {
                $query->andWhere(['invoices.status' => $search->status]);
            }
            if (isset($search->location_id)) {
                $query->andWhere(['invoices.location_id' => $search->location_id]);
            }
            if (!empty($search->date_range)) {
                $date_range = explode(' to ', $search->date_range);
                $fromArr = explode('-', $date_range[0]);
                $toArr = explode('-', $date_range[1]);
                $from = $fromArr[2] . '-' . $fromArr[0] . '-' . $fromArr[1];
                $to = $toArr[2] . '-' . $toArr[0] . '-' . $toArr[1];
                $query->andWhere([
                    'AND',
                    ['>=', 'DATE_FORMAT(invoices.received_on, "%Y-%m-%d")', $from],
                    ['<=', 'DATE_FORMAT(invoices.received_on, "%Y-%m-%d")', $to],
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
                'payments' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'payments' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }
}
