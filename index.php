<?php $main_classes = '';
include 'components/header.php'; ?>
    <!-- Hero Section -->
    <section class="hero bg-dark text-white hero-bg mb-5">
        <div class="text-center hero-opacity py-5">
            <h1 class="display-4" id="hero-title"></h1>
            <p class="lead" id="hero-description"></p>
            <a href="#orologi-lusso" class="btn btn-light btn-lg" id="hero-explore"></a>
        </div>
    </section>

    <!-- Card Section -->
    <section id="orologi-lusso" class="mb-5 container">
        <h2 class="text-center mb-4" id="collezioni-title"></h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center" id="collezioni"></div>
    </section>

    <!-- Script inclusi -->
    <script src="functions/fetch.js"></script>
    <script src="loadContent/index.js"></script>
<?php include 'components/footer.php'; ?>