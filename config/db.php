<?php

/* return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=civ-works',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',

// Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
]; */
return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=imagdentdev',
    'username' => 'root',
    'password' => 'Mitiz@C0llege3214#',
    'charset' => 'utf8',
    'on afterOpen' => function ($event) {
        $event->sender->createCommand("SET time_zone='-06:00';")->execute();
    },

    // Schema cache options (for production environment)
    /* 'enableSchemaCache' => true,
    'schemaCacheDuration' => 60,
    'schemaCache' => 'cache', */
];


