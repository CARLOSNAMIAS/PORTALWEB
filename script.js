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

        // Función para abrir artículos
        function openArticle(title) {
            showNotification('Abriendo artículo...', 'info');
            
            setTimeout(() => {
                alert(`📰 ${title}\n\nEn una implementación real, esto abriría el artículo completo con:\n• Contenido completo del artículo\n• Galería de imágenes\n• Videos relacionados\n• Comentarios de lectores\n• Artículos relacionados\n• Opciones para compartir`);
            }, 500);
        }

        // Función para reproducir videos
        function playVideo(title) {
            showNotification('Cargando reproductor de video...', 'info');
            
            setTimeout(() => {
                alert(`🎥 ${title}\n\nEn una implementación real, esto abriría:\n• Reproductor de video integrado\n• Controles de reproducción\n• Subtítulos disponibles\n• Videos relacionados\n• Opciones de calidad\n• Modo pantalla completa`);
            }, 500);
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
            
            searchBox.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        showSearchSuggestions(query);
                    }, 300);
                }
            });
            
            searchBox.addEventListener('keypress', function(e) {
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

        // Función para simular actualizaciones en tiempo real
        function startLiveUpdates() {
            const liveContainer = document.querySelector('.live-updates');
            const updates = [
                'Presidente anuncia nueva inversión en infraestructura',
                'Bolsa de valores cierra con tendencia positiva',
                'Meteorología emite alerta por lluvias intensas',
                'Ministro de Salud presenta nuevo protocolo sanitario',
                'Universidad Nacional inaugura centro de investigación'
            ];
            
            let updateIndex = 0;
            
            setInterval(() => {
                if (liveContainer && updates[updateIndex]) {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    });
                    
                    const newUpdate = document.createElement('div');
                    newUpdate.className = 'live-item';
                    newUpdate.innerHTML = `
                        <div class="live-time">${timeString}</div>
                        <div class="live-text">${updates[updateIndex]}</div>
                    `;
                    
                    const firstUpdate = liveContainer.querySelector('.live-item');
                    if (firstUpdate) {
                        liveContainer.insertBefore(newUpdate, firstUpdate);
                    }
                    
                    // Mantener solo las últimas 4 actualizaciones
                    const allUpdates = liveContainer.querySelectorAll('.live-item');
                    if (allUpdates.length > 4) {
                        allUpdates[allUpdates.length - 1].remove();
                    }
                    
                    updateIndex = (updateIndex + 1) % updates.length;
                }
            }, 120000); // Cada 2 minutos
        }

// --- FUNCIONES DE RENDERIZADO DINÁMICO ---

function renderHeroStory(story) {
    const heroSection = document.querySelector('.hero-section');
    heroSection.innerHTML = `
        <article class="hero-story" onclick="openArticle('${story.title}')">
            <div class="hero-image">
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
    `;
}

function renderTopStories(stories) {
    const storiesGrid = document.querySelector('.stories-grid');
    storiesGrid.innerHTML = stories.map(story => `
        <article class="story-card" onclick="openArticle('${story.title}')">
            <div class="story-image">
                ${story.image}
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
    `).join('');
}

function renderTrendingStories(stories) {
    const trendingList = document.querySelector('.trending-list');
    trendingList.innerHTML = stories.map(story => `
        <li class="trending-item" onclick="openArticle('${story.title}')">
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


        // Inicialización completa
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔴 CNN Portal cargado correctamente');
            
            // Renderizar contenido dinámico
            renderHeroStory(heroStory);
            renderTopStories(topStories);
            renderTrendingStories(trendingStories);
            renderLiveUpdates(liveUpdates);
            renderVideos(featuredVideos);

            // Configurar todas las funcionalidades
            updateTime();
            setupAdvancedSearch();
            setupSmoothScrolling();
            setupContentLazyLoading();
            startLiveUpdates();
            
            // Actualizar hora cada minuto
            setInterval(updateTime, 60000);
            
            // Mostrar bienvenida
            setTimeout(() => {
                showNotification('🔴 Conectado a CNN en vivo - Noticias actualizándose automáticamente', 'success');
            }, 1500);
            
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