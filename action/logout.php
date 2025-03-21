<?php
include '../utils/Session.php';
$config = include '../config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    Session::start($config);
    $referer = $_POST['referer'] ?? '..';

    if (isset($_SESSION['id'])) {
        Session::destroy();
    }

    header("Location: $referer");
} else {
    header("Location: ..");
}