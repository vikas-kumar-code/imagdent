<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Cases extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%cases}}';
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
            [['patient_id','user_id','location_id','clinic_id'], 'required'],
            [['total_price','doctor_balance','patient_balance','patient_discount','doctor_discount'], 'number'],
            [['location_id','user_id','clinic_id','patient_id','slot_id','created_by','arrange_callback','status'], 'integer'],
            [['diagnosis_codes', 'teeth', 'referral_note','c_id'], 'string'],
            [['added_on','updated_on','appointment_date','patient_checked_in'], 'safe'],
            [['doctor_balance','patient_balance','patient_discount','doctor_discount'], 'default', 'value'=> 0],
        ];
    }

    public function getPatient()
    {
        return $this->hasOne(Patients::className(), ['id' => 'patient_id']);
    }

    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getDoctor()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getClinic()
    {
        return $this->hasOne(Clinics::className(), ['id' => 'clinic_id']);
    }

    public function getLocation()
    {
        return $this->hasOne(Locations::className(), ['id' => 'location_id']);
    }

    public function getCaseServices()
    {
        return $this->hasMany(CaseServices::className(), ['case_id'=>'id']);
    }

    public function getSlot()
    {
        return $this->hasOne(Slots::className(), ['id'=>'slot_id']);
    }

    public function getDocuments()
    {
        return $this->hasMany(Documents::className(), ['case_id' => 'id'])->orderBy("documents.added_on desc");
    } 

    public function getTeam()
    {
        return $this->hasMany(TreatmentTeam::className(), ['case_id' => 'id']);
    } 

    public function getNotes()
    {
        return $this->hasMany(Notes::className(), ['case_id' => 'id']);
    } 

    public function getInvoices()
    {
        return $this->hasMany(Invoices::className(), ['case_id' => 'id'])->orderBy("received_on desc");;
    } 
    public function getLogs()
    {
        return $this->hasMany(CaseLog::className(), ['case_id' => 'id'])->orderBy("added_on desc");;
    } 
    public function getServices()
    {
        return $this->hasMany(CaseServices::className(), ['case_id'=>'id']);
    }
    public function getUnAvailability()
    {
        return $this->hasOne(UnAvailability::className(), ['user_id'=>'user_id']);
    }
}
