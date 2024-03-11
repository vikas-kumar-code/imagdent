<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "patients".
 *
 * @property int $id
 * @property int $clinic_id
 * @property int $patientId
 * @property string $prefix
 * @property string $first_name
 * @property string $middle_name
 * @property string $last_name
 * @property string $suffix
 * @property string $email
 * @property string $Address1
 * @property string $Address2
 * @property string $City
 * @property string $State
 * @property string $Zipcode
 * @property string $HomePhone
 * @property string $WorkPhone
 * @property string $Status
 * @property string $Sex
 * @property string $MaritalStatus
 * @property string $ResponsibleParty
 * @property string $ResponsiblePartyName
 * @property string $BirthDate
 * @property string $AccountBalance
 * @property string $CurrentBal
 * @property string $ThirtyDay
 * @property string $SixtyDay
 * @property string $NinetyDay
 */
class Patients extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'patients';
    }

    public function init()
    {
        if ($this->isNewRecord) {
            $this->added_on = date("Y-m-d H:i:s");
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['language', 'Age', 'Country', 'State', 'added_by'], 'integer'],
            [['prefix','Sex', 'middle_name','suffix', 'SocialSecurityNumber','preferred_name','image'], 'string'],
            [['BirthDate','sms_consent_date','email_consent_date'], 'safe'],
            [['first_name', 'last_name', 'City', 'ResponsibleParty', 'ResponsiblePartyName'], 'string', 'max' => 100],
            [['Address1', 'Address2'], 'string', 'max' => 255],
            [['WorkPhone', 'Status', 'MaritalStatus', 'AccountBalance', 'CurrentBal', 'ThirtyDay', 'SixtyDay', 'NinetyDay'], 'string', 'max' => 50],
            [['HomePhone','MRN'], 'string', 'max' => 20],
            [['Zipcode'], 'string', 'max' => 10],
            [['email'], 'email'],
            [['sms_consent', 'email_consent'], 'boolean'],
            [['added_on'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'patientId' => Yii::t('app', 'Patient ID'),
            'prefix' => Yii::t('app', 'Prefix'),
            'FirstName' => Yii::t('app', 'First Name'),
            'MI' => Yii::t('app', 'MI'),
            'LastName' => Yii::t('app', 'Last Name'),
            'suffix' => Yii::t('app', 'Suffix'),
            'LastName' => Yii::t('app', 'Last Name'),
            'Address1' => Yii::t('app', 'Address1'),
            'Address2' => Yii::t('app', 'Address2'),
            'City' => Yii::t('app', 'City'),
            'State' => Yii::t('app', 'State'),
            'Zipcode' => Yii::t('app', 'Zipcode'),
            'HomePhone' => Yii::t('app', 'Home Phone'),
            'WorkPhone' => Yii::t('app', 'Work Phone'),
            'Status' => Yii::t('app', 'Status'),
            'Sex' => Yii::t('app', 'Sex'),
            'MaritalStatus' => Yii::t('app', 'Marital Status'),
            'ResponsibleParty' => Yii::t('app', 'Responsible Party'),
            'ResponsiblePartyName' => Yii::t('app', 'Responsible Party Name'),
            'BirthDate' => Yii::t('app', 'Birth Date'),
            'Age' => Yii::t('app', 'Age'),
            'AccountBalance' => Yii::t('app', 'Account Balance'),
            'CurrentBal' => Yii::t('app', 'Current Bal'),
            'ThirtyDay' => Yii::t('app', 'Thirty Day'),
            'SixtyDay' => Yii::t('app', 'Sixty Day'),
            'NinetyDay' => Yii::t('app', 'Ninety Day'),
        ];
    }
    
    public function getDocuments()
    {
        return $this->hasMany(Documents::className(), ['patient_id' => 'id'])->orderBy("documents.added_on desc");
    }
    public function getNotes()
    {
        return $this->hasMany(Notes::className(), ['patient_id' => 'id'])->orderBy("notes.added_on desc");
    }

    public function getCountrydetails()
    {
        return $this->hasOne(Countries::className(), ['id' => 'Country']);
    }
    public function getStatedetails()
    {
        return $this->hasOne(States::className(), ['state_id' => 'State']);
    }
    public function getInvoices()
    {
        return $this->hasMany(Invoices::className(), ['patient_id' => 'id']);
    }
}
