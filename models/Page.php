<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "tbl_pages".
 *
 * @property integer $id
 * @property string $name
 * @property string $url
 * @property string $content
 */
class Page extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%static_content}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name', 'url', 'page_title'], 'trim'],
            [['parent_id','sequence','top_navigation'], 'integer'],
            //['name', 'unique', 'targetAttribute' => ['name', 'parent_id'],'message'=>'Page name has already been used.'],
            [['name','page_title'], 'unique'],
            [['content', 'page_title', 'meta_keyword', 'meta_description', 'meta_info'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Page Name',
            'url' => 'Url',
            'content' => 'Page Content',
            'page_title' => 'Page Title',
            'meta_keyword' => 'Meta Keyword',
            'meta_description' => 'Meta Description',
            'meta_info' => 'Meta Information',
        ];
    }

    public function getChildren(){
        return $this->hasMany(Page::className(), ['parent_id' => 'id']);
    }

    public function getParent()
    {
        return $this->hasOne(Page::className(), ['id' => 'parent_id']);
    }
}
