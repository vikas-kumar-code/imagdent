<?php
namespace app\components;

use Yii;
use yii\base\Component;
use yii\swiftmailer\Mailer;
use yii\web\Session;
use yii\helpers\ArrayHelper;
use app\models\User;


class Common extends Component
{

    public function sendEmail($data)
    {
        try {
            $compose = Yii::$app->mailer->compose('body', $data);
            $compose->setFrom([$data['body']->from_email => $data['body']->from_label]);
            $compose->setTo($data['to']);
            //$compose->setTo('opnsrc.devlpr@gmail.com');
            if (isset($data['cc']) && !empty($data['cc'])) {
                $compose->setCc($data['cc']);
            }
            if (isset($data['body']->reply_to_email) && !empty($data['body']->reply_to_email)) {
                $compose->setReplyTo($data['body']->reply_to_email);
            }
            $compose->setSubject($data['subject']);
            return $compose->send();
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    public function getUserIdByUsername($username)
    {
        $find = \app\models\User::find()->select('id')->where(['username' => $username])->one();
        if ($find) {
            return $find->id;
        } else {
            return null;
        }
    }

    public function checkImgUrl($url)
    {
        if (isset($url) && !empty($url)) {
            $urlArr = explode("?", $url);
            return $urlArr[0];
        }
    }

    public function getMetaData($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        $html = curl_exec($ch);
        curl_close($ch);

        $doc = new \DOMDocument();
        @$doc->loadHTML($html);
        $nodes = $doc->getElementsByTagName('title');
        $title = $nodes->item(0)->nodeValue;

        $metas = $doc->getElementsByTagName('meta');
        for ($i = 0; $i < $metas->length; $i++) {
            $meta = $metas->item($i);
            if ($meta->getAttribute('name') == 'description') {
                $description = $meta->getAttribute('content');
            }

            if ($meta->getAttribute('property') == 'og:image') {
                $image = $meta->getAttribute('content');
            }

        }
        return [
            'title' => isset($title) ? $title : '',
            'description' => isset($description) ? $description : '',
            'image' => isset($image) ? $image : '',
        ];
    }

    public function returnException($e)
    {
        //\Yii::info($e->getMessage(), 'mycategory');
        //\Yii::info("Exception occured! =>>> ".$e->getMessage());
        return $e->getMessage();
        return 'There is some technical issue at server end! Please contact administrator or try again later.';
    }

    public function checkModuleActionName($permissions, $module_name, $action_name)
    {
        $permissions = unserialize($permissions);
        if (isset($permissions) && !empty($permissions)) {
            if (isset($permissions[$module_name]) && !empty($permissions[$module_name])) {
                foreach ($permissions[$module_name] as $key => $val) {
                    if ($val == $action_name) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /* public function checkPermission($module_name, $action_name)
    {
    if (Yii::$app->user->isGuest) {
    return false;
    }

    $find = \app\models\AssignedRoles::find()->select('role_id')->where(['user_id' => Yii::$app->user->identity->id])->all();
    //echo $query->createCommand()->getRawSql();die;
    if (isset($find) && !empty($find)) {
    if (array_key_exists($module_name, Yii::$app->params['admin_exclude_module']) && in_array($action_name, Yii::$app->params['admin_exclude_module'][$module_name])) {
    return true;
    }
    foreach ($find as $role) {
    if ($role->role_id == 1) {
    return true;
    }
    $rFind = \app\models\Roles::find()->select('permission')->where(['id' => $role->role_id])->one();
    $permissions = unserialize($rFind->permission);
    if (isset($permissions[$module_name]) && !empty($permissions[$module_name])) {
    foreach ($permissions[$module_name] as $key => $val) {
    if (trim($val) == trim(strtolower($action_name))) {
    return true;
    }
    }
    }
    }
    }
    return false;
    } */

    public function checkPermission($module_name, $action_name)
    {
        if (Yii::$app->user->isGuest) {
            return false;
        }
        if (Yii::$app->user->identity->role_id == 1) {
            return true;
        }

        $find = \app\models\Roles::find()->where(['id' => Yii::$app->user->identity->role_id])->one();
        //echo $query->createCommand()->getRawSql();die;
        if (isset($find) && !empty($find)) {
            $permission = unserialize($find->permission);
            if ($module_name == 'Reports') {
                if (array_key_exists('Financial Reports', $permission) && in_array($action_name, $permission['Financial Reports'])) {
                    return true;
                } else if (array_key_exists('Non-Financial Reports', $permission) && in_array($action_name, $permission['Non-Financial Reports'])) {
                    return true;
                }
            } else {
                if (array_key_exists($module_name, $permission) && in_array($action_name, $permission[$module_name])) {
                    return true;
                }
            }
            //print_r($permission);die;
            // if (array_key_exists($module_name, $permission) && in_array($action_name, $permission[$module_name])) {
            //     return true;
            // }
        }
        return false;
    }

    public function checkModulePermission($module_name)
    {
        $session_action_allowed = Yii::$app->session->get('session_action_allowed');
        if ($session_action_allowed == "all" || (is_array($session_action_allowed) && array_key_exists($module_name, $session_action_allowed))) {
            return true;
        } else {
            return false;
        }
    }

    public function checkModuleActionPermission($module_name, $action_name)
    {
        $session_action_allowed = Yii::$app->session->get('session_action_allowed');
        if ($session_action_allowed == "all" || (is_array($session_action_allowed) && array_key_exists($module_name, $session_action_allowed) && in_array($action_name, $session_action_allowed[$module_name]))) {
            return true;
        } else {
            return false;
        }
    }

    public function addLog($case_id, $title, $message = null)
    {
        $model = new \app\models\CaseLog;
        $model->case_id = $case_id;
        $model->added_by = Yii::$app->user->identity->id;
        $model->title = $title;
        $model->message = $message;
        if ($model->validate()) {
            $model->save();
        }
    }

    public function updateBalance($case_id)
    {
        $total_amount_to_be_paid_by_doctor = [];
        $query = \app\models\CaseServices::find()->where(['case_id' => $case_id, 'who_will_pay' => 0]);
        $total_amount_to_be_paid_by_doctor['sub_total'] = $query->sum('sub_total');
        $total_amount_to_be_paid_by_doctor['discount'] = $query->sum('discount');

        //print_r($total_amount_to_be_paid_by_doctor);die;
        $total_amount_to_be_paid_by_patient = [];
        $query = \app\models\CaseServices::find()->where(['case_id' => $case_id, 'who_will_pay' => 1]);
        $total_amount_to_be_paid_by_patient['sub_total'] = $query->sum('sub_total');
        $total_amount_to_be_paid_by_patient['discount'] = $query->sum('discount');

        //$total_amount_to_be_paid_by_patient = \app\models\CaseServices::find()->where(['case_id'=>$case_id,'who_will_pay'=>1])->sum(['sub_total','discount']);
        //print_r($total_amount_to_be_paid_by_doctor);die;
        //$total_amount_paid_by_doctor = \app\models\Payments::find()->where(['case_id'=>$case_id])->andWhere(['!=','user_id',NULL])->sum('amount');
        //$total_amount_paid_by_patient = \app\models\Payments::find()->where(['case_id'=>$case_id])->andWhere(['!=','patient_id',NULL])->sum('amount');
        $find = \app\models\Cases::findOne(['id' => $case_id]);
        if ($find) {
            /* $find->doctor_balance = $total_amount_to_be_paid_by_doctor - $total_amount_paid_by_doctor;
            $find->patient_balance = $total_amount_to_be_paid_by_patient - $total_amount_paid_by_patient; */

            $find->doctor_balance = $total_amount_to_be_paid_by_doctor['sub_total'];
            $find->doctor_discount = $total_amount_to_be_paid_by_doctor['discount'];
            $find->patient_balance = $total_amount_to_be_paid_by_patient['sub_total'];
            $find->patient_discount = $total_amount_to_be_paid_by_patient['discount'];
            $find->total_price = $total_amount_to_be_paid_by_doctor['sub_total'] + $total_amount_to_be_paid_by_patient['sub_total'];
            if ($find->save()) {
                $model = new \app\models\Invoices;
                $pdfind = $model->find()->where(['case_id' => $case_id, 'status' => 0])->andWhere(['!=', 'user_id', 'NULL'])->one();
                if ($pdfind) {
                    $pdfind->amount = $total_amount_to_be_paid_by_doctor['sub_total'] + $total_amount_to_be_paid_by_doctor['discount'];
                    $pdfind->sub_total = $total_amount_to_be_paid_by_doctor['sub_total'];
                    $pdfind->discount = $total_amount_to_be_paid_by_doctor['discount'];
                    $pdfind->balance_amount = $total_amount_to_be_paid_by_doctor['sub_total'];
                    if ($pdfind->save()) {
                        $model = new \app\models\Invoices;
                        $ppfind = $model->find()->where(['case_id' => $case_id, 'status' => 0])->andWhere(['!=', 'patient_id', 'NULL'])->one();
                        if ($ppfind) {
                            $ppfind->amount = $total_amount_to_be_paid_by_patient['sub_total'] + $total_amount_to_be_paid_by_patient['discount'];
                            $ppfind->sub_total = $total_amount_to_be_paid_by_patient['sub_total'];
                            $ppfind->discount = $total_amount_to_be_paid_by_patient['discount'];
                            $ppfind->balance_amount = $total_amount_to_be_paid_by_patient['sub_total'];
                            $ppfind->save();
                        }
                    }
                }
            } else {
                print_r($find->getErrors());
                die;
            }
        }
    }

    public function getFullName($data)
    {
        $name = "";
        if (isset($data['prefix'])) {
            $name .= $data['prefix'] . ' ';
        }
        if (isset($data['first_name'])) {
            $name .= $data['first_name'] . ' ';
        }
        if (isset($data['middle_name'])) {
            $name .= $data['middle_name'] . ' ';
        }
        if (isset($data['last_name'])) {
            $name .= $data['last_name'] . ' ';
        }
        if (isset($data['suffix'])) {
            $name .= $data['suffix'] . ' ';
        }
        return $name;
    }
    // function mailEventTrigger($user_data)
    // {

    //     $to = ArrayHelper::getColumn(User::find()->where(['id' => $user_data['user_id']])->asArray()->all(), 'email');
    //     $user_model = User::findOne(['id' => $user_data['user_id']]);

    //     $template = \app\models\EmailTemplates::findOne(['id' => $user_data['email_content_id']]);

    //     //check if template exist
    //     if($template){
    //         $data = [
    //             'template_id' => $template->id,
    //             'to' => $to,
    //             'body' => $template,
    //             'subject' => $template->subject,
    //             'name' => ucwords($user_model->name),
    //         ];
    //     } else {
    //         return true;
    //     }

    //     if($result = Yii::$app->common->sendEmail($data)){
    //         return true;
    //     } else {
    //         return $result;
    //     }
    // }

    function getWeekStartEndDatesByDate($current_date)
    {
        $week = date('W', strtotime($current_date));
        $year = date('Y', strtotime($current_date));
        return $this->getWeekStartEndDatesByWeekAndYear($week, $year);
    }
    function getWeekStartEndDatesByWeekAndYear($week, $year)
    {
        $dto = new \DateTime();
        $result['start'] = $dto->setISODate($year, $week, 0)->format('Y-m-d');
        $result['end'] = $dto->setISODate($year, $week, 6)->format('Y-m-d');
        return $result;
    }
}
