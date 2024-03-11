<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "{{%questions}}".
 *
 * @property int $id
 * @property string|null $form_json
 * @property string|null $form_html
 * @property string|null $added_on
 */
class Questions extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%questions}}';
    }
    

    public function init()
    {
        if ($this->isNewRecord) {
            $this->added_on = date("Y-m-d H:i:s");
        }
    }

    public function beforeValidate(){
        $this->form_json = json_encode($this->form_json);
        return parent::beforeValidate();
    }
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name','form_json'], 'required'],
            [['name'], 'unique'],
            [['form_json','name'], 'string'],
            [['added_on'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'form_json' => 'Form Json',
            'added_on' => 'Added On',
        ];
    }
}
