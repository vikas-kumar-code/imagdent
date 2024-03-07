<?php

use yii\helpers\Html;
?>
<table class="table table-dark" style="width:100%" cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <th colspan="4" style="text-align: center; font-size:28px;padding-bottom: 20px;font-weight:800;">
                <?php echo isset($location_name) ? $location_name . ' - ' : '' ?>Top Clinics
            </th>
        </tr>
        <tr>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Name</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Email</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Phone</th>
            <th style="padding: 10px;border-top:0px;border-bottom: 2px solid black;text-align: left;">Fax</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if ($records) {
            foreach ($records as $r) {
                $row = $r['clinic'];
        ?>
                <tr>
                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['name'] ?></td>
                    <?php if ($row['contact_email'] != null && $row['contact_email'] != "") { ?>
                        <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['contact_email']; ?></td>
                    <?php
                    } else { ?>
                        <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['email']; ?></td>
                    <?php
                    }
                    if ($row['contact_phone'] != null && $row['contact_phone'] != "") { ?>
                        <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['contact_phone']; ?></td>
                    <?php } else if ($row['phone'] != null && $row['phone'] != "") { ?>
                        <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo $row['phone'] ?></td>
                    <?php } else { ?>
                        <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php echo "--"; ?></td>
                    <?php } ?>

                    <td style="padding: 10px;text-align: left;border-top: 1px solid #c8ced3;"><?php
                                                                                                if ($row['fax'] != null) {
                                                                                                    echo $row['fax'];
                                                                                                } else {
                                                                                                    echo "--";
                                                                                                }
                                                                                                ?>
                    </td>
                </tr>
        <?php }
        } ?>
    </tbody>
</table>