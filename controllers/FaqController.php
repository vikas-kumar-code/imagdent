<?php

namespace app\controllers;

use Yii;
use yii\base\ErrorException;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use yii\web\Controller;
use yii\web\Response;

class FaqController extends Controller
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
                'except' => ['get-one','list'],
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
            'except' => ['get-one','list'],
			'rules' => [
				[				
					'allow' => true,
					'matchCallback' => function ($rule, $action) {												
						return Yii::$app->common->checkPermission('Faq',$action->id);						
					}
				],
			],
		];		
		return $behaviors;
    }

    function actionAdd(){							
		try{
			$model = new \app\models\Faq;			
			if(isset($_POST) && !empty($_POST)){				
                $POST['Faq'] = $_POST['fields']; 
                //$POST['Faq']['url'] = preg_replace('/\s+/', '-', strtolower(trim($POST['Faq']['question'])));  
                if(isset($POST['Faq']['id']) && !empty($POST['Faq']['id'])){                      
                    $find = $model->findOne($POST['Faq']['id']); 
                    if($find && $find->load($POST) && $find->save()){ 
                        return [
                            'success'=>true,
                            'message'=>'Faq updated successfully.'
                        ];                    
                    }
                    else{
                        return [
                            'error'=>true,
                            'message'=> $find->getErrors()
                        ];
                    }											
                }
                else if($model->load($POST) && $model->save()){ 
                    return [
                        'success'=>true,
                        'message'=>'Faq added successfully.'
                    ];					
                }	
                else{
                    return [
                        'error'=>true,
                        'message'=> $model->getErrors()
                    ];
                }			
			}						
		}
		catch(\Exception $e){
			return [
                'error'=>true,
                'message' => Yii::$app->common->returnException($e),
            ];
		}		
	}

    public function actionList($pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'question' => [
                    'asc' => ['question' => SORT_ASC],
                    'desc' => ['question' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],
                
            ],
            'defaultOrder' => ['question' => SORT_ASC],
        ]);

        $model = new \app\models\Faq;
        $query = $model->find();
        
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'question', $search->name]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if($find){
            $response = [
                'success'=>true,
                'faqs'=>$find,
                'pages'=>$pages
            ];           
        }
        else{
            $response = [
                'success'=>true,
                'faqs'=>[],  
                'pages'=>$pages              
            ];
        }
        return $response;
    }

    public function actionGetOne($id)
    {        
        if(isset($id) && !empty($id)){
            try{
                $model = new \app\models\Faq;
                $find = $model->find()->where(['id'=>$id])->asArray()->one();
                //echo $find->createCommand()->getRawSql();die;
                if($find){
                    return [
                        'success'=>true,
                        'faq'=>$find
                    ];
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>'Question not found!'
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
                'message'=>'Faq not found!'
            ];
        }
    }


    public function actionDelete()
    {               
        if(isset($_POST['id']) && !empty($_POST['id'])){            
            try{
                $model = new \app\models\Faq;
                $find = $model->find()->where(['id'=>$_POST['id']])->one();
                if($find){                    
                    if($find->delete()){
                        return [
                            'success'=>true,
                            'message'=>'Faq has been deleted successfully.'
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
                        'message'=>'Faq not found!'
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
                'message'=>'Faq not found!'
            ];
        }
    }

}
