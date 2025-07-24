const jugador = document.getElementById("jugador");
const puntajeElemento = document.getElementById("puntaje");
const btnIniciar = document.getElementById("btn-iniciar");
const btnDetener = document.getElementById("btn-detener");
const pantallaGameOver = document.getElementById("fin-juego");
const puntajeFinal = document.querySelector(".puntaje-final");
const btnReiniciar = document.getElementById("btn-reiniciar");
const contenedorJuego = document.getElementById("juego");

let puntaje = 0;
let jugadorX = 175;
let operaciones = [];
let juegoActivo = false;
let idBucleJuego;
let velocidad = 2;
let ultimoTiempoGenerado = 0;
const intervaloGeneracion = 1000;
const velocidadJugador = 20;
const distanciaRecolecta = 30;

function inicializarJuego() {
  puntaje = 0;
  jugadorX = 175;
  operaciones = [];
  velocidad = 2;
  puntajeElemento.textContent = `Puntaje: ${puntaje}`;
  jugador.style.left = `${jugadorX}px`;
  pantallaGameOver.style.display = "none";
  document.querySelectorAll('.operacion').forEach(item => item.remove());
}

function crearOperacion() {
  const tipos = [
    { simbolo: '+', fn: (a, b) => a + b },
    { simbolo: '-', fn: (a, b) => a - b },
    { simbolo: '×', fn: (a, b) => a * b },
    { simbolo: '÷', fn: (a, b) => a / b }
  ];
  
  const operacion = tipos[Math.floor(Math.random() * tipos.length)];
  let num1, num2;

  if (operacion.simbolo === '+') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  } else if (operacion.simbolo === '-') {
    num1 = Math.floor(Math.random() * 10) + 5;
    num2 = Math.floor(Math.random() * num1) + 1;
  } else if (operacion.simbolo === '×') {
    num1 = Math.floor(Math.random() * 5) + 1;
    num2 = Math.floor(Math.random() * 5) + 1;
  } else {
    num2 = Math.floor(Math.random() * 5) + 1;
    const multiplicador = Math.floor(Math.random() * 5) + 1;
    num1 = num2 * multiplicador;
  }

  const respuestaCorrecta = operacion.fn(num1, num2);
  const textoOperacion = `${num1}${operacion.simbolo}${num2}`;

  const item = document.createElement("div");
  item.className = "operacion";
  item.style.left = `${Math.random() * 340}px`;
  item.style.top = "0";
  item.textContent = textoOperacion;
  item.dataset.respuesta = respuestaCorrecta;
  contenedorJuego.appendChild(item);

  operaciones.push({
    elemento: item,
    x: parseInt(item.style.left),
    y: 0,
    velocidad: velocidad,
    respuesta: respuestaCorrecta,
    operacion: textoOperacion
  });
}


function moverJugador(direccion) {
  if (!juegoActivo) return;

  if (direccion === "izquierda") {
    jugadorX = Math.max(0, jugadorX - velocidadJugador);
  } else if (direccion === "derecha") {
    jugadorX = Math.min(350, jugadorX + velocidadJugador);
  }

  jugador.style.left = `${jugadorX}px`;
}

function intentarRecolectar() {
  if (!juegoActivo || operaciones.length === 0) return;

  const jugadorRect = jugador.getBoundingClientRect();
  let masCercano = null;
  let distanciaMinima = Infinity;

  operaciones.forEach(item => {
    const rectItem = item.elemento.getBoundingClientRect();
    const distancia = Math.sqrt(
      Math.pow(rectItem.left + 20 - (jugadorRect.left + 25), 2) +
      Math.pow(rectItem.top + 20 - (jugadorRect.top + 25), 2)
    );

    if (distancia < distanciaMinima && distancia < distanciaRecolecta) {
      distanciaMinima = distancia;
      masCercano = item;
    }
  });

  if (masCercano) {
    const respuestaUsuario = parseFloat(prompt(`¿Cuánto es ${masCercano.operacion}?`));

    if (respuestaUsuario === masCercano.respuesta) {
      puntaje += 10;
      puntajeElemento.textContent = `Puntaje: ${puntaje}`;
      masCercano.elemento.remove();
      operaciones = operaciones.filter(m => m !== masCercano);

      if (puntaje > 0 && puntaje % 30 === 0) {
        velocidad += 0.5;
      }
    } else {
      alert(`¡Incorrecto! La respuesta correcta era: ${masCercano.respuesta}`);
    }
  }
}

function bucleJuego(timestamp) {
  if (!juegoActivo) return;

  if (!ultimoTiempoGenerado || timestamp - ultimoTiempoGenerado > intervaloGeneracion) {
    crearOperacion();
    ultimoTiempoGenerado = timestamp;
  }

  operaciones.forEach(item => {
    item.y += item.velocidad;
    item.elemento.style.top = `${item.y}px`;

    if (item.y > 500) {
      item.elemento.remove();
      operaciones = operaciones.filter(m => m !== item);
    }
  });

  idBucleJuego = requestAnimationFrame(bucleJuego);
}

function iniciarJuego() {
  if (juegoActivo) return;

  inicializarJuego();
  juegoActivo = true;
  btnIniciar.disabled = true;
  btnDetener.disabled = false;
  ultimoTiempoGenerado = 0;
  bucleJuego();
}

function detenerJuego() {
  if (!juegoActivo) return;

  juegoActivo = false;
  cancelAnimationFrame(idBucleJuego);
  btnIniciar.disabled = false;
  btnDetener.disabled = true;
  puntajeFinal.textContent = `Tu puntaje: ${puntaje}`;
  pantallaGameOver.style.display = "block";
}

btnIniciar.addEventListener("click", iniciarJuego);
btnDetener.addEventListener("click", detenerJuego);
btnReiniciar.addEventListener("click", iniciarJuego);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moverJugador("izquierda");
  if (e.key === "ArrowRight") moverJugador("derecha");
  if (e.key === " ") intentarRecolectar();
});

// Controles táctiles
let toqueInicialX = 0;

document.addEventListener("touchstart", (e) => {
  toqueInicialX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  if (!juegoActivo) return;

  const toqueFinalX = e.changedTouches[0].clientX;
  const diferencia = toqueInicialX - toqueFinalX;

  if (Math.abs(diferencia) > 50) {
    if (diferencia > 0) moverJugador("izquierda");
    else moverJugador("derecha");
  } else {
    intentarRecolectar();
  }
});
