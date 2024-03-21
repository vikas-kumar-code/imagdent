<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\swiftmailer\Mailer;
use yii\web\Controller;
use yii\web\Response;

class CommonController extends Controller
{

    public $enableCsrfValidation = false;
    public $location = null;

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
                'except' => ['get-banners', 'get-locations', 'contact-us', 'db-details'],
                'class' => CompositeAuth::className(),
                'authMethods' => [
                    HttpBearerAuth::className(),
                    //QueryParamAuth::className(),
                ],
            ];
        }
        /* $behaviors['access'] = [
            'class' => \yii\filters\AccessControl::className(),
            'only' => [],
            'except' => ['get-banners'],
        ]; */
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
        ];
        return $behaviors;
    }
    public function actionUpload()
    {
        $response = [];
        //print_r($_FILES);   die;
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            try {
                include "vendor/Upload.php";
                $handle = new \Upload($_FILES['filepond']);
                if ($handle->uploaded) {
                    $file_name = mt_rand(111111, 999999) . "-temp-" . Yii::$app->user->identity->id;
                    $handle->file_new_name_body = $file_name;
                    $handle->allowed = ['image/*'];
                    $handle->file_overwrite = true;
                    $handle->image_resize = true;
                    $handle->image_x = 144;
                    $handle->image_ratio_y = true;
                    $handle->process($_SERVER['DOCUMENT_ROOT'] . "/images/temp");
                    if ($handle->processed) {
                        $response = [
                            'success' => true,
                            'file_name' => $handle->file_dst_name,
                            /* 'file_name'=>[
                        'source'=>$handle->file_dst_name,
                        'options'=>[
                        'type'=>'local'
                        ]
                        ] */
                        ];
                        $handle->clean();
                    } else {
                        $response = [
                            'error' => true,
                            'message' => $e->getMessage(),
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

    public function actionUploadPatientImage()
    {
        $response = [];
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            try {
                include "vendor/Upload.php";
                $handle = new \Upload($_FILES['filepond']);
                if ($handle->uploaded) {
                    $file_name = mt_rand(111111, 999999) . "-temp-" . Yii::$app->user->identity->id;
                    $handle->file_new_name_body = $file_name;
                    $handle->allowed = ['image/*'];
                    $handle->file_overwrite = true;
                    if ($handle->image_src_x > 2000) {
                        $handle->image_resize = true;
                        $handle->image_x = 600;
                        $handle->image_ratio_y = true;
                    }
                    $handle->process($_SERVER['DOCUMENT_ROOT'] . "/images/temp");
                    if ($handle->processed) {
                        $response = [
                            'success' => true,
                            'file' => [
                                'file_name_original' => $handle->file_src_name,
                                'file_name' => $handle->file_dst_name,
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

    public function actionUploadDocuments()
    {
        $response = [];
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            //try {
            include "vendor/Upload.php";
            $handle = new \Upload($_FILES['filepond']);
            if ($handle->uploaded) {
                $file_name = mt_rand(111111, 999999) . "-temp-" . Yii::$app->user->identity->id;
                $handle->file_new_name_body = $file_name;
                $handle->allowed = ['image/*', 'application/*'];
                $handle->file_overwrite = true;
                if ($handle->image_src_x > 600) {
                    $handle->image_resize = true;
                    $handle->image_x = 600;
                    $handle->image_ratio_y = true;
                }
                $handle->process($_SERVER['DOCUMENT_ROOT'] . "/documents/temp");
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
            /* } catch (\Exception $e) {
                $response = [
                    'error' => true,
                    'message' => $e->getMessage(),
                ];
            } */
        }
        return $response;
    }

    public function actionUploadBanner()
    {
        $response = [];
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            try {
                include "vendor/Upload.php";
                $handle = new \Upload($_FILES['filepond']);
                if ($handle->uploaded) {
                    $file_name = mt_rand(111111, 999999) . "-temp-" . Yii::$app->user->identity->id;
                    $handle->file_new_name_body = $file_name;
                    $handle->allowed = ['image/*'];
                    $handle->file_overwrite = true;
                    if ($handle->image_src_x > 2000) {
                        $handle->image_resize = true;
                        $handle->image_x = 1024;
                        $handle->image_ratio_y = true;
                    }
                    $handle->process($_SERVER['DOCUMENT_ROOT'] . "/images/temp");
                    if ($handle->processed) {
                        $response = [
                            'success' => true,
                            'file' => [
                                'file_name_original' => $handle->file_src_name,
                                'file_name' => $handle->file_dst_name,
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

    public function actionUploadCaseDocuments()
    {
        $response = [];
        if (isset($_FILES) && !empty($_FILES['filepond'])) {
            try {
                include "vendor/Upload.php";
                $handle = new \Upload($_FILES['filepond']);
                if ($handle->uploaded) {
                    $file_name = mt_rand(111111, 999999) . "-" . Yii::$app->user->identity->id;
                    $handle->file_new_name_body = $file_name;
                    if (in_array(Yii::$app->user->identity->role_id, [1, 15])) {
                        $handle->allowed = ['image/*', 'application/*'];
                    }
                    $handle->file_overwrite = true;
                    $handle->process($_SERVER['DOCUMENT_ROOT'] . "/documents");
                    if ($handle->processed) {
                        $dmodel = new \app\models\Documents;
                        $dmodel->document_name = $file_name . '.' . $handle->file_src_name_ext;
                        $dmodel->document_name_original = $handle->file_src_name;
                        $dmodel->extension = $handle->file_src_name_ext;
                        $dmodel->case_id = $_REQUEST['caseId'];
                        $dmodel->case_file = $_REQUEST['case_file'];
                        $dmodel->size = $handle->file_src_size;
                        $dmodel->uploaded_by = Yii::$app->user->identity->id;
                        if ($dmodel->validate()) {
                            $dmodel->save();
                            $find = $dmodel->find()->joinWith(['uploadedby'])->where(['documents.id' => $dmodel->id])->asArray()->one();
                            Yii::$app->common->addLog($_REQUEST['caseId'], "Document has been added to the case.");
                            $response = [
                                'success' => true,
                                'file' => $find
                            ];
                            $handle->clean();
                        }
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

    public function actionSaveDocument()
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $file = $_POST['file'];
                $document_details = $_POST['fields'];
                $file_details = array_merge($file, $document_details);
                return [
                    'success' => true,
                    'file_details' => $file_details,
                ];
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
    }

    public function actionGetCountries()
    {
        $sort = new \yii\data\Sort([
            'attributes' => [
                'id' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['id' => SORT_DESC],
        ]);

        $model = new \app\models\Countries;
        $query = $model->find()->where(['IN', 'id', [254, 43, 122, 113, 159]])->joinWith(['states']);
        $find = $query->orderBy($sort->orders)->asArray()->all();

        if ($find) {
            $response = [
                'success' => true,
                'countries' => $find,
            ];
        }
        return $response;
    }

    public function actionGetClinics($keyword = "", $pageSize = 10)
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
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
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

        $model = new \app\models\Clinics;
        //$find = $model->find()->with(['locations.users'])->orderBy($sort->orders)->asArray()->all();
        $find = $model->find()->where(['deleted' => 'N'])->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'clinics' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'clinics' => [],
            ];
        }
        return $response;
    }

    public function actionSearchClinic($keyword = "", $pageSize = 10)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'id' => [
                    'asc' => ['clinics.id' => SORT_ASC],
                    'desc' => ['clinics.id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'name' => [
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
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

        $model = new \app\models\Clinics;
        //$query = $model->find()->select('id as value, name as label')->joinWith(["locationsas"=>function($query){$query->select('id as value, name as label');}]);
        $query = $model->find()->select('id, id as value, name as label')->with(["locations.users"]);

        if (!empty($keyword)) {
            $query->andWhere([
                'or',
                ['LIKE', 'clinics.name', $keyword],
            ]);
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'clinics' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'clinics' => [],
            ];
        }
        return $response;
    }

    public function actionSearchLocation($keyword = "", $pageSize = 10)
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
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_DESC],
        ]);

        $model = new \app\models\Locations;
        $query = $model->find()->select('id, id as value, name as label,clinic_id')->with(['clinic', 'users']);

        if (!empty($keyword)) {
            $query->andWhere([
                'or',
                ['LIKE', 'name', $keyword],
            ]);
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'locations' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'locations' => [],
            ];
        }
        return $response;
    }

    public function actionSearchUser($keyword = "", $pageSize = 10)
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
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_DESC],
        ]);

        $model = new \app\models\User;
        $query = $model->find()->select('id, id as value, name as label, clinic_id, location_id')->with(['clinic.locations', 'location']);

        if (!empty($keyword)) {
            $query->andWhere([
                'or',
                ['LIKE', 'name', $keyword],
            ]);
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'users' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'users' => [],
            ];
        }
        return $response;
    }

    public function actionGetPlans()
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
                'duration' => [
                    'asc' => ['duration' => SORT_ASC],
                    'desc' => ['duration' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['duration' => SORT_ASC],
        ]);

        $model = new \app\models\Plans;
        $query = $model->find();
        $find = $query->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'plans' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'plans' => [],
            ];
        }
        return $response;
    }

    public function actionGetRoles()
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

        $model = new \app\models\Roles;
        $query = $model->find();

        $find = $query->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'roles' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'roles' => [],
            ];
        }
        return $response;
    }

    /* public function actionGetUsersByLocation($location = "")
    {
        $response = [];

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
        $model = new \app\models\User;
        $query = $model->find();
        if (empty($location)) {
            $location = Yii::$app->user->identity->location_id;
        } else {
            $query->andWhere(['!=', 'id', Yii::$app->user->identity->id]);
        }
        $query->where(['location_id' => $location]);
        $find = $query->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'users' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'users' => [],
            ];
        }
        return $response;
    } */

    public function actionGetUsersByLocation($location)
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['first_name' => SORT_ASC],
                    'desc' => ['first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);
        $model = new \app\models\User;
        $query = $model->find()->select('id,prefix,first_name,last_name,middle_name,suffix')->where(['!=', 'id', Yii::$app->user->identity->id])->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $location . ',locations)'))->andWhere(['deleted' => 'N']);
        $find = $query->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'users' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'users' => [],
            ];
        }
        return $response;
    }

    public function actionGetLocationsByUser()
    {
        $response = [];
        $model = new \app\models\Locations;
        $find = $model->find()->where(['id' => explode(",", Yii::$app->user->identity->locations)])->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'locations' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'locations' => [],
            ];
        }
        return $response;
    }

    public function actionGetUsersByClinic($clinic)
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['first_name' => SORT_ASC],
                    'desc' => ['first_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);
        $model = new \app\models\User;
        $query = $model->find()->select('id,prefix,first_name,last_name,middle_name,suffix,role_id,email')->where(['deleted' => 'N'])->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $clinic . ',clinics)'));
        //where(['!=', 'id', Yii::$app->user->identity->id])
        $find = $query->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'users' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'users' => [],
            ];
        }
        return $response;
    }

    public function actionGetClinicsByUser($keyword = "", $user = "")
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);

        if ($user == null) {
            $find = \app\models\Clinics::find()->select('id,name')->Where([
                'or',
                ['LIKE', 'name', $keyword],
            ])->orderBy($sort->orders)->asArray()->all();

            $response = [
                'success' => true,
                'clinics' => $find,
            ];
        } else {
            $find = \app\models\User::find()->select(['clinics', 'role_id'])->where(['id' => $user])->one();

            $statusvalue = array(14, 15, 16);
            if ($find) {
                $key = array_search($find->role_id, $statusvalue);
                if ($key) {
                    $find = \app\models\Clinics::find()->select('id,name')->Where([
                        'or',
                        ['LIKE', 'name', $keyword],
                    ])->orderBy($sort->orders)->asArray()->all();
                    if ($find) {
                        $response = [
                            'success' => true,
                            'clinics' => $find,
                        ];
                    } else {
                        $response = [
                            'success' => true,
                            'clinics' => [],
                        ];
                    }
                } else {

                    if ($find->clinics != null) {
                        $clinics = explode(',', $find->clinics);
                        $find = \app\models\Clinics::find()->select('id,name')->where(['id' => $clinics])
                            ->andWhere([
                                'or',
                                ['LIKE', 'name', $keyword],
                            ])
                            ->orderBy($sort->orders)->asArray()->all();
                        if ($find) {
                            $response = [
                                'success' => true,
                                'clinics' => $find,
                            ];
                        } else {
                            $response = [
                                'success' => true,
                                'clinics' => [],
                            ];
                        }
                    } else {
                        $response = [
                            'error' => true,
                            'clinics' => [],
                        ];
                    }
                }
            } else {
                $response = [
                    'error' => true,
                    'clinics' => [],
                ];
            }
        }

        return $response;
    }


    /* public function actionGetClinicsByDoctor($keyword = "", $user = "")
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);

        if ($user == null) {
            $find = \app\models\Clinics::find()->select('id,name')->Where([
                'or',
                ['LIKE', 'name', $keyword],
            ])->orderBy($sort->orders)->asArray()->all();

            $response = [
                'success' => true,
                'clinics' => $find,
            ];
        } else {
            $find = \app\models\User::find()->select(['clinics', 'role_id'])->where(['id' => $user])->one();



            if ($find) {


                if ($find->clinics != null) {
                    $clinics = explode(',', $find->clinics);
                    $find = \app\models\Clinics::find()->select('id,name')->where(['id' => $clinics])
                        ->andWhere([
                            'or',
                            ['LIKE', 'name', $keyword],
                        ])
                        ->orderBy($sort->orders)->asArray()->all();
                    if ($find) {
                        $response = [
                            'success' => true,
                            'clinics' => $find,
                        ];
                    } else {
                        $response = [
                            'success' => true,
                            'clinics' => [],
                        ];
                    }
                } else {
                    $response = [
                        'error' => true,
                        'clinics' => [],
                    ];
                }
            } else {
                $response = [
                    'error' => true,
                    'clinics' => [],
                ];
            }
        }

        return $response;
    } */

    public function actionGetClinicsByDoctor($keyword = "", $user = null)
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);
        $cfind = [];
        //For Admin, Imaging Coordinator
        if ($user == null && in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            $cfind = \app\models\Clinics::find()->select(['id', 'name'])->where(['LIKE', 'name', $keyword])->orderBy($sort->orders)->asArray()->all();
        } else {
            $find = \app\models\User::find()->select(['clinics', 'role_id'])->where(['id' => $user])->one();
            if ($find) {
                $clinics = explode(',', $find->clinics);
                $cfind = \app\models\Clinics::find()->select(['id', 'name'])->where(['id' => $clinics])->orderBy($sort->orders)->asArray()->all();
            }
        }

        return [
            'success' => true,
            'clinics' => $cfind
        ];
    }

    public function actionGetAssociatedUsers($clinic_id = "")
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'first_name' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['first_name' => SORT_ASC],
        ]);
        $model = new \app\models\User;
        $query = $model->find()->select(Yii::$app->params['user_table_select_columns'])->where(['deleted' => 'N']);

        if (!empty($clinic_id)) {
            $query->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $clinic_id . ',clinics)'));
        } else {
            $clinicArr = explode(",", Yii::$app->user->identity->clinics);
            $orCondition = [];
            foreach ($clinicArr as $clinic) {
                $orCondition[] = new \yii\db\Expression('FIND_IN_SET(' . $clinic . ', clinics)');
            }
            $query->andWhere("(" . implode(" OR ", $orCondition) . ")");
        }
        //echo $query->createCommand()->getRawSql();die;
        return [
            'success' => true,
            'users' => $query->asArray()->all(),
        ];
    }

    public function actionGetServices($location = "")
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'sequence' => [
                    'asc' => ['sequence' => SORT_ASC],
                    'desc' => ['sequence' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['sequence' => SORT_ASC],
        ]);
        $model = new \app\models\Services;
        $query = $model->find()->joinWith(['locations'])->where(['services.parent_id' => 0]);
        if ($location != null) {
            $query->joinWith([
                'child c' => function ($q) use ($location) {
                    $q->where(new \yii\db\Expression('FIND_IN_SET(' . $location . ',c.locations)'));
                }
            ]);
        } else {
            $query->joinWith(['child c']);
        }

        $find = $query->orderBy($sort->orders)->asArray()->all();
        $response = [
            'success' => true,
            'services' => $find,
        ];
        return $response;
    }

    public function actionGetLocations()
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['publish_name' => SORT_ASC],
                    'desc' => ['publish_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);
        $model = new \app\models\Locations;
        $find = $model->find()->where(['status' => 1])->joinWith(['state'])->orderBy($sort->orders)->asArray()->all();
        $response = [
            'success' => true,
            'locations' => $find,
        ];
        return $response;
    }

    public function actionGetDiagnosisCodes()
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [
                'name' => [
                    'asc' => ['name' => SORT_ASC],
                    'desc' => ['name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['name' => SORT_ASC],
        ]);
        $model = new \app\models\Diagnosiscodes;
        $find = $model->find()->orderBy($sort->orders)->asArray()->all();
        $response = [
            'success' => true,
            'codes' => $find,
        ];
        return $response;
    }

    public function actionGetAvailableSlots($date, $location_id, $singleDay = false)
    {
        $response = $availableSlots = [];
        $bmodel = new \app\models\UnAvailability;
        //echo date("N", strtotime($date));die;
        if (isset($date) && !empty($location_id)) {
            if (isset($singleDay) && $singleDay) {
                $date = date("Y-m-d", strtotime($date));
                if ($date > date("Y-m-d")) {
                    $model = new \app\models\Slots;

                    $day_index = date("N", strtotime($date));
                    /* $availableSlots = [
                        "appointment_date" => $date,
                        "slots" => $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->orderBy("from_time")->asArray()->all(),
                    ];*/
                    $blocked = $bmodel->find()->where(['appointment_date' => $date, 'location_id' => $location_id])->orderBy("from_time")->asArray()->all();
                    if (!$blocked) {
                        $response = [
                            'error' => true,
                            'message' => "This dates are blocked.",
                        ];
                    } else {
                        $availableSlots = [
                            "appointment_date" => $date,
                            "slots" => $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->orderBy("from_time")->asArray()->all(),
                        ];
                    }
                    $response = [
                        'success' => true,
                        'availableSlots' => $availableSlots,
                    ];
                } else {
                    $response = [
                        'error' => true,
                        'message' => "Past date are not allowed",
                    ];
                }
            } else {
                $dates = [];
                $today = date("Y-m-d");
                $date = date("Y-m-d", strtotime($date));
                if ($today == $date) {
                    $dates[0] = $date;
                    $dates[1] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                    $dates[2] = date('Y-m-d', strtotime('+2 day', strtotime($date)));
                    $dates[3] = date('Y-m-d', strtotime('+3 day', strtotime($date)));
                    $dates[4] = date('Y-m-d', strtotime('+4 day', strtotime($date)));
                } else if (date('Y-m-d', strtotime($today . ' +1 day')) == $date) {
                    $dates[0] = date('Y-m-d', strtotime('-1 day', strtotime($date)));
                    $dates[1] = $date;
                    $dates[2] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                    $dates[3] = date('Y-m-d', strtotime('+2 day', strtotime($date)));
                    $dates[4] = date('Y-m-d', strtotime('+3 day', strtotime($date)));
                } else if (date('Y-m-d', strtotime($today . ' +2 day')) == $date) {
                    $dates[0] = date('Y-m-d', strtotime('-2 day', strtotime($date)));
                    $dates[1] = date('Y-m-d', strtotime('-1 day', strtotime($date)));
                    $dates[2] = $date;
                    $dates[3] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                    $dates[4] = date('Y-m-d', strtotime('+2 day', strtotime($date)));
                } else if (date('Y-m-d', strtotime($today . ' +3 day')) == $date) {
                    $dates[0] = date('Y-m-d', strtotime('-3 day', strtotime($date)));
                    $dates[1] = date('Y-m-d', strtotime('-2 day', strtotime($date)));
                    $dates[2] = date('Y-m-d', strtotime('-1 day', strtotime($date)));
                    $dates[3] = $date;
                    $dates[4] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                } else {
                    if (date('Y-m-d', strtotime($today . ' +3 day')) < $date) {
                        $dates[0] = date('Y-m-d', strtotime('-2 day', strtotime($date)));
                        $dates[1] = date('Y-m-d', strtotime('-1 day', strtotime($date)));
                        $dates[2] = $date;
                        $dates[3] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                        $dates[4] = date('Y-m-d', strtotime('+2 day', strtotime($date)));
                    } else {
                        $dates[0] = $date;
                        $dates[1] = date('Y-m-d', strtotime('+1 day', strtotime($date)));
                        $dates[2] = date('Y-m-d', strtotime('+2 day', strtotime($date)));
                        $dates[3] = date('Y-m-d', strtotime('+3 day', strtotime($date)));
                        $dates[4] = date('Y-m-d', strtotime('+4 day', strtotime($date)));
                    }
                }

                if ($dates) {
                    foreach ($dates as $key => $date) {
                        $not_avail_slot = [];
                        if (date("N", strtotime($date)) == 6 || date("N", strtotime($date)) == 7) {
                            continue;
                        }
                        $unavailable = \app\models\UnAvailability::find()->where(['appointment_date' => $date, 'location_id' => $location_id])->all();
                        $booked = \app\models\Cases::find()->select('slot_id as id')->where(['location_id' => $location_id, 'appointment_date' => $date])->asArray()->all();

                        if (!empty($unavailable)) {
                            $items = $sslots = $total = [];

                            $model = new \app\models\Slots;
                            $day_index = date("N", strtotime($date));
                            $currentTime = date('H:i:s');
                            $todayDate = date('Y-m-d');

                            //filter passed time slot for today
                            if ($date == $todayDate && !in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
                                $slots = $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->andWhere(['>=', 'from_time', $currentTime])->orderBy("from_time")->asArray()->all();
                            } else {
                                $slots = $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->orderBy("from_time")->asArray()->all();
                            }
                            $newSlots = $slots;
                            //Every Slot will check to every unavailable time
                            foreach ($slots as $sKey => $sVal) {
                                $not_available = false;
                                foreach ($unavailable as $key => $blckd) {
                                    if ($blckd->full_day_off == 1) {
                                        $newSlots = [];
                                        $not_avail_slot[] = [];
                                    } else {
                                        /* if ($slot['from_time'] == $blckd->from_time) {
                                            $not_available = true;
                                        } else if ($slot['from_time'] > $blckd->from_time && $slot['to_time'] <= $blckd->to_time || $slot['from_time'] <= $blckd->to_time) {
                                            $not_available = true;
                                        } else if ($slot['from_time'] < $blckd->from_time && $slot['to_time'] >= $blckd->from_time) {
                                            $not_available = true;
                                        } */
                                        if ($sVal['from_time'] >= $blckd->from_time && $sVal['from_time'] < $blckd->to_time) {
                                            unset($newSlots[$sKey]);
                                        }
                                    }
                                } //foreach end of blocked

                                //Check $not_available is true
                                /* if ($not_available === true) {
                                    $not_avail_slot[] = $slot;
                                } */
                            } //foreach end of slot

                            $availableSlots[] = [
                                "appointment_date" => $date,
                                "slots" => $newSlots,
                                "bookedSlots" => $booked,
                                "blockedSlots" => $not_avail_slot,
                                //"not_avail_slot" => $not_avail_slot,
                            ];
                        } else {
                            $model = new \app\models\Slots;
                            $day_index = date("N", strtotime($date));
                            $currentTime = date('H:i:s');
                            $todayDate = date('Y-m-d');

                            //filter passed time slot for today
                            if ($date == $todayDate && !in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
                                $slotquery = $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->andWhere(['>=', 'from_time', $currentTime])->orderBy("from_time")->asArray()->all();
                            } else {
                                $slotquery = $model->find()->where(['day_index' => $day_index, 'location_id' => $location_id])->orderBy("from_time")->asArray()->all();
                            }
                            $availableSlots[] = [
                                "appointment_date" => $date,
                                "slots" => $slotquery,
                                "bookedSlots" => $booked,
                                "blockedSlots" => [],
                            ];
                        }
                    }
                    $response = [
                        'success' => true,
                        'availableSlots' => $availableSlots,
                    ];
                }
            }
        }
        return $response;
    }

    public function actionGetReasons()
    {
        $response = [];
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
        $model = new \app\models\Reasons;
        $find = $model->find()->with(['children.children'])->where(['parent_id' => 0])->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'reasons' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'reasons' => [],
            ];
        }
        return $response;
    }

    public function actionGetDashboardData()
    {
        $records = [];
        $model = new \app\models\Referrals;
        $records['newReferrals'] = $model->find()->where(['referred_to' => Yii::$app->user->identity->id, 'status' => 2])->count();

        $model = new \app\models\Referrals;
        $records['approvals'] = $model->find()->where(['referred_from' => Yii::$app->user->identity->id, 'status' => 1])->count();

        $model = new \app\models\Referrals;
        $records['rejectedReferrals'] = $model->find()->where(['referred_by' => Yii::$app->user->identity->id, 'status' => 3])->count();

        return [
            'success' => true,
            'records' => $records,
        ];
    }

    public function actionGetUnavailSlots()
    {
        $response = [];
        try {
            $model = new \app\models\Unavailability;
            if (isset($_POST) && !empty($_POST)) {
                $POST['Unavailability'] = [];
                $POST['Unavailability']['user_id'] = Yii::$app->user->identity->id;
                if (isset($_POST['slot_id'])) {
                    $POST['Unavailability']['slot_id'] = $_POST['slot_id'];
                    $POST['Unavailability']['for_date'] = date('Y-m-d', strtotime($_POST['for_date']));
                    if (isset($_POST['id']) && !empty($_POST['id'])) {
                        $find = $model->findOne(['id' => $_POST['id']]);
                        if ($find) {
                            if (!empty($POST['Unavailability']['slot_id'])) {
                                $find->load($POST);
                                if ($find->save()) {
                                    return [
                                        'success' => true,
                                        'message' => 'Slots updated successfully.',
                                    ];
                                }
                            } else {
                                if ($find->delete()) {
                                    return [
                                        'success' => true,
                                        'message' => 'Slots updated successfully.',
                                    ];
                                }
                            }
                        }
                    } else {
                        $model->load($POST);
                        if ($model->save()) {
                            $response = [
                                'success' => true,
                                'message' => 'Slots added successfully.',
                            ];
                        } else {
                            $response = [
                                'error' => true,
                                'message' => $model->getErrors(),
                            ];
                        }
                    }
                } else {
                    $POST['Unavailability']['for_date'] = date('Y-m-d', strtotime($_POST['for_date']));
                    $find = $model->findOne(['for_date' => $POST['Unavailability']['for_date'], 'user_id' => $POST['Unavailability']['user_id']]);
                    if ($find) {
                        $response = [
                            'success' => true,
                            'slots' => $find,
                        ];
                    } else {
                        $response = [
                            'error' => true,
                            'message' => 'Found No Data',
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
        return $response;
    }

    public function actionGetUserLocations()
    {
        $response = [];
        $find = \app\models\User::find()->select("locations")->where(["id" => Yii::$app->user->identity->id])->one();
        if ($find && $find->locations != 0) {
            $locations = explode(",", $find->locations);
            $model = new \app\models\Locations;
            $find = $model->find()->select("id, publish_name")->where(['id' => $locations])->orderBy("publish_name")->asArray()->all();
            //echo $find->createCommand()->getRawSql();die;
            $response = [
                'success' => true,
                'locations' => $find,
            ];
        }
        return $response;
    }

    public function actionGetUsers($user_id = "", $keyword = "")
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'first_name' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['first_name' => SORT_ASC],
        ]);
        $model = new \app\models\User;
        $query = $model->find()->where(['deleted' => 'N']);

        if (in_array(Yii::$app->user->identity->role_id, Yii::$app->params['imd_roles'])) {
            if (!empty($keyword)) {
                $query->andWhere([
                    'or',
                    ['LIKE', 'first_name', $keyword],
                    ['LIKE', 'middle_name', $keyword],
                    ['LIKE', 'last_name', $keyword],
                    ['LIKE', 'email', $keyword],
                    ['LIKE', 'preferred_name', $keyword],
                ]);
            }
            return [
                'success' => true,
                'users' => $query->asArray()->all(),
            ];
        } else {
            if (!isset(Yii::$app->user->identity->clinics) || empty(Yii::$app->user->identity->clinics)) {
                return [
                    'error' => true,
                    'message' => 'Please contact admin to assign clinic for your account to create case.',
                ];
            }
            $clinicArr = explode(",", Yii::$app->user->identity->clinics);
            $orCondition = [];
            foreach ($clinicArr as $clinic) {
                $orCondition[] = new \yii\db\Expression('FIND_IN_SET(' . $clinic . ', clinics)');
            }
            $query->andWhere("(" . implode(" OR ", $orCondition) . ")");
            //echo $query->createCommand()->getRawSql();die;
            return [
                'success' => true,
                'users' => $query->asArray()->all(),
            ];
        }
    }

    public function actionGetPatients($keyword = "")
    {
        $response = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'first_name' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['first_name' => SORT_ASC],
        ]);
        $model = new \app\models\Patients;
        $query = $model->find();
        $query->andWhere([
            'or',
            ['LIKE', 'first_name', $keyword],
            ['LIKE', 'middle_name', $keyword],
            ['LIKE', 'last_name', $keyword],
        ]);

        return [
            'success' => true,
            'patients' => trim($keyword) !== "" ? $query->asArray()->all() : [],
        ];
    }

    public function actionGetParentServices()
    {
        $response = [];
        $find = \app\models\Services::find()->where(["parent_id" => 0])->orderBy("sequence")->asArray()->all();
        //$find = \app\models\Services::find()->where(['IN',"id",[52,53,54,55]])->orderBy("name")->asArray()->all();
        $response = [
            'success' => true,
            'services' => $find,
        ];
        return $response;
    }

    public function actionCaseDiagnosisCodes()
    {
        $response = [];
        if (isset($_GET) && !empty($_GET['codes'])) {
            $codes = explode(",", $_GET['codes']);
            $model = new \app\models\Diagnosiscodes;
            $find = $model->find()->select(['name', 'code'])->where(['id' => $codes])->orderBy("name")->all();
            //echo $find->createCommand()->getRawSql();die;
            $response = [
                'success' => true,
                'diagnosis_codes' => $find
            ];
        } else {
            $response = [
                'success' => true,
                'diagnosis_codes' => []
            ];
        }
        return $response;
    }

    public function actionGetTeam($case_id)
    {
        if (isset($case_id) && !empty($case_id)) {
            try {
                $model = new \app\models\TreatmentTeam;
                $find = $model->find()->joinWith([
                    "user" => function ($query) {
                        $query->select('id, prefix,first_name,middle_name,last_name,suffix,username,email');
                    }
                ])->where(['case_id' => $case_id])->asArray()->all();
                if ($find) {
                    return [
                        'success' => true,
                        'team' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Team not found!',
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
                'message' => 'Team not found!',
            ];
        }
    }

    public function actionGetSelectedServices($case_id)
    {
        try {
            $model = new \app\models\CaseServices;
            $find = $model->find()->joinWith(['service'])->where(['case_id' => $case_id])->asArray()->all();
            return [
                'success' => true,
                'services' => $find,
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionGetDuePayments($location_id = null)
    {
        try {
            if ($location_id !== null) {
                $model = new \app\models\Invoices;
                $caseStatusArr = [1, 2, 3, 4, 5, 6, 7, 8];
                $find = $model->find()->joinWith([
                    'case.services.service',
                    'case.patient',
                    'case.services' => function ($query) {
                        $query->where(['who_will_pay' => 0]);
                    },
                    'case.team' => function ($query) {
                        $query->orderBy(['id' => SORT_ASC]);
                    }
                ])->where(['cases.status' => $caseStatusArr, 'cases.location_id' => $location_id, 'invoices.patient_id' => null, 'invoices.status' => 0])->andWhere(['>', 'cases.doctor_balance', 0])->asArray()->all();
                //$find = $model->find()->joinWith(['patient','services.service','services'=>function($query){$query->where(['who_will_pay'=>0]);}])->where(['user_id'=>Yii::$app->user->identity->id])->andWhere(['NOT IN','case_id',\app\models\Payments::find()->select('case_id')->where(['user_id'=>Yii::$app->user->identity->id])])->andWhere(['cases.status'=>5,'cases.location_id'=>$location_id])->asArray()->all();
                //$find = $model->find()-> (['patient','services.service','services'=>function($query){$query->where(['who_will_pay'=>0])->andWhere(['NOT IN','case_id',\app\models\Payments::find()->select('case_id')]);}])->where(['user_id'=>Yii::$app->user->identity->id])->asArray()->all();
                $payments = [];

                if (isset($find) && !empty($find)) {
                    foreach ($find as $data) {
                        if (isset($data['case']['team'][0])) {
                            $team = $data['case']['team'][0];
                            if ($team['user_id'] == Yii::$app->user->identity->id) {
                                $payments[] = $data;
                            }
                        }
                    }
                }
                return [
                    'success' => true,
                    'payments' => $payments,
                ];
            } else {
                return [
                    'success' => true,
                    'payments' => [],
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionSendSms()
    {
        //Yii::$app->sms->compose('test-message', ['name' => 'Wade'])->setTo('+15558881234')->send();
        $result = Yii::$app->sms->compose()->setTo('+919650980302')->setMessage("Hey Vikas this is a test!")->send();
        echo "<pre>";
        print_r($result);
        die;
        if ($result === true) {
            die('SMS was sent!');
        } else {
            die('Error sending SMS!');
        }
    }

    public function actionReceivePayment()
    {
        if (isset($_POST) && !empty($_POST)) {
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $user_id = Yii::$app->user->identity->id;
                require dirname(dirname(dirname(__FILE__))) . "/api/web/gateway/vendor/autoload.php";
                require dirname(dirname(dirname(__FILE__))) . "/api/web/gateway/BridgeCommSDK.php";
                $request = new \BridgeCommRequest();
                $request->TransactionID = rand(999999, 111111);
                $request->RequestType = "004";
                $request->ClientIdentifier = "SOAP";
                $request->PrivateKey = "ba8nSz4cEZ5pMTYP";
                $request->AuthenticationTokenId = $_POST['token'];

                $request->requestMessage = new \RequestMessage();
                $request->requestMessage->Amount = 690;
                $request->requestMessage->TransIndustryType = "EC";
                $request->requestMessage->TransactionType = "SALE";
                $request->requestMessage->AcctType = "R";
                $request->requestMessage->HolderType = "P";
                $request->requestMessage->IsoCurrencyCode = "USD";

                $conn = new \BridgeCommConnection();
                $response = $conn->processRequest("https://rhuat.bridgepaynetsecuretest.com/paymentservice/requesthandler.svc", $request);
                //print_r($response);die;
                $tmodel = new \app\models\Transactions;
                $transactions['Transactions'] = (array) $response->responseMessage;
                $transactions['Transactions']['TransactionID'] = $response->TransactionID;
                $transactions['Transactions']['RequestType'] = $response->RequestType;
                $transactions['Transactions']['ResponseCode'] = $response->ResponseCode;
                $transactions['Transactions']['ResponseDescription'] = $response->ResponseDescription;
                //print_r($transactions);die;
                if ($tmodel->load($transactions) && $tmodel->save()) {
                    $cardTypes = [
                        2 => 'Visa',
                        3 => 'Mastercard',
                        4 => 'AMEX',
                        5 => 'Discover'
                    ];
                    $model = new \app\models\Cases;
                    $find = $model->find()->where(['id' => $_POST['selectedCases']])->all();
                    if ($find) {
                        $i = 0;
                        foreach ($find as $case) {
                            $maxId = \app\models\Invoices::find()->max("id") + 1;
                            $imodel = \app\models\Invoices::find()->where(['case_id' => $case->id])->one();
                            $model = new \app\models\Payments;
                            $model->case_id = $case->id;
                            $model->location_id = $case->location_id;
                            $model->invoice_id = $imodel->id;
                            $model->actual_invoice_id = $imodel->invoice_id;
                            $model->user_id = $imodel->user_id;
                            $model->mode = (int) array_search($tmodel->CardType, $cardTypes);
                            $model->manual = 0;
                            $model->paid_amount = $imodel->balance_amount;
                            $model->remaining_amount = 0;
                            $model->received_by = $user_id;
                            $imodel->balance_amount = 0;
                            $imodel->status = 1;
                            if ($model->validate()) {
                                $model->save();
                                $imodel->save();
                                //Yii::$app->common->updateBalance($imodel->case_id);
                                Yii::$app->common->addLog($imodel->case_id, "Payment of $" . $imodel->balance_amount . " received for this case.");
                                $i++;
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $imodel->getErrors(),
                                ];
                            }
                        }
                        if ($i > 0) {
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Payment has been received successfully.',
                            ];
                        } else {
                            return [
                                'error' => true,
                                'message' => "There is some problem in the request.",
                            ];
                        }
                    }
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

    public function actionGetBanners()
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
                'sequence' => [
                    'asc' => ['sequence' => SORT_ASC],
                    'desc' => ['sequence' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['sequence' => SORT_ASC],
        ]);

        $model = new \app\models\Banners;
        $find = $model->find()->orderBy($sort->orders)->asArray()->all();
        if ($find) {
            $response = [
                'success' => true,
                'banners' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'banners' => [],
            ];
        }
        return $response;
    }

    public function actionContactUs()
    {

        if (isset($_POST) && !empty($_POST)) {
            $POST['ContactForm'] = $_POST['fields'];

            try {
                $model = new \app\models\ContactForm;
                if ($model->load($POST) && $model->validate()) {
                    $template = \app\models\EmailTemplates::findOne(['id' => 16]);
                    // print_r($model->subject);
                    // exit();
                    $data = [
                        'template_id' => 16,
                        //'to'=>"support@imagdent.com",
                        // 'to' => "opnsrc.devlpr@gmail.com",
                        'to' => $model->location['email'],
                        'name' => $model->name,
                        'email' => $model->email,
                        'subject_line' => $model->subject,
                        'location' => $model->location['city'],
                        'message' => $model->body,
                        'body' => $template,
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

    public function actionUploadMultipleImages()
    {
        $response = [];
        if (isset($_FILES) && !empty($_FILES['file_names'])) {
            try {
                $files = [];
                foreach ($_FILES['file_names'] as $k => $l) {
                    foreach ($l as $i => $v) {
                        if (!array_key_exists($i, $files))
                            $files[$i] = [];
                        $files[$i][$k] = $v;
                    }
                }
                include "vendor/Upload.php";
                $uploaded = 0;
                foreach ($files as $file) {
                    $handle = new \Upload($file);
                    if ($handle->uploaded) {
                        $file_name = "imagdent-" . mt_rand(111111, 999999);
                        $handle->file_new_name_body = $file_name;
                        $handle->allowed = ['image/*'];
                        $handle->file_overwrite = true;
                        if ($handle->image_src_x > 800) {
                            $handle->image_resize = true;
                            $handle->image_x = 800;
                            $handle->image_ratio_y = true;
                        }
                        $handle->process($_SERVER['DOCUMENT_ROOT'] . "/api/web/images");
                        if ($handle->processed) {
                            $model = new \app\models\Images;
                            $model->file_name = $handle->file_dst_name;
                            if ($model->save()) {
                                $handle->clean();
                                $uploaded++;
                            } else {
                                return [
                                    'error' => true,
                                    'message' => $model->getErrors()
                                ];
                            }
                        } else {
                            $response = [
                                'type' => 'error',
                                'message' => $handle->error,
                            ];
                        }
                    }
                }
                if ($uploaded > 0) {
                    $response = [
                        'success' => true,
                        'message' => "Image uploaded successfully.",
                    ];
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

    public function actionGetBuild()
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
                'versionName' => [
                    'asc' => ['version_name' => SORT_ASC],
                    'desc' => ['version_name' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'versionCode' => [
                    'asc' => ['versionCode' => SORT_ASC],
                    'desc' => ['versionCode' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
            ],
            'defaultOrder' => ['id' => SORT_ASC],
        ]);

        $model = new \app\models\Build;
        $find = $model->find()->orderBy($sort->orders)->asArray()->one();
        if ($find) {
            $response = [
                'success' => true,
                'build' => $find,
            ];
        } else {
            $response = [
                'success' => true,
                'build' => '',
            ];
        }
        return $response;
    }

    public function actionSendTestMail($to)
    {
        try {
            $mail = new Mailer();
            $compose = $mail->compose();
            $compose->setFrom(["no-reply@imgdent.com" => "iMagDent"]);
            $compose->setTo($to);
            $compose->setHtmlBody('<b>Hi there, </b><br><p>This is test mail.</p><p>Hope you are doing well.</p>');
            $compose->setSubject('Server Mail Test');
            //return true;
            return $compose->send();
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    public function actionDbDetails()
    {
        echo "host: " . Yii::$app->db->dsn . "<br/>username: " . Yii::$app->db->username . "<br/>password: " . Yii::$app->db->password;
        die;
    }
}
