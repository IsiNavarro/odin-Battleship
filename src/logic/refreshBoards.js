import { shipPlacingContainer as placeBoard } from '../modules/placeYourShips';
import { player1Grid, player2Grid } from '../modules/app';
import { Player1, Player2 } from './players';

export function refreshBoards() {
  //Refresh PLACE YOUR SHIPS Modal
  const placeBoardChildren = placeBoard.children;
  for (let i = 0; i < placeBoardChildren.length; i++) {
    const node = placeBoardChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);

    if (Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(150,150,150)';
    }
  }

  //Refresh YOUR board
  const player1GridChildren = player1Grid.children;
  for (let i = 0; i < player1GridChildren.length; i++) {
    const node = player1GridChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);

    if (Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(150,150,150)';
    }
  }
  console.log('Refreshing boards...');
}
