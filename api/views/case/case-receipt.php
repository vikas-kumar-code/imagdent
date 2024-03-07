<?php

use yii\helpers\Html;
?>
<table style="width: 100%; color:black;" cellspacing="0" align="center">
    <tr style="">
        <!----1st row----->
        <td style="width:100%">
            <table style="margin-bottom: 15px;width:100%;" align="center" cellspacing="0">
                <tr style="">
                    <td style="width:100%;text-align:center;">
                        <img height="120" className="img-fluid" src="/api/web/images/logo.png">
                    </td>
                </tr>
                <tr style="">
                    <td style="width:100%;text-align:center;">
                        <p style="font-size: 16px;font-family: Roboto; font-weight: 400;">
                            <?php echo $records['location']['street_address'] . ", "; ?><br />
                        </p>
                        <p style="font-size: 16px;font-family: Roboto; font-weight: 400">
                            <?php echo $records['location']['city'] . ', ' . $records['location']['state']['state'] . ', ' . $records['location']['Zipcode']; ?>
                        </p><br />
                        <p>
                            Phone: <?php echo $records['location']['WorkPhone']; ?>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr style="">
        <td style="width:100%">
            <table style="margin-bottom: 15px;width:100%" align="center" cellspacing="0">
                <tr style="">
                    <td style="color:black;width:100%;text-align:center;font-size:20px;font-family: Roboto; 
                         font-weight: bold;fontSize: 30px;">
                        <b>Appointment Confirmation</b>
                    </td>
                <tr style="">
                    <td style="width:100%;text-align:center;font-family: Roboto;
                    color: black;font-weight: bold;">
                        <?php
                        if (!$records['appointment_date']) { ?>

                            <b>Our iMagDent team will contact you soon.<b>
                                <?php } ?>
                    </td>
                </tr>
    </tr>
    <tr style="">
        <td style="">
        </td>
    </tr>
</table>
</td>
</tr>
</table>
<?php if ($records) { ?>
    <table style="width: 100%;" cellspacing="0">
        <tr>
            <td style="width:100%">
                <table style="margin-bottom: 15px;width:100%" align="center" cellspacing="0">
                    <tr style="">
                        <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong>Patient: </strong></span>
                            <span style="color:black;font-size: 18px; font-family: Roboto;"><?php echo $records['patient']['first_name'] . " " . $records['patient']['last_name']; ?></span>
                        <td>
                    </tr>
                    <tr style="">
                        <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong> For: </strong></span> <span style="color:black;font-size: 18px; font-family: Roboto;"><?php echo Yii::$app->common->getFullName($records['doctor']); ?></span>
                        <td>
                    </tr>
                    <?php
                    if ($records['appointment_date']) { ?>
                        <tr style="">
                            <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                                <?php
                                $recDate = $records['appointment_date'];
                                $newrecDate = date("F j, Y", strtotime($recDate));

                                $recFromTime = $records['slot']['from_time'];
                                $newFromTime = date("h:i A", strtotime($recFromTime));

                                $recToTime = $records['slot']['to_time'];
                                $newToTime = date("h:i A", strtotime($recToTime));
                                ?>
                                <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong>Date And Time For Visit: </strong></span>
                                <span style="color:black;font-size: 18px; font-family: Roboto;"><?php echo $newrecDate . ', ' . $newFromTime; ?></span>
                            <td>
                        </tr>
                    <?php } ?>

                    <tr style="">
                        <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong>Procedures: </strong><br></span>
                            <?php if (count($records['services']) > 0) {
                                foreach ($records['services'] as $sn) { ?><span style="color:black;font-size: 22px; font-family: Roboto;">
                                        <?php
                                            echo $sn['service']['name'].',';
                                        ?>
                                        </span>
                                        <br>
                                        <?php }
                            } ?></span>
                        <td>
                    </tr>

                    <tr style="">
                        <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong>Notes:</strong> <?php echo $records['referral_note'] ?></span>
                        <td>
                    </tr>
                    <tr style="">
                        <td style="width:100%;text-align:left;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 25px; font-family: Roboto; font-weight: 600;"><strong>Patient Total: $<?php echo $records['patient_balance'] ?></strong></span>
                        <td>
                    </tr>
                    <tr style="">
                        <td style="width:100%;text-align:left;">
                            &nbsp;
                        <td>
                    </tr>
                    <tr style="margin-bottom:10px;">
                        <td style="width:100%;text-align:left;">
                            &nbsp;
                        <td>
                    </tr>
                    <tr style="">
                        <td style="width:100%;font-family: Roboto; font-weight: 400;">
                            <span style="color:black;font-size: 20px; font-family: Roboto;">

                                Please give 24 hours notice for any changes to your reserved appointment. Should you have any questions, please do not hesitate to contact us.

                            </span>
                        <td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
<?php } ?>