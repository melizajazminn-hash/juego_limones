const canvas = document.getElementById("areaJuego");
const ctx = canvas.getContext("2d");

const txtPuntaje = document.getElementById("txtPuntaje");
const txtVidas = document.getElementById("txtVidas");

const btnIzquierda = document.getElementById("btnIzquierda");
const btnDerecha = document.getElementById("btnDerecha");
const btnReiniciar = document.getElementById("btnReiniciar");

const ANCHO_PERSONAJE = 60;
const ALTO_PERSONAJE = 40;
const ALTO_SUELO = 30;

let personajeX = 270;
let limones = [];
let puntaje = 0;
let vidas = 3;
let juegoActivo = true;


// INICIAR JUEGO
function iniciar() {

    personajeX = 270;
    limones = [];
    puntaje = 0;
    vidas = 3;
    juegoActivo = true;

    actualizarTexto();

    crearLimon();
}


// DIBUJAR JUEGO
function dibujar() {

    // Fondo
    ctx.fillStyle = "#dff3ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // SUELO
    ctx.fillStyle = "#4CAF50";

    ctx.fillRect(
        0,
        canvas.height - ALTO_SUELO,
        canvas.width,
        ALTO_SUELO
    );


    // PERSONAJE
    const personajeY =
        canvas.height - ALTO_SUELO - ALTO_PERSONAJE;

    // cuerpo
    ctx.fillStyle = "#FFD600";

    ctx.fillRect(
        personajeX,
        personajeY,
        ANCHO_PERSONAJE,
        ALTO_PERSONAJE
    );

    // cabeza
    ctx.fillStyle = "#FFE082";

    ctx.beginPath();

    ctx.arc(
        personajeX + 30,
        personajeY - 20,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // LIMONES
    for (let limon of limones) {

        ctx.fillStyle = "#FDD835";

        ctx.beginPath();

        ctx.arc(
            limon.x,
            limon.y,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // hoja
        ctx.fillStyle = "#43A047";

        ctx.beginPath();

        ctx.ellipse(
            limon.x + 8,
            limon.y - 10,
            7,
            4,
            -0.5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // GAME OVER
    if (!juegoActivo) {

        ctx.fillStyle = "rgba(0,0,0,0.6)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "white";

        ctx.font = "bold 40px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            190
        );

        ctx.font = "20px Arial";

        ctx.fillText(
            "Presiona Reiniciar",
            canvas.width / 2,
            230
        );
    }
}


// CREAR LIMÓN
function crearLimon() {

    if (!juegoActivo) {
        return;
    }

    limones.push({

        x: Math.random() * (canvas.width - 30) + 15,

        y: 0,

        velocidad: 2 + Math.random() * 2
    });
}


// ACTUALIZAR JUEGO
function actualizar() {

    if (!juegoActivo) {
        return;
    }

    for (let i = limones.length - 1; i >= 0; i--) {

        let limon = limones[i];

        // Hace caer el limón
        limon.y += limon.velocidad;


        const personajeY =
            canvas.height - ALTO_SUELO - ALTO_PERSONAJE;


        // ATRAPAR LIMÓN
        if (
            limon.x >= personajeX &&
            limon.x <= personajeX + ANCHO_PERSONAJE &&
            limon.y + 12 >= personajeY &&
            limon.y - 12 <= personajeY + ALTO_PERSONAJE
        ) {

            puntaje += 10;

            limones.splice(i, 1);

            actualizarTexto();

            continue;
        }


        // LIMÓN LLEGA AL SUELO
        if (
            limon.y + 12 >=
            canvas.height - ALTO_SUELO
        ) {

            vidas--;

            limones.splice(i, 1);

            actualizarTexto();

            if (vidas <= 0) {

                vidas = 0;

                juegoActivo = false;

                actualizarTexto();
            }
        }
    }
}


// IZQUIERDA
function moverIzquierda() {

    if (!juegoActivo) {
        return;
    }

    personajeX -= 25;

    if (personajeX < 0) {
        personajeX = 0;
    }
}


// DERECHA
function moverDerecha() {

    if (!juegoActivo) {
        return;
    }

    personajeX += 25;

    if (personajeX + ANCHO_PERSONAJE > canvas.width) {

        personajeX =
            canvas.width - ANCHO_PERSONAJE;
    }
}


// ACTUALIZAR PUNTAJE Y VIDAS
function actualizarTexto() {

    txtPuntaje.textContent = puntaje;
    txtVidas.textContent = vidas;
}


// BOTONES
btnIzquierda.addEventListener(
    "click",
    moverIzquierda
);

btnDerecha.addEventListener(
    "click",
    moverDerecha
);

btnReiniciar.addEventListener(
    "click",
    iniciar
);


// TECLADO
document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft") {
            moverIzquierda();
        }

        if (event.key === "ArrowRight") {
            moverDerecha();
        }
    }
);


// CREAR LIMONES
setInterval(
    crearLimon,
    1000
);


// BUCLE DEL JUEGO
function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);
}


// COMENZAR
iniciar();

juego();