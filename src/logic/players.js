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

    this.board = this.createBoard();

    this.huntNtargetMode = 'hunt';
    this.lastAttackX = 0;
    this.lastAttackY = 0;

    this.nextX = 0;
    this.nextY = 0;

    this.nextAttack = 'left';

    this.response = '';
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
    while (this.shipsPlacedCount < 5) {
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);

      this.placeShip(num1, num2);
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
  huntAndTarget() {
    if (!this.response) this.response = '';
    if (this.response.endsWith('sunk!')) {
      this.huntNtargetMode = 'hunt';
      this.nextAttack = 'left';
    }

    if (this.huntNtargetMode === 'hunt') {
      do {
        this.lastAttackX = Math.floor(Math.random() * 10);
        this.lastAttackY = Math.floor(Math.random() * 10);

        this.response = this.recieveAttack(this.lastAttackX, this.lastAttackY);
      } while (!this.response);
      if (this.response.endsWith('hit!')) {
        this.huntNtargetMode = 'target';
        this.nextX = this.lastAttackX;
        this.nextY = this.lastAttackY - 1;
      }
      return;
    }
    if (this.huntNtargetMode === 'target') {
      if (this.nextAttack === 'left') {
        if (this.nextY >= 0) {
          this.response = this.recieveAttack(this.nextX, this.nextY);
          console.log(this.response);
          //If attacking on an attacked node
          if (!this.response) {
            this.nextY = this.lastAttackY + 1;
            this.nextAttack = 'right';
            return this.huntAndTarget();
          }
          if (this.response.endsWith('hit!')) {
            this.nextY--;
            return;
          }
          if (this.response.endsWith('missed')) {
            this.nextY = this.lastAttackY + 1;
            this.nextAttack = 'right';
            return;
          }
        } //If border of grid
        else {
          this.nextY = this.lastAttackY + 1;
          this.nextAttack = 'right';
          return this.huntAndTarget();
        }
      }
      if (this.nextAttack === 'right') {
        if (this.nextY <= 9) {
          this.response = this.recieveAttack(this.nextX, this.nextY);

          if (this.response.endsWith('hit!')) {
            this.nextY++;
            console.log(this.nextY);
            return;
          }
        }
        return;
      }
    }
  }
  isGameEnded() {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].sunk) return false;
    }
    return true;
  }
}

export const Player1 = new Player();
export const Player2 = new Player();
