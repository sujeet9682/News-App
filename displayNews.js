  // Display news articles

  const newsContainer = document.getElementById("news-container");
  // Track displayed article IDs to prevent duplicates
  let displayedArticles = new Set();

  // Create loading indicator element once
  function createLoadingIndicator() {
    // Check if the loading indicator already exists
    let loadingIndicator = document.getElementById("loading-indicator");
    
    if (!loadingIndicator) {
      loadingIndicator = document.createElement("div");
      loadingIndicator.className = "loading-indicator";
      loadingIndicator.id = "loading-indicator";
      
      // Add loading spinner
      const spinnerHTML = `
        <div style="display: flex; align-items: center; justify-content: center;">
          <div style="border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; width: 24px; height: 24px; margin-right: 12px; animation: spin 1s linear infinite;"></div>
          <span>Loading more articles...</span>
        </div>
      `;
      
      loadingIndicator.innerHTML = spinnerHTML;
      loadingIndicator.style.display = "none";
      document.body.appendChild(loadingIndicator);
      
      // Add keyframe animation for the spinner
      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    return loadingIndicator;
  }

  // Create the loading indicator when the page loads
  createLoadingIndicator();

  const displayNews = (articles, shouldClear = true) => {
    // Clear the container only if shouldClear is true
    if (shouldClear) {
      newsContainer.innerHTML = "";
      // Reset the displayed articles tracking when switching categories
      displayedArticles.clear();
    }
    
    if (articles.length === 0) {
      if (shouldClear) {
        // Create a visually prominent error message
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "No articles available for this selection. Try a different category or country.";
        newsContainer.appendChild(errorMsg);
      }
      return;
    }

    articles.forEach((article) => {
        if(article.description == null) return

        // Create a unique ID for the article (using URL)
        const articleId = article.url;
        
        // Skip if this article has already been displayed
        if(displayedArticles.has(articleId)) return;
        
        // Mark this article as displayed
        displayedArticles.add(articleId);

        const newsItem = document.createElement("a");
        newsItem.className = "news-item";
        newsItem.href = article.url

        const itemTitle = document.createElement("h3")
        itemTitle.className = "article-title"
        itemTitle.textContent = article.title.length > 30 ? article.title.substring(0, 89) + "..." : article.title
        newsItem.appendChild(itemTitle)

        const img = document.createElement("img");
        img.className = "article-img";
        img.src = article.urlToImage || "https://via.placeholder.com/300x200?text=No+Image";
        img.alt = "news-image"
        newsItem.appendChild(img);
        
        newsItem.innerHTML += `<p>${
            article.description?.length > 51
            ? article.description.substring(0, 91) + "..."
            : article.description
        }</p>`;

        newsContainer.appendChild(newsItem);
    });
  };



  