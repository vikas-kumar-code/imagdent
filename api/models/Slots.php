<?php
namespace app\models;

use yii\db\ActiveRecord;

class Slots extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%time_slots}}';
    }

    public function rules()
    {
        return [
            [['location_id', 'from_time', 'to_time', 'day_index'], 'required'],
            [['day_index'], 'integer'],
            [['from_time', 'to_time'], 'safe'],
            //[['BirthDate'], 'safe'],
        ];
    }
    public function getLocation()
    {
        return $this->hasMany(Locations::className(), ['id' => 'location_id']);
    }
}
