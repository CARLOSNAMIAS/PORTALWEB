// api/get-radios.js
export default async function handler(request, response) {
  try {
    // Step 1: Discover a working API server
    // We use a known-good endpoint to get a list of servers.
    const serversResponse = await fetch('https://de1.api.radio-browser.info/json/servers');
    if (!serversResponse.ok) {
      throw new Error('Could not fetch list of radio servers.');
    }
    const servers = await serversResponse.json();
    // Pick a random server from the list
    const randomServer = servers[Math.floor(Math.random() * servers.length)].name;

    // Step 2: Fetch stations from the discovered server
    const apiUrl = `https://${randomServer}/json/stations/bycountry/colombia?limit=30&order=clickcount&reverse=true`;

    const radioResponse = await fetch(apiUrl, {
      headers: { 'User-Agent': 'NDA-Noticias-Web-App/1.0' }
    });

    if (!radioResponse.ok) {
      throw new Error(`Radio-Browser API responded with status: ${radioResponse.status}`);
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
    // Log the actual error to Vercel's console
    console.error('Error in get-radios serverless function:', error);
    // Return a generic 500 error to the client
    response.status(500).json({ error: 'Failed to fetch radio stations due to an internal error.' });
  }
}
