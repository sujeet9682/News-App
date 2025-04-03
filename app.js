document.addEventListener("DOMContentLoaded", function () {
  const newsContainer = document.getElementById("news-container");
  const categoryButtons = document.getElementById("category-buttons");

  const API_KEY = CONFIG.API_KEY;
  const BASE_URL = "https://newsapi.org/v2";

  const categories = [
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];
  
  // Add countries
  const countries = [
    { code: "us", name: "USA" },
    { code: "in", name: "India" },
    { code: "gb", name: "UK" },
  ];

  // Track current page and loading state
  let currentPage = 1;
  let isLoading = false;
  let currentCategory = "business";
  let currentCountry = "us"; // Default country

  // Create country selector
  const createCountrySelector = () => {
    // Target the navbar country selector instead of header
    const countrySelector = document.getElementById('navbar-country-selector');
    
    if (!countrySelector) return; // Safety check
    
    // Create country buttons without creating a new container
    countries.forEach(country => {
      const button = document.createElement("button");
      button.className = "navbar-country-btn";
      button.dataset.country = country.code;
      button.textContent = country.name;
      
      // Style active country
      if (country.code === currentCountry) {
        button.classList.add("active");
      }
      
      button.onclick = debounce(() => {
        // Update active class
        document.querySelectorAll('.navbar-country-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update current country and reset page
        currentCountry = country.code;
        currentPage = 1;
        
        // Save to session storage
        sessionStorage.setItem("selectedCountry", currentCountry);
        
        // Fetch news with the selected country
        fetchNews(currentCategory, 1, true);
      }, 300);
      
      countrySelector.appendChild(button);
    });
  };

  // Debounce - to optimize multiple requests
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch news based on selected category and country
  const fetchNews = async (category, page = 1, shouldClear = true) => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    try {
      isLoading = true;
      currentCategory = category;
      
      // Show loading indicator before fetching
      const loadingIndicator = document.getElementById("loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.style.display = "block";
      }
      
      // Clear container before showing potential error
      if (shouldClear) {
        newsContainer.innerHTML = "";
      }
      
      const response = await fetch(
        `${BASE_URL}/top-headlines?category=${category}&country=${currentCountry}&page=${page}&pageSize=10&apiKey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "ok") {
        const articles = data.articles;
        console.log(`Fetched ${articles.length} articles for ${category}, country ${currentCountry}, page ${page}`);
        
        if (articles.length === 0) {
          // Show a prominent message when no articles found
          const noArticlesMsg = document.createElement("div");
          noArticlesMsg.className = "error-message";
          noArticlesMsg.textContent = "No articles available for this selection. Try a different category or country.";
          newsContainer.appendChild(noArticlesMsg);
        } else {
          // Pass the shouldClear parameter to displayNews
          displayNews(articles, shouldClear);
        }
        
        // Store the selected category
        sessionStorage.setItem("selectedCategory", category); 
        
        // Update current page
        currentPage = page;
      } else {
        console.error("Failed to fetch news:", data.message);
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Error fetching news. Please try again later.";
        newsContainer.appendChild(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = "Error fetching news. Please try again later.";
      newsContainer.appendChild(errorMsg);
    } finally {
      isLoading = false;
      // Hide loading indicator after fetch completes
      const loadingIndicator = document.getElementById("loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }
    }
  };

  // Load more news for infinite scroll
  const loadMoreNews = () => {
    // Show loading indicator before fetching
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
    }
    
    fetchNews(currentCategory, currentPage + 1, false);
  };

  // Render category buttons
  const renderCategoryButtons = () => {
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "category-btn";
      // Add active class if this is the current category
      if (category === currentCategory) {
        button.classList.add("active");
      }
      
      button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      button.onclick = debounce(() => {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Reset page count and load new category
        currentPage = 1;
        fetchNews(category, 1, true);
      }, 300);
      categoryButtons.appendChild(button);
    });
  };

  // Check for saved country in session storage
  const savedCountry = sessionStorage.getItem("selectedCountry");
  if (savedCountry) {
    currentCountry = savedCountry;
  }
  
  // Create country selector
  createCountrySelector();

  // Set selected category from sessionStorage (if any)
  const selectedCategory = sessionStorage.getItem("selectedCategory");
  if (selectedCategory) {
    currentCategory = selectedCategory;
    fetchNews(selectedCategory, 1, true); // Fetch news based on saved category
  } else {
    fetchNews("business", 1, true); // Default to 'business' category
  }

  // Render the category buttons
  renderCategoryButtons();

  // Improved Infinite Scroll Event with debounce
  window.addEventListener("scroll", debounce(() => {
    // Check if we're near the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
      loadMoreNews();
    }
  }, 300));
});
