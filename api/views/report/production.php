<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="9" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Production
            </th>
        </tr>
        <tr>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Name</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Price</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Count</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Total Fee</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $grandTotal = 0;
        $totalPrice = 0;
        if ($records) {
            foreach ($records as $r) {
                $row = $r;
                $grandTotal = $grandTotal + ($row['price'] * $row['total_times']);
                $totalPrice = $totalPrice + $row['price'];
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['name'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['price'], 2) ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['total_times'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['price'] * $row['total_times'], 2) ?></td>
                </tr>
        <?php }
        } ?>
        <br><br>
        <tr>
            <td colspan="4" class="alert alert-dark" style="margin-top:30px;font-size:25px;background-color:#cccccc;text-align:right;padding-right:10px;">
                <span style="text-align: right;padding-right:10px;">Grand total: $<?php echo number_format($grandTotal, 2) ?></span>
            </td>
        </tr>
    </tbody>
</table>