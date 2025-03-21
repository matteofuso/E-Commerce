<?php
include '../utils/Session.php';
include_once '../utils/Log.php';
include_once '../utils/Database.php';
$config = include '../config.php';
Session::start($config);

function panic($error_id = -1)
{
    header("Location: ../account.php?err=$error_id");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['id'])) {
        panic(10);
    }

    if (!isset($_SESSION['id'])) {
        panic(3);
    }

    if (Database::connect($config) == null) {
        panic(0);
    }

    try {
        $user = Database::select("SELECT * FROM utenti WHERE id = :id", ['id' => $_SESSION['id']])[0];
    } catch (Exception $e) {
        panic(4);
    }

    $nome = $_POST['nome'] ?? $user->nome;
    $cognome = $_POST['cognome'] ?? $user->cognome;
    $email = $_POST['email'] ?? $user->email;
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    $password = $user->password;

    if (empty($nome) || empty($cognome) || empty($email)) {
        panic(6);
    }

    if (!empty($current_password)) {
        if (empty($new_password) || empty($confirm_password)) {
            panic(6);
        }

        if (!password_verify($current_password, $password)) {
            panic(7);
        }

        if ($new_password !== $confirm_password) {
            panic(5);
        }

        // pass security check
        if (strlen($new_password) < 8 || !preg_match('/[0-9]/', $new_password) || !preg_match('#[A-Z]#', $new_password) || !preg_match('#[a-z]#', $new_password) || !preg_match('#[_!@\#$%^&*]#', $new_password)) {
            panic(8);
        }

        $password = password_hash($new_password, PASSWORD_DEFAULT);
    }

    try {
        Database::query("UPDATE utenti SET nome = :nome, cognome = :cognome, email = :email, password = :password WHERE id = :id", ['nome' => $nome, 'cognome' => $cognome, 'email' => $email, 'password' => $password, 'id' => $_SESSION['id']]);
    } catch (Exception $e) {
        panic(4);
    }

    $_SESSION['nome'] = $nome;
    $_SESSION['cognome'] = $cognome;
    $_SESSION['email'] = $email;

    header("Location: ../account.php");
} else {
    panic(1);
}