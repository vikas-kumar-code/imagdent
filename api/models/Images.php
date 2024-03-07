<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Images extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%images}}';
    }
    

	public function rules()
    {
        return [            
            [['file_name'], 'required'],                        
            [['file_name'], 'trim'],            
            [['file_name'], 'unique'],             
            [['file_name'], 'string'],            
            [['added_on'], 'safe'],              
        ];
    }
    	
}
