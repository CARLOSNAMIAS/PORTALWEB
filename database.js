const heroStory = {
    category: 'Política',
    title: 'Nueva reforma educativa genera intenso debate en el congreso nacional',
    summary: 'La propuesta gubernamental busca modernizar el sistema educativo con un enfoque en tecnología digital y sostenibilidad ambiental, pero enfrenta resistencia de varios sectores.',
    author: 'Ana García',
    time: 'Hace 2 horas',
    location: 'Bogotá',
    comments: 156
};

const topStories = [
    {
        image: 'img/economia.jpg',
        alt: 'Gráficos y datos de la economía colombiana.',
        category: 'Economía',
        title: 'Economía colombiana registra crecimiento del 3.2% en el trimestre',
        summary: 'Los indicadores económicos muestran una recuperación sostenida impulsada por el sector agrícola y manufacturero, superando las expectativas de analistas.',
        time: 'Hace 4 horas',
        reads: '2.1k lecturas'
    },
    {
        image: 'img/deporte.jpg',
        alt: 'Jugadores de la Selección Colombia entrenando en el campo.',
        category: 'Deportes',
        title: 'Selección Colombia se alista para las eliminatorias mundialistas',
        summary: 'El técnico nacional convocó a 25 jugadores para los próximos compromisos internacionales que definirán el camino hacia el mundial.',
        time: 'Hace 6 horas',
        reads: '1.8k lecturas'
    },
    {
        image: 'img/IA.jpg',
        alt: 'Representación abstracta de una red neuronal de inteligencia artificial.',
        category: 'Tecnología',
        title: 'Avances en inteligencia artificial transforman la medicina moderna',
        summary: 'Nuevas herramientas de IA están revolucionando los diagnósticos médicos con precisión sin precedentes en hospitales del país.',
        time: 'Hace 8 horas',
        reads: '3.2k lecturas'
    },
    {
        image: 'img/mundo.jpg',
        alt: 'El planeta Tierra visto desde el espacio con un sol naciente.',
        category: 'Medio Ambiente',
        title: 'Crisis climática se acelera según nuevo informe de la ONU',
        summary: 'El último reporte científico advierte sobre cambios irreversibles en el clima global si no se toman medidas urgentes.',
        time: 'Hace 12 horas',
        reads: '4.5k lecturas'
    }
];

const trendingStories = [
    {
        rank: 1,
        title: 'Crisis europea afecta mercados latinoamericanos',
        meta: 'Hace 1 hora • 5.2k lecturas'
    },
    {
        rank: 2,
        title: 'Medicina regenerativa ofrece nueva esperanza',
        meta: 'Hace 3 horas • 4.8k lecturas'
    },
    {
        rank: 3,
        title: 'Tecnología espacial promete viajes más rápidos',
        meta: 'Hace 5 horas • 4.1k lecturas'
    },
    {
        rank: 4,
        title: 'Educación digital transforma el aprendizaje',
        meta: 'Hace 8 horas • 3.9k lecturas'
    }
];

const liveUpdates = [
    {
        time: '21:45',
        text: 'Congreso aprueba por unanimidad nueva ley de transparencia gubernamental'
    },
    {
        time: '21:30',
        text: 'Banco Central mantiene tasa de interés en 4.25% tras reunión extraordinaria'
    },
    {
        time: '21:15',
        text: 'Registrado sismo de magnitud 4.2 en la región andina sin reportes de daños'
    }
];

const featuredVideos = [
    {
        thumbnail: '📊',
        title: 'Análisis económico semanal: perspectivas del mercado',
        duration: '8:45 min'
    },
    {
        thumbnail: '🎤',
        title: 'Entrevista exclusiva: el futuro de la educación',
        duration: '12:30 min'
    },
    {
        thumbnail: '🌍',
        title: 'Reportaje especial: cambio climático en Colombia',
        duration: '15:20 min'
    }
];

const picoYPlacaData = {
    "Bogotá": {
        horario: "Lunes a viernes, 6:00 a.m. a 9:00 p.m.",
        info: "La restricción se basa en el último dígito de la placa y la paridad del día.",
        reglas: {
            impar: ["1", "2", "3", "4", "5"], // Pueden circular en días impares
            par: ["6", "7", "8", "9", "0"]    // Pueden circular en días pares
        },
        getRestriccion: function (diaSemana, diaMes) {
            if (diaSemana === 0 || diaSemana === 6) return "No aplica en fin de semana.";
            const esPar = diaMes % 2 === 0;
            const noCirculan = esPar ? this.reglas.impar : this.reglas.par;
            return `Día ${esPar ? 'par' : 'impar'}. No circulan placas terminadas en: ${noCirculan.join(', ')}.`;
        }
    },
    "Medellín": {
        horario: "Lunes a viernes, 5:00 a.m. a 8:00 p.m.",
        info: "La restricción se basa en el último dígito de la placa y el día de la semana.",
        reglas: [
            [], // Domingo
            ["6", "9"], // Lunes
            ["5", "7"], // Martes
            ["1", "8"], // Miércoles
            ["0", "2"], // Jueves
            ["3", "4"], // Viernes
            []  // Sábado
        ],
        getRestriccion: function (diaSemana) {
            if (diaSemana === 0 || diaSemana === 6) return "No aplica en fin de semana.";
            const noCirculan = this.reglas[diaSemana];
            return `No circulan placas terminadas en: ${noCirculan.join(' y ')}.`;
        }
    },
    "Cali": {
        horario: "Lunes a viernes, 6:00 a.m. a 7:00 p.m.",
        info: "La restricción se basa en el último dígito de la placa y el día de la semana.",
        reglas: [
            [], // Domingo
            ["3", "4"], // Lunes
            ["5", "6"], // Martes
            ["7", "8"], // Miércoles
            ["9", "0"], // Jueves
            ["1", "2"], // Viernes
            []  // Sábado
        ],
        getRestriccion: function (diaSemana) {
            if (diaSemana === 0 || diaSemana === 6) return "No aplica en fin de semana.";
            const noCirculan = this.reglas[diaSemana];
            return `No circulan placas terminadas en: ${noCirculan.join(' y ')}.`;
        }
    },
    "Cúcuta": {
        horario: "Lunes a viernes, 7:00-8:30am, 11:30am-2:30pm, 5:30-7:30pm.",
        info: "La restricción se basa en el último dígito de la placa y el día de la semana.",
        reglas: [
            [], // Domingo
            ["1", "2"], // Lunes
            ["3", "4"], // Martes
            ["5", "6"], // Miércoles
            ["7", "8"], // Jueves
            ["9", "0"], // Viernes
            []  // Sábado
        ],
        getRestriccion: function (diaSemana) {
            if (diaSemana === 0 || diaSemana === 6) return "No aplica en fin de semana.";
            const noCirculan = this.reglas[diaSemana];
            return `No circulan placas terminadas en: ${noCirculan.join(' y ')}.`;
        }
    }
};