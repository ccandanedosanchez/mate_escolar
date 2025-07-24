const track     = document.querySelector('.carousel__track');
const cards     = Array.from(track?.children || []);
const prevBtn   = document.getElementById('prev');
const nextBtn   = document.getElementById('next');

let currentIdx  = 0;
const cardWidth = 100 / cards.length;

if (track && cards.length) {
  track.style.width = `${cards.length * 100}%`;
  cards.forEach(card => {
    card.style.flex = `0 0 ${cardWidth}%`;
  });

  function updateCarousel () {
    track.style.transform  = `translateX(${-currentIdx * cardWidth}%)`;
    track.style.transition = 'transform 0.9s ease';
  }
  function nextCard () { currentIdx = (currentIdx + 1) % cards.length; updateCarousel(); }
  function prevCard () { currentIdx = (currentIdx - 1 + cards.length) % cards.length; updateCarousel(); }

  nextBtn?.addEventListener('click', nextCard);
  prevBtn?.addEventListener('click', prevCard);

  
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.carousel__btn')) return;
      card.classList.toggle('is-flipped');
    });
  });

  
  track.addEventListener('transitionend', () =>
    cards.forEach(card => card.classList.remove('is-flipped')));
}
