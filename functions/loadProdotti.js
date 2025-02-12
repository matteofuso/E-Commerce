document.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get("category");
        const fileName = category === "sport" ? "sport.json" : "lusso.json";

        const response = await fetch("data/" + fileName); // Assicurati che il percorso sia corretto
        const data = await response.json();
        const productContainer = document.querySelector(".d-flex.flex-wrap.justify-content-center");
        productContainer.innerHTML = ""; // Svuota il contenitore prima di aggiungere i prodotti
        data.forEach(prodotto => {

            // Creazione della card prodotto
            const card = document.createElement("div");
            card.className = "card m-3 shadow-sm";
            card.style.width = "18rem";

            // Immagine prodotto
            const img = document.createElement("img");
            img.src = prodotto.images[0]; // Prima immagine disponibile
            img.className = "card-img-top";
            img.alt = prodotto.modello;

            // Corpo della card
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

            // Creazione del pulsante con href contenente l'ID
            const button = document.createElement("a");
            button.className = "btn btn-primary";
            button.textContent = "Aggiungi al carrello";
            button.href = `prodotto.html?id=${prodotto["id"]}`; // Inserisce l'ID nel link

            // Costruzione della card
            cardBody.appendChild(title);
            cardBody.appendChild(desc);
            cardBody.appendChild(price);
            cardBody.appendChild(button);
            card.appendChild(img);
            card.appendChild(cardBody);

            // Aggiunta al contenitore dei prodotti
            document.querySelector(".d-flex.flex-wrap.justify-content-center").appendChild(card);
        });
    } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
    }
});
