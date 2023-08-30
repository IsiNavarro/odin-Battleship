import { Node } from '../logic/node';
import { Ship } from '../logic/ship';

it("Node: Let's you place new ships", () => {
  const Carrier = new Ship(5);
  const NodeExample = new Node(0, 0);
  NodeExample.ship = Carrier;

  expect(NodeExample.ship.size).toBe(5);
});
