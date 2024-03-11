<?php
namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

/**
 * Diagnosis controller for the `Diagnosis` module
 */
class DiagnosisController extends Controller
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
                        return Yii::$app->common->checkPermission('Diagnosis Codes', $action->id);
                    },
                ],
            ],
        ];

        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Diagnosis Code~Diagnosis Codes~add~/admin/diagnosis~fa fa-diagnoses
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            try {
                $model = new \app\models\Diagnosiscodes;
                $POST['Diagnosiscodes'] = $_POST['fields'];                

                if (isset($POST['Diagnosiscodes']['id']) && !empty($POST['Diagnosiscodes']['id'])) {
                    
                    $find = $model->find()->where(['id' => $POST['Diagnosiscodes']['id']])->one();
                    if ($find && $find->load($POST) && $find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Diagnosis Code has been updated successfully.',
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
                            'message' => 'Diagnosis Code has been added successfully.',
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

    //Label~Module~Action~Url~Icon:List Diagnosis Code~Diagnosis Codes~list~/admin/diagnosis~fa fa-diagnoses
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
                'code' => [
                    'asc' => ['code' => SORT_ASC],
                    'desc' => ['code' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);

        $model = new \app\models\Diagnosiscodes;

        $query = $model->find();

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'name', $search->name]);
            }
            if (!empty($search->code)) {
                $query->andWhere(['LIKE', 'code', $search->code]);
            }          
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();

        if ($find) {
            $response = [
                'success' => true,
                'diagnosis_codes' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'diagnosis_codes' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Diagnosis Code~Diagnosis Codes~get-one~/admin/diagnosis~fa fa-diagnoses
    public function actionGetOne($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Diagnosiscodes;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'diagnosis_code' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Diagnosis code not found!',
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
                'message' => 'Diagnosis code not found!',
            ];
        }
    }
    //Label~Module~Action~Url~Icon:Delete Diagnosis Code~Diagnosis Codes~delete-diagnosis~/admin/diagnosis~fa fa-diagnoses
    public function actionDeleteDiagnosis()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Diagnosiscodes;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                
                if ($find) {
                    if($find->delete()){
                        return [
                            'success' => true,
                            'message' => 'Diagnosis code has been deleted successfully.',
                        ];
                    }else{
                        return [
                            'error' => true,
                            'message' => $find->getErrors(),
                        ];
                    }
                    
                } else {
                    return [
                        'error' => true,
                        'message' => 'Diagnosis code not found!',
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
                'message' => 'Diagnosis code not found!',
            ];
        }
    }

}
