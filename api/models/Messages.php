<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Messages extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%messages}}';
    }
    
    public function init(){
        if($this->isNewRecord){           
            $this->added_on = date("Y-m-d H:i:s");            
        }               
    }

	public function rules()
    {
        return [            
            [['user_id'], 'required'], 
            [['subject'], 'trim'],
            [['subject','message','attachments'], 'string'],                      
            [['user_id','parent_id'], 'integer'],
            [['added_on','updated_on'], 'safe'],
        ];
    }   
    
    public function getUser(){
		return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getFolders(){
		return $this->hasMany(MessageFolder::className(), ['message_id' => 'id']);
    }

    /* public function getInbox(){
        return $this->hasMany(MessageFolder::className(), ['message_id' => 'id'])->where(['message_folder.folder'=>1]);
    }

    public function getSent(){
        return $this->hasMany(MessageFolder::className(), ['message_id' => 'id'])->where(['message_folder.folder'=>2]);
    }

    public function getTrash(){
        return $this->hasMany(MessageFolder::className(), ['message_id' => 'id'])->where(['message_folder.folder'=>3]);
    } */
}
