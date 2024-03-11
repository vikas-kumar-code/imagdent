<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Clinics extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%clinics}}';
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
            [['name', 'email', 'phone','fax'], 'trim'],
            [['name', 'email'], 'unique'],
            [['email'], 'email'],
            [['user_id','npi','ein','state','country'], 'integer'],
            [['status', 'fax', 'email', 'phone', 'status','address1','address2','city','zip'], 'string'],
            [['added_on', 'updated_on'], 'safe'],
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
    public function getDocuments()
    {
        return $this->hasMany(Documents::className(), ['clinic_id' => 'id'])->orderBy("documents.added_on desc");
    }    
    public function getContacts()
    {
        return $this->hasMany(ClinicContact::className(), ['clinic_id' => 'id']);
    }
    public function getNotes()
    {
        return $this->hasMany(Notes::className(), ['clinic_id' => 'id'])->orderBy("notes.added_on desc");
    }

    public function getCountrydetails()
    {
        return $this->hasOne(Countries::className(), ['id' => 'country']);
    }
    public function getStatedetails()
    {
        return $this->hasOne(States::className(), ['state_id' => 'state']);
    }
}
