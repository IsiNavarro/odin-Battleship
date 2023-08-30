import { Ship } from '../logic/ship';

test('Ship 1 hit', () => {
  const ShipExample = new Ship(5);
  ShipExample.hit();
  expect(ShipExample.hits).toBe(1);
});

test('Ship 5 hits', () => {
  const ShipExample = new Ship(5);
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  expect(ShipExample.hits).toBe(5);
});

test('Ship sinking', () => {
  const ShipExample = new Ship(5);
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  ShipExample.hit();
  expect(ShipExample.sunk).toBeTruthy();
});
