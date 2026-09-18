let canvas = document.getElementById("areaJuego");
let ctx = canvas.getContext("2d"); 

const ALTURA_SUELO = 20;
const ALTURA_PERSONAJE = 60;
const ANCHO_PERSONAJE = 40;
const RADIO_LIMON = 12; // Tamaño del limón que va a caer 

// Variables del juego que cambian dinámicamente
let personajeX = canvas.width / 2 - ANCHO_PERSONAJE / 2;
let limonX;
let limonY;
let velocidadLimon;
let puntaje;
let juegoIntervalo; // Controlará la caída continua de los limones 

function iniciar() {
// 1. Reiniciar valores cada vez que se presiona "Reiniciar" o carga la página
personajeX = canvas.width / 2 - ANCHO_PERSONAJE / 2;
puntaje = 0;
velocidadLimon = 4; // Velocidad con la que empiezan a caer
document.getElementById("txtPuntaje").innerText = puntaje; 

// 2. Posicionar el primer limón arriba de forma aleatoria
resetearLimon();

// 3. Activar controles del teclado (Flechas o letras A/D)
window.removeEventListener("keydown", manejarTeclado);
window.addEventListener("keydown", manejarTeclado);

// 4. Detener el bucle anterior (si existía) para evitar que vayan el doble de rápido
if (juegoIntervalo) clearInterval(juegoIntervalo);

// 5. Iniciar la caída constante automática (60 actualizaciones por segundo)
juegoIntervalo = setInterval(actualizarJuego, 1000 / 60);

} 

function actualizarJuego() {
moverLimon();      // Hace que el limón baje en cada frame
detectarColision(); // Comprueba si el personaje lo atrapó
actualizarPantalla(); // Borra y vuelve a dibujar todo
} 

function dibujarSuelo() {
// Un color azul moderno estilo neón/cyberpunk para el suelo
ctx.fillStyle = "#38bdf8";
ctx.fillRect(0, canvas.height - ALTURA_SUELO, canvas.width, ALTURA_SUELO);
} 

function dibujarPersonaje() {
// Un color amarillo brillante (limón) para el personaje
ctx.fillStyle = "#facc15";
ctx.fillRect(personajeX, canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE), ANCHO_PERSONAJE, ALTURA_PERSONAJE);
} 

function dibujarLimon() {
ctx.beginPath();
ctx.arc(limonX, limonY, RADIO_LIMON, 0, Math.PI * 2);
ctx.fillStyle = "#a3e635"; // Verde lima brillante para el limón
ctx.fill();
ctx.closePath();
} 

function moverLimon() {
limonY += velocidadLimon; // El limón cae sumando píxeles hacia abajo 

// Si el limón pasa de largo el suelo y cae al vacío, vuelve a aparecer arriba
if (limonY > canvas.height - ALTURA_SUELO) {
resetearLimon();
}
} 

function resetearLimon() {
limonY = 0; // Regresa al techo
// Genera una coordenada X aleatoria dentro de los límites del Canvas
limonX = Math.random() * (canvas.width - (RADIO_LIMON * 2)) + RADIO_LIMON; 

// Dificultad incremental: El juego se acelera sutilmente a medida que sumas puntos
if (puntaje > 0) {
velocidadLimon = Math.min(velocidadLimon + 0.8, 235);
}
} 

function detectarColision() {
let personajeY = canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE); 

// Si el limón entra en contacto con los límites del rectángulo del personaje
if (limonX + RADIO_LIMON > personajeX &&
limonX - RADIO_LIMON < personajeX + ANCHO_PERSONAJE &&
limonY + RADIO_LIMON > personajeY) {
puntaje += 10; // Suma 10 puntos
document.getElementById("txtPuntaje").innerText = puntaje; // Actualiza el HTML
resetearLimon(); // Desaparece y genera uno nuevo arriba

}

} 

function moverIzquierda() {
if (personajeX > 0) {
personajeX = personajeX - 25; // Aumenté un poco la velocidad de paso para alcanzar los limones rápidos
actualizarPantalla();
}
} 

function moverDerecha() {
if (personajeX < canvas.width - ANCHO_PERSONAJE) {
personajeX = personajeX + 25;
actualizarPantalla();
}
} 

function manejarTeclado(evento) {
if (evento.key === "ArrowLeft" || evento.key === "a") {
moverIzquierda();
} else if (evento.key === "ArrowRight" || evento.key === "d") {
moverDerecha();
}
} 

function actualizarPantalla() {
limpiarCanva();
dibujarSuelo();
dibujarPersonaje();
dibujarLimon(); // Agregado a la actualización de pantalla
} 

function limpiarCanva() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarPersonaje() {
    let imagen = document.getElementById("imgPersonaje");
    
    // Si la imagen cargó con éxito en el navegador, la dibuja
    if (imagen && imagen.complete && imagen.naturalWidth !== 0) {
        ctx.drawImage(imagen, personajeX, canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE), ANCHO_PERSONAJE, ALTURA_PERSONAJE);
    } else {
        // Cuadro amarillo de respaldo por si el archivo no se encuentra
        ctx.fillStyle = "#1ba1b3"; 
        ctx.fillRect(personajeX, canvas.height - (ALTURA_SUELO + ALTURA_PERSONAJE), ANCHO_PERSONAJE, ALTURA_PERSONAJE);
    }
}