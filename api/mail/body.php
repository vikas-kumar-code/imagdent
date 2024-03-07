<?php
$content = "";
if ($body->id == 1) {
    $content = str_replace('[name]', $name, $body->content);
    $content = str_replace('[username]', $username, $content);
    $content = str_replace('[password]', $password, $content);
} else if ($body->id == 2) {
    $content = str_replace('[name]', $name, $body->content);
    $content = str_replace('[IP]', $ip, $content);
    $content = str_replace('[url]', $url, $content);
} else if ($body->id == 4 || $body->id == 5) {
    $content = str_replace('[name]', $name, $body->content);
    $content = str_replace('[referred_from]', $referred_from, $content);
} else if ($body->id == 7) {
    $content = str_replace('[name]', $name, $body->content);
    $content = str_replace('[case_id]', $case_id, $content);
    $content = str_replace('[patient_name]', $patient_name, $content);
    $content = str_replace('[imaging_coordinator_name]', $imaging_coordinator_name, $content);
    $content = str_replace('[imaging_coordinator_email]', $imaging_coordinator_email, $content);
} else if ($body->id == 8) {
    $content = $notes;
} else if ($body->id == 9) {
    $content = $notes;
} else if ($body->id == 11) {
    $content = str_replace('[url]', $url, $body->content);
} else if ($body->id == 12) {
    $content = str_replace('[case_id]', $case_id, $body->content);
    $content = str_replace('[patient_name]', $patient_name, $content);
    $content = str_replace('[name]', $name, $content);
    $content = str_replace('[services]', $services, $content);
} else if ($body->id == 13) {
    $content = str_replace('[case_id]', $case_id, $body->content);
    $content = str_replace('[patient_name]', $patient_name, $content);
    $content = str_replace('[name]', $name, $content);
    $content = str_replace('[services]', $services, $content);
    $content = str_replace('[patient_name]', $patient_name, $content);
} else if ($body->id == 14) {
    $content = str_replace('[case_id]', $case_id, $body->content);
    $content = str_replace('[patient_name]', $patient_name, $content);
    $content = str_replace('[name]', $name, $content);
    $content = str_replace('[services]', $services, $content);
    $content = str_replace('[patient_name]', $patient_name, $content);
} else if ($body->id == 16) {

    $content = str_replace('[name]', $name, $body->content);
    $content = str_replace('[subject]', $subject_line, $content);
    $content = str_replace('[email]', $email, $content);
    $content = str_replace('[location]', $location, $content);
    $content = str_replace('[message]', $message, $content);
}
echo $content;
