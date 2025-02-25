async function loadProdotto(id, parent, button = true) {
    const product = document.createElement("div");
    product.classList = ("row d-flex align-items-center justify-content-center");
    product.innerHTML = `<div class="col-md-4 my-4">
                    <div id="${id}-carousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner" id="${id}-carousel-images"></div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#${id}-carousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#${id}-carousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div class="col-md-6 d-flex flex-column justify-content-center"> <!-- d-flex, flex-column, justify-content-center per centrare verticalmente -->
                    <h2 id="${id}-product-title"></h2>
                    <p id="${id}-description"><strong></strong></p>
                    <strong>Prezzo: </strong>
                    <p id="${id}-price"></p>

                    <div class="mb-3">
                        <label class="form-label">Seleziona Colore</label>
                        <div class="color-picker-container" id="${id}-color-picker"></div>
                    </div>

                    <div class="mb-3 d-none">
                        <label class="form-label" for="size">Seleziona Taglia</label>
                        <select class="form-select" id="size" name="${id}-size"></select>
                    </div>
                    ${button === true ? "<button type=\"submit\" class=\"btn btn-primary\">Aggiungi al Carrello</button>" : ""}
                </div>`;
  const file = id.startsWith("s") ? "sport.json" : "lusso.json";
  const response = await fetch(`data/${file}`);
  data = await response.json();

  const prodotto = data.find((p) => p.id === id);
  if (!prodotto) {
    console.error("Prodotto/Bundle non trovato");
    return;
  }

  
  const productTitle = product.querySelector("#" +id + "-product-title");
  const description = product.querySelector("#" +id + "-description");
  const price = product.querySelector("#" +id + "-price");
  const carousel = product.querySelector("#" +id + "-carousel-images");
  
  updateCarousel(carousel, prodotto.colori[0].immagini);
  productTitle.innerText = prodotto.marca + " " + prodotto.modello;
  description.innerText = prodotto.descrizione;
  price.innerText = prodotto.prezzo + " €";

  const size = product.querySelector("#" +id + "-size");
  const colorPickerContainer = product.querySelector("#" +id + "-color-picker");

  prodotto.colori.forEach((colore, i) => {
    colorPickerContainer.innerHTML += `<div class="color-box">
                        <input type="radio" id="${id}-${
                          colore.nome
                        }" name="${id}-color" value="${colore.nome}" class="d-none" ${
      i == "0" ? "checked" : ""
    }/>
                        <label for="${id}-${colore.nome}">
                        <div class="color-element" style="background-color: ${
                          colore.codice
                        };" title="${colore.nome}"></div>
                        ${colore.nome}
                        </label>
                    </div>`;
  });

  prodotto.taglie.forEach((taglia, i) => {
    size.innerHTML += `<option value="${taglia}">${taglia}</option>`;
    size.parentElement.classList.remove("d-none");
  });

  colorPickerContainer.addEventListener("change", (e) => {
    const selectedColor = prodotto.colori.find(
      (colore) => colore.nome === e.target.value
    );
    updateCarousel(carousel, selectedColor.immagini);
  });
  parent.appendChild(product);
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
}


const params = new URLSearchParams(window.location.search);
const id = params.get("id") ?? null;
if (id) loadProdotto(id, document.getElementById("product-form"));