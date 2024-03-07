<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Notes extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%notes}}';
    }

    public function init()
    {
        if ($this->isNewRecord) {
            $this->added_on = date("Y-m-d H:i:s");
            $this->updated_on = date("Y-m-d H:i:s");
        }
    }

    public function rules()
    {
        return [
            [['note_type','notes'], 'required'],
            [['user_id','clinic_id','patient_id','case_id','added_by'], 'integer'],
            [['notes'], 'string'],
            [['added_on', 'updated_on'], 'safe'],
        ];
    }
    
    public function getAddedby()
    {
        return $this->hasOne(User::className(), ['id' => 'added_by']);
    }
}
