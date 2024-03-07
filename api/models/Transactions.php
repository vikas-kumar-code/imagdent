<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Transactions extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%transactions}}';
    }

    public function rules()
    {
        return [
            [['AuthorizedAmount','OriginalAmount','Balance','RemainingAmount'], 'number'],
            [['TransactionID','RequestType','ResponseCode','ResponseDescription','Token','AuthorizationCode','ExpirationDate','AVSResult','AVSMessage','GatewayTransID','GatewayMessage','InternalMessage','TransactionCode','TransactionDate','CardClass','CardType','CardModifier','ProviderResponseMessage','IsoCurrencyCode','NetworkReferenceNumber','NetworkMerchantId','NetworkTerminalId','MerchantCategoryCode','InvoiceNum'], 'string'],
            [['IsoCountryCode'], 'integer'],
            [['IsoTransactionDate','IsoRequestDate'], 'safe'],
        ];
    }
}
