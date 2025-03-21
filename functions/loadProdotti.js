document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const page = urlParams.get("page") || 1;
    const pageSize = 10; // Default page size

    // Load products
    const productData = await fetchJSON(`api/getproducts.php?category=${category}&page=${page}&page_size=${pageSize}`);
    const productContainer = document.querySelector(
        ".d-flex.flex-wrap.justify-content-center"
    );
    productContainer.innerHTML = ""; // Clear container before adding items

    if (productData.hasOwnProperty("error")) {
      const error = document.createElement("div");
      error.className = "alert alert-danger";
      error.textContent = "Errore nel caricamento dei prodotti";
      productContainer.appendChild(error);
      return;
    }

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

    // Create pagination
    createPagination(productData.current_page, productData.total_pages, category);
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  }
});

// Function to create pagination links
function createPagination(currentPage, totalPages, category) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  // Convert to numbers
  currentPage = parseInt(currentPage);
  totalPages = parseInt(totalPages);

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = currentPage > 1 ? `products.php?category=${category}&page=${currentPage - 1}` : "#";
  prevLink.setAttribute("aria-label", "Previous");
  prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
  prevLi.appendChild(prevLink);
  paginationContainer.appendChild(prevLi);

  // Determine range of page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Ensure we always show at least 5 page links if available
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = `products.php?category=${category}&page=${i}`;
    pageLink.textContent = i;
    pageLi.appendChild(pageLink);
    paginationContainer.appendChild(pageLi);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = currentPage < totalPages ? `products.php?category=${category}&page=${currentPage + 1}` : "#";
  nextLink.setAttribute("aria-label", "Next");
  nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
  nextLi.appendChild(nextLink);
  paginationContainer.appendChild(nextLi);
}