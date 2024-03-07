<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Locations extends ActiveRecord
{
    const STATUS_ACTIVE = 'Y';
    public static function tableName()
    {
        return '{{%locations}}';
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
            [['legal_name','publish_name','country_id','state_id','Zipcode'], 'required'],
            [['legal_name','publish_name'], 'trim'],
            [['legal_name','publish_name'], 'unique'],
            [['country_id','state_id','ein','npi'], 'integer'],
            [['email'], 'email'],
            [['fb_url'], 'url'],
            [['street_address', 'city','legal_name','publish_name','status','billing_legal_name','billing_street_address','billing_city','billing_zipcode','billing_email','billing_fax','billing_phone','fb_url'], 'string'],
            [['Zipcode'], 'string', 'min' => 5],
            [['Zipcode'], 'string', 'max' => 10],
            [['WorkPhone'], 'string', 'max' => 50],
            [['HomePhone','fax'], 'string', 'max' => 20],
            [['WorkPhoneExt'], 'string', 'max' => 5],
            [['added_on','billing_state','billing_country'], 'safe'],
            [['file_name'], 'string'],
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

    public function getUsers()
    {
        return $this->hasMany(User::className(), ['location_id' => 'id']);
    }

    public function getCountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'country_id']);
    }

    public function getState()
    {
        return $this->hasOne(States::className(), ['state_id' => 'state_id']);
    }

    public function getBcountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'billing_country']);
    }

    public function getBstate()
    {
        return $this->hasOne(States::className(), ['state_id' => 'billing_state']);
    }
}
