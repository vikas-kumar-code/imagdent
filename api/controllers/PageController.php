<?php

namespace app\controllers;

use Yii;
use yii\base\ErrorException;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use yii\web\Controller;
use yii\web\Response;

class PageController extends Controller
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
                'except' => ['get-pages','get-by-name'],
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
            'except' => ['get-pages','get-by-name'],
			'rules' => [
				[				
					'allow' => true,
					'matchCallback' => function ($rule, $action) {												
						return Yii::$app->common->checkPermission('Static Pages',$action->id);						
					}
				],
			],
		];		
		return $behaviors;
    }

    function actionAdd(){							
		try{
			$model = new \app\models\Page;			
			if(isset($_POST) && !empty($_POST)){
                $leftMenu = 'N';
                if(isset($_POST['left_menu']) && !empty($_POST['left_menu'])){
                    $leftMenu = 'Y';
                }				
                $POST['Page'] = $_POST['fields'];                
                $POST['Page']['content'] = $_POST['content'];
                $POST['Page']['left_menu'] = $leftMenu;
                $POST['Page']['url'] = preg_replace('/\s+/', '-', strtolower(trim($POST['Page']['page_title'])));  
                if(isset($POST['Page']['id']) && !empty($POST['Page']['id'])){                      
                    $find = $model->findOne($POST['Page']['id']); 
                    if($find && $find->load($POST) && $find->save()){ 
                        return [
                            'success'=>true,
                            'message'=>'Page updated successfully.'
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
                    //$model->sequence = $model->id;
                    $model->save();
                    return [
                        'success'=>true,
                        'message'=>'Page added successfully.'
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

    public function actionList($parent_id = 0, $pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'top_navigation' => [
                    'asc' => ['static_content.top_navigation' => SORT_ASC],
                    'desc' => ['static_content.top_navigation' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],
                'sequence' => [
                    'asc' => ['static_content.sequence' => SORT_ASC],
                    'desc' => ['static_content.sequence' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],
                
            ],
            'defaultOrder' => ['top_navigation' => SORT_DESC,'sequence' => SORT_ASC],
        ]);

        $model = new \app\models\Page;
        $query = $model->find()->joinWith(['parent as p','children c'=>function($q){$q->orderBy('c.sequence asc');}])->where(['static_content.parent_id'=>$parent_id]);
        
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'static_content.name', $search->name]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        if($find){
            $response = [
                'success'=>true,
                'contents'=>$find,
                'pages'=>$pages
            ];           
        }
        else{
            $response = [
                'success'=>true,
                'contents'=>[],  
                'pages'=>$pages              
            ];
        }
        return $response;
    }

    public function actionGetOne($id)
    {        
        if(isset($id) && !empty($id)){
            try{
                $model = new \app\models\Page;
                $find = $model->find()->joinWith(['parent p'])->where(['static_content.id'=>$id])->asArray()->one();
                //echo $find->createCommand()->getRawSql();die;
                if($find){
                    return [
                        'success'=>true,
                        'content'=>$find
                    ];
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>'Page not found!'
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
                'message'=>'Page not found!'
            ];
        }
    }

    public function actionGetByName($url, $first_name=null, $last_name=null)
    {        
        if(isset($url) && !empty($url)){
            try{
                $model = new \app\models\Page;
                $find = $model->find()->where(['url'=>$url])->asArray()->one();
                if(isset($first_name) && !empty($first_name) && isset($last_name) && !empty($last_name))
                {
                    $content = str_replace('[first_name]', $first_name, $find['content']);
                    $content = str_replace('[last_name]', $last_name, $content);
                    $content = str_replace('[current_date]', date('m-d-Y'), $content);
                    $find['content'] = $content;
                }
                if($find){
                    return [
                        'success'=>true,
                        'content'=>$find
                    ];
                }
                else{
                    return [
                        'error'=>true,
                        'message'=>'Page not found!'
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
                'message'=>'Page not found!'
            ];
        }
    }

    public function actionDelete()
    {               
        if(isset($_POST['id']) && !empty($_POST['id'])){            
            try{
                $model = new \app\models\Page;
                $find = $model->find()->where(['id'=>$_POST['id']])->one();
                if($find){                    
                    if($find->delete()){
                        return [
                            'success'=>true,
                            'message'=>'Page has been deleted successfully.'
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
                        'message'=>'Page not found!'
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
                'message'=>'Category not found!'
            ];
        }
    }

    public function actionGetParentPages()
    {        
        try{
            $model = new \app\models\Page;
            $find = $model->find()->where(['parent_id'=>0])->orderBy('name')->asArray()->all();
            return [
                'success'=>true,
                'pages'=>$find
            ];
        }
        catch(\Exception $e){
            return [
                'error'=>true,
                'message' => Yii::$app->common->returnException($e),
            ];													
        }
    }

    public function actionGetPages()
    {        
        try{
            $model = new \app\models\Page;
            $find = $model->find()->joinWith(['children as c'=>function($q){$q->orderBy('c.sequence');}])->where(['static_content.parent_id'=>0,'static_content.top_navigation'=>1])->orderBy('static_content.sequence')->asArray()->all();
            return [
                'success'=>true,
                'pages'=>$find
            ];
        }
        catch(\Exception $e){
            return [
                'error'=>true,
                'message' => Yii::$app->common->returnException($e),
            ];													
        }
    }

    public function actionUpdateSequence()
    { 
        if (isset($_POST['pages']) && !empty($_POST['pages'])) {
            try {
                $update = 0;
                foreach($_POST['pages'] as $key=>$val){
                    $model = new \app\models\Page;
                    $find = $model->find()->where(['id' => $val['id']])->one();
                    if($find){
                        $find->sequence = $key;
                        if($find->save()){
                            $update++;
                        }
                    }
                }
                if($update > 0){
                    return [
                        'success' => true,
                        'message' => 'Order updated successfully.',
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
                'message' => 'Page not found!',
            ];
        }

    }

    public function actionGetImages($pageSize = 50)
    {
        $response = [];
        $data = [];

        $sort = new \yii\data\Sort([
            'attributes' => [
                'added_on' => [
                    'asc' => ['added_on' => SORT_ASC],
                    'desc' => ['added_on' => SORT_DESC],
                    'default' => SORT_DESC,                    
                ],
                
            ],
            'defaultOrder' => ['added_on' => SORT_DESC],
        ]);

        $model = new \app\models\Images;
        $query = $model->find();
        
        $search = new \app\models\SearchForm;
        $GET['SearchForm'] = isset($_GET['fields'])?json_decode($_GET['fields'], true):[];
        if ($search->load($GET)) {
            if (!empty($search->name)) {
                $query->andWhere(['LIKE', 'name', $search->name]);
            }
        }

        $countQuery = clone $query;

        $pages = new \yii\data\Pagination(['totalCount' => $countQuery->count()]);
        $pages->pageSize = $pageSize;
        $find = $query->offset($pages->offset)->limit($pages->limit)->orderBy($sort->orders)->asArray()->all();
        $response = [
            'success'=>true,
            'images'=>$find,
            'pages'=>$pages
        ];
        return $response;
    }

    public function actionDeleteImage()
    {               
        if(isset($_POST['id']) && !empty($_POST['id'])){            
            try{
                $model = new \app\models\Images;
                $find = $model->find()->where(['id'=>$_POST['id']])->one();
                if($find){                    
                    if($find->delete()){
                        return [
                            'success'=>true,
                            'message'=>'Image has been deleted successfully.'
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
                        'message'=>'Image not found!'
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
                'message'=>'Image not found!'
            ];
        }
    }
    //15092021
}
