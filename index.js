class Product {
    constructor(name, price, image) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.reviews = [];
    }

    get averageRating() {
        if (this.reviews.length === 0) return 0;
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round(total / this.reviews.length);
    }

    addReview(comment, rating) {
        const timestamp = new Date().toLocaleString();
        this.reviews.push({ comment, rating, timestamp });
    }
}

const products = [
    new Product("Product 1", 10.00, "https://placehold.jp/3d4070/ffffff/150x150.png"),
    new Product("Product 2", 20.00, "https://placehold.jp/3d4070/ffffff/150x150.png"),
    new Product("Product 3", 25.00, "https://placehold.jp/3d4070/ffffff/150x150.png"),
];

const showProducts = document.querySelector("#product-container");

function updateProductCard(product) {
    const productCard = document.querySelector(`[data-product-name="${product.name}"]`);
    if (productCard) {
        const ratingElement = productCard.querySelector('.card-text:last-of-type');
        ratingElement.textContent = `Rating: ${product.averageRating}/5`;
    }
}

products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("col-3");
    card.innerHTML = `
    <a href="#" class="btn btn-white">
        <div class="card text-center" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#productModal" data-product-name="${product.name}" data-product-rating="${product.averageRating}">
            <img src="${product.image}" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: $${product.price.toFixed(2)}</p>
                <p class="card-text">Rating: ${product.averageRating}/5</p>
            </div>
        </div>
        </a>
    `;
    showProducts.appendChild(card);
});

const productModal = document.getElementById('productModal');
productModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const productName = button.getAttribute('data-product-name');

    const modalTitle = productModal.querySelector('.modal-title');
    const reviewsContainer = productModal.querySelector('#reviewsContainer');

    modalTitle.textContent = productName;
    reviewsContainer.innerHTML = '';

    const product = products.find(p => p.name === productName);
    product.reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.innerHTML = `<strong>${review.timestamp}</strong>: ${review.comment} (Rating: ${review.rating})`;
        reviewElement.innerHTML =`
        <strong>Comment: </strong>${review.comment}<br>
        <strong>Rating: </strong>${review.rating}<br>
        <p>Posted on: ${review.timestamp}<br></p>
        `;

        reviewsContainer.appendChild(reviewElement);
    });
});

const reviewForm = document.getElementById('reviewForm');
reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = productModal.querySelector('.modal-title').textContent;
    const reviewComment = document.getElementById('reviewComment').value;
    const reviewRating = parseInt(document.getElementById('reviewRating').value);

    const product = products.find(p => p.name === productName);
    product.addReview(reviewComment, reviewRating);

    updateProductCard(product);

    reviewForm.reset();

    const modal = bootstrap.Modal.getInstance(productModal);
    modal.hide();
});

