function lanzarConfetti() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
}
let yaCelebreResta = false;      
let yaCelebreDrag = false;       
  
function generarEjerciciosResta(cantidad = 10) {
  const contenedor = document.getElementById('contenedor-ejercicios');
  contenedor.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * (num1 + 1)); 
    const ejercicio = document.createElement('div');
    ejercicio.className = 'ejercicio';
  
    const enunciado = document.createElement('span');
    enunciado.textContent = `${num1} - ${num2} = `;
  
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'respuesta';
    input.dataset.respuesta = num1 - num2;
  
    ejercicio.append(enunciado, input);
    contenedor.appendChild(ejercicio);
  }
  const btnCorregir = document.createElement('button');
  btnCorregir.textContent = 'Corregir';
  btnCorregir.classList.add('boton-corregir');
  btnCorregir.onclick = corregirEjerciciosResta;
  contenedor.appendChild(btnCorregir);
  
  
  const btnOtra = document.createElement('button');
  btnOtra.textContent = 'Otra vez';
  btnOtra.classList.add('boton-corregir');
  btnOtra.onclick = () => { yaCelebreResta = false; generarEjerciciosResta(cantidad); };
  contenedor.appendChild(btnOtra);
}
  
function corregirEjerciciosResta() {
  const inputs = document.querySelectorAll('#contenedor-ejercicios .respuesta');
  let todoCorrecto = true;
  inputs.forEach(input => {
    const correcto = parseInt(input.dataset.respuesta);
    const usuario  = parseInt(input.value);
    
    const previo = input.parentElement.querySelector('.respuesta-correcta');
    if (previo) previo.remove();
  
    const span = document.createElement('span');
    span.className = 'respuesta-correcta';
    span.style.marginLeft = '10px';
  
    if (usuario === correcto) {
      input.style.backgroundColor = '#b2f7b2';
      span.textContent = '✓';
      span.style.color = 'green';
      } else {
      input.style.backgroundColor = '#f7b2b2';
      span.textContent = `✗ ${correcto}`;
      span.style.color = 'red';
      todoCorrecto = false;
    }
    input.parentElement.appendChild(span);
  });

  if (todoCorrecto && !yaCelebreResta) {
    yaCelebreResta = true;
    lanzarConfetti();
  }
}
  
function generarEjerciciosDragDrop(cantidad = 5) {
  const contenedor = document.getElementById('contenedor-dragdrop');
  contenedor.innerHTML = '';
  
  for (let i = 0; i < cantidad; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * (num1 + 1));
    const correcta = num1 - num2;
  
    const ejercicio = document.createElement('div');
    ejercicio.className = 'ejercicio';
  
    const enunciado = document.createElement('p');
    enunciado.textContent = `¿Cuánto es ${num1} - ${num2}?`;
    ejercicio.appendChild(enunciado);
  
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.correcta = correcta;
    dropZone.textContent = 'Arrastra aquí';
    dropZone.style.cssText = `
      display:inline-block; min-width:80px; padding:6px; margin:4px 0;
      border:2px dashed #888; border-radius:6px; text-align:center;
      `;
      
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      const valor = e.dataTransfer.getData('text/plain');
      dropZone.textContent = valor;
      dropZone.dataset.valor = valor;
    });
    ejercicio.appendChild(dropZone);
    const opcionesDiv = document.createElement('div');
    opcionesDiv.className = 'opciones';

    const opciones = new Set([correcta]);
    while (opciones.size < 4) {
      const distractor = correcta + Math.floor(Math.random() * 7) - 3;
      if (distractor >= 0) opciones.add(distractor);
    }
    Array.from(opciones)
    .sort(() => Math.random() - 0.5)
    .forEach(opcion => {
      const box = document.createElement('div');
      box.className = 'option-box';
      box.draggable = true;
      box.dataset.valor = opcion;
      box.textContent = opcion;
      box.style.cssText = `
          display:inline-block; padding:6px 10px; margin:4px;
          border:1px solid #555; border-radius:6px; cursor:grab; user-select:none;
          `;
      box.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', box.dataset.valor);
      });
      opcionesDiv.appendChild(box);
    });
    ejercicio.appendChild(opcionesDiv);
    contenedor.appendChild(ejercicio);
  }
  const btnCorregir = document.createElement('button');
  btnCorregir.textContent = 'Corregir';
  btnCorregir.classList.add('boton-corregir');
  btnCorregir.onclick = corregirDragDrop;
  contenedor.appendChild(btnCorregir);
  
  const btnOtra = document.createElement('button');
  btnOtra.textContent = 'Otra vez';
  btnOtra.classList.add('boton-corregir');
  btnOtra.onclick = () => { yaCelebreDrag = false; generarEjerciciosDragDrop(cantidad); };
  contenedor.appendChild(btnOtra);
}
  
function corregirDragDrop() {
  const zonas = document.querySelectorAll('.drop-zone');
  let todoCorrecto = true;
  zonas.forEach(zona => {
    const correcta = parseInt(zona.dataset.correcta);
    const valor    = parseInt(zona.dataset.valor);
    if (valor === correcta) {
      zona.style.backgroundColor = '#b2f7b2';
      zona.style.borderColor     = '#4caf50';
    } else {
      zona.style.backgroundColor = '#f7b2b2';
      zona.style.borderColor     = '#e53935';
      todoCorrecto = false;
    }
  });
  
  if (todoCorrecto && !yaCelebreDrag) {
    yaCelebreDrag = true;
    lanzarConfetti();
  }
}
  
document.addEventListener('DOMContentLoaded', () => {
  generarEjerciciosResta(10);     
  generarEjerciciosDragDrop(5);  
});
     