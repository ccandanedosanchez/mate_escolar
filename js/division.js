document.addEventListener('DOMContentLoaded', () => {
    nuevaDivision();   
    nuevaPizza();
  });
  
 
function nuevaDivision () {
  const cont = document.getElementById('contenedor-multichoice');
  if (!cont) return;
  
  cont.innerHTML = '';
  const divisor   = getRandomInt(2, 11);  
  const cociente  = getRandomInt(2, 13);  
  const dividendo = divisor * cociente;  
  const pregunta = document.createElement('p');
  pregunta.textContent = `¿Cuánto es ${dividendo} ÷ ${divisor}?`;
  cont.appendChild(pregunta);
  
  const opciones = new Set([cociente]);
  while (opciones.size < 4) {
    const distr = cociente + getRandomInt(-5, 6); 
    if (distr > 0) opciones.add(distr);
  }
  Array.from(opciones)
  .sort(() => Math.random() - 0.5)
  .forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'division-btn';
    btn.textContent = n;
    btn.onclick = () => verificarDivision(btn, n === cociente);
    cont.appendChild(btn);
  });
}
  
function verificarDivision (btn, ok) {
  btn.classList.add(ok ? 'bien' : 'mal');
  if (ok) {
    confetti?.();                      
    setTimeout(nuevaDivision, 1200);  
    } else {
      navigator.vibrate?.(120);
    }
}
    
function nuevaPizza() {
  const sec = document.getElementById('ejercicioPizza');
  if (!sec) return;
  const totalReb = 8;
  const amigos = getRandomInt(2, 7);
  const resultado = parseFloat((totalReb / amigos).toFixed(2));
  const texto = sec.querySelector('.ejemplo-texto');
  texto.innerHTML =
      `Si tenemos <strong>1 pizza con ${totalReb} rebanadas</strong> ` +
      `y somos <strong>${amigos} amigos</strong>, ` +
      `¿cuántas rebanadas recibe cada uno?`;

  const inp = sec.querySelector('#inputPizza');
  const btn = sec.querySelector('#btnPizzaOK');
  const msg = sec.querySelector('#msgPizza');
  inp.value = '';
  msg.textContent = '';
  msg.className = 'feedback-text';

  let attempts = 0; 

  btn.onclick = () => {
    attempts++;
    const valor = parseFloat(inp.value.replace(',', '.'));
    if (Number.isNaN(valor)) return;
    const ok = Math.abs(valor - resultado) < 0.001;
    if (ok) {
      msg.textContent = `¡Correcto! Cada uno recibe ${resultado} porciones 🍕`;
      msg.classList.add('ok');
      confetti?.();
      setTimeout(nuevaPizza, 1800);
    } else {
      if (attempts >= 2) {
        msg.textContent = `La respuesta correcta es ${resultado}. ¡Inténtalo de nuevo con otra pizza!`;
        msg.classList.add('ko');
        setTimeout(nuevaPizza, 2500); 
      } else {
        msg.textContent = 'Intenta otra vez 😉';
        msg.classList.add('ko');
        navigator.vibrate?.(120);
      }
    }
  };
}
  
  
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; 
}
  