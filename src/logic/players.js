import { Ship } from './ship';
import { Node } from './node';

export class Player {
  constructor() {
    this.ships = [
      new Ship(5, 'Carrier'),
      new Ship(4, 'Battleship'),
      new Ship(3, 'Destroyer'),
      new Ship(3, 'Submarine'),
      new Ship(2, 'Patrol Boat'),
    ];
    this.shipsPlacedCount = 0;

    this.board = this.createBoard();
  }

  createBoard(size = 10) {
    const grid = [];
    for (let x = 0; x < size; x++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        row.push(new Node(x, y));
      }
      grid.push(row);
    }
    return grid;
  }

  placeShip(x, y) {
    const ship = this.ships[this.shipsPlacedCount];
    this.board[x][y].ship = ship;

    this.shipsPlacedCount += 1;
  }
}

export const Player1 = new Player();
export const Player2 = new Player();
