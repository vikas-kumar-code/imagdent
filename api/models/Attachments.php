<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Attachments extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%attachments}}';
    }
    
    public function init(){
        if($this->isNewRecord){           
            $this->added_on = date("Y-m-d H:i:s");
            //$this->updated_on = date("Y-m-d H:i:s");
        } 
        else{
            $this->updated_on = date("Y-m-d H:i:s");
        }       
    }

	public function rules()
    {
        return [            
            [['content_id'], 'required'],                                           
            [['file_name','type'], 'string'],                     
            [['added_on'], 'safe'],
        ];
    }

        	
}
