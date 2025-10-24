// api/get-radios.js
export default async function handler(request, response) {
  const FETCH_TIMEOUT = 8000; // 8 seconds timeout for external API calls

  try {
    // --- Step 1: Discover a working API server ---
    const serversController = new AbortController();
    const serversTimeoutId = setTimeout(() => serversController.abort(), FETCH_TIMEOUT);

    let serversResponse;
    try {
      serversResponse = await fetch('https://de1.api.radio-browser.info/json/servers', { signal: serversController.signal });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout fetching radio servers list.');
      }
      throw error; // Re-throw other fetch errors
    } finally {
      clearTimeout(serversTimeoutId);
    }

    if (!serversResponse.ok) {
      throw new Error(`Failed to fetch radio servers list: ${serversResponse.status} ${serversResponse.statusText}`);
    }
    const servers = await serversResponse.json();
    if (!servers || servers.length === 0) {
      throw new Error('No radio servers found in the list.');
    }
    const randomServer = servers[Math.floor(Math.random() * servers.length)].name;
    console.log(`Using radio server: ${randomServer}`); // Log to Vercel

    // --- Step 2: Fetch stations from the discovered server ---
    const stationsController = new AbortController();
    const stationsTimeoutId = setTimeout(() => stationsController.abort(), FETCH_TIMEOUT);

    const apiUrl = `https://${randomServer}/json/stations/bycountry/colombia?limit=30&order=clickcount&reverse=true`;
    let radioResponse;
    try {
      radioResponse = await fetch(apiUrl, {
        headers: { 'User-Agent': 'NDA-Noticias-Web-App/1.0' },
        signal: stationsController.signal
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Timeout fetching stations from ${randomServer}.`);
      }
      throw error; // Re-throw other fetch errors
    } finally {
      clearTimeout(stationsTimeoutId);
    }

    if (!radioResponse.ok) {
      throw new Error(`Failed to fetch stations from ${randomServer}: ${radioResponse.status} ${radioResponse.statusText}`);
    }

    const stationsData = await radioResponse.json();
    if (!stationsData || stationsData.length === 0) {
      return response.status(200).json({ stations: [] });
    }

    const stations = stationsData
      .filter(station => station.url_resolved)
      .map(station => ({
        uuid: station.stationuuid,
        name: station.name,
        streamUrl: station.url_resolved,
        favicon: station.favicon || null
      }));

    // Set cache headers and send response
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ stations });

  } catch (error) {
    console.error('Error in get-radios serverless function:', error.message); // Log specific error message
    response.status(500).json({ error: `Server error: ${error.message || 'Unknown error'}` }); // Return specific error to client
  }
}
