// api/get-radios.js

/**
 * Vercel Serverless Function to fetch radio stations from Colombia.
 * This function queries the public radio-browser.info API.
 */
export default async function handler(request, response) {
  // The API endpoint from radio-browser.info for Colombian stations,
  // ordered by click count (most popular first) and limited to 30 results.
  const apiUrl = 'https://at1.api.radio-browser.info/json/stations/bycountry/colombia?limit=30&order=clickcount&reverse=true';

  try {
    const radioResponse = await fetch(apiUrl, {
      headers: {
        // The API documentation recommends setting a User-Agent
        'User-Agent': 'NDA-Noticias-Web-App/1.0'
      }
    });

    if (!radioResponse.ok) {
      throw new Error(`Radio-Browser API responded with status: ${radioResponse.status}`);
    }

    const stationsData = await radioResponse.json();

    if (!stationsData || stationsData.length === 0) {
      return response.status(200).json({ stations: [] });
    }

    // Map the response to a cleaner format that the frontend will use.
    // We filter out stations that don't have a valid stream URL.
    const stations = stationsData
      .filter(station => station.url_resolved)
      .map(station => ({
        uuid: station.stationuuid,
        name: station.name,
        streamUrl: station.url_resolved,
        favicon: station.favicon || null // Use station icon or null
      }));

    // Set cache headers for Vercel's Edge Network (cache for 1 hour)
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    // Set the Content-Type header to indicate a JSON response.
    response.setHeader('Content-Type', 'application/json');
    // Send a successful response (200) with the curated list of stations.
    response.status(200).json({ stations });

  } catch (error) {
    console.error('Error fetching radio stations from Radio-Browser API:', error);
    // In case of an error, return a 500 Internal Server Error response.
    response.status(500).json({ error: 'Failed to fetch radio stations' });
  }
}
