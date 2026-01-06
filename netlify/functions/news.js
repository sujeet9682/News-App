
export const handler = async (event) => {
    const { category, country, page = 1 } = event.queryStringParameters;
  
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&page=${page}&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    );
  
    const data = await response.json();
  
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  };
  