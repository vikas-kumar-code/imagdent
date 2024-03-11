<?php

namespace app\models;

use Yii;


class Faq extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%faq}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['question','answer'], 'required'],
            [['question'], 'trim'],
            //['name', 'unique', 'targetAttribute' => ['name', 'parent_id'],'message'=>'Page name has already been used.'],
            [['question'], 'unique'],
            [['answer', 'question'], 'string'],
        ];
    }

}
