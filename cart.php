<?php
include 'components/session.php';
include 'utils/Database.php';
include_once 'utils/Log.php';
$config = include 'config.php';
Database::connect($config);
try {
    if (!isset($_SESSION['id'])) {
        $sid = Database::select("select s.id from sessioni s where s.session_id = :sid", [
            'sid' => session_id()
        ]);

        if (count($sid) == 0) {
            $sid = null;
        } else {
            $sid = $sid[0]->id;
        }
    }
} catch (Exception $e) {
    Log::errlog($e);
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
                $cart = Database::select("select *, c.id as riga from carrello c
                    inner join prodotti p on p.id = c.prodotto
                    inner join colori col on col.id = c.colore
                    inner join taglie t on t.id = c.taglia
                     where (c.session = :sid or c.utente = :uid)
                     and c.quantita > 0", [
                    'sid' => $sid ?? -1,
                    'uid' => $_SESSION['id'] ?? -1
                ]);
                foreach ($cart as $item) {
                    $immagine = Database::select("select i.uri from immagini i inner join colori c on c.id = i.colore where c.prodotto = :prodotto limit 1;", [':prodotto' => $item->prodotto])[0]->uri;
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
    <p id="total" class="text-end"></p>
    <div id="bundles-container" class="row mx-2">

    </div>
    <div class="mb-3">
        <label for="discount-code" class="form-label h3" id="discount-code-label"></label>
        <div class="input-group">
            <input type="text" id="discount-code" class="form-control">
            <button class="btn btn-secondary" type="button" onclick="applyDiscount()" id="discount-apply"></button>
        </div>
    </div>
    <div class="text-end">
        <div class="mb-2"><strong id="provisional-total-label"><?= $totale ?></strong> - €<span
                    id="provisional-total"><?= $totale ?></span>
        </div>
        <div class="mb-2"><strong id="discount"></strong> - €<span id="discount-amount">0.00</span></div>
        <h3><strong id="supertotal"></strong> - €<span id="cart-total"><?= $totale ?></span></h3>
    </div>
    <button class="btn btn-primary" onclick="checkout()" id="checkout"></button>
    <form method="post" action="action/editquantity.php" class="modal faded" id="deleteForm" tabindex="-1"
          aria-labelledby="deleteFormTitle" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteFormTitle">Vuoi rimuovere l'orologio?</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <p class="modal-body" id="deleteFormText">Sei sicuro di voler rimuovere l'oggetto dal carrello</p>
                <div class="modal-footer">
                    <input name="id" id="deleteFormId" type="hidden" value="">
                    <input name="quantity" type="hidden" value="0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    <button type="submin" class="btn btn-danger">Elimina</button>
                </div>
            </div>
        </div>
    </form>
    <script src="functions/fetch.js"></script>
    <script src="loadContent/carrello.js"></script>
    <script src="functions/carrello.js"></script>
<?php include 'components/footer.php'; ?>