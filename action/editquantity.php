<?php
include '../utils/Session.php';
include_once '../utils/Log.php';
include_once '../utils/Database.php';
include_once '../utils/Token.php';
$config = include '../config.php';

Session::start($config);

function panic($error_id = -1, $redirect = true)
{
    if ($redirect) {
        header("Location: ../cart.php?err=$error_id");
    } else {
        http_response_code(400);
        echo json_encode(['error' => $error_id]);
    }
    die();
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $quantity = $_POST['quantity'] ?? -1;
    $id = $_POST['id'] ?? null;
    $resource = $_POST['resource'] ?? null;
    $redirect = $_POST['redirect'] ?? true;

    if ($quantity < 0 || empty($id) || empty($resource)) {
        panic(1, $redirect);
    }

    if (Database::connect($config) == null) {
        panic(0, $redirect);
    }

    $tid = null;
    if (!isset($_SESSION['id'])) {
        $tid = Token::fetchDatabase($config, $_COOKIE['AEToken']);
        if (!$tid) {
            panic(2);
        }
    }

    if ($resource == 'orologio') {
        try {
            Database::query("update carrello set quantita = :quantity where (utente = :utente or token = :token) and id = :id", [
                'quantity' => $quantity,
                'id' => $_POST['id'],
                'utente' => $_SESSION['id'] ?? -1,
                'token' => $tid ?? -1
            ]);
        } catch (Exception $e) {
            Log::errlog($e);
            panic(2, $redirect);
        }
        if ($redirect) {
            header("Location: ../cart.php");
        }
    } else if ($resource == 'bundle') {
        try {
            Database::query("update carrello_bundle set rimosso = 1 where (utente = :utente or token = :token) and id = :id", [
                'id' => $_POST['id'],
                'utente' => $_SESSION['id'] ?? -1,
                'token' => $tid ?? -1
            ]);
        } catch (Exception $e) {
            Log::errlog($e);
            panic(22, $redirect);
        }
    } else {
        panic(1, $redirect);
    }

    if ($redirect) {
        header("Location: ../cart.php");
    }
} else {
    panic(1);
}