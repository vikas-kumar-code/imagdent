<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Payments extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%payments}}';
    }
    public function init()
    {
        // if ($this->isNewRecord) {
        //     $this->added_on = date("Y-m-d H:i:s");
        // }
    }
    public function rules()
    {
        return [
            [['case_id','paid_amount','remaining_amount'], 'required'],
            [['paid_amount','remaining_amount'], 'number'],
            [['actual_invoice_id','cheque_number'], 'string'],
            [['case_id','user_id','patient_id','received_by','location_id','mode','manual','invoice_id'], 'integer'],
            [['paid_amount','remaining_amount'], 'default', 'value'=> 0],
            [['added_on'], 'default', 'value'=> date("Y-m-d H:i:s")],
        ];
    }

    public function getCase()
    {
        return $this->hasOne(Cases::className(), ['id' => 'case_id']);
    }

    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    public function getPatient()
    {
        return $this->hasOne(Patients::className(), ['id' => 'patient_id']);
    }

    public function getLocation()
    {
        return $this->hasOne(Locations::className(), ['id' => 'location_id']);
    }

    public function getInvoice()
    {
        return $this->hasOne(Invoices::className(), ['id' => 'invoice_id']);
    }

    public function getReceivedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'received_by']);
    }
}
