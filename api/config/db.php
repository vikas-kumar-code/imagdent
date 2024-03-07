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
    'dsn' => 'mysql:host=localhost;dbname=mitizt5_imgdent_live',
    'username' => 'mitizt5_mazeeca',
    'password' => 'kCSEZ+-+BjwD',
    'charset' => 'utf8',
    'on afterOpen' => function($event) { 
        $event->sender->createCommand("SET time_zone='-06:00';")->execute(); 
    },

    // Schema cache options (for production environment)
    /* 'enableSchemaCache' => true,
    'schemaCacheDuration' => 60,
    'schemaCache' => 'cache', */
]; 


