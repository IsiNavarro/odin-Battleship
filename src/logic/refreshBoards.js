import { shipPlacingContainer as placeBoard } from '../modules/placeYourShips';
import { player1Grid, player2Grid } from '../modules/app';
import { Player1, Player2 } from './players';

export function refreshPlacingBoard() {
  //Refresh PLACE YOUR SHIPS Modal
  const placeBoardChildren = placeBoard.children;
  for (let i = 0; i < placeBoardChildren.length; i++) {
    const node = placeBoardChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);

    if (Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(201,201,201)';
    }
  }

  refreshPlayer1WhenPlacing();
}

function refreshPlayer1WhenPlacing() {
  //Refresh YOUR board
  const player1GridChildren = player1Grid.children;
  for (let i = 0; i < player1GridChildren.length; i++) {
    const node = player1GridChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);

    if (Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(201,201,201)';
    }
  }
}

export function refreshComputerBoard() {
  //Refresh COMPUTER's Board
  const player2GridChildren = player2Grid.children;

  for (let i = 0; i < player2GridChildren.length; i++) {
    const node = player2GridChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);

    const attack = Player2.board[x][y].attacked;
    if (attack) {
      if (attack === 'miss') {
        node.style.backgroundColor = '#ffffff';
      } else if (attack === 'hit') {
        node.style.backgroundColor = 'rgb(255, 64, 64)';
      }
    }
  }
}
