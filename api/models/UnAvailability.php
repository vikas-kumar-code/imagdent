<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class UnAvailability extends ActiveRecord{    
         
    public static function tableName(){
        return '{{%un_availability}}';
    }
    
	public function rules()
    {
        return [            
            [['user_id','location_id','appointment_date'], 'required'],           
            [['user_id','location_id','full_day_off'], 'integer'],            
            [['appointment_date'], 'safe'],  
            [['from_time','to_time'], 'safe'], 
            [['subject'], 'string'],                       
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'user_id' => Yii::t('app', 'User'),
            'location_id' => Yii::t('app', 'Location'),
            'appointment_date' => Yii::t('app', 'Date'),
            'from_time' => Yii::t('app', 'Start Time'),
            'to_time' => Yii::t('app', 'End Time'),
            'subject' => Yii::t('app', 'Subject'),
        ];
    }
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
    public function getLocation()
    {
        return $this->hasOne(Locations::className(), ['id' => 'location_id']);
    }
   
    	
}
