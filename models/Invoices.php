<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Invoices extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%invoices}}';
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
            [['case_id', 'amount'], 'required'],
            [['amount', 'discount', 'sub_total', 'balance_amount'], 'number'],
            [['invoice_id', 'cheque_number'], 'string'],
            [['case_id', 'user_id', 'patient_id', 'received_by', 'location_id', 'mode', 'manual', 'status'], 'integer'],
            [['amount', 'discount', 'sub_total', 'balance_amount'], 'default', 'value' => 0],
            [['added_on'], 'safe'],
        ];
    }

    public function getCase()
    {
        return $this->hasOne(Cases::className(), ['id' => 'case_id']);
    }

    public function getCompletedcase()
    {
        return $this->hasOne(Cases::className(), ['id' => 'case_id'])->where(['cases.status'=>8]);
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

    public function getPayments()
    {
        return $this->hasMany(Payments::className(), ['invoice_id' => 'id']);
    }
}
