<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';
require_once(__DIR__.'/functions.php');
$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'timeZone' => 'America/Chicago',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
    ],
    'components' => [
        'sms' => [
            'class' => 'wadeshuler\sms\twilio\Sms',
        
            // Advanced app use '@common/sms', basic use '@app/sms'
            'viewPath' => '@app/sms',     // Optional: defaults to '@app/sms'
        
            // send all sms to a file by default. You have to set
            // 'useFileTransport' to false and configure the messageConfig['from'],
            // 'sid', and 'token' to send real messages
            'useFileTransport' => false,
        
            'messageConfig' => [
                'from' => '+14022567669',  // Your Twilio number (full or shortcode)
            ],
        
            // Find your Account Sid and Auth Token at https://twilio.com/console
            'sid' => 'ACf7aef4f496358019eecb4b02ff26cae4',
            'token' => 'c3912cafdd7f4d1eb3630ba407825a95',
        
            // Tell Twilio where to POST information about your message.
            // @see https://www.twilio.com/docs/sms/send-messages#monitor-the-status-of-your-message
            //'statusCallback' => 'https://example.com/path/to/callback',      // optional
        ],
        'authClientCollection' => [
            'class' => 'yii\authclient\Collection',
            'clients' => [
                /* 'google' => [
                    'class' => 'yii\authclient\clients\GoogleOAuth',
                    'clientId' => '1025347121163-bn2t6imn8io9rlivk3u7th1ifjareerv.apps.googleusercontent.com',
                    'clientSecret' => 'rO_t87dHrGOhV9F3RMJ1Ph6-',
                ],
                'facebook' => [
                    'class' => 'yii\authclient\clients\Facebook',
                    'clientId' => '1685861045034002',
                    'clientSecret' => '83f90b6df1347bfada4991ee38a6ba18',
                ], */
                'twitter' => [
                    'class' => 'yii\authclient\clients\Twitter',
                    'consumerKey' => 'BGUZMyKECAjgW6KD8ZgGPNU6j',
                    'consumerSecret' => '9pmOVWgAFLgLRORxp9RitThSyXHMvLLRu5B0NBMRQeAyDUdDYY ',
                ],
            ],
        ],
        'common' => [
            'class' => 'app\components\Common'
        ],
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'CtQEqSSMFy-QGdpzeKGvBLwZ5SQXGzLj',
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => $params['mailerSettings']['class'],
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => false,
            //'apiKey' => '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',
            'transport' => [
                'class' => $params['mailerSettings']['transport']['class'],
                'host' => $params['mailerSettings']['transport']['host'],
                'username' => $params['mailerSettings']['transport']['username'],
                'password' => $params['mailerSettings']['transport']['password'],
                'port' => $params['mailerSettings']['transport']['port'],
                'encryption' => $params['mailerSettings']['transport']['encryption']
                
                /* 'streamOptions' => [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                    ],
                ], */
            ],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error'],
                ],
            ],
        ],
        'db' => $db,

        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
            ],
        ],

    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
