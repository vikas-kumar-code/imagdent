<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "countries".
 *
 * @property int $id
 * @property string $name
 * @property string $code
 */
class Countries extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'countries';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [            
            [['id'], 'integer'],
            [['name', 'code','country_code','flag'], 'string', 'max' => 255],                        
        ];
    }
    
    public function getStates(){
		return $this->hasMany(States::className(), ['country_id' => 'id']);
    }
}
