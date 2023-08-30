export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.ship = null;
    this.attacked = false; //Can be 'miss' or 'hit'
  }
}
