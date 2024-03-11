<?php

namespace app\controllers;

use app\models\ContactForm;
use app\models\LoginForm;
use Yii;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\web\Controller;
use yii\web\Response;

class SiteController extends Controller
{
    public $enableCsrfValidation = false;
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        //phpinfo();
        return $this->render('index');
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }

        $model->password = '';
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    public function actionDownload($file = null)
    {
        if($file != null){
            $model = new \app\models\Documents;
            $find = $model->find()->where(['document_name'=>$file])->one();
            if($find){
                return Yii::$app->response->sendFile($_SERVER['DOCUMENT_ROOT'] . "/documents/".$file, $find->document_name_original);
            }
        }
        
        //exec('wget http://imagdent.com/documents/415359-2.inv');
    }

    public function actionAddModuleAction()
    {
        echo "<pre>";
        $msg = "";
        $controllers = \yii\helpers\FileHelper::findFiles(Yii::getAlias('@app/controllers'), ['recursive' => true]);
        //print_r($controllers);die;
        foreach ($controllers as $controller) {
            $cNameArr = explode('/', $controller);
            if ($cNameArr[count($cNameArr) - 1] != "SiteController.php") {
                $contents = file_get_contents($controller);
                //print_r($contents);die;
                #get all action function file in individual controllers
                preg_match_all('/Label~Module~Action(.*)/', $contents, $label_module_action);
                if (isset($label_module_action[0]) && !empty($label_module_action[0])) {
                    foreach ($label_module_action[0] as $lma) {
                        $function_details = explode(":", $lma);
                        $function_details = explode("~", $function_details[1]);
                        $module_name = trim($function_details[1]);
                        $action_label_name = trim($function_details[0]);
                        $action_name = trim($function_details[2]);
                        $url = trim($function_details[3]);
                        $icon = trim($function_details[4]);

                        $model = new \app\models\ModuleActions;
                        $msg .= "<br/>" . $model->find()->where(['module_name' => $module_name, 'action_label_name' => $action_label_name, 'action_name' => $action_name])->createCommand()->getRawSql() . "<br/>";

                        $find = $model->find()->where(['module_name' => $module_name, 'action_label_name' => $action_label_name, 'action_name' => $action_name])->one();
                        if ($find) {
                            $msg .= "Found - Updating<br/>";
                            $find->module_name = $module_name;
                            $find->action_label_name = $action_label_name;
                            $find->action_name = $action_name;
                            $find->url = $url;
                            $find->icon = $icon;
                            $find->save();
                        } else {
                            $msg .= "Not found - Inserting<br/>";
                            $model->module_name = $module_name;
                            $model->action_label_name = $action_label_name;
                            $model->action_name = $action_name;
                            $model->url = $url;
                            $model->icon = $icon;
                            $model->save();
                        }
                    }
                }
            }
        }
        die($msg);
    }

    public function actionReceiveSms()
    {
        $post = print_r($_POST, true);
        mail('opnsrc.devlpr@gmail.com', 'Incomming sms details', $post);
    }

    public function actionD()
    {
        return \Yii::$app->response->sendFile($_SERVER['DOCUMENT_ROOT'] . "/api/web/reports/end-of-the-day.pdf");
    }

    /* public function actionPatientCheckedIn(){
        $model = new \app\models\CaseLog;
        $find = $model->find()->where(['LIKE', 'title', 'Patient checked in'])->all();
        foreach($find as $f){
            $cmodel = new \app\models\Cases;
            $ffind = $cmodel->findOne(['id'=>$f->case_id]);
            if($ffind){
                $ffind->patient_checked_in = $f->added_on;
                if($ffind->save()){
                    echo $f->case_id." Saved";
                }

            }
        }

    } */
}
