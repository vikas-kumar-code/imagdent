<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\swiftmailer\Mailer;
use yii\web\Controller;
use yii\web\Response;

class UserController extends Controller
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
                'except' => ['login', 'forgot-password', 'check-password-reset-token', 'reset-password', 'search-zipcode', 'signup'],
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
            'except' => ['login', 'forgot-password', 'check-password-reset-token', 'reset-password', 'search-zipcode', 'signup', 'get', 'change-default-location', 'logout'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        if (isset($_POST) && !empty($_POST)) {
                            if ($action->id == 'add' || (isset($_POST['fields']['id']) && $_POST['fields']['id'] == Yii::$app->user->identity->id)) {
                                return true;
                            }
                        }
                        return Yii::$app->common->checkPermission('Users', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Add/Edit User~Users~add~/admin/users~fa fa-user-md
    public function actionAdd()
    {
        if (isset($_POST) && !empty($_POST)) {
            $scenario = [];
            $transaction = Yii::$app->db->beginTransaction();
            try {
                $model = new \app\models\User();
                $POST['User'] = $_POST['fields'];
                $POST['User']['country_id'] = isset($_POST['fields']['country_id']['value']) ? $_POST['fields']['country_id']['value'] : NULL;
                $POST['User']['state_id'] = isset($_POST['fields']['state_id']['value']) ? $_POST['fields']['state_id']['value'] : NULL;
                $POST['User']['bcountry_id'] = isset($_POST['fields']['bcountry_id']['value']) ? $_POST['fields']['bcountry_id']['value'] : NULL;
                $POST['User']['bstate_id'] = isset($_POST['fields']['bstate_id']['value']) ? $_POST['fields']['bstate_id']['value'] : NULL;
                $POST['User']['mcountry_id'] = isset($_POST['fields']['mcountry_id']['value']) ? $_POST['fields']['mcountry_id']['value'] : NULL;
                $POST['User']['mstate_id'] = isset($_POST['fields']['mstate_id']['value']) ? $_POST['fields']['mstate_id']['value'] : NULL;
                $POST['User']['lcountry_id'] = isset($_POST['fields']['lcountry_id']['value']) ? $_POST['fields']['lcountry_id']['value'] : NULL;
                $POST['User']['lstate_id'] = isset($_POST['fields']['lstate_id']['value']) ? $_POST['fields']['lstate_id']['value'] : NULL;
                $POST['User']['deleted'] = "N";

                if (isset($POST['User']['clinics']) && !empty($POST['User']['clinics'])) {
                    $clinics = [];
                    foreach ($POST['User']['clinics'] as $key => $val) {
                        $clinics[$key] = $val['value'];
                    }
                    $POST['User']['clinics'] = implode(",", $clinics);
                }
                if (isset($POST['User']['locations']) && !empty($POST['User']['locations'])) {
                    $locations = [];
                    foreach ($POST['User']['locations'] as $key => $val) {
                        $locations[$key] = $val['value'];
                    }
                    $POST['User']['locations'] = implode(",", $locations);
                }
                $POST['User']['default_location'] = isset($_POST['fields']['default_location']['value']) ? $_POST['fields']['default_location']['value'] : NULL;
                if (isset($POST['User']['id']) && !empty($POST['User']['id'])) {
                    $find = $model->find()->where(['id' => $POST['User']['id']])->one();
                    if(Yii::$app->user->identity && Yii::$app->user->identity->role_id == 1) {
                        $find->scenario = "admin-add";
                    }else{
                        $find->scenario = "Profile";
                    }
                    $POST['User']['deleted'] = (!empty($find)) ? $find->deleted : "N";
                    if ($find && $find->load($POST)) {
                        if ($find->validate() && $find->save()) {
                            if (isset($POST['User']['password']) && !empty($POST['User']['password'])) {
                                $find->password_hash = Yii::$app->security->generatePasswordHash($POST['User']['password']);
                                $find->save();
                            }
                            if (isset($_POST['documents']) && !empty($_POST['documents'])) {
                                $dmodel = new \app\models\Documents;
                                $files = [];
                                foreach ($_POST['documents'] as $document) {
                                    $dfind = $dmodel->findOne(['document_name' => $document['document_name'], 'user_id' => $find->id]);
                                    if (!$dfind) {
                                        $new_file_name = mt_rand(111111, 999999) . "-" . $find->id . "." . $document['extension'];
                                        //if(strpos($attachment, "temp") != false){
                                        copy($_SERVER['DOCUMENT_ROOT'] . "/documents/temp/" . $document['document_name'], $_SERVER['DOCUMENT_ROOT'] . "/documents/" . $new_file_name);
                                        $dmodel = new \app\models\Documents;
                                        $dmodel->document_name = $new_file_name;
                                        $dmodel->document_name_original = $document['document_name_original'];
                                        $dmodel->extension = $document['extension'];
                                        $dmodel->user_id = $find->id;
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
                                            'and', 'user_id = :user_id',
                                            ['not in', 'document_name', $files],
                                        ],
                                        [':user_id' => $find->id]
                                    );
                                }
                            } else {
                                \app\models\Documents::deleteAll(['user_id' => $find->id]);
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
                                        $nmodel->user_id = $find->id;
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
                                            'and', 'user_id = :user_id',
                                            ['not in', 'id', $notes],
                                        ],
                                        [':user_id' => $find->id]
                                    );
                                }
                            } else {
                                \app\models\Notes::deleteAll(['user_id' => $find->id]);
                            }
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'User has been updated successfully.',
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
                            'message' => "User not found.",
                        ];
                    }
                } else if ($model->load($POST) && $model->validate()) {
                    if(Yii::$app->user->identity && Yii::$app->user->identity->role_id == 1) {
                        $model->scenario = "admin-add";
                    }else{
                        $model->scenario = "Profile";
                    }
                    if (isset($model->password) && !empty($model->password)) {
                        $model->password_hash = Yii::$app->security->generatePasswordHash($model->password);
                    }
                    //$model->clinic_id = Yii::$app->user->identity->clinic_id;
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
                                $dmodel->user_id = $model->id;
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
                                $nmodel->user_id = $model->id;
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
                            'message' => 'User has been added successfully.',
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

    //Label~Module~Action~Url~Icon:List User~Users~list~/admin/users~fa fa-user-md
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
                'email' => [
                    'asc' => ['email' => SORT_ASC],
                    'desc' => ['email' => SORT_DESC],
                    'default' => SORT_DESC,
                ],
                'username' => [
                    'asc' => ['username' => SORT_ASC],
                    'desc' => ['username' => SORT_DESC],
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

        $model = new \app\models\User;
        $query = $model->find()->where(['deleted' => 'N'])->joinWith(["role", "location"]);

        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields']) ? json_decode($_GET['fields'], true) : [];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere([
                    'or',
                    ['LIKE', 'users.first_name', $search->name],
                    ['LIKE', 'users.middle_name', $search->name],
                    ['LIKE', 'users.last_name', $search->name],
                    ['LIKE', 'users.preferred_name', $search->name],
                ]);
            }
            if (!empty($search->email)) {
                $query->andWhere(['LIKE', 'users.email', $search->email]);
            }
            if (!empty($search->username)) {
                $query->andWhere(['LIKE', 'users.username', $search->username]);
            }
            if (!empty($search->phone)) {
                $query->andWhere(['LIKE', 'users.phone', preg_replace('/[^\p{L}\p{N}]/', '', $search->phone)]);
            }
            if (!empty($search->location_id)) {
                $query->andWhere(new \yii\db\Expression('FIND_IN_SET(' . $search->location_id . ',users.locations)'));
            }
            if (!empty($search->role_id)) {
                $query->andWhere(['=', 'role_id', $search->role_id]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        //print_r($find);die;
        //echo $query->createCommand()->getRawSql();die;
        if ($find) {
            $response = [
                'success' => true,
                'users' => $find,
                'pages' => $pages,
            ];
        } else {
            $response = [
                'success' => true,
                'users' => [],
                'pages' => $pages,
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {
        if (isset($id) && !empty($id)) {
            try {
                $model = new \app\models\User;
                $find = $model->find()->select(Yii::$app->params['user_table_select_columns'])->joinWith(['documents', 'notes', 'pcountry pc', 'pstate ps', 'mcountry mc', 'bcountry bc', 'mstate ms', 'bstate bs', 'lcountry lc', 'lstate ls'])->where(['users.id' => $id])->orWhere(['username' => $id])->asArray()->one();
                $cmodel = new \app\models\Clinics;
                $cfind = $cmodel->find()->select(['id', 'name'])->where(['id' => explode(',', $find['clinics'])])->all();
                $find['clinicDetails'] = $cfind;
                if ($find) {
                    return [
                        'success' => true,
                        'user' => $find,
                    ];
                } else {
                    return [
                        'error' => true,
                        'message' => 'User not found!',
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
                'message' => 'User not found!',
            ];
        }
    }

    public function actionConfirmEmail($code)
    {
        if (isset($code) && !empty($code)) {
            try {
                $model = new \app\models\User;
                $find = $model->find()->where(['verification_code' => $code])->one();
                if ($find) {
                    if ($find->status == 'N') {
                        $find->status = 'Y';
                        $find->save();
                        return [
                            'success' => true,
                            'message' => 'Email verified successfully. Please login to continue.',
                        ];
                    } else {
                        return [
                            'error' => true,
                            'message' => 'Error: Email address already verified!',
                        ];
                    }
                } else {
                    return [
                        'error' => true,
                        'message' => 'Error: Invalid verification code!',
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
                'message' => 'Invalid verification code!',
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete User~Users~delete~/admin/users~fa fa-user-md
    public function actionDelete()
    {
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            try {
                $model = new \app\models\User();
                $find = $model->find()->where(['id' => $_POST['id']])->one();
                if ($find) {
                    $find->deleted = 'Y';
                    if ($find->save()) {
                        return [
                            'success' => true,
                            'message' => 'User has been deleted successfully.',
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
                        'message' => 'User not found!',
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
                'message' => 'User not found!',
            ];
        }
    }

    public function actionChangePassword()
    {
        if (isset($_POST) && !empty($_POST)) {
            $model = new \app\models\ChangePasswordForm;
            $transaction = Yii::$app->db->beginTransaction();
            if (isset($_POST['current_password']) && !empty($_POST['current_password'])) {
                $model->current_password = $_POST['current_password'];
            }
            if (isset($_POST['new_password']) && !empty($_POST['new_password'])) {
                $model->new_password = $_POST['new_password'];
            }
            if (isset($_POST['confirm_password']) && !empty($_POST['confirm_password'])) {
                $model->confirm_password = $_POST['confirm_password'];
            }

            if ($model->checkPassword(Yii::$app->user->identity->username)) {
                $user = new \app\models\User;
                $find = $user->findOne(['username' => Yii::$app->user->identity->username]);
                try {
                    if ($find) {
                        $find->password = $model->new_password;
                        $find->password_hash = Yii::$app->security->generatePasswordHash($model->new_password);
                        if ($find->save()) {
                            $data = [
                                'template_id' => 2,
                                'username' => $find->username,
                                'body' => \app\models\EmailTemplates::findOne(['id' => 2]),
                            ];
                            $mail = new Mailer();
                            $compose = $mail->compose('body', $data);
                            $compose->setFrom([Yii::$app->params['adminEmail'] => 'imagDent']);
                            $compose->setTo($find->email);
                            $compose->setSubject($data['body']->subject);
                            $compose->send();
                            $transaction->commit();
                            return [
                                'success' => true,
                                'message' => 'Your password has been updated successfully.',
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
                            'message' => 'User does not exist.',
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
                    'error' => $model->getErrors(),
                ];
            }
        }
    }

    public function actionResetPassword()
    {
        if (isset($_POST) && !empty($_POST)) {
            $model = new \app\models\User;
            if (isset($_POST['token']) && !empty($_POST['token'])) {
                $token = $_POST['token'];
            }
            $find = $model->find()->where(['password_reset_token' => $token])->one();
            try {
                if ($find) {
                    $find->password = $_POST['new_password'];
                    $find->password_hash = Yii::$app->security->generatePasswordHash($_POST['new_password']);
                    if ($find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Your password has been updated successfully.',
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
                        'message' => 'Password reset URL does not seem to be valid.',
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

    public function actionLogin()
    {
        //echo Yii::$app->security->generatePasswordHash("admin");die;
        $data = $reponnse = [];
        $model = new \app\models\LoginForm;
        if (isset($_POST['username']) && !empty($_POST['username'])) {
            $model->username = $_POST['username'];
        }
        if (isset($_POST['password']) && !empty($_POST['password'])) {
            $model->password = $_POST['password'];
        }
        //echo Yii::$app->security->generatePasswordHash("admin");die;
        if ($model->login()) {
            $user = new \app\models\User;
            $find = $user->findOne(['id' => Yii::$app->user->getId(), 'status' => \app\models\User::STATUS_ACTIVE]);
            //echo $find->createCommand()->getRawSql();die;
            try {
                /* $msg = print_r($_POST, true);
                mail('opnsrc.devlpr@gmail.com', 'Login Success', $msg); */
                if ($find) {
                    if (empty($find->access_token)) {
                        $find->access_token = Yii::$app->security->generateRandomString();
                    }
                    if ($find->save()) {
                        $response = [
                            'success' => true,
                            'user_id' => $find->id,
                            'username' => $find->username,
                            'name' => $find->name,
                            'email' => $find->email,
                            'user_type' => $find->role_id,
                            'token' => $find->access_token,
                            'image' => $find->image,
                            'locations' => $find->locations,
                            'default_location' => $find->default_location
                        ];
                    } else {
                        $response['response'] = [
                            'status' => 'error',
                            'message' => $find->getErrors(),
                        ];
                    }
                } else {
                    $response = [
                        'error' => 'Sorry! You are not authorized to login.',
                    ];
                }
            } catch (\Exception $e) {
                $response['response'] = [
                    'status' => 'error',
                    'message' => Yii::$app->common->returnException($e),
                ];
            }
        } else {
            $response = [
                'error' => "Incorrect username or password.",
            ];
        }
        return $response;
    }

    public function actionLogout()
    {
        /* $model = new \app\models\User;		
		$find = $model->find()->where(['id'=>Yii::$app->user->identity->id])->one();
        if($find){
            //$find->access_token = '';
            if($find->save()){
                return [
                    'success' => true,
                ];
            }
        } */
        return [
            'success' => true,
        ];
    }

    public function actionCheckUsername($username)
    {
        if (isset($username) && !empty($username)) {
            $model = new \app\models\User;
            $find = $model->find()->where(['username' => $username])->count();
            if ($find) {
                return [
                    'success' => true,
                ];
            } else {
                return [
                    'error' => true,
                ];
            }
        }
    }

    public function actionForgotPassword()
    {
        $data = $response = [];
        $username =  $_POST['username'];
        if (isset($username) && !empty($username)) {
            $model = new \app\models\User;
            $find = $model->find()->where(['email' => $username])->orWhere(['username' => $username])->one();
            //echo $find->createCommand()->getRawSql();die;
            if ($find) {
                $token = sha1(uniqid($find->email, true));
                $find->password_reset_token = $token;
                if ($find->save()) {
                    //echo $find->email;die;                    
                    $template = \app\models\EmailTemplates::findOne(['id' => 2]);
                    $data = [
                        'template_id' => 2,
                        'to' => $find->email,
                        'name' => isset($find->name) ? $find->name : $find->username,
                        'url' => Yii::$app->params['siteUrl'] . "/reset-password/" . $token,
                        'ip' => $_SERVER['SERVER_ADDR'],
                        'body' => $template,
                        'subject' => $template->subject
                    ];
                    if (Yii::$app->common->sendEmail($data)) {
                        $response = [
                            'success' => true,
                            'message' => 'We have sent an email on your registered email address, please click on the given link to reset your password.',
                        ];
                    }
                } else {
                    $response = [
                        'error' => true,
                        'message' => $find->getErrors(),
                    ];
                }
            } else {
                $response = [
                    'error' => true,
                    'message' => "There is no user registered with this email.",
                ];
            }
        } else {
            $response = [
                'error' => true,
                'message' => "There is no user registered with this email.",
            ];
        }
        return $response;
    }

    public function actionCheckPasswordResetToken()
    {
        $data = $response = [];
        $token =  $_POST['token'];

        if (isset($token) && !empty($token)) {
            $find = \app\models\User::find()->where(['password_reset_token' => $token])->one();
            if ($find) {
                $response = [
                    'success' => true,
                ];
            } else {
                $response = [
                    'error' => true,
                    'message' => "Password reset url does not seem to be valid.",
                ];
            }
        } else {
            $response = [
                'error' => true,
                'message' => "Password reset url does not seem to be valid.",
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Delete Document~Users~delete-document~/admin/users~fa fa-user-md
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

    public function actionChangeDefaultLocation()
    {
        if (isset($_POST['location_id']) && !empty($_POST['location_id'])) {
            try {
                $model = new \app\models\User;
                $find = $model->find()->where(['id' => Yii::$app->user->identity->id])->one();
                if ($find) {
                    $find->default_location = $_POST['location_id'];
                    if ($find->save()) {
                        return [
                            'success' => true,
                            'message' => 'Location has been changed successfully.',
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
                        'message' => 'User not found!',
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
                'message' => 'User not found!',
            ];
        }
    }

    public function actionSearchZipcode($zipcode)
    {
        if (isset($zipcode) && !empty($zipcode)) {
            try {
                $find = \app\models\User::find()->select(['users.country_id', 'users.state_id', 'city', 'p_zipcode', 'users.id'])->joinWith(['pcountry pc', 'pstate ps'])->where(['p_zipcode' => $zipcode])->groupBy('p_zipcode')->asArray()->one();
                if ($find) {
                    return [
                        'success' => true,
                        'user' => $find,
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

    public function actionSignup()
    {
        $data = [];
        if (isset($_POST) && !empty($_POST)) {
            $POST['User'] = $_POST['fields'];
            $POST['User']['deleted'] = "N";
            try {
                $transaction = Yii::$app->db->beginTransaction();
                $model = new \app\models\User(['scenario' => 'Registration']);
                $model->load($POST);
                if ($model->load($POST) && $model->validate()) {
                    if ($model->password != $model->confirm_password) {
                        return [
                            'error' => true,
                            'message' => ['confirm_password' => 'Confirm password did not match.'],
                        ];
                    }
                    $model->password_hash = Yii::$app->security->generatePasswordHash($model->password);
                    $model->access_token = Yii::$app->security->generateRandomString();
                    $model->role_id = 15;
                    $model->status = 'Y';
                    $pmodel = new \app\models\Page;
                    $pfind = $pmodel->find()->where(['url' => 'agreement'])->asArray()->one();
                    $content = str_replace('[first_name]', $model->first_name, $pfind['content']);
                    $content = str_replace('[last_name]', $model->last_name, $content);
                    $content = str_replace('[current_date]', date('m-d-Y'), $content);
                    $model->hippa_aggrement = $content;
                    $model->accepted_on = date("Y-m-d H:i:s");
                    if ($model->save()) {
                        $template = \app\models\EmailTemplates::findOne(['id' => 1]);
                        $data = [
                            'template_id' => 1,
                            'to' => [$model->email,Yii::$app->params['supportEmail']],
                            'name' => $model->first_name,
                            'username' => $model->username,
                            'password' => $model->password,
                            'body' => $template,
                            'subject' => $template->subject
                        ];
                        Yii::$app->common->sendEmail($data);
                        $transaction->commit();
                        return [
                            'success' => true,
                            'userDetails' => [
                                'user_id' => $model->id,
                                'username' => $model->username,
                                'name' => $model->first_name,
                                'email' => $model->email,
                                'user_type' => $model->role_id,
                                'token' => $model->access_token,
                                'image' => $model->image,
                            ]
                        ];
                    } else {
                        $transaction->rollBack();
                        return [
                            'error' => true,
                            'message' => $model->getErrors(),
                        ];
                    }
                } else {
                    $transaction->rollBack();
                    return [
                        'error' => true,
                        'message' => $model->getErrors()
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
}
