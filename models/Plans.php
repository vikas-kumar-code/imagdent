<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Plans extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%membership_plans}}';
    }
    
    /* public function init(){
        if($this->isNewRecord){           
            $this->added_on = date("Y-m-d H:i:s");
            $this->updated_on = date("Y-m-d H:i:s");
        }               
    } */

	public function rules()
    {
        return [            
            [['name','duration','price'], 'required'],                        
            [['name'], 'trim'],            
            [['name'], 'unique'],             
            [['name'], 'string'],            
            [['duration'], 'integer'],            
            [['price'], 'number'],                        
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
