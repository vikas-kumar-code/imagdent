<?php

namespace app\models;

use Yii;
use app\models\IdCodes;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "assigned_roles".
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $role_id
 */
class AssignedRoles extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'assigned_roles';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'role_id'], 'required'],
            [['user_id', 'role_id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'user_id' => Yii::t('app', 'User ID'),
            'role_id' => Yii::t('app', 'Role ID'),
        ];
    }
    
    public function getRole(){
        return $this->hasOne(Roles::className(), ['id' => 'role_id']);
    }
    
    public function getUser(){
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
    
    public function add(){
        if($this->validate() && $this->save()){
            return $this;
        }
        else{
            print_r($this->getErrors());die;
            $this->addErrors($this->getErrors());
            throw new \Exception('Invalid data submitted');
        }
        return null;
    }
    
    public function getClientName($user_id){
		if(!empty($user_id)){
			$idcode = IdCodes::find()->where(['user_id' => $user_id,'status' => '2'])->orderBy(['activated_on' => SORT_ASC])->one();
			$client_name = (!empty($idcode) && $idcode->getClient()->exists())?$idcode->client['name']:"--";
			return $client_name;exit;
		}
		return "--";
	}
	
    public function getNumberOfIdCodes($user_id){
		//$countQuery = new \yii\db\Query;
		//return Yii::$app->db->createCommand($countQuery->from("idcodes")->select('COUNT(id)')->where(" user_id = '".$user_id."' AND status = 2")->createCommand()->getRawSql())->queryScalar();
		return IdCodes::find()->where(['user_id' => $user_id,'status' => '2'])->count();
	}
}
