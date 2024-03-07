<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="5" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Existing Patients
            </th>
        </tr>
        <tr>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Name</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Birth Date</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Age</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Phone</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">City</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">State</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Sex</th>
            <th style="padding: 8px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Added On</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($records) {
            foreach ($records as $r) {
                $row = $r['patient'];
        ?>
                <tr>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo Yii::$app->common->getFullName($row); ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo date("m-d-Y", strtotime($row['BirthDate'])); ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['Age'] ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        if ($row['WorkPhone'] != null) {
                            echo $row['WorkPhone'];
                        } else {
                            echo "--";
                        }
                        ?>
                    </td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['City'] ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['statedetails']['state'] ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['Sex'] ?></td>
                    <td style="padding: 8px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo date("m-d-Y", strtotime($row['added_on'])); ?></td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>