
// api/search-news.js

export default async function handler(request, response) {
  // Obtener el término de búsqueda desde los parámetros de la URL (ej: /api/search-news?q=futbol)
  const searchQuery = request.query.q;

  // Si no hay término de búsqueda, devolver un error
  if (!searchQuery) {
    return response.status(400).json({ error: 'El término de búsqueda es requerido' });
  }

  const apiKey = 'a895210f770b6ab78056d679cd5887c4';
  // Usar el término de búsqueda del usuario en la URL de la API de GNews
  const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=es&max=10&token=${apiKey}`;

  try {
    const newsResponse = await fetch(apiUrl);
    if (!newsResponse.ok) {
      throw new Error(`GNews API responded with status: ${newsResponse.status}`);
    }
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      // Si no hay artículos, devolver un array vacío en lugar de un error
      return response.status(200).json({ heroStory: null, topStories: [] });
    }

    // Mapear la respuesta de GNews a la estructura que el frontend espera
    const heroStory = {
      image: newsData.articles[0].image,
      category: newsData.articles[0].source.name || 'Búsqueda',
      title: newsData.articles[0].title,
      summary: newsData.articles[0].description,
      author: newsData.articles[0].source.name || 'Desconocido',
      time: new Date(newsData.articles[0].publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      location: 'Global',
      comments: Math.floor(Math.random() * 1000) + 50,
      url: newsData.articles[0].url
    };

    const topStories = newsData.articles.slice(1, 9).map(article => ({
      image: article.image || 'img/IA.jpg',
      alt: article.title,
      category: article.source.name || 'Búsqueda',
      title: article.title,
      summary: article.description,
      time: new Date(article.publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      reads: `${(Math.random() * 5).toFixed(1)}k lecturas`,
      url: article.url
    }));

    const responseData = {
      heroStory,
      topStories
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching search results from GNews:', error);
    response.status(500).json({ error: 'Failed to fetch search results' });
  }
}
