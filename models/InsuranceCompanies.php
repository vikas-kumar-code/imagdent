<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class InsuranceCompanies extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%insurance_companies}}';
    }

    public function init()
    {
        if ($this->isNewRecord) {
            $this->added_on = date("Y-m-d H:i:s");
        }
    }

    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'trim'],
            [['name'], 'unique'],
            [['name'], 'string'],
            [['added_on'], 'safe'],
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
