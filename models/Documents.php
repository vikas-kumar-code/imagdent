<?php
namespace app\models;

use yii\db\ActiveRecord;

class Documents extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%documents}}';
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
            [['document_name_original', 'document_name', 'extension', 'uploaded_by'], 'required'],
            [['document_name', 'document_name_original', 'document_type_id', 'extension'], 'string'],
            [['user_id','clinic_id','patient_id','case_id','case_file', 'size'], 'integer'],
            [['added_on'], 'safe'],
        ];
    }

    public function getUploadedby()
    {
        return $this->hasOne(User::className(), ['id'=>'uploaded_by']);
    }
}
