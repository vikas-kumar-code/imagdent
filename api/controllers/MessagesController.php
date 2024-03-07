<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
//use yii\swiftmailer\Mailer;
use yii\web\Controller;
use yii\web\Response;

class MessagesController extends Controller
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
            'except' => ['get-new-messages-count'],
            'rules' => [
                [
                    'allow' => true,
                    'matchCallback' => function ($rule, $action) {
                        return Yii::$app->common->checkPermission('Messages', $action->id);
                    },
                ],
            ],
        ];
        return $behaviors;
    }

    //Label~Module~Action~Url~Icon:Send Message~Messages~send~/admin/messages~fa fa-envelope
    public function actionSend(){
        if(isset($_POST) && !empty($_POST)){
            $transaction = Yii::$app->db->beginTransaction();
            try{   
                $model = new \app\models\Messages;
                $POST['Messages'] = $_POST['fields'];
                $POST['Messages']['user_id'] = Yii::$app->user->identity->id;

                if(isset($_POST['recipients']) && !empty($_POST['recipients'])){
                    if($model->load($POST) && $model->validate()){                    
                        if(isset($_POST['attachments']) && !empty($_POST['attachments'])){                
                            $attachments = [];
                            $i = 0;
                            foreach($_POST['attachments'] as $attachment){       
                                if(file_exists($_SERVER['DOCUMENT_ROOT']."/documents/temp/".$attachment)){ 
                                    $file_details = pathinfo($attachment);
                                    $new_file_name = mt_rand(111111,999999)."-".Yii::$app->user->identity->id.".".$file_details['extension'];
                                    copy($_SERVER['DOCUMENT_ROOT']."/documents/temp/".$attachment,$_SERVER['DOCUMENT_ROOT']."/documents/".$new_file_name);
                                    unlink($_SERVER['DOCUMENT_ROOT']."/documents/temp/".$attachment);
                                    $attachments[$i] = ['type'=>$file_details['extension'],'name'=>$new_file_name];
                                    $i++;                                          
                                }
                            } 
                            $model->attachments = json_encode($attachments);
                        }
                        if($model->save()){
                            foreach($_POST['recipients'] as $key => $recipient){
                                //print_r($recipient);die;
                                $smodel = new \app\models\MessageFolder;                          
                                $smodel->user_id = $recipient['value'];
                                $smodel->message_id = $model->id;
                                $smodel->folder = 1;
                                $smodel->save();

                                    $smodel = new \app\models\MessageFolder;                          
                                    $smodel->user_id = $model->user_id;
                                    $smodel->message_id = $model->id;
                                    $smodel->folder = 2;
                                    $smodel->save();
                                
                            }
                            if(isset($_POST['case_id']) && !empty($_POST['case_id'])){
                                $lmodel = new \app\models\CaseLog;
                                $lmodel->addLog($_POST['case_id'], "Message has been sent");   
                                
                                if(isset($POST['Messages']['Cc']) && !empty($POST['Messages']['Cc'])){
                                    $umodel = new \app\models\User;
                                    $ufind = $umodel->findOne(['email'=>$POST['Messages']['Cc']]);
                                    if($ufind){
                                        $smodel = new \app\models\MessageFolder;                          
                                        $smodel->user_id = $ufind->id;
                                        $smodel->message_id = $model->id;
                                        $smodel->folder = 1;
                                        $smodel->save();
                                    }
                                    else{
                                        $template = \app\models\EmailTemplates::findOne(['id' => 11]);
                                        $data = [
                                            'template_id' => 11,
                                            'to' => $POST['Messages']['Cc'],
                                            'body' => $template,
                                            'subject' => $template->subject,
                                            'url' => Yii::$app->params['siteUrl'],
                                            'body' => $template,
                                        ];
                                        Yii::$app->common->sendEmail($data);
                                    }
                                }
                            }
                            $transaction->commit();
                            return [
                                'success'=>true,
                                'message' => "Message has been sent successfully.",	
                            ];
                        }                                                
                    }
                    else{
                        return [
                            'error'=>true,
                            'message'=>$model->getErrors()
                        ];
                    }                     
                }             
            }
            catch(\Exception $e){
                $transaction->rollBack();
                return [
                    'error'=>true,
                    'message' => $this->returnException($e),	
                ];													
			}
        }
    }
    
    //Label~Module~Action~Url~Icon:Inbox~Messages~inbox~/admin/messages~fa fa-envelope
    public function actionInbox($pageSize = 50)
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [                
                'messages.added_on' => [
                    'asc' => ['messages.added_on' => SORT_ASC],
                    'desc' => ['messages.added_on' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],                
            ],
            'defaultOrder' => ['messages.added_on' => SORT_DESC],
        ]);

        //=>function($q){$q->groupBy('user_id');}
        $model = new \app\models\MessageFolder;
        //$query = $model->find()->joinWith(['message.folders mf', 'message.folders.user'=>function($q){$q->select(Yii::$app->params['user_table_select_columns_new']);}])->where(['message_folder.user_id'=>Yii::$app->user->identity->id,'message_folder.folder'=>1])->groupBy('message_id');

        $query = $model->find()->joinWith(['message.folders mf', 'message.folders.user'])->where(['message_folder.user_id'=>Yii::$app->user->identity->id,'message_folder.folder'=>1])->groupBy('message_id');
                
        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if($find){
            foreach($find as $key=>$val){
                $folders = [];
                foreach($val['message']['folders'] as $k=>$v){
                    if($v['folder'] == "2"){
                        $folders[] = $v;
                    }
                }
                $find[$key]['message']['folders'] = $folders;
            }
            $response = [
                'success'=>true,
                'folders'=>$find,
                'pages'=>$pages,
                'pageCount'=>$pages->pageCount	
            ];
        }
        else{
            $response = [
                'success'=>true,
                'folders'=>[],
                //'pages'=>$pages,
                //'pageCount'=>$pages->pageCount	
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Sent Messages~Messages~sent~/admin/messages~fa fa-envelope
    public function actionSent($pageSize = 50)
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [                
                'messages.added_on' => [
                    'asc' => ['messages.added_on' => SORT_ASC],
                    'desc' => ['messages.added_on' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],                
            ],
            'defaultOrder' => ['messages.added_on' => SORT_DESC],
        ]);

        $model = new \app\models\MessageFolder;
        $query = $model->find()->joinWith(['message.folders mf', 'message.folders.user'])->where(['message_folder.user_id'=>Yii::$app->user->identity->id,'message_folder.folder'=>2])->groupBy('message_id');
                
        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if($find){
            foreach($find as $key=>$val){
                $folders = [];
                if(isset($val['message']['folders'])){
                    foreach($val['message']['folders'] as $k=>$v){
                        if($v['folder'] == "1"){
                            $folders[] = $v;
                        }
                    }
                    $find[$key]['message']['folders'] = $folders;
                }
            }
            $response = [
                'success'=>true,
                'folders'=>$find,
                'pages'=>$pages,
                'pageCount'=>$pages->pageCount	
            ]; 
        }
        else{
            $response = [
                'success'=>true,
                'folders'=>[],
                //'pages'=>$pages,
                //'pageCount'=>$pages->pageCount	
            ];
        }
        return $response;
    }

    //Label~Module~Action~Url~Icon:Trash Messages~Messages~trash~/admin/messages~fa fa-envelope
    public function actionTrash($pageSize = 50)
    {
        $response = [];
        $sort = new \yii\data\Sort([
            'attributes' => [                
                'messages.added_on' => [
                    'asc' => ['messages.added_on' => SORT_ASC],
                    'desc' => ['messages.added_on' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],                
            ],
            'defaultOrder' => ['messages.added_on' => SORT_DESC],
        ]);

        $model = new \app\models\MessageFolder;
        $query = $model->find()->joinWith(['message.folders mf', 'message.folders.user'])->where(['message_folder.user_id'=>Yii::$app->user->identity->id,'message_folder.folder'=>3])->groupBy('message_id');
                
        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        //echo $find->createCommand()->getRawSql();die;
        if($find){
            foreach($find as $key=>$val){
                $folders = [];
                foreach($val['message']['folders'] as $k=>$v){
                    if($val['deleted_folder'] == "1"){
                        if($v['folder'] == "2"){
                            $folders[] = $v;
                        }
                    } else if($val['deleted_folder'] == "2"){
                        if($v['folder'] == "1"){
                            $folders[] = $v;
                        }
                    }
                }
                $find[$key]['message']['folders'] = $folders;
            }
        }
        $response = [
            'success'=>true,
            'folders'=>$find,
            'pages'=>$pages,
            'pageCount'=>$pages->pageCount	
        ]; 
        return $response;
    }
    

    //Label~Module~Action~Url~Icon:Get Message~Messages~get~/admin/messages~fa fa-envelope
    public function actionGet($id,$folder)
    {        
        if(isset($id) && !empty($id)){
            try{
                $model = new \app\models\Messages;
                $find = $model->find()->joinWith(['user' => function ($q) {$q->select(['users.id', 'prefix','first_name','middle_name','last_name','suffix', 'username', 'image']);}])->where(['messages.id'=>$id])->asArray()->one();
                //echo $find->createCommand()->getRawSql();die;
                if($find){               
                    //$find['attachments'] = unserialize($find['attachments']);  
                    if($folder == "I"){
                        $fmodel = new \app\models\MessageFolder;
                        $ffind = $fmodel->find()->where(['message_id'=>$id,'folder'=>1])->one(); 
                        if($ffind){
                            $ffind->read_message = "Y";
                            $ffind->save();
                        }
                    }
                    return [
                        'success'=>true,
                        'message'=>$find,
                        'recipients'=>\app\models\MessageFolder::find()->joinWith(['user' => function ($q) {$q->select(['users.id', 'prefix','first_name','middle_name','last_name','suffix', 'username', 'image','email']);}])->where(['message_id'=>$id,'folder'=>2])->asArray()->all()
                    ];
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>'Content not found!'
                    ];
                }
            }
			catch(\Exception $e){
                return [
                    'error'=>true,
                    'message' => $this->returnException($e),	
                ];													
			}
        }
        else{
            return [
                'error'=>true,
                'message'=>'Message not found!'
            ];
        }
    }

    //Label~Module~Action~Url~Icon:Delete Message~Messages~delete~/admin/messages~fa fa-envelope
    public function actionDelete()
    {    
        $response = [];           
        if(isset($_POST) && !empty($_POST)){                        
            try{
                $POST['Messages'] = $_POST['fields'];
                $model = new \app\models\MessageFolder;
                foreach($POST['Messages']['id'] as $id){
                    $find = $model->find()->where(['message_id'=>$id,'user_id'=>Yii::$app->user->identity->id])->andWhere(['!=','folder',3])->one();
                    $folder = $find->folder;
                    if($find){   
                        $find->folder = 3;
                        $find->deleted_folder=$folder;
                        if($find->update()){
                            $response = [
                                'success' => true,
                                'message' => 'Message has been deleted successfully'
                            ];
                        }                 
                    }
                    else{
                        $response = [
                            'error'=>true,
                            'message'=>'Message not found!'
                        ];
                    }
                }                                           
  
            }
			catch(\Exception $e){
                $response = [
                    'error'=>true,
                    'message' => $this->returnException($e),	
                ];													
			}
        }
        else{
            $response = [
                'error'=>true,
                'message'=>'Message not found!'
            ];
        }
        return $response;
    }

    public function actionGetNewMessagesCount()
    {
        $response = [];
        $model = new \app\models\MessageFolder;
        $find = $model->find()->select("count(*) as total")->where(['user_id' => Yii::$app->user->identity->id,'folder'=>1,'read_message'=>'N'])->asArray()->one();
        $response = [
            'success' => true,
            'totalNewMessages' => $find,
        ];
        return $response;
    }
}