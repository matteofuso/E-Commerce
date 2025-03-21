<?php
include '../utils/Session.php';
include_once '../utils/Log.php';
include_once '../utils/Database.php';
$config = include '../config.php';
Session::start($config);

function panic($error_id = -1, $referer = '..')
{
    header("Location: ../register.php?ref=$referer&err=$error_id");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $referer = $_POST['referer'] ?? '..';
    $nome = $_POST['nome'] ?? null;
    $cognome = $_POST['cognome'] ?? null;
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;
    $confirm_password = $_POST['confirm_password'] ?? null;

    if (empty($nome) || empty($cognome) || empty($email) || empty($password) || empty($confirm_password)) {
        panic(1, $referer);
    }

    if ($password != $confirm_password) {
        panic(2, $referer);
    }

    if (Database::connect($config) == null) {
        panic(0, $referer);
    }

    $pass_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        Database::query("insert into utenti (nome, cognome, email, password, ruolo) values (:nome, :cognome, :email, :password, 1)", [
            ':nome' => $nome,
            ':cognome' => $cognome,
            ':email' => $email,
            ':password' => $pass_hash
        ]);
    } catch (Exception $e) {
        Log::errlog($e);
        panic(3, $referer);
    }
    header("Location: ../login.php?ref=$referer");
} else {
    panic(1);
}