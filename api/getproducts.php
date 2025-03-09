<?php
require '../utils/Database.php';
$config = require '../config.php';

function returnError($message)
{
    echo json_encode(['error' => $message]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $category = $_GET['category'] ?? null;
    $page = $_GET['page'] ?? 1;
    $page_size = $_GET['page_size'] ?? 10;
    $minimal = $_GET['minimal'] ?? true;

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

    if ($category === null) {
        $query = "from prodotti";
        $bind = [];
    } else {
        $query = "from categorizzazioni c
                inner join prodotti p on p.id = c.prodotto
                inner join categorie c2 on c2.id = c.categoria
                where c2.nome = :category";
        $bind = [':category' => $category];
    }
    $limit = " limit " . $page_size . " offset " . ($page - 1) * $page_size;

    try {
        $total_products = Database::select("select count(*) as total " . $query, $bind)[0]->total;
        $response['total_pages'] = ceil($total_products / $page_size);
        $products = Database::select("select p.* " . $query . $limit, $bind);

        if (empty($products)) {
            returnError('No products found');
        }

        foreach ($products as $product) {
            if (!$minimal) {
                $colori = Database::select("select c.id, c.colore, c.hex from colori c where c.prodotto = :id;", [':id' => $product->id]);
                $product->colori = $colori;

                foreach ($colori as $colore) {
                    $taglie = Database::select("select t.taglia, d.disponibili, d.venduti from disponibilita d inner join taglie t ON t.id = d.taglia where d.colore = :id;", [':id' => $colore->id]);
                    $colore->taglie = $taglie;

                    $immagini = Database::select("select i.uri from immagini i inner join colori c on c.id = i.colore where c.id = :id;", [':id' => $colore->id]);
                    $colore->immagini = $immagini;
                }

                $caratteristiche = Database::select("select c2.titolo, c2.descrizione from caratterizzazioni c inner join prodotti p on p.id = c.prodotto inner join caratteristiche c2 on c.caratteristica = c2.id where p.id = :id", [':id' => $product->id]);
                $product->caratteristiche = $caratteristiche;
            } else {
                $immagine = Database::select("select i.uri from immagini i inner join colori c on c.id = i.colore where c.prodotto = :prodotto limit 1;", [':prodotto' => $product->id]);
                $product->immagine = $immagine[0]->uri;
            }
        }
        $response['products'] = $products;
        echo json_encode($response);
    } catch (Exception $e) {
        returnError('Database error');
    }
}