async function loadBundle() {
    const params = new URLSearchParams(window.location.search);
    const bundleId = params.get("id");

    if (!bundleId) {
        console.error("No bundle ID provided in the URL.");
        return;
    }

    // Fetch bundle data
    const bundleData = await fetch('data/bundles.json');
    const bundles = await bundleData.json();

    const selectedBundle = bundles.find(bundle => bundle.id === bundleId);
    if (!selectedBundle) {
        console.error("Bundle not found.");
        return;
    }

    let prezzo_totale = 0;


    container = document.getElementById("product-container");
    for (const productId of selectedBundle.products) {
        prodotto = await loadProdotto(productId, container, false);
        prezzo_totale += parseFloat(prodotto.prezzo);
    }

    // Display bundle details
    document.getElementById("bundle-name").innerText = selectedBundle.name;
    document.getElementById("bundle-description").innerText = selectedBundle.description;
    document.getElementById("bundle-price").innerHTML = `<strong>Prezzo:</strong> <s>${prezzo_totale.toFixed(2)}</s> €${selectedBundle.price} €`;
    document.getElementById("bundle-id").value = selectedBundle.id;
}

// Call loadBundle to execute on page load
document.addEventListener("DOMContentLoaded", loadBundle);
