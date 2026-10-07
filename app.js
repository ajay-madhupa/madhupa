// ===============================
// SUPABASE CONNECTION
// ===============================

const SUPABASE_URL =
    "https://rusvskaresrhmevfrnse.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2DtiHqMJKM-Olp0DJXsXHw_D0XpZmeN";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ===============================
// ELEMENTS
// ===============================

const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    productContainer.innerHTML =
        "<p>Loading products...</p>";


    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("visible", true)
            .order("id", {
                ascending: false
            });


    if (error) {

        console.error(
            "Supabase error:",
            error
        );

        productContainer.innerHTML = `
            <p>
                ❌ Unable to load products.
            </p>
        `;

        return;
    }


    displayProducts(data);
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(products) {

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";

    if (!products || products.length === 0) {

        container.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
    		class="product-image"
    		src="${product.image}"
    		alt="${product.name}"
		>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="price">
                    ₹${product.price}
                </p>

                <p>
                    ${product.category}
                </p>

                <p>
                    Sizes: ${product.sizes}
                </p>

                <button class="whatsapp-button">
                    Order on WhatsApp
                </button>

            </div>
        `;

        // Open product details when card is clicked
        card.addEventListener("click", function(event) {

            // Don't open popup when WhatsApp button is clicked
            if (
                event.target.classList.contains("whatsapp-btn")
            ) {
                return;
            }

            openProductModal(product);
        });


        // WhatsApp button
        const whatsappButton =
            card.querySelector(".whatsapp-button");

        whatsappButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const message =
                    `Hi, I am interested in ${product.name} - ₹${product.price}. Available sizes: ${product.sizes}`;

                const whatsappUrl =
                    `https://wa.me/917981908542?text=${encodeURIComponent(message)}`;

                window.open(
                    whatsappUrl,
                    "_blank"
                );
            }
        );


        container.appendChild(card);
    });
}


// ===============================
// SEARCH + FILTER
// ===============================

let allProducts = [];


async function getProducts() {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("visible", true)
            .order("id", {
                ascending: false
            });


    if (error) {

        console.error(error);

        return;

    }


    allProducts = data;

    displayProducts(
        allProducts
    );
}



function filterProducts() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const filtered =
        allProducts.filter(
            function(product) {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayProducts(
        filtered
    );

}


searchInput.addEventListener(
    "input",
    filterProducts
);


categoryFilter.addEventListener(
    "change",
    filterProducts
);


// ===============================
// WHATSAPP
// ===============================

function orderProduct(
    name,
    price
) {

    const phoneNumber =
        "917981908542";


    const message =
        "Hello, I am interested in " +
        name +
        " priced at ₹" +
        price;


    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );
}

// ===============================
// Open Product Popup
// ===============================


function openProductModal(product) {

    const images =
        product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];


    let currentImageIndex = 0;


    const modal =
        document.getElementById("productModal");

    const modalImage =
        document.getElementById("modalImage");

    const imageCounter =
        document.getElementById("imageCounter");

    const thumbnailContainer =
        document.getElementById("thumbnailContainer");

    const prevButton =
        document.getElementById("prevImage");

    const nextButton =
        document.getElementById("nextImage");


    // ==================================
    // SHOW CURRENT IMAGE
    // ==================================

    function showImage() {

        if (images.length === 0) {

            modalImage.src =
                "https://placehold.co/600x700?text=No+Image";

        } else {

            modalImage.src =
                images[currentImageIndex];

        }


        // Image counter

        imageCounter.textContent =
            images.length > 0
                ? `${currentImageIndex + 1} / ${images.length}`
                : "";


        // ==================================
        // Update thumbnail selection
        // ==================================

        const thumbnails =
            thumbnailContainer.querySelectorAll("img");


        thumbnails.forEach((thumbnail, index) => {

            if (index === currentImageIndex) {

                thumbnail.classList.add(
                    "active-thumbnail"
                );

            } else {

                thumbnail.classList.remove(
                    "active-thumbnail"
                );

            }

        });
    }


    // ==================================
    // CREATE THUMBNAILS
    // ==================================

    thumbnailContainer.innerHTML = "";


    images.forEach((image, index) => {

        const thumbnail =
            document.createElement("img");

        thumbnail.src = image;

        thumbnail.alt =
            `${product.name} image ${index + 1}`;


        thumbnail.className =
            "product-thumbnail";


        thumbnail.onclick = function () {

            currentImageIndex = index;

            showImage();

        };


        thumbnailContainer.appendChild(
            thumbnail
        );

    });


    // ==================================
    // PRODUCT INFORMATION
    // ==================================

    document.getElementById("modalName").textContent =
        product.name;

    document.getElementById("modalPrice").textContent =
        `₹${product.price}`;

    document.getElementById("modalCategory").textContent =
        product.category;

    document.getElementById("modalSizes").textContent =
        product.sizes;


    // ==================================
    // PREVIOUS IMAGE
    // ==================================

    prevButton.onclick = function () {

        if (images.length === 0) {
            return;
        }

        currentImageIndex--;

        if (currentImageIndex < 0) {

            currentImageIndex =
                images.length - 1;
        }

        showImage();

    };


    // ==================================
    // NEXT IMAGE
    // ==================================

    nextButton.onclick = function () {

        if (images.length === 0) {
            return;
        }

        currentImageIndex++;

        if (currentImageIndex >= images.length) {

            currentImageIndex = 0;
        }

        showImage();

    };


    // ==================================
    // HIDE ARROWS FOR ONE IMAGE
    // ==================================

    if (images.length <= 1) {

        prevButton.style.display = "none";
        nextButton.style.display = "none";

    } else {

        prevButton.style.display = "flex";
        nextButton.style.display = "flex";

    }


    // ==================================
    // SHOW FIRST IMAGE
    // ==================================

    showImage();


    // ==================================
    // OPEN MODAL
    // ==================================

    modal.style.display = "flex";


    // ==================================
    // WHATSAPP ORDER
    // ==================================

    const whatsappButton =
        document.getElementById("modalWhatsApp");


    whatsappButton.onclick = function () {

        const message =
            `Hi, I am interested in ${product.name} - ₹${product.price}. Available sizes: ${product.sizes}`;


        const whatsappUrl =
            `https://wa.me/917981908542?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappUrl,
            "_blank"
        );

    };

}


// Close popup
document
    .getElementById("closeModal")
    .addEventListener("click", function() {

        document.getElementById("productModal")
            .style.display = "none";

    });


// Close popup when clicking outside
document
    .getElementById("productModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            this.style.display = "none";
        }

    });


// Close popup using Escape key
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document.getElementById("productModal")
            .style.display = "none";
    }

});


// ===============================
// START
// ===============================

getProducts();
