document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const fileName = category + ".json";

    // Load products
    const productData = await fetchJSON("api/getproducts.php?category=" + category);
    const productContainer = document.querySelector(
      ".d-flex.flex-wrap.justify-content-center"
    );
    productContainer.innerHTML = ""; // Clear container before adding items

    // Display individual products
    productData.products.forEach((prodotto) => {
      const card = document.createElement("div");
      card.className = "card m-3 shadow-sm";
      card.style.width = "18rem";

      // Product image
      const img = document.createElement("img");
      img.src = prodotto.immagine;
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
      button.href = `product.php?id=${prodotto["id"]}`;

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
