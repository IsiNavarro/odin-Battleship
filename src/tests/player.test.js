import { Player } from '../logic/players';

const PlayerExample = new Player();

it('Player: Ships are there', () => {
  expect(PlayerExample.ships[0].name).toBe('Carrier');
});

it('Player: Board works', () => {
  expect(PlayerExample.board[0][3].y).toBe(3);
});

it('Player: Place a ship', () => {
  PlayerExample.placeShip(0, 0);
  expect(PlayerExample.board[0][0].ship.name).toBe('Carrier');
});

it('Player: Ship properly placed', () => {
  expect(PlayerExample.board[0][4].ship.name).toBe('Carrier');
});

it("Player: Can't place if a ship is on the way", () => {
  expect(PlayerExample.placeShip(0, 2)).toBe(null);
});

it("Player: Can't place if a ship is on top", () => {
  expect(PlayerExample.placeShip(1, 2)).toBe(null);
});

it("Player: Can't place if a ship is right behind", () => {
  expect(PlayerExample.placeShip(0, 5)).toBe(null);
});

it('Player: Can place on the very next one', () => {
  expect(PlayerExample.placeShip(0, 6)).toBe('Battleship placed');
});

it("Player: Can't place if a ship is underneath", () => {
  PlayerExample.placeShip(9, 6);
  expect(PlayerExample.placeShip(8, 6)).toBe(null);
});
it("Player: Can't place if a ship is in front", () => {
  expect(PlayerExample.placeShip(9, 3)).toBe(null);
});

it('Player: Can recieve attacks', () => {
  PlayerExample.recieveAttack(0, 6);
  expect(PlayerExample.ships[1].hits).toBe(1);
});
