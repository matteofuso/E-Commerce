<?php
include '../utils/Session.php';
include_once '../utils/Token.php';
include_once '../utils/Log.php';
include_once '../utils/Database.php';
$config = include '../config.php';
Session::start($config);

function panic($error_id = -1, $referer = '..')
{
    header("Location: ../login.php?ref=$referer&err=$error_id");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;
    $remember = $_POST['remember'] ?? null;
    $referer = $_POST['referer'] ?? '..';
    $referer = urldecode($referer);

    if (empty($email) || empty($password)) {
        panic(1, $referer);
    }

    if (Database::connect($config) == null) {
        panic(0, $referer);
    }

    $pass_hash = password_hash($password, PASSWORD_DEFAULT);
    $user = Database::select("select * from utenti where email = :email", [
        'email' => $email,
    ]);

    if (count($user) == 0) {
        panic(2, $referer);
    }

    if (!password_verify($password, $user[0]->password)) {
        panic(2, $referer);
    }

    Session::loadUser($user[0]);

    if (isset($remember)) {
        Session::remember();
    }

    $tid = Token::fetchDatabase($config, $_COOKIE['AEToken'], false);
    if ($tid != -1) {
        try {
            Database::query("update carrello set token = null, utente = :utente where token = :token;",
                [':utente' => $_SESSION['id'], ':token' => $tid]
            );

            Database::query("update carrello_bundle set token = null, utente = :utente where token = :token;", [
                ':utente' => $_SESSION['id'], ':token' => $tid
            ]);

             Database::select("delete from carrello_promocodes where token = :token;", [
                ':token' => $tid
            ]);
        } catch (Exception $e) {
            Log::errlog($e);
            panic(3, $referer);
        }
    }

    header("Location: $referer");
} else {
    panic(1);
}