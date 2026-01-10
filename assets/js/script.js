console.log("Test js..");

const modal = document.getElementById('productModal');
        const openBtn = document.getElementById('openAddModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        const toggleModal = () => modal.classList.toggle('hidden');

        openBtn.addEventListener('click', () => {
            document.getElementById('productForm').reset();
            document.getElementById('modalTitle').innerText = 'Add New Product';
            toggleModal();
        });

        [closeBtn, cancelBtn].forEach(btn => btn.addEventListener('click', toggleModal));