<?php

use yii\helpers\Html;

$modeArr = ["Cash", "Check", "Visa", "MasterCard", "Amex", "Discover", "No Fee"];
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="9" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Credit Card
            </th>
        </tr>
        <tr>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Date</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Invoice ID</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Patient</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Doctor</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Total Of Fees</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Adjustments</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Sub Total</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Amount Paid</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Balance Due</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">&nbsp;&nbsp;Mode</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $pmodeArr = [];
        if ($records) {
            foreach ($records as $row) {
                if ($row['payments']) {
                    foreach ($row['payments'] as $payment) {
                        if ($payment && $payment['mode']) {
                            if (!in_array($modeArr[$payment['mode']], $pmodeArr)) {
                                $pmodeArr[] = $modeArr[$payment['mode']];
                            }
                        }
                    }
                }
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        if (isset($row['case']['added_on'])) {
                            echo date("m-d-Y", strtotime($row['case']['added_on']));
                        } else {
                            echo "--";
                        }
                        ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['invoice_id'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo $row['case']['patient']['first_name'] . " " . $row['case']['patient']['last_name'];
                        ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo Yii::$app->common->getFullName($row['case']['user']);
                        ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['amount'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;color:red">$<?php echo number_format($row['discount'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['sub_total'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['sub_total'] - $row['balance_amount'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['balance_amount'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo implode(", ", $pmodeArr);
                        ?>
                    </td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>
<div class="alert alert-dark" style="margin-top:20px;font-size:25px;background-color:#cccccc;padding: 5px;">
    Total Payments: $<?php echo number_format($totalPayments, 2); ?>
</div>