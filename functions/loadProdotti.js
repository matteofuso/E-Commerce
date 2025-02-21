document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get("category");
        const fileName = category === "sport" ? "sport.json" : "lusso.json";

        // Load products
        const productResponse = await fetch("data/" + fileName);
        const productData = await productResponse.json();

        // Load bundles
        const bundleResponse = await fetch("data/bundles.json");
        const bundleData = await bundleResponse.json();

        const productContainer = document.querySelector(".d-flex.flex-wrap.justify-content-center");
        productContainer.innerHTML = ""; // Clear container before adding items

        // Display bundles first
        bundleData.forEach(bundle => {
            const card = document.createElement("div");
            card.className = "card m-3 shadow-sm bundle-card";
            card.style.width = "18rem";

            // Bundle image
            const img = document.createElement("img");
            img.src = bundle.image;
            img.className = "card-img-top";
            img.alt = bundle.name;

            // Card body
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const title = document.createElement("h5");
            title.className = "card-title";
            title.textContent = bundle.name;

            const desc = document.createElement("p");
            desc.className = "card-text";
            desc.textContent = bundle.description;

            const price = document.createElement("p");
            price.className = "card-text";
            price.innerHTML = `<strong>Prezzo: €${bundle.price}</strong>`;

            const button = document.createElement("a");
            button.className = "btn btn-primary";
            button.textContent = "Vedi Bundle";
            button.href = `prodotto.html?bundle=${bundle.id}`;

            cardBody.appendChild(title);
            cardBody.appendChild(desc);
            cardBody.appendChild(price);
            cardBody.appendChild(button);
            card.appendChild(img);
            card.appendChild(cardBody);

            productContainer.appendChild(card);
        });

        // Display individual products
        productData.forEach(prodotto => {
            const card = document.createElement("div");
            card.className = "card m-3 shadow-sm";
            card.style.width = "18rem";

            // Product image
            const img = document.createElement("img");
            img.src = prodotto.colori[0].immagini[0];
            img.className = "card-img-top";
            img.alt = prodotto.modello;

            // Card body
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const title = document.createElement("h5");
            title.className = "card-title";
            title.textContent = prodotto.marca + " " + prodotto.modello;

            const desc = document.createElement("p");
            desc.className = "card-text";
            desc.textContent = prodotto.descrizione;

            const price = document.createElement("p");
            price.className = "card-text";
            price.innerHTML = `<strong>Prezzo: €${prodotto.prezzo}</strong>`;

            const button = document.createElement("a");
            button.className = "btn btn-primary";
            button.textContent = "Vai al prodotto";
            button.href = `prodotto.html?id=${prodotto["id"]}`;

            cardBody.appendChild(title);
            cardBody.appendChild(desc);
            cardBody.appendChild(price);
            cardBody.appendChild(button);
            card.appendChild(img);
            card.appendChild(cardBody);

            productContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
    }
});
