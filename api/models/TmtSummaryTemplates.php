<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "tbl_pages".
 *
 * @property integer $id
 * @property string $name
 * @property string $content
 */
class TmtSummaryTemplates extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%tmt_summary_templates}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'content'], 'required'],
            [['name'], 'trim'],
            [['name'], 'unique'],
            [['name', 'content'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'content' => 'Content',
        ];
    }
}
