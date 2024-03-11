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
                ?> <?php echo $record->case->location->Zipcode; ?>
            </th>
        </tr>

    </table>
    <br>
    <br>
    <table style="width: 100%;">

        <tr style="">
            <th colspan="1" style="width:100%;text-align:center;font-size:26px;">Receipt of Payment</th>
        </tr>

    </table>
    <br>
    <br>

    <strong>Patient Information</strong>
    <table style="border: 2px solid black; width: 100%">
        <tr>

            <td style="border: 0px solid blue; width: 100px;">
                <strong> Patient Name:</strong>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->patient->prefix; ?>
                            <?php echo $record->case->patient->first_name; ?>
                            <?php echo $record->case->patient->middle_name; ?>
                            <?php echo $record->case->patient->last_name; ?>
                            <?php echo $record->case->patient->suffix; ?></td>
                    </tr>
                </table>

            </td>


            <td style="border: 0px solid blue; text-align: center">
                <strong>Invoice No:</strong>&nbsp;&nbsp;<?php echo $record->invoice_id; ?>
            </td>

            <td style="border: 0px solid blue; text-align: center">
                <strong>Case Id:</strong>&nbsp;&nbsp;<?php echo $record->case->id; ?>
            </td>

        </tr>
        <tr> <strong> Address:</strong>
            <td style="border: 0px solid blue; width: 100px;">
                <strong> Address:</strong>
            </td>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->patient->Address1; ?><br><?php echo $record->case->patient->City; ?>
                            <?php
                            if ($record->case->patient->State != null) {
                                echo $record->case->patient->statedetails->state;
                            }
                            ?>
                            <?php echo $record->case->patient->Zipcode; ?></td>
                    </tr>
                </table>

            </td>

        </tr>
    </table>
    <br>
    <br />

    <table>
        <tr>
            <th style="width: 350px; text-align: left;">Services Rendered By</th>
            <th>Referring Doctor Information</th>
        </tr>
    </table>
    <table style="border: 2px solid black; width: 100%">
        <tr>
            <td style="border: 0px solid blue; width: 120px;">
                <strong>Location:</strong>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->location->publish_name; ?></td>
                    </tr>
                </table>
            </td>
            <td style="border: 0px solid blue; width: 120px;">
                <strong>Doctor’s Name:</strong>
            </td>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->user->prefix; ?> <?php echo $record->case->user->first_name; ?>
                            <?php echo $record->case->user->middle_name; ?>
                            <?php echo $record->case->user->last_name; ?></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="border: 0px solid blue; width: 100px;">
                <strong> Address:</strong>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->location->street_address; ?><br><?php echo $record->case->location->city; ?>
                            <?php
                            if ($record->case->location->state_id != null) {
                                echo $record->case->location->state->state;
                            }
                            ?>
                            <?php echo $record->case->location->Zipcode; ?>
                        </td>
                    </tr>
                </table>

            </td>
            <td style="border: 0px solid blue; width: 100px;">
                <strong> Address:</strong>
            <td>
                <table>
                    <tr>
                        <td><?php echo $record->case->user->b_street; ?><br><?php echo $record->case->user->b_city; ?>
                            <?php if ($record->case->user->bstate_id != null) {
                                echo $record->case->user->bstate->state;
                            }
                            ?>
                            <?php echo $record->case->user->b_zipcode; ?></td>
                    </tr>
                </table>

            </td>

        </tr>
        <tr>
            <td style="border: 0px solid blue; width: 100px;">
                <?php if ($record->case->location->WorkPhone) { ?>
                    <strong> Phone Number:</strong>
                <?php } ?>
            <td>
                <table>
                    <tr>
                        <?php if ($record->case->location->WorkPhone) { ?>
                            <td> <?php echo $record->case->location->WorkPhone; ?></td>
                        <?php } ?>
                    </tr>
                </table>

            </td>
            <td style="border: 0px solid blue; width: 100px;">
                <?php if ($record->case->user->phone) { ?>
                    <strong> Phone Number:</strong>
                <?php } ?>
            <td>
                <table>
                    <tr>
                        <?php if ($record->case->user->phone) { ?>
                            <td> <?php echo $record->case->user->phone; ?></td>
                        <?php } ?>
                    </tr>
                </table>

            </td>

        </tr>
        <tr>
            <td style="border: 0px solid blue; width: 100px;">
                <?php
                if ($record->case->location->npi != null && $record->case->location->npi != 0) {
                ?>
                    <strong> NPI:</strong>
                <?php } ?>
            </td>
            <td>
                <table>
                    <tr>
                        <?php
                        if ($record->case->location->npi != null && $record->case->location->npi != 0) {
                        ?>
                            <td> <?php echo $record->case->location->npi; ?></td>
                        <?php } ?>
                    </tr>
                </table>

            </td>
            <td style="border: 0px solid blue; width: 100px;">
                <?php
                if ($record->case->user->npi != null && $record->case->user->npi != 0) {
                ?>
                    <strong> NPI:</strong>
                <?php } ?>
            </td>
            <td>
                <table>
                    <tr>
                        <?php
                        if ($record->case->user->npi != null && $record->case->user->npi != 0) {
                        ?>
                            <td> <?php echo $record->case->user->npi; ?></td>
                        <?php } ?>
                    </tr>
                </table>

            </td>

        </tr>
    </table>
    <br />
    <br />

    <strong>Services</strong>
    <table style="border-collapse: separate; border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Procedure</th>
            <th style="text-align: left;">Fee</th>
            <th style="text-align: left;">Adjustment</th>
        </tr>
        <?php
        foreach ($record->case->caseServices as $caseService) {

            if ($caseService->who_will_pay == "1") {

        ?>
                <tr>
                    <td><?php echo $caseService->service->name; ?></td>
                    <td>$<?php echo number_format($caseService->price, 2); ?></td>
                    <?php
                    $floatdiscount = (float) $caseService->discount;
                    if ($floatdiscount > 0) {
                    ?>
                        <td style="color:red;">-$<?php echo number_format($caseService->discount, 2); ?></td>
                    <?php
                    } else {
                    ?>
                        <td>$<?php echo number_format($caseService->discount, 2); ?></td>
                    <?php } ?>
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
            $floatttotal = (float) $record->case->patient_balance;
            $floatpadiscount = (float) $record->case->patient_discount;
            $subtotaldue = $floatttotal + $floatpadiscount;

            ?>
            <th style="text-align: right;">SubTotal: </th>
            <th style="text-align: left;">$<?php echo number_format($subtotaldue, 2); ?></th>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th style="text-align: right;"><u>Total of Adjustments: </u></th>
            <?php
            $floatpdiscount = (float) $record->case->patient_discount;
            if ($floatpdiscount > 0) { ?>
                ?>

                <th style="color:red;text-align: left;"><u>-$<?php echo number_format($record->case->patient_discount, 2); ?></u><br /></th>
            <?php } else { ?>

                <th style="text-align: left;"><u>$<?php echo number_format($record->case->patient_discount, 2); ?></u><br /></th>
            <?php } ?>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th style="text-align: right;">Total Patient Due: </th>
            <th style="text-align: left;">$<?php echo number_format($record->case->patient_balance, 2); ?></th>
            <td></td>
            <td></td>
        </tr>
    </table>
    <br />
    <br />

    <?php
    if ($record->case->diagnosis_codes != null) {
        $diagnosisCodeArray = explode(',', $record->case->diagnosis_codes);

    ?>
        <strong>Diagnosis Codes</strong>
        <table style="border: 2px solid black; width: 100%;">
            <tr>
                <th style="text-align: left; ">Diagnosis
                    Code</th>
                <th style="text-align: left;">Description</th>
            </tr>
            <?php
            foreach ($diagnosisCodeArray as $diagnosis) {
                $model = new \app\models\Diagnosiscodes;
                $find = $model->find()->where(['id' => $diagnosis])->one();

            ?>
                <tr>
                    <td><?php echo $find->code; ?></td>
                    <td><?php echo $find->name; ?></td>
                </tr>
            <?php } ?>
        </table>
    <?php } ?>
    <br>
    <strong>Payments</strong>
    <table style="border: 2px solid black; width: 100%;">
        <tr>
            <th style="text-align: left;">Payment Date</th>
            <th style="text-align: left;">Payment Method</th>
            <th style="text-align: left;">Payment Amount</th>
            <th style="text-align: left;">Balance Remaining</th>
        </tr>

        <?php
        foreach ($record->case->invoices as $payment) {
            if ($payment->status == 1 && $payment->patient_id != null) {
        ?>
                <tr>
                    <td><?php echo date("F j, Y", strtotime($payment->received_on)); ?></td>
                    <td>
                        <?php
                        if ($payment->mode == 0) {
                            $Pmode = "Cash";
                        } elseif ($payment->mode == 1) {
                            $Pmode = "Check #" . $payment->cheque_number;
                        } elseif ($payment->mode == 2) {
                            $Pmode = "Visa";
                        } elseif ($payment->mode == 3) {
                            $Pmode = "MasterCard";
                        } elseif ($payment->mode == 4) {
                            $Pmode = "Amex";
                        } elseif ($payment->mode == 5) {
                            $Pmode = "Discover";
                        }
                        echo $Pmode;
                        ?>
                    </td>
                    <td>$<?php echo number_format($payment->sub_total,2); ?></td>
                    <td>$0.00</td>
                </tr>
        <?php $psubtotal = $payment->sub_total;
            }
        } ?>
        <br>
        <tr>
            <td colspan="2" style="text-align: right;"><strong>Total of Payments:</strong></td>
            <td><strong>$<?php
                            echo number_format($psubtotal, 2); ?></strong></td>
            <td><strong> Balance Remaining:$0.00</strong></td>
    </table>
    <br>
    <br>
    <div style="width: 100%;">
        <center>
            <strong>iMagDent is an independent imaging lab. It is not a hospital or
                located in a hospital setting. iMagDent does not prescribe imaging services. This is NOT a bill. Please pay
                insured directly. iMagDent does NOT accept assignment. Fees are non-negotiable.
            </strong>
            <br>
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I hereby certify that the procedure, as
            indicated above, have been completed and that the fees submitted are the actual fees.
        </center>
    </div>
    <br>
    <br>
    <table style="width: 100%;">
        <tr>
            <td>
                <strong>iMagDent Representative:</strong>

            </td>
            <td>
                <h5 style="text-align:left; border-bottom: 1px solid black; width: 400px;"></h5>

            </td>
            <td>
                <strong> Date:</strong>
            </td>
            <td>
                <h5 style="text-align:left; border-bottom: 1px solid black; width: 200px;"></h5>

            </td>
        </tr>
    </table>
</div>