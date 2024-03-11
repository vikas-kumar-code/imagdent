<?php

use yii\helpers\Html;

$modeArr = ["Cash", "Check", "Visa", "MasterCard", "Amex", "Discover", "Adjustments"];
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="10" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>End of Day
            </th>
        </tr>
        <?php if ($records) { ?>
        <tr>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Date</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Invoice ID</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Patient</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Doctor</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Total Of Fees</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Adjustments</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Sub Total</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Amount Paid</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Balance Due</th>
            <th style="text-align: left;font-size:13px;padding:5px;border-top:0px;">Mode</th>
        </tr>
        <?php } ?>
    </thead>
    <tbody>
        <?php if ($records) {
            $totalProduction = 0;
            $totalAdjustments = 0;
            foreach ($records as $row) {
                $totalProduction = $totalProduction + $row['amount'];
                $totalAdjustments = $totalAdjustments + $row['discount']
        ?>
                <tr>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">
                        <?php
                        if (isset($row['added_on'])) {
                            echo date("m-d-Y", strtotime($row['case']['patient_checked_in']));
                        } else {
                            echo "--";
                        }
                        ?>&nbsp;&nbsp;
                    </td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;"><?php echo $row['invoice_id'] ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold">
                        <?php
                        echo $row['case']['patient']['first_name'] . " " . $row['case']['patient']['last_name'];
                        ?>
                    </td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold">
                        <?php
                        echo Yii::$app->common->getFullName($row['case']['user']);
                        ?>
                    </td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">$<?php echo number_format($row['amount'], 2) ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;color:red;">$<?php echo number_format($row['discount'], 2) ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">$<?php echo number_format($row['sub_total'], 2) ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">$<?php echo number_format($row['sub_total'] - $row['balance_amount'], 2) ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">$<?php echo number_format($row['balance_amount'], 2) ?></td>
                    <td style="text-align: left;border-top:3px solid;padding:5px;font-size:11px;font-weight:bold;">
                        <?php
                        $pmodeArr = [];
                        foreach ($row['payments'] as $payment) {
                            if ($payment && $payment['mode']) {
                                if (!in_array($modeArr[$payment['mode']], $pmodeArr)) {
                                    $pmodeArr[] = $modeArr[$payment['mode']];
                                }
                            }
                        }
                        echo implode(", ", $pmodeArr) ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: left;font-size:12px;padding:5px;"><strong>Services Rendered</strong></td>
                    <td style="text-align: left;font-size:12px;padding:5px;"><strong>Fee</strong></td>
                    <td style="text-align: left;font-size:12px;padding:5px;"><strong>Discount</strong></td>
                    <td style="text-align: left;font-size:12px;padding:5px;"><strong>Sub&nbsp;Total</strong></td>
                    <td style="text-align: left;font-size:12px;padding:5px;" colspan="4"><strong>Paid By</strong></td>
                </tr>
                <?php
                if (count($row['case']['services']) > 0) {
                    if (isset($row['user_id'])) {
                        foreach ($row['case']['services'] as $cs) {
                            if ($cs['who_will_pay'] == 0) {
                ?>
                                <tr>
                                    <td colspan="5" style="text-align: left;font-size:10px;padding:5px;"><?php echo $cs['service']['name'] ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;">$<?php echo number_format($cs['price'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;color:red">$<?php echo number_format($cs['discount'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;">$<?php echo number_format($cs['sub_total'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;" colspan="4">Doctor</td>
                                </tr>
                            <?php           }
                        }
                    } else if (isset($row['patient_id'])) {
                        foreach ($row['case']['services'] as $cs) {
                            if ($cs['who_will_pay'] == 1) {
                            ?>
                                <tr>
                                    <td colspan="5" style="text-align: left;font-size:10px;padding:5px;"><?php echo $cs['service']['name'] ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;">$<?php echo number_format($cs['price'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;color:red">$<?php echo number_format($cs['discount'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;">$<?php echo number_format($cs['sub_total'], 2) ?></td>
                                    <td style="text-align: left;font-size:10px;padding:5px;" colspan="4">Patient</td>
                                </tr>
                <?php           }
                        }
                    }
                }
                ?>
        <?php }
        } ?>
    </tbody>
</table>
<br>
<?php if ($records) { ?>
<table style="border:2px solid;width:100%" cellspacing="0" cellpadding="0">
    <tr>
        <td valign="top">
            <table style="width:100%" cellpadding="5">
                <tr>
                    <td>Total of Production</td>
                    <td>$<?php echo number_format($totalProduction, 2) ?></td>
                    <td>Total Adjustments</td>
                    <td>$<?php echo number_format($totalAdjustments, 2) ?></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<br>
<table style="border:2px solid;width:100%" cellspacing="0" cellpadding="0">
    <tr>
        <td valign="top">
            <?php if (!empty($groupPayments)) { ?>
                <table style="width:100%" cellpadding="5">
                    <?php
                    $totalCcPayment = 0;
                    foreach ($groupPayments as $gp) {
                        if ($gp['mode'] > 1 && $gp['mode'] != 6) {
                            $totalCcPayment = $totalCcPayment + $gp['total'];
                    ?>
                            <tr>
                                <td><?php
                                    echo "Total of ".$modeArr[$gp['mode']] ?></td>
                                <td>$<?php echo number_format($gp['total'], 2) ?></td>
                            </tr>
                    <?php   }
                    }
                    ?>
                </table>
            <?php } ?>
        </td>
        <td valign="top">
            <?php if (!empty($groupPayments)) { ?>
                <table style="width:100%" cellpadding="5">
                    <?php
                    $totalOtherModePayment = 0;
                    foreach ($groupPayments as $gp) {
                        if ($gp['mode'] <= 1 && $gp['mode'] != null) {
                            $totalOtherModePayment = $totalOtherModePayment + $gp['total'];
                    ?>
                            <tr>
                                <td>Total Of <?php echo $modeArr[$gp['mode']] ?></td>
                                <td>$<?php echo number_format($gp['total'], 2) ?></td>
                            </tr>
                    <?php   }
                    }
                    $groundTotal = $totalOtherModePayment + $totalCcPayment + $totalPatientAr + $totalDoctorAr;
                    ?>
                    <tr>
                        <td>Total Of Patient A/R:</td>
                        <td>$<?php echo number_format(round($totalPatientAr, 2), 2) ?></td>
                    </tr>
                    <tr>
                        <td>Total Of Doctor A/R:</td>
                        <td>$<?php echo number_format(round($totalDoctorAr, 2), 2) ?></td>
                    </tr>
                </table>
            <?php } ?>
        </td>
    </tr>
    <tr>
        <td style="border-top:2px solid;">
            <table style="width:100%" cellspacing="0" cellpadding="5">
                <tr>
                    <td style="font-size:20px">Total Of CC</td>
                    <td style="font-size:20px">$<?php echo number_format(round($totalCcPayment, 2), 2) ?></td>
                </tr>
            </table>
        </td>
        <td style="border-top:2px solid;font-size:20px">
            <table style="width:100%" cellspacing="0" cellpadding="5">
                <tr>
                    <td style="font-size:20px">Grand Total:</td>
                    <td style="font-size:20px">$<?php echo number_format(round($groundTotal, 2), 2) ?></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<?php } ?>
<div class="alert alert-dark" style="margin-top:20px;font-size:25px;background-color:#cccccc;padding: 5px;">
    A/R Payments Collected: $<?php echo number_format($arPaymentsCollectedTotal, 2); ?>
</div>
<br>
<?php if (!empty($arPaymentsCollected)) { ?>
    <table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
        <thead>
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
            foreach ($arPaymentsCollected as $arpayment) {
            ?>
                <tr>
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $arpayment['invoice_id']; ?></td>
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo Yii::$app->common->getFullName($arpayment['case']['user']);
                        ?>
                    </td>
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        echo $arpayment['location']['publish_name'];
                        ?>
                    </td>
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $totalPaidAmount = array_sum(array_column($arpayment['payments'], 'paid_amount'));
                        echo '$' . number_format($totalPaidAmount, 2);
                        ?>
                    </td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $arPmodeArr = [];
                        foreach ($arpayment['payments'] as $payment) {
                            if ($payment && $payment['mode']) {
                                if (!in_array($modeArr[$payment['mode']], $arPmodeArr)) {
                                    $arPmodeArr[] = $modeArr[$payment['mode']];
                                }
                            }
                        }
                        echo implode(", ", $arPmodeArr) ?>
                    </td>
                    <td style="padding: 5px;text-align: left;border-top: 1px solid #c8ced3;">
                        <?php
                        $arPreceivedBy = [];
                        foreach ($arpayment['payments'] as $payment) {
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