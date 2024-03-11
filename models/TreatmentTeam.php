<?php
namespace app\models;

use yii\db\ActiveRecord;

class TreatmentTeam extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%treatment_team}}';
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
            [['case_id', 'user_id', 'added_by'], 'required'],
            [['case_id', 'user_id', 'added_by'], 'integer'],
            [['added_on'], 'safe'],
        ];
    }

    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
