<?php
require '../utils/Database.php';
$config = require '../config.php';

function returnError($message)
{
    echo json_encode(['error' => $message]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $page = $_GET['page'] ?? 1;
    $page_size = $_GET['page_size'] ?? 10;

    $response = [
        'current_page' => $page,
        'page_size' => $page_size,
    ];

    if (!is_numeric($page) || !is_numeric($page_size)) {
        returnError('Invalid page or page_size');
    }

    $db = Database::connect($config);
    if ($db === null) {
        returnError('Database connection failed');
    }

    try {
        $bundles = Database::select("select * from bundles b limit " . $page_size . " offset " . ($page - 1) * $page_size);
        $response['bundles'] = $bundles;
        echo json_encode($response);
    } catch (Exception $e) {
        returnError('Database error');
    }
}