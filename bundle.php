<?php include 'components/header.php'; ?>
    <form method="get" action="action/addcart.php" class="container flex-column d-flex justify-content-center">
        <h1 id="bundle-name"></h1>
        <p id="bundle-description"></p>
        <p id="bundle-price"></p>
        <div id="product-container">
        </div>
        <input type="hidden" name="bundle" id="bundle-id">
        <button type="submit" class="btn btn-primary mx-auto">Aggiungi al Carrello</button>
    </form>

    <!-- Script inclusi -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    <script src="functions/fetch.js"></script>
    <script src="functions/loadProdotto.js"></script>
    <script src="functions/loadBundle.js"></script>
<?php include 'components/footer.php'; ?>