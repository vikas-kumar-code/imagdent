<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Reasons extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%reasons}}';
    }

    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'trim'],
            [['name'], 'unique'],
            [['name'], 'string'],
            [['parent_id'], 'integer'],
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

    public function getChildren()
    {
        return $this->hasMany(Reasons::className(), ['parent_id' => 'id'])->orderBy("name");
    }

    /* public function getSubchildren()
{
return $this->hasMany(Reasons::className(), ['parent_id' => 'id'])->orderBy("name");
} */
}
