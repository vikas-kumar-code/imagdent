<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class EmpanelledCompanies extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%empanelled_companies}}';
    }

    public function rules()
    {
        return [
            [['user_id', 'company_id'], 'required'],
            [['user_id', 'company_id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'user_id' => Yii::t('app', 'User ID'),
        ];
    }

}
