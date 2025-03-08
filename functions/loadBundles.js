document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load bundles
    const bundleData = await fetchJSON("data/bundles.json");

    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Clear container before adding items

    // Display bundles first
    bundleData.forEach((bundle) => {
      const card = document.createElement("div");
      card.className = "card m-3 shadow-sm bundle-card px-0";

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
