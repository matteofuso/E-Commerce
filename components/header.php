<?php
/**@var $nav_page */
/**@var $main_classes */
require_once 'utils/Session.php';
$config = include 'config.php';
Session::start($config);
$pages = [
    "index.php" => "Homepage",
    "products.php?category=lusso" => "Orologi di lusso",
    "products.php?category=sport" => "Orologi Sportivi",
    "bundles.php" => "Bundle",
    "cart.php" => "Carrello",
];
$title = $title ?? 'Aeternum';
$main_classes = $main_classes ?? 'container my-4';
$query = $_SERVER['QUERY_STRING'] == '' ? '' : '?' . $_SERVER['QUERY_STRING'];
$curr_page = basename($_SERVER['PHP_SELF']) . $query;
?>

<!doctype html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles/default.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="icon" type="image/x-icon" href="images/logo.png">
    <title>Aeternum - <?= $pages[$curr_page] ?? $title ?></title>
</head>
<body class="d-flex flex-column min-vh-100">
<header data-bs-theme="dark" class="bg-body shadow-lg sticky-top">
    <div class="d-flex justify-content-between align-items-center py-2 container">
        <a href="index.php" class="d-flex align-items-center text-decoration-none link-body-emphasis">
            <img src="images/logo.png" alt="Aeternum Logo" class="logo me-3" height="100px">
            <span class="logo-text h1 my-0 d-none d-sm-block">Aeternum</span>
        </a>
        <div class="d-flex align-items-center">
            <!-- Login/Account Button with Dropdown -->
            <?php if(isset($_SESSION['nome'])): ?>
                <!-- User is logged in - show dropdown -->
                <div class="dropdown mx-3">
                    <button class="btn btn-bd-primary bg-primary dropdown-toggle"
                            type="button" id="userDropdown" data-bs-toggle="dropdown"
                            aria-expanded="false">
                        <i class="bi bi-person"></i>
                        <span class="ms-1 d-none d-md-inline"><?= $_SESSION['nome'] ?></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow py-0" aria-labelledby="userDropdown">
                        <li>
                            <a class="dropdown-item d-flex align-baseline py-2 rounded-top" href="account.php">
                                <i class="bi bi-person-circle me-2"></i>
                                Account
                            </a>
                        </li>
                        <li><hr class="dropdown-divider my-0"></li>
                        <li>
                            <form action="action/logout.php" method="post">
                                <input type="hidden" name="referer" value="<?= $_SERVER['PHP_SELF'] ?>">
                                <button type="submit" class="dropdown-item d-flex align-baseline py-2 rounded-bottom">
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            <?php else: ?>
                <!-- User is not logged in - show login button -->
                <a href="login.php?ref=<?= urlencode($_SERVER['REQUEST_URI'])?>"
                   class="btn btn-bd-primary bg-primary mx-3 text-white text-decoration-none d-flex align-baseline">
                    <i class="bi bi-person me-2"></i>
                    <span>Login</span>
                </a>
            <?php endif; ?>
            <div class="dropdown bd-mode-toggle">
                <button class="btn btn-bd-primary py-2 dropdown-toggle" id="bd-theme"
                        type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (dark)">
                    <i class="bi bi-circle-half my-1"></i>
                    <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                    <li>
                        <button type="button" class="dropdown-item d-flex align-baseline"
                                data-bs-theme-value="light" aria-pressed="false">
                            <i class="bi bi-sun-fill me-2"></i>
                            Chiaro
                            <i class="bi bi-check2 ms-auto d-none"></i>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="dropdown-item d-flex align-baseline active"
                                data-bs-theme-value="dark" aria-pressed="true">
                            <i class="bi bi-moon-stars-fill me-2"></i>
                            Scuro
                            <i class="bi bi-check2 ms-auto d-none"></i>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="dropdown-item d-flex align-baseline" data-bs-theme-value="auto"
                                aria-pressed="false">
                            <i class="bi bi-circle-half me-2"></i>
                            Auto
                            <i class="bi bi-check2 ms-auto d-none"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <button class="navbar-toggler mx-3 d-lg-none link-body-emphasis" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false"
                    aria-label="Toggle navigation">
                <i class="bi bi-list h1"></i>
            </button>
        </div>
    </div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary py-0">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbar">
                <ul class="navbar-nav my-3">
                    <?php
                    foreach ($pages as $link => $page) {
                        $active = $curr_page == $link ? ' active' : '';
                        echo '<li class="nav-item mx-2"><a class="nav-link' . $active .'" href="' . $link . '">' . $page . '</a></li>';
                    }
                    ?>
                </ul>
            </div>
        </div>
    </nav>
</header>
<main class="flex-grow-1 <?=$main_classes?>">
