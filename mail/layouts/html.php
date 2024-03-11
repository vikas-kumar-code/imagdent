<?php
use yii\helpers\Html;

/* @var $this \yii\web\View view component instance */
/* @var $message \yii\mail\MessageInterface the message being composed */
/* @var $content string main view render result */
?>
<?php $this->beginPage()?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=<?=Yii::$app->charset?>" />
    <title><?=Html::encode($this->title)?></title>
    <?php $this->head()?>
    <style>
        .button {
            display: inline-block;
            color: #23282c;
            text-align: center;
            vertical-align: middle;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            color: #fff;
            background-color: #20a8d8;
            border-color: #20a8d8;
        }
        .link {
            display: inline-block;
            color: #23282c;
            text-align: center;
            vertical-align: middle;
            padding: 0.175rem 0.55rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            color: #fff;
            background-color: #20a8d8;
            border-color: #20a8d8;
            text-decoration:none;
        }
    </style>
</head>
<body>
    <?php $this->beginBody()?>
    <table cellpadding="0" cellspacing="0" width="85%">
        <tr>
            <td><img src="<?=Yii::$app->params['apiUrl']?>/web/images/logo.png" title="iMagDent"></td>
        </tr>
        <tr>
            <td style="background-color:#FFFFFF;padding-right:15%"><hr/></td>
        </tr>
        <tr>
            <td style="background-color:#FFFFFF;padding:10px"><?=$content?></td>
        </tr>
        <tr>
            <td style="background-color:#5c20c3;text-align:center;height:50px;color:#FFFFFF">&copy;iMagDent</td>
        </tr>
    </table>
    <?php $this->endBody()?>
</body>
</html>
<?php $this->endPage()?>
