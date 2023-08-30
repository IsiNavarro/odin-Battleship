import css from './app.css';
import { Player1, Player2 } from '../logic/players';
import { refreshComputerBoard } from '../logic/refreshBoards';

const app = document.createElement('main');

const eventDisplayer = document.createElement('h3');
eventDisplayer.textContent = 'Choose a target';

const playersContainer = document.createElement('div');
playersContainer.classList.add('players-container');

const player1 = document.createElement('div');
player1.classList.add('player-one');
const player1Display = document.createElement('h4');
player1Display.classList.add('player-display');
player1Display.textContent = 'YOU';
player1.appendChild(player1Display);

export const player1Grid = document.createElement('div');
player1Grid.classList.add('player-one-grid');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    let node = document.createElement('div');
    node.classList.add('player-one-grid-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);

    player1Grid.appendChild(node);
  }
}
player1.appendChild(player1Grid);

const player2 = document.createElement('div');
player2.classList.add('player-two');
const player2Display = document.createElement('h4');
player2Display.classList.add('player-display');
player2Display.textContent = 'Computer';
player2.appendChild(player2Display);

export const player2Grid = document.createElement('div');
player2Grid.classList.add('player-two-grid');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    let node = document.createElement('div');
    node.classList.add('player-two-grid-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);

    node.addEventListener('click', () => {
      const x = parseInt(node.dataset.x);
      const y = parseInt(node.dataset.y);

      Player2.recieveAttack(x, y);
      refreshComputerBoard();
      //Player1.recieveComputerAttack();
      return;
    });

    player2Grid.appendChild(node);
  }
}
player2.appendChild(player2Grid);

playersContainer.appendChild(player1);
playersContainer.appendChild(player2);

app.appendChild(eventDisplayer);
app.appendChild(playersContainer);

export default app;
