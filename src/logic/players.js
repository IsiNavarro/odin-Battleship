import { Ship } from './ship';
import { Node } from './node';

export class Player {
  constructor() {
    this.ships = [
      new Ship(5, 'CARRIER'),
      new Ship(4, 'BATTLESHIP'),
      new Ship(3, 'DESTROYER'),
      new Ship(3, 'SUBMARINE'),
      new Ship(2, 'PATROL BOAT'),
    ];
    this.shipsPlacedCount = 0;
    this.attackedPlaces = [];

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
    if (shipSize > this.board[x].length - y) return null;
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
      if (y + shipSize <= 9) {
        if (this.board[x][y + shipSize].ship) return null; //Right
      }
    }

    //Place ship
    for (let i = 0; i < shipSize; i++) {
      this.board[x][y + i].ship = ship;
    }

    this.shipsPlacedCount += 1;
    return `${ship.name} placed`;
  }

  placeShipsRandom() {
    const size = 10;
    const listOfPossibilities = [];

    for (let x = 0; x < size; x++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        row.push([x, y]);
      }
      listOfPossibilities.push(row);
    }

    while (this.shipsPlacedCount < 5) {
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);

      this.placeShip(num1, num2);
      listOfPossibilities[num1].splice(num2, 1);
    }
  }
  recieveAttack(x, y) {
    const attackedNode = this.board[x][y];
    if (attackedNode.attacked) return null;
    else {
      if (attackedNode.ship) {
        attackedNode.ship.hit();
        attackedNode.attacked = 'hit';
        if (attackedNode.ship.sunk)
          return `Enemy ${attackedNode.ship.name} has been sunk!`;
        else return `Enemy ${attackedNode.ship.name} was hit!`;
      } else {
        attackedNode.attacked = 'miss';
        return `The attack missed`;
      }
    }
  }
}

export const Player1 = new Player();
export const Player2 = new Player();
