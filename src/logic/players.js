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
    const shipSize = ship.size;

    //Check ship won't be out of limit
    if (shipSize > this.board[x].length - shipSize - 1) return null;
    //Check no other ships around
    else {
      //Check left
      if (y > 0) {
        if (this.board[x][y - 1].ship) return null;
      }
      for (let i = 0; i < shipSize; i++) {
        //Check Self
        if (this.board[x][y + i].ship) return null;
        //Check Bottom
        if (x < 9) {
          if (this.board[x + 1][y + i].ship) return null;
        }
        //Check top
        if (x > 0) {
          if (this.board[x - 1][y + i].ship) return null;
        }
      }
      if (this.board[x][y + shipSize - 1].ship) return null; //Right
    }

    //Place ship
    for (let i = 0; i < shipSize; i++) {
      this.board[x][y + i].ship = ship;
    }

    this.shipsPlacedCount += 1;
    return `${ship.name} placed`;
  }
}

export const Player1 = new Player();
export const Player2 = new Player();
