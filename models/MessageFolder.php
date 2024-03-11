<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class MessageFolder extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%message_folder}}';
    }
    
    public function rules()
    {
        return [            
            [['user_id','message_id','folder'], 'required'],             
            [['read_message'], 'string'],                      
            [['user_id','message_id','folder','deleted_folder'], 'integer'],
            [['added_on'], 'safe'],
        ];
    }   
    
    public function getMessage(){
		return $this->hasOne(Messages::className(), ['id' => 'message_id']);
    }

    public function getUser(){
		  return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    
}
