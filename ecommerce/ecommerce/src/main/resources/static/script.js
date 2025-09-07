document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("productForm");
  const message = document.getElementById("message");
  const productContainer = document.getElementById("products"); // Optional: If you display products below

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const product = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: parseFloat(form.price.value),
      stock: parseInt(form.stock.value)
    };

    if (!product.name || isNaN(product.price) || isNaN(product.stock)) {
      message.style.color = "red";
      message.textContent = "Please fill all required fields correctly.";
      return;
    }

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      message.style.color = "green";
      message.textContent = `✅ Product "${data.name}" added successfully!`;
      form.reset();
      if (productContainer) {
        loadProducts(); // Refresh product list if container exists
      }
    })
    .catch(error => {
      message.style.color = "red";
      message.textContent = `❌ ${error.message}`;
    });
  });

  // Optional: Load products after adding new one
  function loadProducts() {
    fetch("/api/products")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then(data => {
        productContainer.innerHTML = "";
        data.forEach(product => {
          productContainer.innerHTML += `
            <div style="border:1px solid #ddd; margin:10px; padding:10px; border-radius:5px;">
              <h3>${product.name}</h3>
              <p>${product.description || ""}</p>
              <p><strong>Price:</strong> ₹${product.price}</p>
              <p><strong>Stock:</strong> ${product.stock}</p>
            </div>
          `;
        });
      })
      .catch(err => {
        productContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
      });
  }

  // Uncomment below if you want products to show when the page loads
  // if (productContainer) loadProducts();
});
