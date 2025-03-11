<?php include 'components/header.php'; ?>
    <form method="post" action="action/addcart.php" class="container flex-column d-flex justify-content-center">
        <h1 id="bundle-name"></h1>
        <p id="bundle-description"></p>
        <p id="bundle-price"></p>
        <div id="product-container">
        </div>
        <input type="hidden" name="bundle" id="bundle-id">
        <button type="submit" class="btn btn-primary mx-auto">Aggiungi al Carrello</button>
    </form>

    <!-- Script inclusi -->
    <script src="functions/fetch.js"></script>
    <script src="functions/loadProdotto.js"></script>
    <script src="functions/loadBundle.js"></script>
<?php include 'components/footer.php'; ?>