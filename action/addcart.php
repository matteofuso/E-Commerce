<?php
include '../components/session.php';
include '../utils/Log.php';
include '../utils/Database.php';
$config = include '../config.php';

function panic($error_id = -1)
{
    header("Location: ../cart.php?err=$error_id");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    if (Database::connect($config) == null) {
        panic(0);
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
            $same = Database::select("select * from carrello where prodotto = :prodotto and colore = :colore and taglia = :taglia and (session = :session or utente = :utente)", [
                'prodotto' => $id,
                'colore' => $color,
                'taglia' => $size,
                'session' => $sid ?? -1,
                'utente' => $_SESSION['id'] ?? -1
            ]);

            if (count($same) > 0) {
                Database::query("update carrello set quantita = quantita + 1 where id = :id", [
                    'id' => $same[0]->id
                ]);
                header("Location: ../cart.php");
                die();
            }

            Database::query("insert into carrello (utente, prodotto, colore, taglia, session) values (:utente, :prodotto, :colore, :taglia, :session)", [
                'utente' => $_SESSION['id'] ?? null,
                'prodotto' => $id,
                'colore' => $color,
                'taglia' => $size,
                'session' => $sid
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
            Database::query("insert into carrello_bundle(bundle, utente, session) values (:bundle, :utente, :session)", [
                'bundle' => $bundle,
                'utente' => $_SESSION['id'] ?? null,
                'session' => $sid
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