<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class CaseServices extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%case_services}}';
    }

    /* public function init()
    {
        if ($this->isNewRecord) {
            $this->added_on = date("Y-m-d H:i:s");
            $this->updated_on = date("Y-m-d H:i:s");
        }
    } */

    public function rules()
    {
        return [
            [['case_id','service_id','price'], 'required'],
            [['reason', 'discount'], 'required', 'on' => 'add-discount'],
            [['reason'], 'trim'],
            [['price','discount','sub_total'], 'number'],
            [['case_id','service_id','who_will_pay','location_id'], 'integer'],
            [['reason','note'], 'string'],
        ];
    }

    public function getService()
    {
        return $this->hasOne(Services::className(), ['id' => 'service_id']);
    }

    public function getLocations()
    {
        return $this->hasMany(LocationPrice::className(), ['service_id' => 'service_id']);
    }
    public function getCases()
    {
        return $this->hasOne(Cases::className(), ['id' => 'case_id']);
    }

    public function getCase()
    {
        return $this->hasOne(Cases::className(), ['id' => 'case_id']);
    }
}
