<?php

use yii\helpers\Html;

?>
<?php if ($records) {
    foreach ($records as $row) {
        $statementTotal = 0;
        foreach ($row['invoices'] as $invoice) {
            if ($invoice['case']['status'] == 8) {
                $statementTotal = $statementTotal + $invoice['sub_total'];
            }
        }
?>
        <table class="table table-dark" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td height="16" colspan="2"></td>
            </tr>
            <tr>
                <td valign="top" width="50%">
                    <table width="100%">
                        <tr>
                            <td>
                                <img src="/api/web/images/logo.png" width="110px" /> <br />
                                <strong>
                                    12223 West Giles Rd.
                                    <br />
                                    La Vista, NE 68128
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td height="98"></td>
                        </tr>
                        <tr>
                            <td>
                                <strong>
                                    <?php echo Yii::$app->common->getFullName($row); ?>
                                    <br />
                                    <?php echo $row['b_street']; ?>
                                    <br />
                                    <?php echo $row['b_city'];
                                    if (isset($row['bstate']) && !empty($row['bstate'])) {
                                        echo ", " . $row['bstate']['state_code'];
                                    }
                                    echo " " . $row['b_zipcode'];
                                    ?>
                                </strong>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                    <table style="width:100%">
                        <tr>
                            <td align="right"><strong>Statement Date: </strong></td>
                            <td><?php echo date("m-d-Y"); ?></td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Account Number: </strong>
                            </td>
                            <td>
                                <?php echo $row['id']; ?>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Statement Total:</strong>
                            </td>
                            <td>$<?php echo number_format($statementTotal, 2) ?></td>
                        </tr>
                        <tr>
                            <td colspan="2" height="30"></td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Amount Enclosed:</strong>
                            </td>
                            <td style="border-bottom:1px solid black"></td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Type of card:</strong>
                            </td>
                            <td style="border-bottom:1px solid black">
                                <table width="100%">
                                    <tr>
                                        <td>Visa</td>
                                        <td>MasterCard</td>
                                        <td>Amex</td>
                                        <td>Discover</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Card Number:</strong>
                            </td>
                            <td style="border-bottom:1px solid black;"></td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Security Code:</strong>
                            </td>
                            <td>
                                <table width="100%">
                                    <tr>
                                        <td style="border-bottom:1px solid black;" width="35%"></td>
                                        <td><strong>Zipcode:</strong></td>
                                        <td style="border-bottom:1px solid black;" width="35%"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <strong>Signature:</strong>
                            </td>
                            <td style="border-bottom:1px solid black;"></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="50" colspan="2"></td>
            </tr>
            <tr>
                <td style="border-bottom:1px dashed #989A9C;" colspan="2"></td>
            </tr>
            <tr>
                <td height="30" colspan="2"></td>
            </tr>
        </table>
        <table class="table table-dark" width="100%" cellspacing="0" cellpadding="0" style="page-break-after: always;">
            <tr>
                <th width="10%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Date</th>
                <th width="15%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Invoice No.</th>
                <th width="22%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Patient</th>
                <th width="23%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Imaging Location
                </th>
                <th width="15%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Subtotal</th>
                <th width="15%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Adjustments</th>
                <th width="15%" style="text-align: left;font-size:16px;padding:5px;border-top:0px;">Invoice Total
                </th>
            </tr>


            <?php
            foreach ($row['invoices'] as $invoice) {
                if ($invoice['case']['status'] == 8) {
            ?>
                    <tr style="background:#C1C1C1;">
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            <?php echo date("m-d-Y", strtotime($invoice['case']['patient_checked_in'])); ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            <?php echo $invoice['invoice_id']; ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            <?php echo $invoice['case']['patient']['last_name'] . ', ' . $invoice['case']['patient']['first_name']; ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            <?php echo $invoice['case']['location']['publish_name']; ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            $<?php echo $invoice['amount']; ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            <?php
                            echo $invoice['amount'] && $invoice['discount'] > 0 ? "-$" . $invoice['discount'] : "$0.00";
                            ?>
                        </td>
                        <td style="text-align: left;border-top:3px solid;padding:5px;font-size:14px;">
                            $<?php echo $invoice['sub_total']; ?>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td style="text-align: left;font-size:14px;padding:5px;" colspan="2" align="left">
                            <strong>Procedure</strong>
                        </td>
                        <td style="text-align: left;font-size:14px;padding:5px;" align="left"><strong>Fee</strong></td>
                        <td style="text-align: left;font-size:14px;padding:5px;"><strong>Adjustments</strong></td>
                    </tr>
                    <?php
                    if (count($invoice['case']['services']) > 0) {
                        foreach ($invoice['case']['services'] as $cs) {
                    ?>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="2" style="text-align: left;font-size:13px;padding:5px;border-top:1px solid #a6a6a6;" align="left">
                                    <?php echo $cs['service']['name'] ?>
                                </td>
                                <td style="text-align: left;font-size:13px;padding:5px;border-top:1px solid #a6a6a6;" align="left">$<?php echo number_format($cs['sub_total'], 2) ?></td>
                                <td style="text-align: left;font-size:13px;padding:5px; border-top:1px solid #a6a6a6;">$<?php echo number_format($cs['discount'], 2) ?></td>
                            </tr>
                    <?php
                        }
                    }
                    ?>

            <?php
                }
            }
            ?>

        </table>
<?php   }
}
?>