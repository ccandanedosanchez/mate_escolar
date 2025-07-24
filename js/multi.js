function lanzarConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
let yaCelebre = false;   
  

function generarEjercicios(cantidad = 10) {
  const contenedor = document.getElementById('contenedor-ejercicios');
  contenedor.innerHTML = '';
  
  for (let i = 0; i < cantidad; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    const ejercicio = document.createElement('div');
    ejercicio.className = 'ejercicio';
  
    const enunciado = document.createElement('span');
    enunciado.textContent = `${num1} x ${num2} = `;
  
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'respuesta';
    input.dataset.respuesta = num1 * num2;
  
    ejercicio.appendChild(enunciado);
    ejercicio.appendChild(input);
    contenedor.appendChild(ejercicio);
  }
  const btnCorregir = document.createElement('button');
  btnCorregir.textContent = 'Corregir';
  btnCorregir.classList.add('boton-corregir');
  btnCorregir.onclick = corregirEjercicios;
  contenedor.appendChild(btnCorregir);
  
  const btnOtraVez = document.createElement('button');
  btnOtraVez.textContent = 'Otra vez';
  btnOtraVez.classList.add('boton-corregir');
  btnOtraVez.onclick = () => {
    yaCelebre = false;           // reinicia bandera para nueva ronda
    generarEjercicios(cantidad);
  };
  contenedor.appendChild(btnOtraVez);
}
  
function corregirEjercicios(){
  const inputs = document.querySelectorAll('.respuesta');
  let todoCorrecto = true;
  
  inputs.forEach(input => {
    const correcta = parseInt(input.dataset.respuesta);
    const usuario  = parseInt(input.value);
  
    // Elimina respuesta anterior si existe
    const spanPrevio = input.parentElement.querySelector('.respuesta-correcta');
    if (spanPrevio) spanPrevio.remove();
    
    // span con feedback
    const span = document.createElement('span');
    span.classList.add('respuesta-correcta');
    span.style.marginLeft = '10px';
  
    if (usuario === correcta) {
      input.style.backgroundColor = '#b2f7b2';
      span.textContent = '✓';
      span.style.color = 'green';
    } else {
      input.style.backgroundColor = '#f7b2b2';
      span.textContent = `✗ ${correcta}`;
      span.style.color = 'red';
      todoCorrecto = false;
    }
    input.parentElement.appendChild(span);
    });
    
    if (todoCorrecto && !yaCelebre) {
      yaCelebre = true;
      lanzarConfetti();
    }
}
  

function generarEjerciciosMulti(cantidad = 5) {
    const contenedor = document.getElementById('contenedor-multichoice');
    contenedor.innerHTML = '';
  
    for (let i = 0; i < cantidad; i++) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const correcta = num1 * num2;
  
      const ejercicio = document.createElement('div');
      ejercicio.className = 'ejercicio';
  
      const enunciado = document.createElement('p');
      enunciado.textContent = `¿Cuánto es ${num1} x ${num2}?`;
      ejercicio.appendChild(enunciado);
  
      // Generar 3 distractores + correcta
      const opciones = new Set([correcta]);
      while (opciones.size < 4) {
        const distractor = correcta + Math.floor(Math.random() * 7) - 3;
        if (distractor > 0) opciones.add(distractor);
      }
  
      // Mezclar opciones
      Array.from(opciones)
        .sort(() => Math.random() - 0.5)
        .forEach(opcion => {
          const label = document.createElement('label');
          label.style.display = 'block';
  
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `multi-${i}`;
          input.value = opcion;
          input.dataset.correcta = correcta;
  
          label.appendChild(input);
          label.append(` ${opcion}`);
          ejercicio.appendChild(label);
        });
  
      contenedor.appendChild(ejercicio);
    }
  
    const btnCorregir = document.createElement('button');
    btnCorregir.textContent = 'Corregir';
    btnCorregir.classList.add('boton-corregir');
    btnCorregir.onclick = corregirEjerciciosMulti;
    contenedor.appendChild(btnCorregir);
  
    const btnOtraVez = document.createElement('button');
    btnOtraVez.textContent = 'Otra vez';
    btnOtraVez.classList.add('boton-corregir');
    btnOtraVez.onclick = () => generarEjerciciosMulti(cantidad);
    contenedor.appendChild(btnOtraVez);
}
  
function corregirEjerciciosMulti() {
  const ejercicios = document.querySelectorAll('#contenedor-multichoice .ejercicio');
  let todoCorrecto = true;
  let alMenosUnoIncorrecto = false;

  ejercicios.forEach(ejercicio => {
    const inputs = ejercicio.querySelectorAll('input[type="radio"]');
    const correcta = parseInt(inputs[0].dataset.correcta);
    let ejercicioCorrecto = false;
    inputs.forEach(input => {
      const label = input.parentElement;
      if (input.checked) {
        if (parseInt(input.value) === correcta) {
          label.style.backgroundColor = '#b2f7b2';
          ejercicioCorrecto = true;
        } else {
          label.style.backgroundColor = '#f7b2b2';
          alMenosUnoIncorrecto = true;
        }
      }
    });
    if (!ejercicioCorrecto) {
      todoCorrecto = false;
    }
  });
  if (todoCorrecto && !alMenosUnoIncorrecto && !yaCelebre) {
    yaCelebre = true;
    lanzarConfetti();
  }
}
  
document.addEventListener('DOMContentLoaded', () => {
  generarEjercicios(10);
  generarEjerciciosMulti(5);
});
  