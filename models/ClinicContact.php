<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class ClinicContact extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%clinic_contacts}}';
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
            [['contact_fname'], 'required'],
            [['contact_prefix','contact_fname', 'contact_mname', 'contact_lname', 'contact_suffix','contact_email'], 'trim'],
            //[['contact_email'], 'unique'],
            [['contact_email'], 'email'],
            [['clinic_id','contact_role','contact_phone_ext'], 'integer'],
            [['contact_prefix','contact_fname', 'contact_mname', 'contact_lname', 'contact_suffix', 'contact_email','contact_phone','contact_fax'], 'string'],
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
}
