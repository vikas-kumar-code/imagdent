<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

/**
 * Location controller for the `Location` module
 */
class LocationController extends Controller
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
            'except' => ['list'],
            'class' => \yii\filters\AccessControl::className(),
            'only' => [],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Locations', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Location~Locations~add~/admin/locations~fa fa-map-marker
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            try {
                $model = new \app\models\Locations;
                $POST['Locations'] = $_POST['fields'];
                $POST['Locations']['country_id'] = $_POST['fields']['country_id']['value'];
                $POST['Locations']['state_id'] = $_POST['fields']['state_id']['value'];
                $POST['Locations']['billing_country'] = $_POST['fields']['billing_country']['value'];
                if (isset($_POST['fields']['billing_state']['value']) && !empty($_POST['fields']['billing_state']['value'])) {
                    $POST['Locations']['billing_state'] = $_POST['fields']['billing_state']['value'];
                } else {
                    $POST['Locations']['billing_state'] = null;
                }
                $POST['Locations']['file_name'] = isset($_POST['fields']['file_name'])?$_POST['fields']['file_name']:null;

                if (strlen(preg_replace("/[\s-]+/", "", $_POST['fields']['Zipcode'])) <= 5) {
                    $POST['Locations']['Zipcode'] = str_replace("-", "", $_POST['fields']['Zipcode']);
                } else {
                    $POST['Locations']['Zipcode'] = $_POST['fields']['Zipcode'];
                }

                if (isset($POST['Locations']['id']) && !empty($POST['Locations']['id'])) {

                    $find = $model->find()->where(['id' => $POST['Locations']['id']])->one();

                    if ($find->file_name) {
                        $documentPath = $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $find->file_name;
                        if(file_exists($documentPath))
                        {
                            unlink($documentPath);
                        } 
                    }

                    if ($find && $find->load($POST) && $find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Location has been updated successfully.',
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
                            'message' => 'Location has been added successfully.',
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

    //Label~Module~Action~Url~Icon:List Locations~Locations~list~/admin/locations~fa fa-map-marker
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

        $model = new \app\models\Locations;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->legal_name)) {
                $query->andWhere(['LIKE', 'legal_name', $search->legal_name]);
            }
            if (!empty($search->publish_name)) {
                $query->andWhere(['LIKE', 'publish_name', $search->publish_name]);
            }
            if (!empty($search->City)) {
                $query->andWhere(['LIKE', 'city', $search->City]);
            }
            if (!empty($search->Zipcode)) {
                $query->andWhere(['LIKE', 'Zipcode', $search->Zipcode]);
            }
            if (!empty($search->email)) {
                $query->andWhere(['LIKE', 'email', $search->email]);
            }
            if (!empty($search->ein)) {
                $query->andWhere(['LIKE', 'ein', $search->ein]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'locations' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'locations' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Get Location Details~Locations~get-one~/admin/locations~fa fa-map-marker
    public function actionGetOne($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Locations;
                $find = $model->find()->joinWith(['country', 'state', 'bcountry bc', 'bstate bs'])->where(['locations.id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'location' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Location not found!',
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
                'message' => 'Location not found!',
            ];
        }
    }

    //upload location document
    public function actionUploadDocument()
    {
        // $model = new \app\models\Locations;
        // $model->load( Yii::$app->request->post());

        $response = [];
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            try {
                include "vendor/Upload.php";
                $handle = new \Upload($_FILES['filepond']);
                if ($handle->uploaded) {
                    //$file_name = mt_rand(111111, 999999) . "-temp-" . Yii::$app->user->identity->id;
                    $file_name = "location-" . mt_rand(111111, 999999) . Yii::$app->user->identity->id;

                    $handle->file_new_name_body = $file_name;
                    $handle->allowed = ['image/*', 'application/*'];
                    $handle->file_overwrite = true;
                    if ($handle->image_src_x > 600) {
                        $handle->image_resize = true;
                        $handle->image_x = 600;
                        $handle->image_ratio_y = true;
                    }
                    //
                    $handle->process($_SERVER['DOCUMENT_ROOT'] . "/documents");
                    if ($handle->processed) {
                        $response = [
                            'success' => true,
                            'file' => [
                                'document_name_original' => $handle->file_src_name,
                                'document_name' => $handle->file_dst_name,
                                'extension' => $handle->file_src_name_ext,
                            ],
                        ];
                        $handle->clean();
                    } else {
                        Yii::$app->response->statusCode = 415;
                        $response = [
                            'type' => 'error',
                            'message' => $handle->error,
                        ];
                    }
                }
            } catch (\Exception $e) {
                $response = [
                    'error' => true,
                    'message' => $e->getMessage(),
                ];
            }
        }
        return $response;
    }

    //delete location document
    public function actionDeleteDocument()
    {
        if (isset($_POST['file_name']) && !empty($_POST['file_name'])) {
            try {
                unlink($_SERVER['DOCUMENT_ROOT'] . "/documents/" . $_POST['file_name']);
                //Yii::$app->common->addLog($case_id, "Document has been deleted from the case.");
                return [
                    'success' => true,
                    'message' => 'Document has been deleted successfully.',
                ];
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
    }

    //Label~Module~Action~Url~Icon:Delete Location~Locations~delete-location~/admin/locations~fa fa-map-marker
    public function actionDeleteLocation()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Locations;
                $find = $model->find()->where(['id' => $_POST['id']])->one();

                if ($find) {
                    if ($find->delete()) {
                        //$user_model = \app\models\User::find()->where(['location_id' => $_POST['id']])->all();
                        $user_model = \app\models\User::find()->where(new \yii\db\Expression('FIND_IN_SET(' . $_POST['id'] . ',users.locations)'))->all();
                        foreach ($user_model as $user) {
                            //$user->location_id = 0;
                            $user->locations = implode(',', array_diff(explode(',', $user->locations), [$_POST['id']]));
                            $user->update();
                        }
                        $price_model =  new \app\models\LocationPrice;

                        $find_price = $price_model->find()->where(['location_id' => $_POST['id']])->all();
                        if (count($find_price)) {
                            $price_model->deleteAll(['location_id' => $_POST['id']]);
                        }
                        return [
                            'success' => true,
                            'message' => 'Location has been deleted successfully.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Location not found!',
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
                'message' => 'Location not found!',
            ];
        }
    }
}
