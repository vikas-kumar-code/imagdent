<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\helpers\Security;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    const STATUS_ACTIVE = 'Y';
    const ROLE_ADMIN = 1;
    const ROLE_USER = 0;

    public $password;
    public $confirm_password;

    public static function tableName()
    {
        return '{{%users}}';
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
            [['email', 'name', 'username','first_name', 'last_name'], 'trim'],
            [['first_name', 'last_name', 'username', 'password','email','confirm_password'], 'required', 'on' => 'Registration'],
            [['first_name', 'last_name', 'username','email','locations','default_location'], 'required', 'on' => ['Profile', 'admin-add']],
            //['confirm_password', 'compare', 'compareAttribute' => 'password'],
            [['email'], 'email'],
            [['password'], 'string', 'min' => 6],
            [['clinics'], 'required', 'on' => 'admin-add'],

            ['email', 'unique', 'targetAttribute' => ['email', 'deleted'], 'message'=>'Email has already been taken.'],
            ['username', 'unique', 'targetAttribute' => ['username', 'deleted'], 'message'=>'Username has already been taken.'],
            [['username'], 'match', 'pattern' => '/^[a-z]\w*$/i', 'message' => 'Only letters and numbers are allowed.'],
            [['term_accepted', 'phone', 'name', 'status','city','b_city','m_city','locations','p_street','b_street','m_street','p_address2','b_address2','m_address2','clinics','licence_no','l_status','mobile','fax','prefix','first_name','middle_name','last_name','suffix','preferred_name','hippa_aggrement'], 'string'],
            [['role_id','country_id','state_id','bcountry_id','bstate_id','mcountry_id','mstate_id','lcountry_id','lstate_id','npi','invisalignId','default_location','referral'], 'integer'],
            [['added_on', 'updated_on','accepted_on','deleted'], 'safe'],
            [['username', 'email', 'password', 'auth_key','confirm_password'], 'string', 'max' => 100],
            [['access_token', 'password_hash', 'password_reset_token'], 'string', 'max' => 255],
            [['p_zipcode','b_zipcode','m_zipcode'], 'string', 'max' => 10],
            [['verification_code'], 'string', 'max' => 50],
        ];
    }
    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'username' => Yii::t('app', 'Username'),
            'email' => Yii::t('app', 'Email'),
            'phone' => Yii::t('app', 'Phone'),
            'password' => Yii::t('app', 'Password'),
            'status' => Yii::t('app', 'Status'),
            'verification_code' => Yii::t('app', 'Verification Code'),
            'added_on' => Yii::t('app', 'Added On'),
            'updated_on' => Yii::t('app', 'Updated On'),
        ];
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
    }

    public function getPcountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'country_id']);
    }
    public function getPstate()
    {
        return $this->hasOne(States::className(), ['state_id' => 'state_id']);
    }
    public function getBcountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'bcountry_id']);
    }
    public function getBstate()
    {
        return $this->hasOne(States::className(), ['state_id' => 'bstate_id']);
    }
    public function getMcountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'mcountry_id']);
    }
    public function getMstate()
    {
        return $this->hasOne(States::className(), ['state_id' => 'mstate_id']);
    }
    public function getLcountry()
    {
        return $this->hasOne(Countries::className(), ['id' => 'lcountry_id']);
    }
    public function getLstate()
    {
        return $this->hasOne(States::className(), ['state_id' => 'lstate_id']);
    }

    public function getRole()
    {
        return $this->hasOne(Roles::className(), ['id' => 'role_id']);
    }

    public function getClinic()
    {
        return $this->hasOne(Clinics::className(), ['id' => 'clinic_id']);
    }
    
    public function getLocation()
    {        
        return $this->hasOne(Locations::className(), ['id' => 'locations']);
    }

    public function getDocuments()
    {
        return $this->hasMany(Documents::className(), ['user_id' => 'id'])->orderBy("documents.added_on desc");
    }

    public function getNotes()
    {
        return $this->hasMany(Notes::className(), ['user_id' => 'id'])->orderBy("notes.added_on desc");
    }

    public function getCases()
    {
        return $this->hasMany(Cases::className(), ['user_id' => 'id']);
    }

    public function getInvoices()
    {
        return $this->hasMany(Invoices::className(), ['user_id' => 'id']);
    }
    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['access_token' => $token]);
        # throw new NotSupportedException('"findIdentityByAccessToken" is not implemented.');
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    /* public static function findByUsername($username){
    return static::findOne(['username'=>$username,'status' => self::STATUS_ACTIVE]);
    } */

    public static function findByUsernameOrEmail($username)
    {
        return static::find()->where(['status' => self::STATUS_ACTIVE])->andWhere("username = '$username' OR email = '$username'")->one();
    }

    public static function findUsername($username)
    {
        if (!empty($username)) {
            return static::findOne(['username' => $username]);
        } else {
            return false;
        }
    }

    public static function findMCode($code)
    {
        $session = new \yii\web\Session;
        $session->open();
        $user_id = $session->get('registered_mobile_number_user_id');
        return static::findOne(['m_verification_code' => $code, 'id' => $user_id]);
    }

    public static function findEmail($email)
    {
        return static::findOne(['email' => $email]);
    }

    /**
     * Finds user by email or phone
     *
     * @param string $username
     * @return static|null
     */
    /*public static function findByUsername($username){
    return static::findOne("status = ".self::STATUS_ACTIVE." AND (email = '".$username."' OR phone = '".$username."')");
    }*/

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token)
    {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne([
            'password_reset_token' => $token,
            'status' => self::STATUS_ACTIVE,
        ]);
    }

    /**
     * Finds out if password reset token is valid
     *
     * @param string $token password reset token
     * @return boolean
     */
    public static function isPasswordResetTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }
        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        $parts = explode('_', $token);
        $timestamp = (int) end($parts);
        return $timestamp + $expire >= time();
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return boolean if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    /**
     * Generates new password reset token
     */
    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Removes password reset token
     */
    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }
    
}
