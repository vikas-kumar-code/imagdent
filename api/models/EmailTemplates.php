<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "tbl_pages".
 *
 * @property integer $id
 * @property string $subject
 * @property string $content
 */
class EmailTemplates extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%email_templates}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['subject', 'content', 'from_email', 'from_label', 'reply_to_email'], 'required'],
            [['subject'], 'trim'],
            [['subject'], 'unique'],
            [['subject', 'content', 'from_email', 'from_label', 'reply_to_email','sms'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'subject' => 'Subject',
            'content' => 'Content',
        ];
    }
}
