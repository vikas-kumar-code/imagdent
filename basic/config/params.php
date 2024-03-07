<?php
if (strstr($_SERVER['HTTP_HOST'], 'mitiztechnologies')) {
    if (strstr($_SERVER['HTTP_HOST'], 'https')) {
        $siteUrl = 'https://imagdent.mitiztechnologies.in';
        $apiUrl = 'https://imagdent.mitiztechnologies.in/api';
    } else {
        $siteUrl = 'http://imagdent.mitiztechnologies.in';
        $apiUrl = 'http://imagdent.mitiztechnologies.in/api';
    }
} else {
    if (strstr($_SERVER['HTTP_HOST'], 'https')) {
        $siteUrl = 'https://imagdent.com';
        $apiUrl = 'https://imagdent.com/api';
    } else {
        $siteUrl = 'http://imagdent.com';
        $apiUrl = 'http://imagdent.com/api';
    }
}

return [
    'adminEmail' => 'info@mitiztechnologies.com',
    'supportEmail' => 'support@mitiztechnologies.com',
    'siteUrl' => $siteUrl,
    'apiUrl' => $apiUrl,
    'admin_module_arr' => [
        ['module_name' => 'Dashboard', 'url' => '/admin/dashboard', 'icon' => 'fa fa-tachometer-alt'],
        ['module_name' => 'Messages', 'url' => '/admin/messages', 'icon' => 'fa fa-envelope'],
        ['module_name' => 'Cases', 'url' => '/admin/cases', 'icon' => 'fa fa-medkit'],
        [
            'module_name' => 'Financial Reports',
            'url' => '/admin/financial-report',
            'icon' => 'fa fa-chart-bar',
            'children' => [
                ['name' => 'End Of Day', 'url' => '/admin/financial-report/end-of-day', 'icon' => 'fa fa-circle'],
                ['name' => 'Production', 'url' => '/admin/financial-report/production', 'icon' => 'fa fa-circle'],
                ['name' => 'Doctor A/R', 'url' => '/admin/financial-report/doctor-ar', 'icon' => 'fa fa-circle'],
                ['name' => 'Patient A/R', 'url' => '/admin/financial-report/patient-ar', 'icon' => 'fa fa-circle'],
                ['name' => 'Online Transactions', 'url' => '/admin/financial-report/online-transactions', 'icon' => 'fa fa-circle'],
                ['name' => 'A/R Collected', 'url' => '/admin/financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Method of payment report', 'url' => 'financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Invoice report (sent)', 'url' => 'financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Writeoff/adjustments/discounts', 'url' => 'financial-report/ar-collected', 'icon' => 'fa fa-circle']
            ]
        ],
        [
            'module_name' => 'Non-Financial Reports',
            'url' => 'non-financial-report',
            'icon' => 'fa fa-chart-bar',
            'children' => [
                ['name' => 'Credit Card', 'url' => '/admin/non-financial-report/credit-card', 'icon' => 'fa fa-circle'],
                ['name' => 'New Users', 'url' => '/admin/non-financial-report/new-users', 'icon' => 'fa fa-circle'],
                ['name' => 'Top Doctors ', 'url' => '/admin/non-financial-report/top-doctors', 'icon' => 'fa fa-circle'],
                ['name' => 'Top Clinics', 'url' => '/admin/non-financial-report/top-clinics', 'icon' => 'fa fa-circle'],
                ['name' => 'Top Services', 'url' => '/admin/non-financial-report/top-services', 'icon' => 'fa fa-circle'],
                ['name' => 'Doctors', 'url' => '/admin/non-financial-report/doctors', 'icon' => 'fa fa-circle'],
                ['name' => 'New Patients', 'url' => '/admin/non-financial-report/new-patients', 'icon' => 'fa fa-circle'],
                ['name' => 'Existing Patients', 'url' => '/admin/non-financial-report/existing-patients', 'icon' => 'fa fa-circle'],
                ['name' => 'Radiology interpretations (Varsha) ', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Log-in reports', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Clock in/out reports', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'Cancelled appointments', 'url' => '/admin/non-financial-report/cancelled-appointments', 'icon' => 'fa fa-circle'],
                ['name' => 'Inactive Accounts', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'PTO Report / Request', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
                ['name' => 'New user - How did you hear about us report', 'url' => '/admin/non-financial-report/ar-collected', 'icon' => 'fa fa-circle'],
            ]
        ],
        ['module_name' => 'Clinics', 'url' => '/admin/clinics', 'icon' => 'fa fa-clinic-medical'],
        ['module_name' => 'Locations', 'url' => '/admin/locations', 'icon' => 'fa fa-map-marker'],
        ['module_name' => 'Services', 'url' => '/admin/services', 'icon' => 'fa fa-hand-holding-usd'],
        ['module_name' => 'Diagnosis Code', 'url' => '/admin/diagnosis', 'icon' => 'fa fa-diagnoses'],
        ['module_name' => 'Patients', 'url' => '/admin/patients', 'icon' => 'fa fa-users'],
        ['module_name' => 'Time Slots', 'url' => '/admin/time-slots', 'icon' => 'fa fa-clock'],
        ['module_name' => 'Scheduler', 'url' => '/admin/scheduler', 'icon' => 'fa fa-calendar'],
        ['module_name' => 'Email Templates', 'url' => '/admin/email-templates', 'icon' => 'fa fa-envelope-open'],
        ['module_name' => 'Forms', 'url' => '/admin/forms', 'icon' => 'fa fa-file-alt'],
        /*['module_name' => 'Document Types', 'url' => 'document-types', 'icon' => 'file'],
        ['module_name' => 'Tmt. Summary Templates', 'url' => 'tmt-summary-templates', 'icon' => 'medkit'],
        ['module_name' => 'Insurance Companies', 'url' => 'insurance-companies', 'icon' => 'hospital'],
        ['module_name' => 'Membership Plans', 'url' => 'plans', 'icon' => 'user-plus'],
        ['module_name' => 'Static Pages', 'url' => 'static-pages', 'icon' => 'newspaper'],*/
        ['module_name' => 'User Roles', 'url' => '/admin/roles', 'icon' => 'fa fa-users'],
        ['module_name' => 'Users', 'url' => '/admin/users', 'icon' => 'fa fa-user-md'],
        ['module_name' => 'Front end settings', 'url' => '/admin/front-end-settings', 'icon' => 'fa fa-sliders-h'],
    ],
    'user_table_select_columns' => ['users.id', 'username', 'users.email', 'phone', 'users.name', 'users.status', 'users.clinics', 'role_id', 'locations', 'users.country_id', 'users.state_id', 'users.city', 'p_street', 'p_address2', 'p_zipcode', 'bcountry_id', 'bstate_id', 'b_city', 'b_street', 'b_address2', 'b_zipcode', 'mcountry_id', 'mstate_id', 'm_city', 'm_street', 'm_address2', 'm_zipcode', 'lcountry_id', 'lstate_id', 'licence_no', 'l_status', 'mobile', 'fax', 'npi', 'prefix', 'first_name', 'middle_name', 'last_name', 'suffix', 'invisalignId', 'default_location'],
    'user_table_select_columns_new' => ['id', 'username', 'email', 'phone', 'name', 'status', 'clinics', 'role_id', 'locations', 'country_id', 'state_id', 'city', 'p_street', 'p_address2', 'p_zipcode', 'bcountry_id', 'bstate_id', 'b_city', 'b_street', 'b_address2', 'b_zipcode', 'mcountry_id', 'mstate_id', 'm_city', 'm_street', 'm_address2', 'm_zipcode', 'lcountry_id', 'lstate_id', 'licence_no', 'l_status', 'mobile', 'fax', 'npi', 'prefix', 'first_name', 'middle_name', 'last_name', 'suffix', 'invisalignId', 'default_location'],

    'admin_exclude_actions' => ['index', 'logout', 'profile'],
    'admin_exclude_module' => ['Settings' => ['profile'], 'Tag Types' => ['update-position']],
    'mailerSettings' => [
        'class' => 'yii\swiftmailer\Mailer',
        // send all mails to a file by default. You have to set
        // 'useFileTransport' to false and configure a transport
        // for the mailer to send real emails.
        'useFileTransport' => false,
        //'apiKey' => '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',
        'transport' => [
            'class' => 'Swift_SmtpTransport',
            'host' => 'smtp.sendgrid.net',
            'username' => 'apikey',
            'password' => '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',
            'port' => '2525',
            'encryption' => 'tls'

            /* 'streamOptions' => [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ], */
        ],
    ],
    'twilio' => [
        'sid' => 'ACf7aef4f496358019eecb4b02ff26cae4',
        'token' => 'c3912cafdd7f4d1eb3630ba407825a95',
        'phone' => '+14022567669'
    ],
    // 'email_content' => [
    //     'user_login' => '18',

    // ],
    'imd_roles' => [1, 2, 3, 4, 5, 6, 12, 13]
];