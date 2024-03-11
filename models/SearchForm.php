<?php
namespace app\models;

use yii\base\Model;

/**
 * SearchForm is the model behind the login form.
 */
class SearchForm extends Model
{
    public $id;
    public $name;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $username;
    public $City;
    public $state;
    public $clinic_id;
    public $status;
    public $middle_name;
    public $Zipcode;
    public $BirthDate;
    public $sex;
    public $SocialSecurityNumber;
    public $user_id;
    public $patient_id;
    public $day_index;
    public $subject;
    public $referred_from;
    public $location_id;
    public $legal_name;
    public $publish_name;
    public $ein;
    public $code;
    public $ada_code;
    public $cpt_code;
    public $contact_name;
    public $parent_id;
    public $role_id;
    public $date_range;
    public $invoice_id;
    public $currentDate;
    public $view;
    public $case_id;


    public function rules()
    {
        return [
            [['name', 'first_name', 'last_name', 'email', 'username', 'phone', 'City', 'state', 'middle_name', 'Zipcode','referred_from','legal_name','publish_name','ein','code','ada_code','cpt_code','contact_name','invoice_id'
        ], 'trim'],
            [['clinic_id', 'user_id', 'patient_id', 'day_index','location_id','ein','parent_id','id','role_id'], 'integer'],
            [['name', 'email', 'phone', 'username', 'City', 'state', 'sex', 'SocialSecurityNumber','subject','referred_from','legal_name','publish_name','code','ada_code','cpt_code','contact_name','Zipcode','date_range','invoice_id','view', 'case_id'], 'string'],
            [['BirthDate','status','currentDate'], 'safe'],
        ];
    }

}
