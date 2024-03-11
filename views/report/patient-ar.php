<?php

use yii\helpers\Html;

?>
<table class="table table-dark" cellspacing="0" cellpadding="0" style="width: 100%; border-spacing: 0px">
    <tr>
        <th colspan="9" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
            <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Patient's A/R
        </th>
    </tr>
    <tr>
        <th style="text-align: left; font-size:12px;padding: 8px;background-color:#D8D8D8;">Name</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;"> Invoice ID </th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">Date</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">Doctor</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">0-30</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">31-60</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">61-90</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">91+</th>
        <th style="text-align: left;font-size:12px; padding: 8px; background-color:#D8D8D8;">Grand Total</th>
    </tr>

    <?php if ($records) {
        foreach ($records as $row) {
            if ($row['invoices'] && count($row['invoices']) != 0) {
                $zeroToThirtyTotal = 0;
                $thirtyFirstToSixtyTotal = 0;
                $sixtyoneToNintyTotal = 0;
                $nintyPlusTotal = 0;

                foreach ($row['invoices'] as $key => $invoice) { 
                    if($invoice['case_status'] == 8){?>
                    <tr>
                        <th style="text-align: left;font-size:11px;padding: 8px;">
                            <?php
                            if ($key == 0) {
                                echo Yii::$app->common->getFullName($row);
                            }
                            ?>
                        </th>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;"><?php echo $invoice['invoice_id']; ?></td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;"><?php echo date("m-d-Y", strtotime($invoice['patient_checked_in'])); ?></td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;">
                            <?php
                            echo Yii::$app->common->getFullName($invoice['user']);
                            //echo $invoice['user']['first_name'] . " " . $invoice['user']['last_name'];
                            ?>
                        </td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;">
                            <?php
                            if ($invoice['zerotothirty']) {
                                $zeroToThirtyTotal = $zeroToThirtyTotal + $invoice['balance_amount'];
                                echo '$' . $invoice['balance_amount'];
                            } else {
                                echo "-------";
                            }
                            ?>
                        </td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;">
                            <?php
                            if ($invoice['thirtyfirstToSixty']) {
                                $thirtyFirstToSixtyTotal = $thirtyFirstToSixtyTotal + $invoice['balance_amount'];
                                echo '$' . $invoice['balance_amount'];
                            } else {
                                echo "-------";
                            }
                            ?>
                        </td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;">
                            <?php
                            if ($invoice['sixtyoneToNinty']) {
                                $sixtyoneToNintyTotal =  $sixtyoneToNintyTotal + $invoice['balance_amount'];
                                echo '$' . $invoice['balance_amount'];
                            } else {
                                echo "-------";
                            }
                            ?>
                        </td>
                        <td style="text-align: left;font-size:11px;padding:8px;border-top: 1px solid #c8ced3;">
                            <?php
                            if ($invoice['nintyPlus']) {
                                $nintyPlusTotal = $nintyPlusTotal + $invoice['balance_amount'];
                                echo '$' . $invoice['balance_amount'];
                            } else {
                                echo "-------";
                            }
                            ?>
                        </td>
                        <td style="border-top: 1px solid #c8ced3;"></td>
                    </tr>
            <?php }
                }
            }
            ?>
            <tr>
                <td colspan="4" style="text-align: left;border-top: 2px solid black;"></td>
                <td style="text-align: left; border-top: 2px solid black;padding:8px;"><?php echo '$' . number_format($zeroToThirtyTotal, 2); ?></td>
                <td style="text-align: left;border-top: 2px solid black;padding:8px;"><?php echo '$' . number_format($thirtyFirstToSixtyTotal, 2); ?></td>
                <td style="text-align: left;border-top: 2px solid black;padding:8px;"><?php echo '$' . number_format($sixtyoneToNintyTotal, 2); ?></td>
                <td style="text-align: left;border-top: 2px solid black;padding:8px;"><?php echo '$' . number_format($nintyPlusTotal, 2); ?></td>
                <td style="text-align: left;border-top: 2px solid black;padding:8px;">
                    <?php
                    echo '$' . number_format($zeroToThirtyTotal + $thirtyFirstToSixtyTotal + $sixtyoneToNintyTotal + $nintyPlusTotal, 2);
                    ?>
                </td>
            </tr>
            <tr>
                <td></td>
                <br />
            </tr>

    <?php } ?>
    <tr>
        <td></td>
    <tr>
    <tr>
        <td style="margin-top:10px;font-size:20px;background-color:#cccccc;text-align:right;padding: 5px;"
            colspan="9">
            <div class="alert alert-dark" style="margin-top:20px;font-size:25px;padding: 5px;border:none;">
                Total Patient A/R: $<?php echo number_format($patientArTotal, 2); ?>
            </div>
        </td>
    </tr>
    <?php }
    ?>
</table>