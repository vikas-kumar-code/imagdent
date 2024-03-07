<?php

namespace app\controllers;

use Yii;
use yii\base\ErrorException;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use yii\web\Controller;
use yii\web\Response;

class TemplateController extends Controller
{

    public $enableCsrfValidation = false;

    public function init()
    {
        parent::init();
        Yii::$app->response->format = Response::FORMAT_JSON;
        \Yii::$app->user->enableSession = false;
        $_POST = json_decode(file_get_contents('php://input'), true);
    }

    public function behaviors(){
        $behaviors = parent::behaviors();
        if($_SERVER['REQUEST_METHOD'] != 'OPTIONS'){
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
						return Yii::$app->common->checkPermission('Email Templates',$action->id);						
					}
				],
			],
		];		
		return $behaviors;
    }

    public function actionAdd(){
        if(isset($_POST) && !empty($_POST)){
            try{
                $model = new \app\models\EmailTemplates;
                $id = isset($_POST['id']) ? $_POST['id'] : "";
                $POST['EmailTemplates'] = $_POST['fields'];                
                $POST['EmailTemplates']['content'] = isset($_POST['content'])?$_POST['content']:"";
                if(isset($id) && !empty($id)){
                    $find = $model->find()->where(['id'=>$id])->one();
                    if($find){                        
                        $find->load($POST);                        
                        if($find->save()){                            
                            return [
                                'success'=>true,
                                'message'=>'Template has been updated successfully.'
                            ];
                        }
                        else{
                            return [
                                'error'=>true,
                                'message'=>$find->getErrors()
                            ];
                        }
                    }
                    else{
                        return [
                            'error'=>true,
                            'message'=>"Template not found."
                        ];
                    }
                }
                else if($model->load($POST) && $model->save()){                     
                    return [
                        'success'=>true,
                        'message'=>"Template has been added successfully."
                    ];                                
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>$model->getErrors()
                    ];
                }
            }
            catch(\Exception $e){
                return [
                    'error'=>true,
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
                'id' => [
                    'asc' => ['id' => SORT_ASC],
                    'desc' => ['id' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],
                'subject' => [
                    'asc' => ['subject' => SORT_ASC],
                    'desc' => ['subject' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],                
            ],
            'defaultOrder' => ['id' => SORT_DESC],
        ]);

        $model = new \app\models\EmailTemplates;
        $query = $model->find()->where("id != 0");
        
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->subject)) {
                $query->andWhere(['LIKE', 'subject', $search->subject]);
            }
        }
        
        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if($find){
            $response = [
                'success'=>true,
                'templates'=>$find,
                'pages'=>$pages
            ];           
        }
        else{
            $response = [
                'success'=>true,
                'templates'=>[],  
                'pages'=>$pages              
            ];
        }
        return $response;
    }

    public function actionGet($id)
    {        
        if(isset($id) && !empty($id)){
            try{
                $model = new \app\models\EmailTemplates;
                $find = $model->find()->where(['id'=>$id])->asArray()->one();
                if($find){
                    return [
                        'success'=>true,
                        'template'=>$find
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
                    'message' => Yii::$app->common->returnException($e),	
                ];													
			}
        }
        else{
            return [
                'error'=>true,
                'message'=>'Content not found!'
            ];
        }
    }

    public function actionDelete()
    {               
        if(isset($_POST['id']) && !empty($_POST['id'])){            
            try{
                $model = new \app\models\EmailTemplates;
                $find = $model->find()->where(['id'=>$_POST['id']])->one();
                if($find){                    
                    if($find->delete()){
                        return [
                            'success'=>true,
                            'message'=>'Template has been deleted successfully.'
                        ];
                    }
                    else{
                        return [
                            'error'=>true,
                            'message'=>$find->getErrors()
                        ];
                    }                    
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>'Template not found!'
                    ];
                }
            }
			catch(\Exception $e){
                return [
                    'error'=>true,
                    'message' => Yii::$app->common->returnException($e),
                ];													
			}
        }
        else{
            return [
                'error'=>true,
                'message'=>'Content not found!'
            ];
        }
    }
}
