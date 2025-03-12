<?php
include '../components/session.php';
include '../utils/Log.php';
include '../utils/Database.php';
$config = include '../config.php';

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
    $redirect = $_POST['redirect'] ?? false;

    if ($quantity < 0 || empty($id)) {
        panic(1, $redirect);
    }

    if (Database::connect($config) == null) {
        panic(0, $redirect);
    }

    $sid = null;
    if (!isset($_SESSION['id'])) {
        $sid = Database::select("select s.id from sessioni s where s.session_id = :sid", [
            'sid' => session_id()
        ]);

        if (count($sid) == 0) {
            Database::query("insert into sessioni (session_id) values (:sid)", [
                'sid' => session_id()
            ]);
            $sid = Database::connect()->lastInsertId();
        } else {
            $sid = $sid[0]->id;
        }
    }

    try {
        Database::query("update carrello set quantita = :quantity where (utente = :utente or session = :session) and id = :id", [
            'quantity' => $quantity,
            'id' => $_POST['id'],
            'utente' => $_SESSION['id'] ?? -1,
            'session' => $sid ?? -1
        ]);
    } catch (Exception $e) {
        Log::errlog($e);
        panic(2, $redirect);
    }
    if ($redirect) {
        header("Location: ../cart.php");
    }
} else {
    panic(1);
}