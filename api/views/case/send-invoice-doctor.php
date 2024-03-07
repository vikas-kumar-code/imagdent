<?php

use yii\helpers\Html;
?>

<div>

    <table style="border-collapse: separate; width: 100%;">
        <tr>
            <th><img height="100" src="/api/web/images/logo.png"></th>
            <th style="width:100%;text-align:right; font-size:20px;">
                <?php echo $record->case->location->street_address; ?><br><?php echo $record->case->location->city; ?>
                <?php
                if ($record->case->location->state_id != null) {
                    echo $record->case->location->state->state;
                }
                ?>

                <?php echo $record->case->location->Zipcode; ?>
            </th>
        </tr>

    </table>
    <br>
    <br>
    <table style="width: 100%;">

        <tr style="">
            <th colspan="1" style="width:100%;text-align:center;font-size:26px;">Invoice</th>
        </tr>

    </table>
    <br>
    <br>

    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th>Invoice No:</th>
            <td><?php echo $record->invoice_id; ?></td>
            <th>Invoice Total:</th>
            <td>$<?php echo number_format($record->case->doctor_balance, 2); ?></td>
        </tr>
    </table>
    <br />
    <br />
    <strong>Bill To</strong>
    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Doctor’s Name: </th>
            <td style="text-align: left;"><?php echo $record->case->user->prefix; ?> <?php echo $record->case->user->first_name; ?>
                <?php echo $record->case->user->middle_name; ?> <?php echo $record->case->user->last_name; ?></td>
            <?php
            if ($record->case->user->phone) {
            ?>
                <th style="text-align: right;">Phone Number: </th>
                <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo $record->case->user->phone; ?></td>
            <?php } else { ?>
                <th></th>
                <td></td>
            <?php } ?>
        </tr>
        <tr>
            <th style="text-align: left;">Address: </th>
            <td style="text-align: left;"><?php echo $record->case->user->b_street; ?><br><?php echo $record->case->user->b_city; ?>
                <?php if ($record->case->user->bstate_id != null) {
                    echo $record->case->user->bstate->state;
                }
                ?>
                <?php echo $record->case->user->b_zipcode; ?></td>
            <?php
            if ($record->case->user->npi != null && $record->case->user->npi != 0) {
            ?>
                <th style="text-align: right;">NPI: </th>
                <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo $record->case->user->npi; ?></td>
            <?php } ?>
        </tr>
    </table>

    <br />
    <br />
    <strong>Service Rendered By</strong>
    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Location: </th>
            <td style="text-align: left;"><?php echo $record->case->location->publish_name; ?></td>
            <?php
            if ($record->case->location->WorkPhone) {
            ?>
                <th style="text-align: right;">Phone Number: </th>
                <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo $record->case->location->WorkPhone; ?></td>
            <?php } else { ?>
                <th></th>
                <td></td>
            <?php } ?>
        </tr>
        <tr>
            <th style="text-align: left;">Address: </th>
            <td style="text-align: left;"><?php echo $record->case->location->street_address; ?><br><?php echo $record->case->location->city; ?>
                <?php
                if ($record->case->location->state_id != null) {
                    echo $record->case->location->state->state;
                }
                ?>
                <?php echo $record->case->location->Zipcode; ?>
            </td>
            <?php
            if ($record->case->location->npi != null && $record->case->location->npi != 0) {
            ?>
                <th style="text-align: right;">NPI: </th>
                <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo $record->case->location->npi; ?></td>
            <?php } ?>
        </tr>
    </table>
    <br />
    <br />
    <strong>Patient Information</strong>
    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Patient Name: </th>
            <td style="text-align: left;"><?php echo $record->case->patient->prefix; ?> <?php echo $record->case->patient->first_name; ?>
                <?php echo $record->case->patient->middle_name; ?> <?php echo $record->case->patient->last_name; ?>
                <?php echo $record->case->patient->suffix; ?></td>
            <th style="text-align: right;">DOB:</th>
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo date("F j, Y", strtotime($record->case->patient->BirthDate)); ?></td>
        </tr>
        <tr>
            <th style="text-align: left;">Address: </th>
            <td style="text-align: left;"><?php echo $record->case->patient->Address1; ?><br><?php echo $record->case->patient->City; ?>
                <?php
                if ($record->case->patient->State != null) {
                    echo $record->case->patient->statedetails->state;
                }
                ?>
                <?php echo $record->case->patient->Zipcode; ?></td>

            <?php
            if ($record->case->patient->HomePhone) {
            ?>
                <th style="text-align: right;">Phone:</th>
                <td style="text-align: left;">&nbsp;&nbsp;&nbsp;<?php echo $record->case->patient->HomePhone; ?></td>
            <?php } else { ?>
                <th></th>
                <td></td>
            <?php } ?>
        </tr>
    </table>
    <br />
    <br />

    <strong>Services Completed</strong>
    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Procedure</th>
            <th style="text-align: left;">Fee</th>
            <th style="text-align: left;">Adjustment</th>
            <th style="text-align: left;">Total</th>
        </tr>
        <?php
        foreach ($record->case->caseServices as $caseService) {

            if ($caseService->who_will_pay == "0") {

        ?>
                <tr>
                    <td style="text-align: left;"><?php echo $caseService->service->name; ?></td>
                    <td style="text-align: left;">$<?php echo number_format($caseService->price, 2); ?></td>
                    <?php
                    $floatdiscount = (float) $caseService->discount;
                    if ($floatdiscount > 0) {
                    ?>
                        <td style="color:red;text-align: left;">-$<?php echo number_format($caseService->discount, 2); ?></td>
                    <?php
                    } else {
                    ?>
                        <td style="text-align: left;">$<?php echo number_format($caseService->discount, 2); ?></td>
                    <?php } ?>
                    <td style="text-align: left;">$<?php echo number_format($caseService->sub_total, 2); ?></td>
                </tr>
        <?php
            }
        }
        ?>
        <tr>
        </tr>
        <tr></tr>
        <tr></tr>

        <tr>
            <?php
            $floatttotal = (float) $record->case->doctor_balance;
            $floatdodiscount = (float) $record->case->doctor_discount;
            $subtotaldue = $floatttotal + $floatdodiscount;

            ?>
            <th style="text-align: right;">SubTotal: </th>
            <th style="text-align: left;">$<?php echo number_format($subtotaldue, 2); ?></th>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <th style="text-align: right;"><u>Total of Adjustments: </u></th>
            <?php
            $floatddiscount = (float) $record->case->doctor_discount;
            if ($floatddiscount > 0) { ?>
                ?>
                <th style="color:red;text-align: left;"><u>-$<?php echo number_format($record->case->doctor_discount, 2); ?></u><br /></th>
            <?php } else { ?>

                <th style="text-align: left;"><u>$<?php echo number_format($record->case->doctor_discount, 2); ?></u><br /></th>
            <?php } ?>
            <td></td>
            <td></td>

        </tr>
        <tr>
            <th style="text-align: right;">Total Due: </th>
            <th style="text-align: left;">$<?php echo number_format($record->case->doctor_balance, 2); ?></th>
            <td></td>
            <td></td>
        </tr>

    </table>
</div>