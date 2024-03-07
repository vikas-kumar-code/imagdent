<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "module_actions".
 *
 * @property integer $id
 * @property string $module_name
 * @property string $action_label_name
 * @property string $action_name
 * @property string $added_on
 */
class ModuleActions extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'module_actions';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['module_name', 'action_label_name', 'action_name'], 'required'],
            [['added_on'], 'safe'],
            [['module_name', 'action_label_name', 'action_name', 'url', 'icon'], 'trim'],
            [['module_name', 'action_label_name', 'action_name', 'url', 'icon'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'module_name' => 'Module Name',
            'action_label_name' => 'Action Name',
            'action_name' => 'Action Name',
            'date' => 'Date',
        ];
    }

    public function getChildren()
    {
        return $this->hasMany(ModuleActions::className(), ['module_name' => 'module_name']);
    }

}
