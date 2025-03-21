<?php
include 'utils/Session.php';
include_once 'utils/Database.php';
include_once 'utils/Log.php';
include_once 'utils/Token.php';
$config = include 'config.php';
Database::connect($config);
Session::start($config);
$tid = null;
if (!isset($_SESSION['id']) && isset($_COOKIE['AEToken'])) {
    $tid = Token::fetchDatabase($config, $_COOKIE['AEToken'], false);
}
$totale = 0;
?>

<?php include 'components/header.php'; ?>
<?php include 'components/alert.php'; ?>
    <h1 id="title"></h1>
    <p id="description"></p>
    <div class="control-overflow">
        <table class="table">
            <thead>
            <tr>
                <th id="table-product"></th>
                <th id="table-color"></th>
                <th id="table-size"></th>
                <th id="table-quantity"></th>
                <th id="table-price"></th>
                <th id="table-total"></th>
                <th id="table-remove"></th>
            </tr>
            </thead>
            <tbody id="cart-body">
            <?php
            $cart = [];
            try {
                $cart = Database::select("select *, c.id as riga, col.id as idcolore from carrello c
                    inner join prodotti p on p.id = c.prodotto
                    inner join colori col on col.id = c.colore
                    inner join taglie t on t.id = c.taglia
                     where (c.token = :tid or c.utente = :uid)
                     and c.quantita > 0", [
                    'tid' => $tid ?? -1,
                    'uid' => $_SESSION['id'] ?? -1
                ]);
                foreach ($cart as $item) {
                    $immagine = Database::select("select i.uri from immagini i where i.colore = :colore limit 1;", [':colore' => $item->idcolore])[0]->uri;
                    $totale_item = $item->prezzo * $item->quantita;
                    $totale += $totale_item;
                    ?>
                    <tr class="align-middle">
                        <td>
                            <a href="product.php?id=<?= $item->prodotto ?>" class="text-decoration-none">
                                <div class="d-flex align-items-center"><img src="<?= $immagine ?>" class="me-3"
                                                                            width="60" height="60"
                                                                            style="object-fit: cover; border-radius: 4px;">
                                    <div>
                                        <span class="fw-medium text-white"><?= $item->marca ?></span>
                                        <div class="small text-secondary"><?= $item->modello ?></div>
                                    </div>
                                </div>
                            </a>
                        </td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="me-2"
                                     style="width: 18px; height: 18px; background-color: <?= $item->hex ?>; border-radius: 50%;"></div>
                                <?= $item->colore ?>
                            </div>
                        </td>
                        <td><span class="badge bg-light text-dark"><?= $item->taglia ?></span></td>
                        <td>
                            <div class="input-group input-group-sm" style="max-width: 120px;">
                                <button class="btn btn-outline-secondary" type="button"
                                        onclick="updateQuantity(<?= $item->riga ?>, this)">-
                                </button>
                                <input type="number" min="0" value="<?= $item->quantita ?>"
                                       class="form-control text-center"
                                       onchange="updateQuantity(<?= $item->riga ?>, this)">
                                <button class="btn btn-outline-secondary" type="button"
                                        onclick="updateQuantity(<?= $item->riga ?>, this)">+
                                </button>
                            </div>
                        </td>
                        <td class="prezzo-singolo"><?= $item->prezzo ?>€</td>
                        <td class="fw-bold prezzo-aggregato"><?= $totale_item ?>€</td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm" onclick="removeItem(<?= $item->riga ?>)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                    <?php
                }
            } catch (Exception $e) {
                Log::errlog($e);
            }
            if (count($cart) == 0) {
                ?>
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="alert alert-info mb-0">
                            <i class="bi bi-cart-x me-2"></i>Non ci sono prodotti in questa sezione
                        </div>
                    </td>
                </tr>
                <?php
            }
            ?>
            </tbody>
        </table>
    </div>
    <p id="total" class="text-end"><strong>Totale parziale: </strong>€<?= $totale ?></p>
<?php
try {
    $bundles = Database::select("select *, cb.id as idbundle from carrello_bundle cb
            inner join bundles b on b.id = cb.bundle
            where (cb.utente = :uid or cb.token = :tid) and cb.rimosso = 0", [
        'uid' => $_SESSION['id'] ?? -1,
        'tid' => $tid ?? -1
    ]);

    if (count($bundles) > 0) {
        ?>
        <div class="card my-4 w-100 px-0">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">I tuoi Bundle</h4>
            </div>
            <?php foreach ($bundles as $bundle) {
                $prodotti = Database::select("select *, c.colore as nomecolore from prodotti_carello_bundle pcb
inner join prodotti p on p.id = pcb.prodotto
inner join colori c on c.id = pcb.colore
inner join taglie t on t.id = pcb.taglia
inner join immagini i on i.colore = c.id
where pcb.bundle = :bundle
group by pcb.bundle, pcb.prodotto", [
                    'bundle' => $bundle->idbundle
                ]);
                $totale_bundle = 0;
                $totale += $bundle->prezzo;
                ?>
                <div class="card-body pb-0" id="bundles-list">
                    <div class="card mb-3 shadow-sm">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><?= $bundle->nome ?></h5>
                            <button class="btn btn-outline-danger btn-sm"
                                    onclick="removeBundle(<?= $bundle->idbundle ?>)">
                                <i class="bi bi-trash"></i> Rimuovi
                            </button>
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-3"><?= $bundle->descrizione ?></p>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                    <tr>
                                        <th>Prodotto</th>
                                        <th>Colore</th>
                                        <th>Taglia</th>
                                        <th class="text-end">Prezzo</th>
                                    </tr>
                                    </thead>
                                    <tbody id="bundle-0-products">
                                    <?php foreach ($prodotti as $prodotto) {
                                        $totale_bundle += $prodotto->prezzo;
                                        ?>
                                        <tr class="align-middle">
                                            <td>
                                                <div class="d-flex align-items-center"><img src="<?= $prodotto->uri ?>"
                                                                                            class="me-3" width="60"
                                                                                            height="60"
                                                                                            style="object-fit: cover; border-radius: 4px;">
                                                    <div>
                                                        <span class="fw-medium"><?= $prodotto->marca ?></span>
                                                        <div class="small text-secondary"><?= $prodotto->modello ?></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div style="width: 18px; height: 18px; background-color: <?= $prodotto->hex ?>; border-radius: 50%; border: 1px solid #ddd; margin-right: 8px;"></div>
                                                    <?= $prodotto->nomecolore ?>
                                                </div>
                                            </td>
                                            <td><span class="badge bg-light text-dark"><?= $prodotto->taglia ?></span>
                                            </td>
                                            <td class="text-end">€<?= $prodotto->prezzo ?></td>
                                        </tr>
                                    <?php } ?>
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-end align-items-center gap-2 mt-3">
                                <div class="badge bg-success p-2 fs-6">Risparmi <?= $totale_bundle - $bundle->prezzo ?>
                                    €
                                </div>
                                <div class="fs-5 fw-bold ms-2">€<?= $bundle->prezzo ?></div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
        <?php
    }
} catch (Exception $e) {
    Log::errlog($e);
}
?>

    <p id="total" class="text-end"></p>
    <div id="bundles-container" class="row mx-2">

    </div>
    <form method="post" action="action/applycoupon.php" class="mb-3">
        <label for="discount-code" class="form-label h3" id="discount-code-label"></label>
        <div class="input-group">
            <input type="text" id="discount-code" name="code" class="form-control">
            <button class="btn btn-secondary" type="submit" id="discount-apply"></button>
        </div>
    </form>
    <div class="text-end">
        <div class="mb-2"><strong id="provisional-total-label"><?= $totale ?></strong> - €<span
                    id="provisional-total"><?= $totale ?></span>
        </div>
        <?php
        $sconto_totale = 0;
        try {
            $promocodes = Database::select("select * from carrello_promocodes cp
                inner join promocodes p on p.id = cp.promocode
                where (cp.token = :tid or cp.utente = :uid) and cp.riscattato = 0
                order by p.sconto_percentuale asc", [
                'tid' => $tid ?? -1,
                'uid' => $_SESSION['id'] ?? -1
            ]);
            foreach ($promocodes as $promocode) {
                $sconto = $promocode->sconto + $promocode->sconto_percentuale * $totale / 100;
                $sconto_totale += $sconto;
                $totale -= $sconto;
                echo "<div class='mb-2 text-end'>
                    <strong>Sconto $promocode->code</strong> - €<span>" . number_format($sconto, 2) . "</span>
                    <a href='action/removepromocode.php?promocode_id=$promocode->id' class='ms-2 text-white'>
                        <i class='bi bi-x-lg'></i>
                    </a>
                  </div>";
            }
        } catch (Exception $e) {
            Log::errlog($e);
        }
        ?>
        <div class="mb-2"><strong id="discount"></strong> - €<span id="discount-amount"><?= number_format($sconto_totale, 2) ?></span></div>
        <h3><strong id="supertotal"></strong> - €<span id="cart-total"><?= number_format($totale, 2) ?></span></h3>
    </div>
    <button class="btn btn-primary" onclick="checkout()" id="checkout"></button>
    <form method="post" action="action/editquantity.php" class="modal faded" id="deleteForm" tabindex="-1"
          aria-labelledby="deleteFormTitle" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteFormTitle"></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <p class="modal-body" id="deleteFormText"></p>
                <div class="modal-footer">
                    <input name="id" id="deleteFormId" type="hidden" value="">
                    <input name="quantity" type="hidden" value="0">
                    <input type="hidden" name="resource" id="resource">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    <button type="submit" class="btn btn-danger">Elimina</button>
                </div>
            </div>
        </div>
    </form>
    <script src="functions/fetch.js"></script>
    <script src="loadContent/carrello.js"></script>
    <script src="functions/carrello.js?1"></script>
<?php include 'components/footer.php'; ?>