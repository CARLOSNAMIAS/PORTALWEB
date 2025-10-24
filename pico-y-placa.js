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