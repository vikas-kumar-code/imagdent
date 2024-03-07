<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="5" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Top Doctors
            </th>
        </tr>
        <tr>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Name</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Username</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Email</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Phone</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Added On</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($records) {
            foreach ($records as $r) {
                $row = $r['doctor'];
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo Yii::$app->common->getFullName($row); ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['username'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['email'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        if ($row['phone'] != null) {
                            echo $row['phone'];
                        } else {
                            echo "--";
                        }
                        ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo date("m-d-Y", strtotime($row['added_on'])); ?></td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>