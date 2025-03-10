async function loadBundle() {
  const params = new URLSearchParams(window.location.search);
  const bundleId = params.get("id");

  if (!bundleId) {
    console.error("No bundle ID provided in the URL.");
    return;
  }

  // Fetch bundle data
  const bundle = await fetchJSON("api/bundledetails.php?id=" + bundleId);

  let prezzo_totale = 0;

  container = document.getElementById("product-container");
  for (const prodotto of bundle.prodotti) {
    await loadProdotto(prodotto, container, false);
    prezzo_totale += parseFloat(prodotto.prezzo);
  }

  // Display bundle details
  document.getElementById("bundle-name").innerText = bundle.nome;
  document.getElementById("bundle-description").innerText =
      bundle.descrizione;
  document.getElementById(
    "bundle-price"
  ).innerHTML = `<strong>Prezzo:</strong> <s>${prezzo_totale.toFixed(2)}</s> €${
      bundle.prezzo
  } €`;
  document.getElementById("bundle-id").value = bundle.id;
}

// Call loadBundle to execute on page load
document.addEventListener("DOMContentLoaded", loadBundle);
