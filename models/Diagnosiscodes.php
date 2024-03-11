<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Diagnosiscodes extends ActiveRecord
{
    const STATUS_ACTIVE = 'Y';
    public static function tableName()
    {
        return '{{%diagnosis_codes}}';
    }

    public function rules()
    {
        return [
            [['name','code'], 'required'],
            [['name'], 'trim'],
            [['name'], 'unique'],
            [['name', 'code','status'], 'string'],
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
