<?php include 'components/header.php'; ?>
    <h1 id="title"></h1>
    <p id="description"></p>
    <div class="d-flex flex-wrap justify-content-center"></div>

    <!-- Pagination controls -->
    <div class="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation">
            <ul class="pagination" id="pagination-container">
                <!-- Pagination links will be dynamically added here -->
            </ul>
        </nav>
    </div>

    <!-- Script inclusi -->
    <script src="functions/fetch.js"></script>
    <script src="loadContent/prodotti.js"></script>
    <script src="functions/loadProdotti.js"></script>
<?php include 'components/footer.php'; ?>