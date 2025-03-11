async function loadProdotto(prodotto, parent, button = true) {
    const id = typeof(prodotto) != "object" ? prodotto : prodotto.id;
    const product = document.createElement("div");
    product.classList = "row d-flex justify-content-center";
    product.innerHTML = `<div class="col-md-4 my-4">
                  <div id="p${id}-carousel" class="carousel slide" data-bs-ride="carousel">
                      <div class="carousel-inner" id="p${id}-carousel-images"></div>
                      <button class="carousel-control-prev d-none" type="button" data-bs-target="#p${id}-carousel" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next d-none" type="button" data-bs-target="#p${id}-carousel" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Next</span>
                      </button>
                  </div>
              </div>

              <div class="col-md-6 d-flex flex-column justify-content-center"> <!-- d-flex, flex-column, justify-content-center per centrare verticalmente -->
                  <h2 id="p${id}-product-title"></h2>
                  <p id="p${id}-description"><strong></strong></p>
                  <strong>Prezzo: </strong>
                  <p id="p${id}-price"></p>

                  <div class="mb-3">
                      <label class="form-label">Seleziona Colore</label>
                      <div class="color-picker-container" id="p${id}-color-picker"></div>
                  </div>

                  <div class="mb-3 d-none">
                      <label class="form-label" for="size">Seleziona Taglia</label>
                      <select class="form-select" id="p${id}-size" name="${id}-size"></select>
                  </div>
                  
                  <div class="overflow-auto mb-4">
                      <h4>Caratteristiche</h4>
                      <table class="table table-bordered" id="p${id}-caratteristiche-table">
                          <tbody></tbody>
                      </table>
                  </div>
                  
                  ${
        button === true
            ? '<button type="submit" class="btn btn-primary">Aggiungi al Carrello</button>'
            : ""
    }
                  <input type="hidden" name="id[]" value="${id}">
              </div>`;
    parent.appendChild(product);
    if (typeof(prodotto) != "object"){
        prodotto = await fetchJSON(`api/productdetails.php?id=${id}`);
    }
    if (!prodotto) {
        console.error("Prodotto/Bundle non trovato");
        return;
    }

    const productTitle = product.querySelector("#p" + id + "-product-title");
    const description = product.querySelector("#p" + id + "-description");
    const price = product.querySelector("#p" + id + "-price");
    const carousel = product.querySelector("#p" + id + "-carousel-images");
    const caratteristicheTable = product.querySelector(
        "#p" + id + "-caratteristiche-table tbody"
    );

    updateCarousel(carousel, prodotto.colori[0].immagini);
    productTitle.innerText = prodotto.marca + " " + prodotto.modello;
    description.innerText = prodotto.descrizione;
    price.innerText = prodotto.prezzo + " €";

    // Popolamento della tabella delle caratteristiche
    if (prodotto.caratteristiche && prodotto.caratteristiche.length > 0) {
        prodotto.caratteristiche.forEach((caratteristica) => {
            const row = document.createElement("tr");
            row.innerHTML = `
      <th scope="row">${caratteristica.titolo}</th>
      <td>${caratteristica.descrizione}</td>
    `;
            caratteristicheTable.appendChild(row);
        });
    } else {
        const caratteristicheDiv = product.querySelector(".overflow-auto");
        caratteristicheDiv.classList.add("d-none");
    }

    let size = product.querySelector("#p" + id + "-size");
    const colorPickerContainer = product.querySelector(
        "#p" + id + "-color-picker"
    );
    updateSizes(size, prodotto.colori[0].taglie);
    prodotto.colori.forEach((colore, i) => {
        colorPickerContainer.innerHTML += `<div class="color-box">
                      <input type="radio" id="p${id}-${
            colore.colore
        }" name="${id}-color" value="${colore.id}" class="d-none" ${
            i == "0" ? "checked" : ""
        }/>
                      <label for="p${id}-${colore.colore}">
                      <div class="color-element" style="background-color: ${
            colore.hex
        };" title="${colore.colore}"></div>
                      ${colore.colore}
                      </label>
                  </div>`;
    });


    colorPickerContainer.addEventListener("change", (e) => {
        const selectedColor = prodotto.colori.find(
            (colore) => colore.id == e.target.value
        );
        console.log(e.target.value)
        console.log(selectedColor)
        updateCarousel(carousel, selectedColor.immagini);
        updateSizes(size, selectedColor.taglie);
    });
    return prodotto;
}

function updateCarousel(carousel, images) {
    carousel.innerHTML = images
        .map(
            (img, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
          <img src="${img}" class="d-block product-image" alt="Product Image">
      </div>
  `
        )
        .join("");
    carousel.parentElement.querySelectorAll("button").forEach((button) => {
        if (images.length > 1) button.classList.remove("d-none");
        else button.classList.add("d-none");
    });
}

function updateSizes(container, sizes) {
    container.parentElement.classList.add("d-none");
    sizes.forEach((taglia, i) => {
        container.innerHTML = "";
        container.innerHTML += `<option value="${taglia.id}">${taglia.taglia}</option>`;
        container.parentElement.classList.remove("d-none");
    });
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id") ?? null;
if (id) loadProdotto(id, document.getElementById("product-form"));
