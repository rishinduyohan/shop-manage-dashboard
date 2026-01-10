// console.log("Test js..");
const productGrid = document.getElementById('productGrid');
const API_URL = 'https://dummyjson.com/products';
let products = [];

fetch(API_URL+'?limit=16')
    .then(res => res.json())
    .then(data => {
        products = data;
        // console.log(products);
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.classList.add('card');
            productCard.innerHTML = `
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${product.category}</li>
                    <li class="list-group-item">$${product.price}</li>
                    <li class="list-group-item">${product.availabilityStatus}</li>
                </ul>
                <div class="card-footer bg-white border-top-0 d-flex gap-2">
                <button class="btn btn-outline-primary flex-grow-1" onclick="editProduct(${product.id})">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id}, this)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            `;
            productGrid.appendChild(productCard);
        });
    });

editProduct = (id) => {
    console.log(id);

}

async function deleteProduct(id, btn) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const response = await fetch(API_URL+`/${id}`, {method: 'DELETE'});

            if(response.status===200){
                btn.closest('.product-card').remove();
                alert("Successfully deleted!");
            }
        } catch (error) {
            console.error(error);
        }
    }
}