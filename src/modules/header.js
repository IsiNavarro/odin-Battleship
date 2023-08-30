import css from './header.css';

const header = document.createElement('header');
const logo = document.createElement('h1');
logo.textContent = 'BATTLESHIP';

header.appendChild(logo);

export default header;
