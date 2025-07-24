const btnOpenDrawing  = document.getElementById('openDrawing');
const btnCloseDrawing = document.getElementById('closeDrawing');
const drawingOverlay  = document.getElementById('drawingOverlay');

btnOpenDrawing?.addEventListener('click', () => drawingOverlay.classList.add('active'));
btnCloseDrawing?.addEventListener('click', () => drawingOverlay.classList.remove('active'));

const btnMenuOpen   = document.getElementById('btnOpen');   
const btnMenuClose  = document.getElementById('btnClose');  
const mobileSidebar = document.querySelector('.sidebar');

btnMenuOpen?.addEventListener('click', () => { mobileSidebar.style.display = 'flex'; });
btnMenuClose?.addEventListener('click', () => { mobileSidebar.style.display = 'none'; });

mobileSidebar?.querySelectorAll('.nav-dropdown > a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();                 
    link.parentElement.classList.toggle('active');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800 && mobileSidebar) {
    mobileSidebar.style.display = 'none';
    mobileSidebar.querySelectorAll('.nav-dropdown.active')
                 .forEach(d => d.classList.remove('active'));
  }
});

const canvas = document.getElementById('drawingBoard');
const ctx    = canvas?.getContext('2d');
let drawing  = false;

function getPos(e){
  if (e.touches) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.touches[0].clientX - rect.left,
             y: e.touches[0].clientY - rect.top };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function start(e){ drawing = true; draw(e); }
function end()  { drawing = false; ctx.beginPath(); }
function draw(e){
  if (!drawing) return;
  const {x, y} = getPos(e);
  ctx.lineWidth   = 4;
  ctx.lineCap     = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
if (canvas) {
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mouseup',   end);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchstart',start);
  canvas.addEventListener('touchend',  end);
  canvas.addEventListener('touchmove', draw);
}

document.getElementById('clearCanvas')
?.addEventListener('click', () =>
  ctx.clearRect(0, 0, canvas.width, canvas.height));


