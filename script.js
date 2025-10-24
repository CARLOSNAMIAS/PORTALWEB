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
    // Actualizar navegación activa
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Simular carga de contenido por categoría
    showNotification(`Cargando noticias de ${category.toUpperCase()}...`, 'info');

    // En una implementación real, aquí cargarías contenido específico
    setTimeout(() => {
        showNotification(`Noticias de ${category} actualizadas`, 'success');
    }, 1000);
}





// Función para suscripción al boletín
function subscribeNewsletter() {
    const emailInput = event.target.previousElementSibling;
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Por favor ingresa tu email', 'error');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }

    // Simular suscripción
    event.target.textContent = 'SUSCRIBIENDO...';
    event.target.disabled = true;

    setTimeout(() => {
        showNotification(`¡Suscripción exitosa! Recibirás noticias en ${email}`, 'success');
        emailInput.value = '';
        event.target.textContent = 'SUSCRIBIRSE';
        event.target.disabled = false;
    }, 2000);
}

// Función de búsqueda mejorada
function setupAdvancedSearch() {
    const searchBox = document.querySelector('.search-box');
    let searchTimeout;

    searchBox.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(query);
            }, 300);
        }
    });

    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

// Función para mostrar sugerencias de búsqueda
function showSearchSuggestions(query) {
    // En una implementación real, esto haría una llamada a la API
    console.log(`Buscando sugerencias para: ${query}`);
}

// Función para realizar búsqueda
function performSearch(query) {
    showNotification(`Buscando: "${query}"...`, 'info');

    // Simular búsqueda
    setTimeout(() => {
        alert(`🔍 Resultados de búsqueda para: "${query}"\n\nEn una implementación real mostraría:\n• Artículos relacionados\n• Videos\n• Imágenes\n• Filtros por fecha y categoría\n• Ordenamiento por relevancia`);
        document.querySelector('.search-box').value = '';
    }, 1000);
}

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info') {
    // Remover notificación existente si hay una
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };

    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 600;
                font-size: 0.9rem;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
                max-width: 400px;
            `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Función para scroll suave mejorado
function setupSmoothScrolling() {
    // Detectar scroll para efectos
    let ticking = false;

    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        const nav = document.querySelector('.nav');

        if (scrolled > 100) {
            nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Función para lazy loading de contenido
function setupContentLazyLoading() {
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                contentObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos que necesitan lazy loading
    document.querySelectorAll('.story-card, .video-card').forEach(card => {
        contentObserver.observe(card);
    });
}



// --- FUNCIONES DE RENDERIZADO DINÁMICO ---

function renderHeroStory(story) {
    const heroSection = document.querySelector('.hero-section');
    heroSection.innerHTML = `
        <a href="${story.url}" style="text-decoration: none; color: inherit;">
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
        <a href="${story.url}" style="text-decoration: none; color: inherit;">
            <article class="story-card">
                <div class="story-image">
                    ${imageHtml}
                </div>
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

    // Inyectar anuncio después de la segunda noticia
    if (storiesHtml.length > 2) {
        const adHtml = `
            <article class="story-card">
                <div class="ad-placeholder ad-in-feed">
                    <span>Publicidad</span>
                </div>
            </article>
        `;
        storiesHtml.splice(2, 0, adHtml);
    }

    storiesGrid.innerHTML = storiesHtml.join('');
}




function renderTrendingStories(stories) {
    const trendingList = document.querySelector('.trending-list');
    trendingList.innerHTML = stories.map(story => `
        <li class="trending-item" onclick="window.location.href='${story.url}'">
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
    liveUpdatesContainer.innerHTML = ''; // Limpiar contenedor
    liveUpdatesContainer.appendChild(widgetHeader); // Re-agregar el encabezado

    updates.forEach(update => {
        const item = document.createElement('div');
        item.className = 'live-item';
        item.innerHTML = `
            <div class="live-time">${update.time}</div>
            <div class="live-text">${update.text}</div>
        `;
        liveUpdatesContainer.appendChild(item);
    });
}

function renderVideos(videos) {
    const videoGrid = document.querySelector('.video-grid');
    videoGrid.innerHTML = videos.map(video => `
        <article class="video-card" onclick="playVideo('${video.title}')">
            <div class="video-thumbnail">
                <div class="play-button">▶</div>
                ${video.thumbnail}
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-duration">⏱️ ${video.duration}</div>
            </div>
        </article>
    `).join('');
}


// --- FUNCIONES DE PICO Y PLACA ---

function setupPicoYPlaca() {
    const citySelector = document.getElementById('pico-y-placa-city-selector');
    const infoContainer = document.getElementById('pico-y-placa-info');

    if (!citySelector || !infoContainer || typeof picoYPlacaData === 'undefined') {
        console.error("Elementos del DOM de Pico y Placa o los datos no se encontraron.");
        return;
    }

    const cities = Object.keys(picoYPlacaData);

    // 1. Populate city selector
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelector.appendChild(option);
    });

    // 2. Function to update info
    const updatePicoYPlacaInfo = (city) => {
        const data = picoYPlacaData[city];
        if (!data) {
            infoContainer.innerHTML = '<p>No hay datos para la ciudad seleccionada.</p>';
            return;
        }

        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
        const dayOfMonth = today.getDate();

        const restriccion = data.getRestriccion(dayOfWeek, dayOfMonth);

        infoContainer.innerHTML = `
            <h5>Hoy en ${city}</h5>
            <p><strong>Restricción:</strong> ${restriccion}</p>
            <p><small><strong>Horario:</strong> ${data.horario}</small></p>
        `;
    };

    // 3. Add event listener
    citySelector.addEventListener('change', (e) => {
        updatePicoYPlacaInfo(e.target.value);
    });

    // 4. Initial update
    if (cities.length > 0) {
        updatePicoYPlacaInfo(cities[0]);
    }
}


// --- FUNCIONES DE CLIMA ---

function getWeatherIcon(wmoCode) {
    const icons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Drizzle: Light
        53: '🌦️', // Drizzle: Moderate
        55: '🌦️', // Drizzle: Dense intensity
        61: '🌧️', // Rain: Slight
        63: '🌧️', // Rain: Moderate
        65: '🌧️', // Rain: Heavy intensity
        66: '🌧️', // Freezing Rain: Light
        67: '🌧️', // Freezing Rain: Heavy intensity
        71: '🌨️', // Snow fall: Slight
        73: '🌨️', // Snow fall: Moderate
        75: '🌨️', // Snow fall: Heavy intensity
        77: '🌨️', // Snow grains
        80: '⛈️', // Rain showers: Slight
        81: '⛈️', // Rain showers: Moderate
        82: '⛈️', // Rain showers: Violent
        85: '🌨️', // Snow showers slight
        86: '🌨️', // Snow showers heavy
        95: '🌩️', // Thunderbolt
        96: '🌩️', // Thunderstorm with slight hail
        99: '🌩️', // Thunderstorm with heavy hail
    };
    return icons[wmoCode] || '🤷';
}

function fetchUserWeather() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const [weatherResponse, geoResponse] = await Promise.all([
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`),
                    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`)
                ]);

                if (!weatherResponse.ok || !geoResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const weatherData = await weatherResponse.json();
                const geoData = await geoResponse.json();

                const locationElement = document.getElementById('location');
                const weatherElement = document.getElementById('weather');

                const city = geoData.city || geoData.locality || 'Ubicación desconocida';
                const country = geoData.countryName || '';
                const temperature = Math.round(weatherData.current_weather.temperature);
                const weatherCode = weatherData.current_weather.weathercode;
                const icon = getWeatherIcon(weatherCode);

                if (locationElement) locationElement.textContent = `📍 ${city}, ${country}`;
                if (weatherElement) weatherElement.textContent = `${icon} ${temperature}°C`;

                // Auto-select Pico y Placa city
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
        }, (error) => {
            console.error("Error getting geolocation:", error.message);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


function setupHamburgerMenu() {
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu--open');
        });
    }
}

// --- FUNCIÓN PARA OBTENER NOTICIAS DE LA API ---

async function fetchNews() {
    showNotification('Cargando últimas noticias...', 'info');
    try {
        const response = await fetch('/api/get-news');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();

        // Renderizar el contenido de la API
        if (data.heroStory) {
            renderHeroStory(data.heroStory);
        }
        if (data.topStories) {
            renderTopStories(data.topStories);
        }

        showNotification('Noticias actualizadas correctamente', 'success');

    } catch (error) {
        console.error('Error al obtener noticias:', error);
        showNotification('No se pudieron cargar las noticias', 'error');
        // Opcional: renderizar contenido estático como fallback
        // renderHeroStory(heroStory);
        // renderTopStories(topStories);
    }
}


// Inicialización completa
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔴 NDA Noticias cargado correctamente');

    // Cargar noticias dinámicas desde la API
    fetchNews();

    // Renderizar contenido estático de las otras secciones
    renderTrendingStories(trendingStories);
    renderLiveUpdates(liveUpdates);
    renderVideos(featuredVideos);

    // Configurar todas las funcionalidades
    updateTime();
    setupPicoYPlaca(); // Configurar Pico y Placa
    fetchUserWeather(); // Obtener clima del usuario (y auto-seleccionar ciudad de PyP)
    setupAdvancedSearch();
    setupSmoothScrolling();
    setupContentLazyLoading();
    setupHamburgerMenu();

    // Actualizar hora cada minuto
    setInterval(updateTime, 60000);

    // Agregar efectos de fade-in
    setTimeout(() => {
        document.querySelectorAll('.story-card, .sidebar-widget').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease-out';

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }, 500);
});

// Agregar estilos adicionales para animaciones
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
            .fade-in {
                animation: fadeInUp 0.6s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Hover effects mejorados */
            .story-card:hover .story-title {
                color: #cc0000;
            }
            
            .trending-item:hover .trending-rank {
                background: #990000;
                transform: scale(1.1);
            }
            
            .hero-story:hover {
                transform: scale(1.02);
                transition: transform 0.3s ease-out;
            }
            
            /* Loading states */
            .loading-skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
document.head.appendChild(additionalStyles);