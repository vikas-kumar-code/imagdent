<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Build extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%build}}';
    }
    

	public function rules()
    {
        return [            
            [['version_name'], 'trim'],          
            [['version_code'], 'required'],                        
        ];
    }
    	
}
