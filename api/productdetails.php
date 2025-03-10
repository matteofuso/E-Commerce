<?php
require 'utils/prodotto.php';
$config = require '../config.php';

function returnError($message)
{
    echo json_encode(['error' => $message]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = $_GET['id'] ?? null;

    $product = getProduct($id, $config);
    if (isset($product['error'])) {
        returnError($product['error']);
    }
    echo json_encode($product);
}