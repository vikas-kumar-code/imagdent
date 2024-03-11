<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="6" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Cancelled Appointments</th>
        </tr>
        <tr>
            <th style="border-top:0px;padding:5px;">ID</th>
            <th style="border-top:0px;padding:5px;">Location</th>
            <th style="border-top:0px;padding:5px;">Patient Name</th>
            <th style="border-top:0px;padding:5px;">Doctor</th>
            <th style="border-top:0px;padding:5px;">Clinic</th>
            <th style="border-top:0px;padding:5px;">Price</th>
            <th style="border-top:0px;padding:5px;">Appointment Date</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($records) {
            foreach ($records as $r) {
                $row = $r;
        ?>
                <tr>
                    <td style="padding:5px;"><?php echo $row['c_id'] ?></td>
                    <td style="padding:5px;"><?php echo $row['location']['publish_name'] ?></td>
                    <td style="padding:5px;"><?php echo Yii::$app->common->getFullName($row['patient']) ?></td>
                    <td style="padding:5px;"><?php echo Yii::$app->common->getFullName($row['user']) ?></td>
                    <td style="padding:5px;"><?php echo $row['clinic']['name'] ?></td>
                    <td style="padding:5px;">$<?php echo number_format($row['total_price'], 2) ?></td>
                    <td style="padding:5px;"><?php echo date("m-d-Y", strtotime($row['appointment_date'])); ?></td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>