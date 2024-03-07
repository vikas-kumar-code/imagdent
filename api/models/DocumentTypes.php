<?php
namespace app\models;

use yii\db\ActiveRecord;

class DocumentTypes extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%document_types}}';
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
            [['name'], 'required'],
            [['name'], 'trim'],
            [['name'], 'unique'],
            [['added_on', 'updated_on'], 'safe'],
        ];
    }

}
