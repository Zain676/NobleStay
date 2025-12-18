(function () {
  "use strict";

  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// filter scroller

const filtersContainer = document.getElementById("filters");
const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");
const filterItems = document.querySelectorAll("#filters .filter");

if (scrollLeftBtn && scrollRightBtn && filtersContainer) {
  scrollLeftBtn.addEventListener("click", () => {
    filtersContainer.scrollBy({ left: -200, behavior: "smooth" });
  });

  scrollRightBtn.addEventListener("click", () => {
    filtersContainer.scrollBy({ left: 200, behavior: "smooth" });
  });
}

if (filterItems.length > 0) {
  filterItems.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Remove active from all filters
      filterItems.forEach((f) => f.classList.remove("active"));

      // Add active to clicked one
      filter.classList.add("active");

      // Filter listings by selected category
      const selectedCategory = filter.querySelector("p").innerText.trim();
      filterListingsByCategory(selectedCategory);
    });
  });
}

function filterListingsByCategory(category) {
  const listings = document.querySelectorAll(".listing"); // Your listing cards

  listings.forEach((listing) => {
    const cat = listing.getAttribute("data-category");
    if (category === "All" || cat === category) {
      listing.style.display = "block";
    } else {
      listing.style.display = "none";
    }
  });
}

// filtering by category

const filterWrapper = document.getElementById("filters");

if (filterWrapper) {
  filterWrapper.addEventListener("click", async (event) => {
    const element = event.target.closest(".category-btn");
    if (!element) return;

    const category = element.getAttribute("data-category");

    // Show loader
    document.getElementById("loader-overlay").style.display = "flex";

    try {
      const res = await fetch(`/listings/category/${category}`);
      const data = await res.json();
      const listingsContainer = document.getElementById("listings-container");
      listingsContainer.innerHTML = "";

      if (!data.listings || data.listings.length === 0) {
        listingsContainer.innerHTML = `
          <div class="d-flex justify-content-center align-items-center w-100" style="min-height: 60vh;">
            <div class="card text-center shadow p-4" style="width: 100%; max-width: 400px;">
              <div class="card-body">
                <i class="bi bi-search fs-1 text-muted mb-3"></i>
                <h4 class="text-muted">No listings found</h4>
                <p class="text-secondary">Try another category or check back later.</p>
              </div>
            </div>
          </div>`;
      } else {
        data.listings.forEach((listing) => {
          const html = `
            <a href="/listings/${listing._id}" class="listing-link" data-category="${listing.category}">
              <div class="card mt-4 listing-card">
                <img src="${listing.image.url}" class="card-img-top">
                <div class="card-img-overlay"></div>
                <div class="card-body mt-3">
                  <p class="card-text mb-4">
                    <b>${listing.title}</b><br>
                    &#8360; ${listing.price.toLocaleString("en-PK")} / night
                  </p>
                </div>
              </div>
            </a>`;
          listingsContainer.innerHTML += html;
        });
      }
    } catch (err) {
      console.error("Error fetching filtered listings:", err);
      listingsContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
    } finally {
      // Hide loader
      document.getElementById("loader-overlay").style.display = "none";
    }
  });
}
