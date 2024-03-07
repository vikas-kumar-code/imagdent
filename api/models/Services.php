<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Services extends ActiveRecord
{
    const STATUS_ACTIVE = 'Y';
    public static function tableName()
    {
        return '{{%services}}';
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
            [['name','code','price'], 'required'],
            [['name'], 'trim'],
            [['name', 'code'], 'unique'],
            [['price'], 'number'],
            [['parent_id', 'sequence', 'note_required'], 'integer'],
            [['name', 'ada_code', 'cpt_code', 'status', 'locations'], 'string'],
            [['added_on', 'updated_on'], 'safe'],
            [['locations'], 'required', 'when' => function ($model) {
                return $model->parent_id != 0 ? true : false;
            }],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'name' => Yii::t('app', 'Name'),
        ];
    }

    public function getLocations()
    {
        return $this->hasMany(LocationPrice::className(), ['service_id' => 'id']);
    }

    public function getParent()
    {
        return $this->hasOne(Services::className(), ['id' => 'parent_id']);
    }

    public function getChild()
    {
        return $this->hasMany(Services::className(), ['parent_id' => 'id']);
    }
}
