<?php

use yii\helpers\Html;

$modeArr = ["Cash", "Check", "Visa", "MasterCard", "Amex", "Discover", "No Fee"];
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="6" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>A/R Collected
            </th>
        </tr>
        <tr>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Invoice Id</th>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Name</th>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Location</th>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Amount</th>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Payment Method</th>
            <th style="text-align: left;font-size:14px;padding:5px;border-top:0px; border-bottom:3px solid;">Received By</th>
        </tr>
    <tbody>
        <?php
        if (!empty($records)) {
            foreach ($records as $row) {
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['invoice_id']; ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo Yii::$app->common->getFullName($row['case']['user']);
                        ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo $row['location']['publish_name'];
                        ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $totalPaidAmount = array_sum(array_column($row['payments'], 'paid_amount'));
                        echo '$' . number_format($totalPaidAmount, 2);
                        ?>
                    </td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $arPmodeArr = [];
                        $arPreceivedBy = [];
                        foreach ($row['payments'] as $payment) {
                            $arPredeivedBy = $payment['receivedBy']['username'];
                            if ($payment && $payment['mode']) {
                                if (!in_array($modeArr[$payment['mode']], $arPmodeArr)) {
                                    $arPmodeArr[] = $modeArr[$payment['mode']];
                                }
                            }
                        }
                        echo implode(", ", $arPmodeArr) ?>
                    </td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $arPreceivedBy = [];
                        foreach ($row['payments'] as $payment) {
                            if ($payment['receivedBy']['username']) {
                                $arPreceivedBy[] = $payment['receivedBy']['username'];
                            }
                        }
                        echo implode(", ", array_unique($arPreceivedBy));
                        ?>
                    </td>
                </tr>
            <?php } ?>
    </tbody>
    </thead>
</table>
<?php } ?>