
async function load() {
    const data = await fetchJSON("content/bundles.json");

    document.getElementById("title").innerHTML = data.title;
    document.getElementById("description").innerHTML = data.description;
}

load();