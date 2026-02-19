const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const btnEmpezar = document.getElementById("btnEmpezar");

let API_KEY = ""; // <- ahora se cargará desde MockAPI

let escuchando = true;
let timeoutSuspension;

// ---------- CONFIG VOZ ----------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "es-ES";
recognition.continuous = true;
recognition.interimResults = false;

// ---------- OBTENER API KEY DESDE MOCKAPI ----------
async function obtenerApiKey() {
    try {
        const res = await fetch("https://698def67aded595c253090ea.mockapi.io/api/v1/apikey");
        const data = await res.json();
        API_KEY = data[0].apikey;
        console.log("API KEY cargada desde MockAPI");
    } catch (error) {
        console.error("Error obteniendo API KEY:", error);
    }
}

// ---------- FUNCIÓN PARA SUSPENDER ----------
function suspender() {
    escuchando = false;
    estado.textContent = "🔴 Suspendido... Di 'Atenea'";
}

// ---------- REINICIAR TEMPORIZADOR ----------
function resetTimer() {
    clearTimeout(timeoutSuspension);
    timeoutSuspension = setTimeout(suspender, 8000);
}

// ---------- LLAMADA A OPENAI ----------
async function interpretarOrden(texto) {

    const prompt = `
Convierte la siguiente frase en UNA sola de estas órdenes EXACTAS:

avanzar
retroceder
detener
vuelta derecha
vuelta izquierda
90° derecha
90° izquierda
360° derecha
360° izquierda

Si no coincide con ninguna, responde EXACTAMENTE: Orden no reconocida

Frase: "${texto}"
`;

    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0
        })
    });

    const data = await respuesta.json();
    return data.choices[0].message.content.trim();
}

// ---------- EVENTO DE VOZ ----------
recognition.onresult = async (event) => {

    const texto = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Escuchado:", texto);

    resetTimer();

    // Wake word
    if (!escuchando && texto.includes("atenea")) {
        escuchando = true;
        estado.textContent = "🟢 Escuchando órdenes...";
        return;
    }

    if (!escuchando) return;

    estado.textContent = "🟢 Procesando...";

    const orden = await interpretarOrden(texto);
    resultado.textContent = orden;
};


// ---------- INICIO CONTROLADO CON BOTÓN ----------
async function iniciarApp() {

    btnEmpezar.addEventListener("click", async () => {

        // Ocultar botón
        btnEmpezar.style.display = "none";

        estado.textContent = "🟡 Cargando configuración...";

        // Cargar API KEY
        await obtenerApiKey();

        // Reproducir audio
        const audio = new Audio("assets/audios/presentacion.wav");

        try {
            await audio.play();
        } catch (error) {
            console.log("Error al reproducir audio:", error);
        }

        // Cuando termine el audio → activar micrófono
        audio.onended = () => {
            estado.textContent = "🟢 Escuchando...";
            recognition.start();
            resetTimer();
        };
    });
}

iniciarApp();
