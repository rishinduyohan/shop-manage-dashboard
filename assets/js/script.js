// console.log("Test js..");
const productGrid = document.getElementById('productGrid');
const API_URL = 'https://dummyjson.com/products';
let products = [];

fetch(API_URL + '?limit=16')
    .then(res => res.json())
    .then(data => {
        products = data;
        // console.log(products);
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.classList.add('card');
            productCard.setAttribute('data-product-id', product.id);
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
    // console.log(id);
    const product = products.products.find(product => product.id === id);
    if (product) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${product.thumbnail}" class="img-fluid rounded mb-3" alt="${product.title}">
                            </div>
                            <div class="col-md-8">
                                <form id="editForm">
                                    <div class="mb-3">
                                        <label class="form-label">Title</label>
                                        <input type="text" class="form-control" value="${product.title}" id="editTitle">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Description</label>
                                        <textarea class="form-control" id="editDesc">${product.description}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Price</label>
                                        <input type="number" class="form-control" value="${product.price}" id="editPrice">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Category</label>
                                        <input type="text" class="form-control" value="${product.category}" id="editCategory">
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="updateProduct(${id})">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        new bootstrap.Modal(modal).show();
    }
}

async function deleteProduct(id, btn) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const response = await fetch(API_URL + `/${id}`, { method: 'DELETE' });

            if (response.status === 200) {
                btn.closest('.product-card').remove();
                alert("Successfully deleted!");
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function updateProduct(id) {
    // alert(id);
    const updatedItem = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDesc').value,
        price: document.getElementById('editPrice').value,
        category: document.getElementById('editCategory').value
    }
    try {
        const response = await fetch(API_URL+`/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
        });

        if (response.status === 200) {
            alert("Product Updated Successfully!");
            const modalElement = document.querySelector('.modal.show');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                const productIndex = products.products.findIndex(product => product.id === id);
                if (productIndex !== -1) {
                    products.products[productIndex] = { ...products.products[productIndex], ...updatedItem };
                }
                const productCard = document.querySelector(`[data-product-id="${id}"]`);
                if (productCard) {
                    productCard.querySelector('.card-title').textContent = updatedItem.title;
                    productCard.querySelector('.card-text').textContent = updatedItem.description;
                    productCard.querySelectorAll('.list-group-item')[1].textContent = `$${updatedItem.price}`;
                    productCard.querySelectorAll('.list-group-item')[0].textContent = updatedItem.category;
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        title: document.getElementById('title').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('imageUrl').value || 'https://via.placeholder.com/150'
    };

    if (productId) {
        updateProduct(productId, productData);
    } else {
        createProduct(productData);
    }
});

async function createProduct(data) {
    try {
        const response = await fetch(API_URL+`/add`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card card';
        productCard.setAttribute('data-product-id', result.id);
        productCard.innerHTML = `
            <img src="${result.thumbnail}" class="card-img-top" alt="${result.title}">
            <div class="card-body">
                <h5 class="card-title">${result.title}</h5>
                <p class="card-text">${result.description || ''}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">${result.category}</li>
                <li class="list-group-item">$${result.price}</li>
            </ul>
            <div class="card-footer bg-white border-top-0 d-flex gap-2">
                <button class="btn btn-outline-primary flex-grow-1" onclick="editProduct(${result.id})">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn btn-outline-danger" onclick="deleteProduct(${result.id}, this)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
        alert('Product Added successfully!');
        
    } catch (error) {
        console.error(error);
    }
}