<?php include 'components/header.php'; ?>
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
            <!-- Prodotti caricati dinamicamente -->
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
        <div class="mb-2"><strong id="provisional-total-label"></strong> - €<span id="provisional-total">0.00</span>
        </div>
        <div class="mb-2"><strong id="discount"></strong> - €<span id="discount-amount">0.00</span></div>
        <h3><strong id="supertotal"></strong> - €<span id="cart-total">0.00</span></h3>
    </div>
    <button class="btn btn-primary" onclick="checkout()" id="checkout"></button>

    <!-- Script inclusi -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    <script src="functions/fetch.js"></script>
    <script src="loadContent/carrello.js"></script>
    <script src="functions/carrello.js"></script>
    <script src="functions/colormode.js"></script>
<?php include 'components/footer.php'; ?>