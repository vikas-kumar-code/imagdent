<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\web\Controller;
use yii\web\Response;

class RoleController extends Controller
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
            'except' => ['get-modules-by-role', 'list'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('User Roles', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit Role~User Roles~add~/admin/roles~fa fa-users
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            try {
                $model = new \app\models\Roles;
                $id = isset($_POST['id']) ? $_POST['id'] : "";
                $POST['Roles'] = $_POST['fields'];
                if (isset($id) && !empty($id)) {
                    $find = $model->find()->where(['id' => $id])->one();
                    if ($find && $find->load($POST) && $find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Role has been updated successfully.',
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
                            'message' => 'Role has been added successfully.',
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

        $model = new \app\models\Roles;
        $query = $model->find();

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
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
                'roles' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'roles' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\Roles;
                $find = $model->find()->where(['id' => $id])->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'role' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Role not found!',
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
                'message' => 'Role not found!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Role~User Roles~delete~/admin/roles~fa fa-users
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\Roles;
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find && $find->delete()) {
                    return [
                        'success' => true,
                        'message' => 'Role has been deleted successfully.',
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'Role not found!',
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
                'message' => 'Role not found!',
            ];
        }
    }

    public function actionGetActions($module_name)
    {
        if (isset($module_name) && !empty($module_name)) {
            try {
                $model = new \app\models\ModuleActions;
                $find = $model->find()->where(["module_name" => $module_name])->asArray()->all();
                return [
                    'success' => true,
                    'actions' => $find,
                ];
            } catch (\Exception $e) {
                return [
                    'error' => true,
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        }
        return [
            'error' => true,
            'message' => "Action not found.",
        ];
    }

    public function actionGetModules()
    {
        try {
            $model = new \app\models\ModuleActions;
            $find = $model->find()->groupBy("module_name")->asArray()->all();
            return [
                'success' => true,
                'modules' => $find,
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    public function actionGetModulesByRole($role_id = "")
    {
        try {
            $model = new \app\models\ModuleActions;

            if (isset($role_id) && !empty($role_id)) {

                if ($role_id == 1) {
                    //$find = $model->find()->groupBy("module_name")->asArray()->all();
                    return [
                        'success' => true,
                        //'modules' => $find,
                        'modules' => Yii::$app->params['admin_module_arr'],
                    ];
                } else {
                    $model = new \app\models\Roles;
                    $find = $model->findOne(['id' => $role_id]);
                    if ($find) {
                        $modules = [];
                        $module_names = unserialize($find->permission);
                        foreach ($module_names as $key => $val) {
                            $modules[] = $key;
                        }
                        $model = new \app\models\ModuleActions;
                        //$find = $model->find()->select(['id','module_name','action_label_name','action_name','url','icon','added_on','CONCAT("/admin/",url) as url'])->where(['module_name' => $modules])->groupBy("module_name")->asArray()->all();
                        $find = $model->find()->joinWith([
                            'children ch'
                        ])->where(['module_actions.module_name' => $modules])->groupBy("module_name")->asArray()->all();
                        //echo $find->createCommand()->getRawSql();die;
                        array_unshift($find, [
                            'icon' => 'fa fa-tachometer-alt',
                            'id' => '2332323',
                            'module_name' => 'Dashboard',
                            'url' => '/admin/dashboard'
                        ]);
                        return [
                            'success' => true,
                            'modules' => $find,
                        ];
                    }
                }
            } else {
                return [
                    'error' => true,
                    'modules' => [],
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => Yii::$app->common->returnException($e),
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Assign Permission~User Roles~assign-permission~/admin/roles~fa fa-users
    public function actionAssignPermission($id = null)
    {
        if (isset($_POST) && !empty($_POST)) {
            try {
                $id = $_POST['id'];
                $_POST = $_POST['fields'];
                $model = new \app\models\Roles;
                if (isset($id) && !empty($id)) {
                    if ($find = $model->findOne(['id' => $id])) {
                        $permissions = [];
                        if (isset($_POST['module_name']) && !empty($_POST['module_name'])) {
                            foreach ($_POST['module_name'] as $key => $val) {
                                $module_details = explode("~", $val);
                                $id = $module_details[1];
                                $name = trim($module_details[0]);
                                if (isset($_POST["module_action_$id"]) && !empty($_POST["module_action_$id"])) {
                                    foreach ($_POST["module_action_$id"] as $key => $val) {
                                        $permissions[$name][] = trim($val);
                                    }
                                }
                            }
                            if (isset($permissions) && !empty($permissions)) {
                                $find->permission = serialize($permissions);
                            }
                            if ($find->validate() && $find->save()) {
                                return [
                                    'success' => true,
                                    'message' => 'Permission has been updated successfully.',
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
                                'message' => 'Module not found.',
                            ];
                        }
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Role not found.',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Role not found.',
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

    public function actionGetPermission($role_id = "")
    {
        try {
            $model = new \app\models\Roles;
            if (isset($role_id) && !empty($role_id)) {
                $model = new \app\models\Roles;
                $find = $model->findOne(['id' => $role_id]);
                if ($find) {
                    $modules = unserialize($find->permission);
                    return [
                        'success' => true,
                        'permission' => $modules,
                    ];
                }
            } else {
                return [
                    'error' => true,
                    'permission' => [],
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
