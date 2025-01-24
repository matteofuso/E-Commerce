const header = document.body.querySelector('header');
const footer = document.body.querySelector('footer');
const pages = {
    'Home': 'index.html',
    'Products': 'products.html',
    'Accessori': 'accessori.html',
    'Carrello': 'cart.html',
};

header.classList.add('sticky-top');
header.innerHTML = `
    <div style="background-color: #d0ccc9;" class="d-flex justify-content-between align-items-center p-3">
        <div class="d-flex align-items-center">
            <img src="images/logo.webp" width="100" height="100" alt="Logo">
            <h1 class="m-2">L'eccomercè</h1>
        </div>    
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon" data-bs-theme="dark"></span>
        </button>
    </div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    ${Object.keys(pages).map(page => `
                        <li class="nav-item">
                            <a class="nav-link" href="${pages[page]}">${page}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    </nav>
`;

footer.innerHTML = `
    <div class="text-center py-3 bg-light">
        <p class="mb-0">© 2025 Company Name. All rights reserved.</p>
    </div>
`;
