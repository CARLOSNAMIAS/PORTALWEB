
// Función para actualizar la hora actual
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Función para cambiar categorías
function showCategory(category) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    showNotification(`Cargando noticias de ${category.toUpperCase()}...`, 'info');
    setTimeout(() => {
        showNotification(`Noticias de ${category} actualizadas`, 'success');
    }, 1000);
}

// Función para suscripción al boletín
function subscribeNewsletter() {
    const emailInput = event.target.previousElementSibling;
    const email = emailInput.value.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }
    event.target.textContent = 'SUSCRIBIENDO...';
    event.target.disabled = true;
    setTimeout(() => {
        showNotification(`¡Suscripción exitosa! Recibirás noticias en ${email}`, 'success');
        emailInput.value = '';
        event.target.textContent = 'SUSCRIBIRSE';
        event.target.disabled = false;
    }, 2000);
}

// --- FUNCIONES DE BÚSQUEDA ---
function setupAdvancedSearch() {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function updateSectionTitle(title) {
    const sectionTitle = document.querySelector('.top-stories .section-title');
    if (sectionTitle) {
        sectionTitle.textContent = title;
    }
}

async function performSearch(query) {
    showNotification(`Buscando: "${query}"...`, 'info');
    document.querySelector('.search-box').value = '';
    try {
        const response = await fetch(`/api/search-news?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        if (data.topStories && data.topStories.length > 0) {
            renderHeroStory(data.heroStory);
            renderTopStories(data.topStories);
            updateSectionTitle(`Resultados para: "${query}"`);
            showNotification('Búsqueda completada', 'success');
        } else {
            document.querySelector('.hero-section').innerHTML = '';
            document.querySelector('.stories-grid').innerHTML = '<p style="grid-column: 1 / -1;">No se encontraron artículos para su búsqueda.</p>';
            updateSectionTitle(`No hay resultados para: "${query}"`);
            showNotification('No se encontraron noticias', 'warning');
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showNotification('Ocurrió un error al realizar la búsqueda', 'error');
    }
}

// --- SISTEMA DE NOTIFICACIONES ---
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const colors = { success: '#27ae60', error: '#e74c3c', info: '#3498db', warning: '#f39c12' };
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 1rem 2rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; font-weight: 600; font-size: 0.9rem; transform: translateX(100%); transition: transform 0.3s ease-out; max-width: 400px;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
    }, 4000);
}

// --- FUNCIONES DE RENDERIZADO ---
function renderHeroStory(story) {
    const heroSection = document.querySelector('.hero-section');
    if (!story) {
        heroSection.innerHTML = '';
        return;
    }
    heroSection.innerHTML = `
        <a href="${story.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
            <article class="hero-story">
                <div class="hero-image" style="background-image: url('${story.image}');">
                    <div class="hero-overlay">
                        <span class="hero-category">${story.category}</span>
                        <h1 class="hero-title">${story.title}</h1>
                        <p class="hero-summary">${story.summary}</p>
                        <div class="hero-meta">
                            <span>📝 Por ${story.author}</span>
                            <span>🕐 ${story.time}</span>
                            <span>📍 ${story.location}</span>
                            <span>💬 ${story.comments} comentarios</span>
                        </div>
                    </div>
                </div>
            </article>
        </a>
    `;
}

function renderTopStories(stories) {
    const storiesGrid = document.querySelector('.stories-grid');
    let storiesHtml = stories.map(story => {
        const imageHtml = `<img src="${story.image}" alt="${story.alt}" style="width: 100%; height: 100%; object-fit: cover;">`;
        return `
        <a href="${story.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
            <article class="story-card">
                <div class="story-image">${imageHtml}</div>
                <div class="story-content">
                    <span class="story-category">${story.category}</span>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-summary">${story.summary}</p>
                    <div class="story-meta">
                        <span class="story-time">🕐 ${story.time}</span>
                        <span>👁️ ${story.reads}</span>
                    </div>
                </div>
            </article>
        </a>
    `});
    if (storiesHtml.length > 2) {
        const adHtml = `<article class="story-card"><div class="ad-placeholder ad-in-feed"><span>Publicidad</span></div></article>`;
        storiesHtml.splice(2, 0, adHtml);
    }
    storiesGrid.innerHTML = storiesHtml.join('');
}

function renderTrendingStories(stories) {
    const trendingList = document.querySelector('.trending-list');
    trendingList.innerHTML = stories.map(story => `
        <li class="trending-item" onclick="window.open('${story.url}', '_blank')">
            <span class="trending-rank">${story.rank}</span>
            <div class="trending-content">
                <h4>${story.title}</h4>
                <div class="trending-meta">${story.meta}</div>
            </div>
        </li>
    `).join('');
}

function renderLiveUpdates(updates) {
    const liveUpdatesContainer = document.querySelector('.live-updates');
    const widgetHeader = liveUpdatesContainer.querySelector('.widget-header');
    liveUpdatesContainer.innerHTML = '';
    liveUpdatesContainer.appendChild(widgetHeader);
    updates.forEach(update => {
        const item = document.createElement('div');
        item.className = 'live-item';
        item.innerHTML = `<div class="live-time">${update.time}</div><div class="live-text">${update.text}</div>`;
        liveUpdatesContainer.appendChild(item);
    });
}

function renderVideos(videos) {
    const videoGrid = document.querySelector('.video-grid');
    videoGrid.innerHTML = videos.map(video => `
        <article class="video-card" onclick="playVideo('${video.url}')">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="play-button">▶</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-duration">⏱️ ${video.duration}</div>
            </div>
        </article>
    `).join('');
}

function playVideo(url) {
    if (url) window.open(url, '_blank');
}

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---
async function fetchNews() {
    showNotification('Cargando últimas noticias...', 'info');
    try {
        const response = await fetch('/api/get-news');
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        const data = await response.json();
        if (data.heroStory) renderHeroStory(data.heroStory);
        if (data.topStories) renderTopStories(data.topStories);
        showNotification('Noticias actualizadas correctamente', 'success');
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        showNotification('No se pudieron cargar las noticias', 'error');
    }
}

async function fetchVideos() {
    try {
        const response = await fetch('/api/get-videos');
        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
            renderVideos(data.videos);
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

// --- INICIALIZACIÓN Y UTILIDADES ---
function setupPicoYPlaca() {
    const citySelector = document.getElementById('pico-y-placa-city-selector');
    const infoContainer = document.getElementById('pico-y-placa-info');
    if (!citySelector || !infoContainer || typeof picoYPlacaData === 'undefined') return;
    const cities = Object.keys(picoYPlacaData);
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelector.appendChild(option);
    });
    const updatePicoYPlacaInfo = (city) => {
        const data = picoYPlacaData[city];
        if (!data) return;
        const today = new Date();
        const restriccion = data.getRestriccion(today.getDay(), today.getDate());
        infoContainer.innerHTML = `<h5>Hoy en ${city}</h5><p><strong>Restricción:</strong> ${restriccion}</p><p><small><strong>Horario:</strong> ${data.horario}</small></p>`;
    };
    citySelector.addEventListener('change', (e) => updatePicoYPlacaInfo(e.target.value));
    if (cities.length > 0) updatePicoYPlacaInfo(cities[0]);
}

function getWeatherIcon(wmoCode) {
    const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌦️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️', 71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️', 80: '⛈️', 81: '⛈️', 82: '⛈️', 85: '🌨️', 86: '🌨️', 95: '🌩️', 96: '🌩️', 99: '🌩️' };
    return icons[wmoCode] || '🤷';
}

function fetchUserWeather() {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const [weatherResponse, geoResponse] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`),
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`)
            ]);
            if (!weatherResponse.ok || !geoResponse.ok) throw new Error('Failed to fetch data');
            const weatherData = await weatherResponse.json();
            const geoData = await geoResponse.json();
            const locationElement = document.getElementById('location');
            const weatherElement = document.getElementById('weather');
            const city = geoData.city || geoData.locality || 'Ubicación desconocida';
            const temperature = Math.round(weatherData.current_weather.temperature);
            const icon = getWeatherIcon(weatherData.current_weather.weathercode);
            if (locationElement) locationElement.textContent = `📍 ${city}, ${geoData.countryName || ''}`;
            if (weatherElement) weatherElement.textContent = `${icon} ${temperature}°C`;
            if (city && typeof picoYPlacaData !== 'undefined' && picoYPlacaData[city]) {
                const citySelector = document.getElementById('pico-y-placa-city-selector');
                if (citySelector) {
                    citySelector.value = city;
                    citySelector.dispatchEvent(new Event('change'));
                }
            }
        } catch (error) {
            console.error("Error fetching weather or location data:", error);
        }
    });
}

function setupHamburgerMenu() {
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => navMenu.classList.toggle('nav-menu--open'));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔴 NDA Noticias cargado correctamente');
    fetchNews();
    fetchVideos();
    renderTrendingStories(trendingStories);
    renderLiveUpdates(liveUpdates);
    updateTime();
    setupPicoYPlaca();
    fetchUserWeather();
    setupAdvancedSearch();
    setupHamburgerMenu();
    setupRadioPlayer(); // <-- AÑADIDO: Inicializar el reproductor de radio
    setInterval(updateTime, 60000);
});

// --- REPRODUCTOR DE RADIO ---

function setupRadioPlayer() {
    // Referencias a los elementos del DOM
    const radioPlayer = document.getElementById('radio-player');
    const radioPlayerButton = document.getElementById('radio-player-button');
    const closePlayerButton = document.getElementById('close-player');
    const playPauseButton = document.getElementById('play-pause');
    const playPauseIcon = playPauseButton.querySelector('i');
    const nextButton = document.getElementById('next-station');
    const prevButton = document.getElementById('prev-station');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const stationName = document.getElementById('station-name');
    const stationFavicon = document.getElementById('station-favicon');
    const audioStream = document.getElementById('audio-stream');

    // Estado del reproductor
    let stations = [];
    let currentStationIndex = 0;
    let isPlaying = false;
    let isDataLoaded = false;

    // --- FUNCIONES DE LA API ---

    async function fetchStations() {
        showNotification('Cargando emisoras...', 'info');
        try {
            const response = await fetch('/api/get-radios');
            if (!response.ok) throw new Error('La respuesta de la red no fue correcta');
            const data = await response.json();
            
            if (data.stations && data.stations.length > 0) {
                stations = data.stations;
                isDataLoaded = true;
                loadStation(currentStationIndex);
                showNotification('Emisoras cargadas', 'success');
            } else {
                showNotification('No se encontraron emisoras', 'warning');
                stationName.textContent = 'No hay emisoras disponibles';
            }
        } catch (error) {
            console.error("Error al obtener las emisoras:", error);
            showNotification('Error al cargar emisoras', 'error');
            stationName.textContent = 'Error al cargar';
        }
    }

    // --- FUNCIONES DEL REPRODUCTOR ---

    function loadStation(index) {
        if (stations.length === 0) return;
        const station = stations[index];
        stationName.textContent = station.name;
        stationFavicon.src = station.favicon || 'img/favicon.svg';
        stationFavicon.onerror = () => { stationFavicon.src = 'img/favicon.svg'; }; // Fallback si el favicon falla
        audioStream.src = station.streamUrl;
        
        // Si el reproductor ya estaba sonando, intenta reproducir la nueva emisora
        if (isPlaying) {
            playAudio();
        }
    }

    function playAudio() {
        audioStream.play().then(() => {
            isPlaying = true;
            updatePlayPauseIcon();
        }).catch(error => {
            console.error("Error al reproducir audio:", error);
            showNotification('No se pudo reproducir la emisora.', 'error');
            isPlaying = false;
            updatePlayPauseIcon();
        });
    }

    function pauseAudio() {
        audioStream.pause();
        isPlaying = false;
        updatePlayPauseIcon();
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    function updatePlayPauseIcon() {
        playPauseIcon.classList.toggle('bi-play-fill', !isPlaying);
        playPauseIcon.classList.toggle('bi-pause-fill', isPlaying);
    }

    function playNext() {
        if (stations.length === 0) return;
        currentStationIndex = (currentStationIndex + 1) % stations.length;
        loadStation(currentStationIndex);
    }

    function playPrev() {
        if (stations.length === 0) return;
        currentStationIndex = (currentStationIndex - 1 + stations.length) % stations.length;
        loadStation(currentStationIndex);
    }

    function updateVolume() {
        audioStream.volume = volumeSlider.value;
        updateVolumeIcon();
    }

    function updateVolumeIcon() {
        if (volumeSlider.value == 0) {
            volumeIcon.className = 'bi bi-volume-mute-fill';
        } else if (volumeSlider.value < 0.5) {
            volumeIcon.className = 'bi bi-volume-down-fill';
        } else {
            volumeIcon.className = 'bi bi-volume-up-fill';
        }
    }

    function togglePlayerVisibility() {
        const isVisible = radioPlayer.classList.toggle('visible');
        if (isVisible && !isDataLoaded) {
            fetchStations();
        }
    }

    // --- EVENT LISTENERS ---

    radioPlayerButton.addEventListener('click', (e) => {
        e.preventDefault();
        togglePlayerVisibility();
    });

    closePlayerButton.addEventListener('click', () => radioPlayer.classList.remove('visible'));
    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', playNext);
    prevButton.addEventListener('click', playPrev);
    volumeSlider.addEventListener('input', updateVolume);

    // Sincronizar UI con el estado real del audio
    audioStream.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseIcon();
    });

    audioStream.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseIcon();
    });

    // Inicializar volumen
    updateVolume();
}

