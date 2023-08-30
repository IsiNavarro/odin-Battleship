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
