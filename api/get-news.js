// api/get-news.js

/**
 * Esta es una función serverless que se ejecuta en un entorno de Node.js.
 * Vercel automáticamente convierte archivos en esta carpeta /api en endpoints.
 * Por ejemplo, este archivo estará disponible en TUDOMINIO.com/api/get-news
 */
export default async function handler(request, response) {
  const apiKey = 'a895210f770b6ab78056d679cd5887c4';
  const FETCH_TIMEOUT = 8000; // 8 seconds timeout for external API calls

  try {
    const apiUrl = `https://gnews.io/api/v4/search?q=colombia&lang=es&max=10&token=${apiKey}`;

    const newsController = new AbortController();
    const newsTimeoutId = setTimeout(() => newsController.abort(), FETCH_TIMEOUT);

    let newsResponse;
    try {
      newsResponse = await fetch(apiUrl, { signal: newsController.signal });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout fetching news from GNews API.');
      }
      throw error; // Re-throw other fetch errors
    } finally {
      clearTimeout(newsTimeoutId);
    }

    if (!newsResponse.ok) {
      throw new Error(`GNews API responded with status: ${newsResponse.status} ${newsResponse.statusText}`);
    }
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error('No articles found in GNews response or API returned empty.');
    }

    // Mapear la respuesta de GNews a la estructura que el frontend espera
    const heroStory = {
      image: newsData.articles[0].image,
      category: newsData.articles[0].source.name || 'Noticias',
      title: newsData.articles[0].title,
      summary: newsData.articles[0].description,
      author: newsData.articles[0].source.name || 'Desconocido',
      time: new Date(newsData.articles[0].publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      location: 'Colombia', // GNews no provee ubicación detallada
      comments: Math.floor(Math.random() * 1000) + 50, // Dato simulado
      url: newsData.articles[0].url
    };

    const topStories = newsData.articles.slice(1, 9).map(article => ({
      image: article.image || 'img/IA.jpg', // Usar imagen de GNews o una por defecto
      alt: article.title,
      category: article.source.name || 'Noticias',
      title: article.title,
      summary: article.description,
      time: new Date(article.publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      reads: `${(Math.random() * 5).toFixed(1)}k lecturas`, // Dato simulado
      url: article.url
    }));

    const responseData = {
      heroStory,
      topStories
    };

    // Set cache headers for Vercel's Edge Network (cache for 5 minutes)
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    // Configuramos la cabecera para indicar que la respuesta es JSON
    response.setHeader('Content-Type', 'application/json');
    // Enviamos una respuesta exitosa (código 200) con los datos de GNews
    response.status(200).json(responseData);

  } catch (error) {
    console.error('Error in get-news serverless function:', error.message);
    // En caso de error, devolver una respuesta de error más específica
    response.status(500).json({ error: `Failed to fetch news: ${error.message || 'Unknown error'}` });
  }
}