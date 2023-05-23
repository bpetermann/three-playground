const rotate = { direction: 'y' };

const rotateX = document.getElementById('rotateX');
const rotateY = document.getElementById('rotateY');
const stop = document.getElementById('stop');

rotateX.addEventListener('click', () => {
  rotateX.style.opacity = '0.6';
  rotateY.style.opacity = '1';
  stop.style.opacity = '1';

  rotate.direction = 'x';
});

rotateY.addEventListener('click', () => {
  rotateX.style.opacity = '1';
  rotateY.style.opacity = '0.6';
  stop.style.opacity = '1';

  rotate.direction = 'y';
});

stop.addEventListener('click', () => {
  rotateX.style.opacity = '1';
  rotateY.style.opacity = '1';
  stop.style.opacity = '0.6';

  rotate.direction = null;
});

export default rotate