async function load() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const data = await fetchJSON("content/prodotti.json");

    document.getElementById("title").innerHTML = data[category].title;
    document.getElementById("description").innerHTML = data[category].description;
}

load();