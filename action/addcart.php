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

    if (!isset($_POST['bundle'])) {
        if (!isset($_POST['id'])) {
            panic(1);
        }
        $id = $_POST['id'][0];
        $color = $_POST[$id . '-color'] ?? null;
        $size = $_POST[$id . '-size'] ?? null;

        if (empty($color) || empty($size)) {
            panic(1);
        }

        try {
            $same = Database::select("select * from carrello where prodotto = :prodotto and colore = :colore and taglia = :taglia and (token = :token or utente = :utente)", [
                'prodotto' => $id,
                'colore' => $color,
                'taglia' => $size,
                'token' => $tid ?? -1,
                'utente' => $_SESSION['id'] ?? -1
            ]);

            if (count($same) > 0) {
                Database::query("update carrello set quantita = quantita + 1 where id = :id", [
                    'id' => $same[0]->id
                ]);
                header("Location: ../cart.php");
                die();
            }

            Database::query("insert into carrello (utente, prodotto, colore, taglia, token) values (:utente, :prodotto, :colore, :taglia, :token)", [
                'utente' => $_SESSION['id'] ?? null,
                'prodotto' => $id,
                'colore' => $color,
                'taglia' => $size,
                'token' => $tid
            ]);
        } catch (Exception $e) {
            Log::errlog($e);
            panic(2);
        }
    } else {
        $bundle = $_POST['bundle'];
        $prodotti = $_POST['id'] ?? null;

        if (empty($prodotti)) {
            panic(1);
        }

        try{
            Database::query("insert into carrello_bundle(bundle, utente, token) values (:bundle, :utente, :token)", [
                'bundle' => $bundle,
                'utente' => $_SESSION['id'] ?? null,
                'token' => $tid
            ]);
            $bid = Database::connect()->lastInsertId();
        } catch (Exception $e) {
            Log::errlog($e);
            panic(2);
        }

        foreach ($prodotti as $id) {
            $color = $_POST[$id . '-color'] ?? null;
            $size = $_POST[$id . '-size'] ?? null;

            if (empty($color) || empty($size)) {
                panic(1);
            }

            try {
                Database::query("insert into prodotti_carello_bundle(bundle, prodotto, colore, taglia) values (:bundle, :prodotto, :colore, :taglia)", [
                    'bundle' => $bid,
                    'prodotto' => $id,
                    'colore' => $color,
                    'taglia' => $size
                ]);
            } catch (Exception $e) {
                Log::errlog($e);
                panic(2);
            }
        }
    }
    header("Location: ../cart.php");
} else {
    panic(1);
}