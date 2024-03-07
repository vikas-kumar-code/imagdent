<?php

namespace app\modules\admin\controllers;
use Yii;

use yii\web\Controller;
use app\models\Questions;
/**
 * Default controller for the `admin` module
 */
class FormController extends Controller
{
    public $enableCsrfValidation = false;
    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionAdd()
    {
        $data = $response = [];		
		$data["title"] = 'Add Form';
        $data['model'] = $model = new Questions();
        return $this->render('add', $data);
    }

    function actionSave($id = NULL){
		$data = $response = [];
        $data['model'] = $model = new Questions();					
        if($model->load(Yii::$app->request->post()) && Yii::$app->request->isAjax){
            try{
                
                $transaction = \Yii::$app->db->beginTransaction();
                $model->form_html = (isset($_POST['html_data']))?$_POST['html_data']:null;
                $model->form_json = (isset($_POST['formData']))?$_POST['formData']:null;

                if(isset($_POST['formData']) && !empty(json_decode($_POST['formData'], true)) && $model->validate() && $model->save()){
                    $response['success'] = true;
                    $transaction->commit();
                }
                else{
                    $response['errors'] = $model->getErrors();
                    $response['error'] = true;
                    $response['error_msg'] = "Invalid records entered.";
                    $transaction->rollBack();
                }

            }
            catch(\Exception $e){
                $response['error'] = true;
                $response['error_msg'] = $e->getMessage();
                $transaction->rollBack();
            }
            return json_encode($response);
        }
		
	}
}
