import css from './assets/style.css';
import { header, app, shipPlacing, footer } from './modules/allModules';

const body = document.querySelector('body');
body.append(header);
body.append(app);
body.appendChild(shipPlacing);
body.appendChild(footer);
