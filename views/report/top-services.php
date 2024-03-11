<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="3" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Top Services
            </th>
        </tr>
        <tr>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Name</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Code</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Price</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($records) {
            foreach ($records as $r) {
                $row = $r['service'];
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['name'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['code'] ?></td>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;">$<?php echo number_format($row['price'], 2) ?></td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>