
async function load() {
    const data = await fetchJSON("content/carrello.json");

    document.getElementById("title").innerHTML = data.title;
    document.getElementById("description").innerHTML = data.description;

    document.getElementById("table-product").innerHTML = data.table["product"];
    document.getElementById("table-color").innerHTML = data.table["color"];
    document.getElementById("table-size").innerHTML = data.table["size"];
    document.getElementById("table-quantity").innerHTML = data.table["quantity"];
    document.getElementById("table-price").innerHTML = data.table["price"];
    document.getElementById("table-total").innerHTML = data.table["total"];
    document.getElementById("table-remove").innerHTML = data.table["remove"];

    document.getElementById("discount-code-label").innerHTML = data["discount-code"];
    document.getElementById("discount-code").placeholder = data["code-placeholder"];
    document.getElementById("discount-apply").innerHTML = data["discount-apply"];
    document.getElementById("provisional-total-label").innerHTML = data["provisional-total"];
    document.getElementById("discount").innerHTML = data["discount"];
    document.getElementById("supertotal").innerHTML = data["total"];
    document.getElementById("checkout").innerHTML = data["checkout"];
}

load();