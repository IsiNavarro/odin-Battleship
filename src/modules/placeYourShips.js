import css from './placeYourShips.css';
import { refreshPlacingBoard } from '../logic/refreshBoards';
import { Player1, Player2 } from '../logic/players';
import app from './app';

const shipPlacing = document.createElement('div');
shipPlacing.classList.add('ship-placing');

const heading = document.createElement('h2');
heading.classList.add('ship-placing-h2');
heading.textContent = 'Place your ships!';
shipPlacing.appendChild(heading);

const shipPlacingContainer = document.createElement('div');
shipPlacingContainer.classList.add('ship-placing-container');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    const node = document.createElement('div');
    node.classList.add('ship-placing-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);

    //Placing a ship when clicking a node
    node.addEventListener('click', () => {
      const x = parseInt(node.dataset.x);
      const y = parseInt(node.dataset.y);

      Player1.placeShip(x, y);
      refreshPlacingBoard();

      if (Player1.shipsPlacedCount >= 5) {
        shipPlacing.style.display = 'none';
        app.style.display = 'flex';
        Player2.placeShipsRandom();

        //HERE WE HAVE TO START THE GAME CONTROLLER
        return;
      }
    });
    shipPlacingContainer.appendChild(node);
  }
}

shipPlacing.appendChild(shipPlacingContainer);

export default shipPlacing;
export { shipPlacingContainer };
