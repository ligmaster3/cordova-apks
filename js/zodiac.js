document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("zodiacForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const dia = parseInt(document.getElementById("dia").value);
        const mes = parseInt(document.getElementById("mes").value);
        const errorDiv = document.getElementById("error");
        const resultadoDiv = document.getElementById("resultado");

        errorDiv.textContent = '';
        resultadoDiv.innerHTML = '';

        if (isNaN(dia) || isNaN(mes) || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
            errorDiv.textContent = "Por favor, ingresa un día y mes válidos.";
            return;
        }

        let signos;
        try {
            const response = await fetch('/signos.json');
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo de signos.");
            }
            const data = await response.json();

            // Accede a `signosZodiacales` dentro del JSON
            signos = data.signosZodiacales;

            if (!Array.isArray(signos)) {
                throw new Error("El archivo JSON no tiene el formato esperado.");
            }
        } catch (error) {
            console.error("Error al cargar los signos:", error);
            errorDiv.textContent = "Error al cargar los datos de los signos.";
            return;
        }

        const signo = encontrarSigno(signos, mes, dia);
        if (signo) {
            mostrarResultado(signo);
        } else {
            errorDiv.textContent = "No se encontró el signo zodiacal para esta fecha.";
        }
    });
});


function encontrarSigno(signos, mes, dia) {
    for (const signo of signos) {
        const { inicio, fin } = signo;
        const fechaInicio = new Date(2023, inicio.mes - 1, inicio.dia);
        const fechaFin = new Date(2023, fin.mes - 1, fin.dia);
        const fechaConsulta = new Date(2023, mes - 1, dia);

        if (fechaConsulta >= fechaInicio && fechaConsulta <= fechaFin) {
            return signo;
        }
    }
    return null;
}

function mostrarResultado(signo) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <h2>${signo.nombre} (${formatDate(signo.inicio.mes, signo.inicio.dia)} - ${formatDate(signo.fin.mes, signo.fin.dia)})</h2>
        <div class="imagenes-container">
            <div class="imagen-wrapper">
                <div class="imagen-titulo">Símbolo</div>
               <div class="imagen-titulo">Constelación</div>
            </div>
            <div class="imagen-wrapper">
               <p>${signo.nombre}</p> 
                <img src="${signo.constelacion}" alt="Constelación de ${signo.nombre}" class="imagen">
            </div>
        </div>
        <div class="info-container">
            <p>${signo.info}</p>
        </div>
    `;
}

function formatDate(mes, dia) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${dia} de ${meses[mes - 1]}`;
}
