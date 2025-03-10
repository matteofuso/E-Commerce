<?php
require '../utils/Database.php';

function getProduct($id, $config)
{
    $db = Database::connect($config);
    if ($db === null) {
        return ['error' => 'Database connection failed'];
    }

    try {
        $product = Database::select("select * from prodotti p where p.id = :id", [':id' => $id]);

        if (empty($product)) {
            return ['error' => 'No product found'];
        }

        $product = $product[0];
        $colori = Database::select("select c.id, c.colore, c.hex from colori c where c.prodotto = :id;", [':id' => $product->id]);
        $product->colori = $colori;

        foreach ($colori as $colore) {
            $taglie = Database::select("select t.id, t.taglia, d.disponibili, d.venduti from disponibilita d inner join taglie t ON t.id = d.taglia where d.colore = :id;", [':id' => $colore->id]);
            $colore->taglie = $taglie;

            $immagini = Database::select("select i.uri from immagini i inner join colori c on c.id = i.colore where c.id = :id;", [':id' => $colore->id]);
            $colore->immagini = array_column($immagini, 'uri');
        }

        $categorie = Database::select("select c2.nome from categorizzazioni c inner join categorie c2 on c.categoria = c2.id where c.prodotto = :prodotto", [':prodotto' => $product->id]);
        $product->categorie = array_column($categorie, 'nome');

        $caratteristiche = Database::select("select c2.titolo, c2.descrizione from caratterizzazioni c inner join prodotti p on p.id = c.prodotto inner join caratteristiche c2 on c.caratteristica = c2.id where p.id = :id", [':id' => $product->id]);
        $product->caratteristiche = $caratteristiche;

        return (array) $product;
    } catch
    (Exception $e) {
        return ['error' => 'Database error'];
    }
}