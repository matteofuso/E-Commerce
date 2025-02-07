// Funzione per caricare i dati del prodotto
async function loadProductData() {
    // Simuliamo un fetch per ottenere il JSON (puoi sostituirlo con un URL vero)
    const jsonData = {
        "l1": {
            "marca": "Rolex",
            "modello": "Submariner",
            "descrizione": "Orologio di lusso subacqueo con cassa in acciaio e lunetta in ceramica.",
            "prezzo": "10999.99",
            "images": ["images/7.jpeg", "images/9.jpeg"],
            "varianti": [
                {
                    "tipo": "colore",
                    "valori": [
                        ["nero", "#000000"],
                        ["verde", "#008000"]
                    ]
                }
            ]
        }
    };

    // Prendiamo i dati del prodotto
    const product = jsonData.l1;

    // Aggiorniamo il titolo, la descrizione, il prezzo
    document.getElementById('productDetails').innerHTML = `
        <h2>${product.marca} ${product.modello}</h2>
        <p><strong>Descrizione:</strong> ${product.descrizione}</p>
        <p><strong>Prezzo:</strong> €${parseFloat(product.prezzo).toLocaleString()}</p>

        <!-- Selezione colore -->
        <div class="mb-3">
            <label class="form-label">Seleziona Colore</label>
            <div class="color-picker-container" id="colorOptions">
            </div>
        </div>

        <!-- Selezione taglia con dropdown -->
        <div class="mb-3">
            <label class="form-label" for="size">Seleziona Taglia</label>
            <select class="form-select" id="size" name="size">
                <option value="M">M</option>
                <option value="L">L</option>
            </select>
        </div>

        <button class="btn btn-primary">Aggiungi al Carrello</button>
    `;

    // Aggiorniamo le immagini nel carousel
    const carouselImages = document.getElementById('carouselImages');
    product.images.forEach((image, index) => {
        const isActive = index === 0 ? 'active' : ''; // La prima immagine è quella attiva
        carouselImages.innerHTML += `
            <div class="carousel-item ${isActive}">
                <img src="${image}" class="d-block product-image" alt="${product.modello}">
            </div>
        `;
    });

    // Aggiungiamo le opzioni di colore
    const colorOptionsContainer = document.getElementById('colorOptions');
    product.varianti.forEach(variant => {
        if (variant.tipo === "colore") {
            variant.valori.forEach(([colorName, colorCode]) => {
                colorOptionsContainer.innerHTML += `
                    <div class="color-box">
                        <input type="radio" id="${colorName}" name="color" value="${colorName}" class="d-none"/>
                        <label for="${colorName}">
                            <div class="color-element" style="background-color: ${colorCode};" title="${colorName}"></div>
                            ${colorName}
                        </label>
                    </div>
                `;
            });
        }
    });
}

// Carica i dati al caricamento della pagina
window.onload = loadProductData;