
// api/get-videos.js

export default async function handler(request, response) {
  const apiKey = process.env.GNEWS_API_KEY;
  // Búsqueda específica para artículos que probablemente contengan videos.
  const searchQuery = 'colombia (video OR reportaje OR entrevista)';
  const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=es&max=6&token=${apiKey}`;

  try {
    const newsResponse = await fetch(apiUrl);
    if (!newsResponse.ok) {
      throw new Error(`GNews API responded with status: ${newsResponse.status}`);
    }
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      return response.status(200).json({ videos: [] });
    }

    // Mapear la respuesta para que coincida con lo que el frontend podría esperar
    const videos = newsData.articles.map(article => ({
      thumbnail: article.image || 'img/mundo.jpg', // Usar imagen del artículo o una por defecto
      title: article.title,
      duration: `${Math.floor(Math.random() * 15) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} min`, // Duración simulada
      url: article.url
    }));

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ videos });

  } catch (error) {
    console.error('Error fetching video articles from GNews:', error);
    response.status(500).json({ error: 'Failed to fetch video articles' });
  }
}
