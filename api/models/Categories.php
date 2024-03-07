<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Categories extends ActiveRecord{    
    const STATUS = 'Y';
     
    public static function tableName(){
        return '{{%categories}}';
    }
    
    public function init(){
        if($this->isNewRecord){           
            $this->added_on = date("Y-m-d H:i:s");
            $this->updated_on = date("Y-m-d H:i:s");
        } 
        else{
            $this->updated_on = date("Y-m-d H:i:s");
        }       
    }

	public function rules()
    {
        return [            
            [['name'], 'required'],                        
            [['name'], 'trim'],            
            [['name'], 'unique'],            
            [['status'], 'string'],
            [['parent_id'], 'integer'],            
            [['added_on', 'updated_on'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'name' => Yii::t('app', 'Name'),
        ];
    }
    	
}
