// console.log("Test js..");
const productGrid = document.getElementById('productGrid');
let products = [];

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        products = data;
        // console.log(products);
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.classList = 'card';
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
                <div class="card-body">
                    <a href="#" class="card-link">Card link</a>
                    <a href="#" class="card-link">Another link</a>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    });

