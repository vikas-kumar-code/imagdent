<?php

namespace app\models;

use Yii;

class ReferralVersions extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'referral_versions';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['referral_id', 'updated_by'], 'required'],
            [['referral_id', 'updated_by'], 'integer'],
            [['referral_details', 'notes'], 'string'],
            [['updated_on'], 'safe'],
        ];
    }

    public function getReferraldetails()
    {
        return $this->hasOne(Referrals::className(), ['id' => 'referral_id']);
    }

}
