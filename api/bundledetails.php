<?php
require 'utils/prodotto.php';
require_once '../utils/Database.php';
$config = require '../config.php';

function returnError($message)
{
    echo json_encode(['error' => $message]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = $_GET['id'] ?? null;

    $db = Database::connect($config);
    if ($db === null) {
        returnError('Database connection failed');
    }

    try {
        $bundles = Database::select("select * from bundles b where b.id = :bundle", [':bundle' => $id]);

        if (empty($bundles)) {
            returnError('No bundle found');
        }

        $bundle = $bundles[0];

        $prodotti = Database::select("select pb.prodotto from prodotti_bundle pb where pb.bundle = :bundle", [':bundle' => $bundle->id]);
        foreach ($prodotti as $prodotto){
            $bundle->prodotti[] = getProduct($prodotto->prodotto, $config);
        }
        echo json_encode($bundle);
    } catch (Exception $e) {
        returnError('Database error');
    }
}