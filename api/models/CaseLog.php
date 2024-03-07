<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class CaseLog extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%case_log}}';
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
            [['case_id','added_by','title'], 'required'],
            [['title','message'], 'string'],
            [['case_id','added_by'], 'integer'],
            [['added_on'], 'safe'],
        ];
    }

    public function getAddedby()
    {
        return $this->hasOne(User::className(), ['id'=>'added_by']);
    }
    public function addLog($case_id, $title, $message = null){
        //$model = new \app\models\CaseLog;
        $this->case_id = $case_id;
        $this->added_by = Yii::$app->user->identity->id;
        $this->title = $title;
        $this->message = $message;
        if($this->validate()){
            $this->save();
        }
    }
}
