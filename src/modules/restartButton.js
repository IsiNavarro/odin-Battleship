import css from './restartButton.css';

const button = document.createElement('button');
button.classList.add('restart-button');
button.textContent = 'Restart';

button.addEventListener('click', () => {
  location.reload();
});

export default button;
