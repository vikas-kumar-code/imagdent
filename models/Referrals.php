<?php

namespace app\models;

use Yii;

class Referrals extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'referrals';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['patient_id', 'clinic_id', 'location_id', 'referred_to', 'referred_from'], 'required'],
            [['patient_id', 'clinic_id', 'location_id', 'referred_to', 'slot_id', 'referred_from', 'referred_by', 'urgent', 'arrange_callback', 'status'], 'integer'],
            [['reasons', 'teeth', 'documents', 'notes', 'reason_for_rejection', 'treatment_summary'], 'string'],
            [['appointment_date'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'patient_id' => Yii::t('app', 'Patient ID'),
            'clinic_id' => Yii::t('app', 'Client ID'),
            'location_id' => Yii::t('app', 'Location ID'),
            'referred_to' => Yii::t('app', 'Referred To'),
            'slot_id' => Yii::t('app', 'Slot ID'),
            'referred_by' => Yii::t('app', 'Referred By'),
            'reasons' => Yii::t('app', 'Reasons'),
            'teeth' => Yii::t('app', 'Teeth'),
            'documents' => Yii::t('app', 'Documents'),
            'appointment_date' => Yii::t('app', 'Appointment Date'),
        ];
    }

    public function getDocuments()
    {
        return $this->hasMany(PatientDocuments::className(), ['patient_id' => 'id'])->orderBy("added_on desc");
    }

    public function getClinic()
    {
        return $this->hasOne(Clinics::className(), ['id' => 'clinic_id']);
    }
    public function getLocation()
    {
        return $this->hasOne(Locations::className(), ['id' => 'location_id']);
    }
    public function getPatient()
    {
        return $this->hasOne(Patients::className(), ['id' => 'patient_id']);
    }

    public function getReferredto()
    {
        return $this->hasOne(User::className(), ['id' => 'referred_to']);
    }

    public function getReferredfrom()
    {
        return $this->hasOne(User::className(), ['id' => 'referred_from']);
    }

    public function getReferredby()
    {
        return $this->hasOne(User::className(), ['id' => 'referred_by']);
    }

    public function getSlot()
    {
        return $this->hasOne(Slots::className(), ['id' => 'slot_id']);
    }

}
