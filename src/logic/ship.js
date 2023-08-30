export class Ship {
  constructor(size, name, hits = 0, sunk = false) {
    this.name = name;
    this.size = size;
    this.hits = hits;
    this.sunk = sunk;
  }
  hit() {
    this.hits++;
    this.sunk = this.hits >= this.size ? true : false;
  }
}
