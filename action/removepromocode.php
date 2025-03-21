<?php
require '../utils/Session.php';
require_once '../utils/Database.php';
require_once '../utils/Token.php';
require_once '../utils/Log.php';
$config = require_once '../config.php';
Session::start($config);

function panic($error_id)
{
    header('Location ../cart.php?err=' . $error_id);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $promocode_id = $_GET['promocode_id'] ?? null;
    $uid = $_SESSION['id'] ?? -1;
    $tid = Token::fetchDatabase($config, $_COOKIE['AEToken']);

    if (empty($promocode_id)) {
        panic(1);
    }

    if ($tid < 1 && $uid < 1) {
        panic(2);
    }

    if (Database::connect($config) == null) {
        panic(0);
    }

    try {
        echo $promocode_id;
        echo $uid;
        echo $tid;
        Database::query("delete from carrello_promocodes where promocode = :promocode and (utente = :uid or token = :tid);",
            [
                ':promocode' => $promocode_id,
                ':uid' => $uid,
                ':tid' => $tid
            ]
        );
    } catch (Exception $e) {
        Log::errlog($e);
        panic(3);
    }

    header('Location: ../cart.php');
} else {
    panic(1);
}