<?php

namespace app\models;

use yii\db\ActiveRecord;

class LocationPrice extends ActiveRecord
{

    public static function tableName()
    {

        return '{{%price_with_location}}';

    }

    public function rules()
    {

        return [

            [['service_id', 'location_id'], 'required'],

            [['service_id', 'location_id'], 'integer'],
            [['service_id', 'location_id', 'price'], 'number'],

        ];

    }

}
