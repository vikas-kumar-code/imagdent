<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "tbl_state".
 *
 * @property integer $state_id
 * @property integer $country_id
 * @property string $state
 * @property string $state_code
 */
class States extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName(){
        return '{{%states}}';
    } 
		
	/**
     * @inheritdoc
     */
    public function rules(){
        return [
            [['state_id', 'country_id'], 'integer'],
            [['state', 'state_code'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels(){
        return [
            'state_id' => 'State ID',
            'country_id' => 'Country ID',
            'state' => 'State',
            'state_code' => 'State Code',
        ];
    }
}
