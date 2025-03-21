<?php
include '../utils/Session.php';
include_once '../utils/Log.php';
include_once '../utils/Database.php';
include_once '../utils/Token.php';
$config = include '../config.php';
Session::start($config);

function panic($error_id = -1)
{
    header("Location: ../cart.php?err=$error_id");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $code = $_POST['code'] ?? null;

    if (empty($code)) {
        panic(1);
    }

    if (Database::connect($config) == null) {
        panic(0);
    }

    $tid = null;
    if (!isset($_SESSION['id'])) {
        $tid = Token::fetchDatabase($config, $_COOKIE['AEToken']);
        if (!$tid) {
            panic(2);
        }
    }

    try {
        $coupon = Database::select("select * from promocodes where code = :code", [
            'code' => $code
        ]);

        if (count($coupon) == 0) {
            panic(3);
        }

        $coupon = $coupon[0];
        $same = Database::select("select * from carrello_promocodes where promocode = :coupon and (token = :token or utente = :utente)", [
            'coupon' => $coupon->id,
            'token' => $tid ?? -1,
            'utente' => $_SESSION['id'] ?? -1
        ]);

        if (count($same) > 0) {
            panic(4);
        }

        Database::query("insert into carrello_promocodes (token, utente, promocode) values (:token, :utente, :coupon)", [
            'token' => $tid ?? null,
            'utente' => $_SESSION['id'] ?? null,
            'coupon' => $coupon->id
        ]);
    } catch (Exception $e) {
        Log::errlog($e);
        panic(2);
    }

    header("Location: ../cart.php");
} else {
    panic(1);
}