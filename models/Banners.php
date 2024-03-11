<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Banners extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%banners}}';
    }
    

	public function rules()
    {
        return [            
            [['file_name'], 'required'],                        
            [['file_name'], 'trim'],            
            [['file_name'], 'unique'],             
            [['file_name','link','html'], 'string'],            
            [['sequence'], 'integer'],                   
        ];
    }
    	
}
