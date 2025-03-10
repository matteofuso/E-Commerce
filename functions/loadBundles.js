document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load bundles
    const bundleData = await fetchJSON("api/getbundles.php");

    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Clear container before adding items

    // Display bundles first
    bundleData.bundles.forEach((bundle) => {
      const card = document.createElement("div");
      card.className = "card m-3 shadow-sm bundle-card px-0";

      // Bundle image
      const img = document.createElement("img");
      img.src = bundle.immagine;
      img.className = "card-img-top";
      img.alt = bundle.nome;

      // Card body
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = bundle.nome;

      const desc = document.createElement("p");
      desc.className = "card-text";
      desc.textContent = bundle.descrizione;

      const price = document.createElement("p");
      price.className = "card-text";
      price.innerHTML = `<strong>Prezzo: €${bundle.prezzo}</strong>`;

      const button = document.createElement("a");
      button.className = "btn btn-primary";
      button.textContent = "Vedi Bundle";
      button.href = `bundle.php?id=${bundle.id}`;

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
