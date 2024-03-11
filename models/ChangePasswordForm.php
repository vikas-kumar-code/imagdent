<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * ChangePasswordForm is the model behind the login form.
 */
class ChangePasswordForm extends Model
{
    public $current_password;
	public $new_password;
	public $confirm_password; 	
	
	private $_user = false;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
           [['current_password', 'new_password', 'confirm_password'], 'required'],           
           ['confirm_password', 'compare', 'compareAttribute' => 'new_password'],
           //['current_password', 'validatePassword'],           
        ];
    }
	
    /**
     * Logs in a user using the provided username and password.
     * @return boolean whether the user is logged in successfully
     */
    public function checkPassword($username){		
		if($this->validate()){
            $user = User::findUsername($username);            
			if($user && !$user->validatePassword($this->current_password)){
				$this->addError('current_password', 'You current password did not match.');
				return false;
			}			
			else{
				return true;	
			}           
        }         
    }   
}
