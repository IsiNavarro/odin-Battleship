"use strict";
(self["webpackChunkbattleship"] = self["webpackChunkbattleship"] || []).push([["index"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/style.css */ "./src/assets/style.css");
/* harmony import */ var _modules_allModules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/allModules */ "./src/modules/allModules.js");


const body = document.querySelector('body');
body.append(_modules_allModules__WEBPACK_IMPORTED_MODULE_1__.header);
body.append(_modules_allModules__WEBPACK_IMPORTED_MODULE_1__.app);
body.appendChild(_modules_allModules__WEBPACK_IMPORTED_MODULE_1__.shipPlacing);
body.appendChild(_modules_allModules__WEBPACK_IMPORTED_MODULE_1__.button);
body.appendChild(_modules_allModules__WEBPACK_IMPORTED_MODULE_1__.footer);

/***/ }),

/***/ "./src/logic/node.js":
/*!***************************!*\
  !*** ./src/logic/node.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Node: () => (/* binding */ Node)
/* harmony export */ });
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ship = null;
    this.attacked = false; //Can be 'miss' or 'hit'
  }
}

/***/ }),

/***/ "./src/logic/players.js":
/*!******************************!*\
  !*** ./src/logic/players.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player),
/* harmony export */   Player1: () => (/* binding */ Player1),
/* harmony export */   Player2: () => (/* binding */ Player2)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/logic/ship.js");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node */ "./src/logic/node.js");


class Player {
  constructor() {
    this.ships = [new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(5, 'CARRIER'), new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(4, 'BATTLESHIP'), new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(3, 'DESTROYER'), new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(3, 'SUBMARINE'), new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(2, 'PATROL BOAT')];
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
  createBoard() {
    let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    const grid = [];
    for (let x = 0; x < size; x++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        row.push(new _node__WEBPACK_IMPORTED_MODULE_1__.Node(x, y));
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
    if (attackedNode.attacked) return null;else {
      if (attackedNode.ship) {
        attackedNode.ship.hit();
        attackedNode.attacked = 'hit';
        if (attackedNode.ship.sunk) return `Enemy ${attackedNode.ship.name} has been sunk!`;else return `Enemy ${attackedNode.ship.name} was hit!`;
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
const Player1 = new Player();
const Player2 = new Player();

/***/ }),

/***/ "./src/logic/refreshBoards.js":
/*!************************************!*\
  !*** ./src/logic/refreshBoards.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   refreshComputerBoard: () => (/* binding */ refreshComputerBoard),
/* harmony export */   refreshPlacingBoard: () => (/* binding */ refreshPlacingBoard),
/* harmony export */   refreshPlayer1Board: () => (/* binding */ refreshPlayer1Board)
/* harmony export */ });
/* harmony import */ var _modules_placeYourShips__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/placeYourShips */ "./src/modules/placeYourShips.js");
/* harmony import */ var _modules_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/app */ "./src/modules/app.js");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./players */ "./src/logic/players.js");



function refreshPlacingBoard() {
  //Refresh PLACE YOUR SHIPS Modal
  const placeBoardChildren = _modules_placeYourShips__WEBPACK_IMPORTED_MODULE_0__.shipPlacingContainer.children;
  for (let i = 0; i < placeBoardChildren.length; i++) {
    const node = placeBoardChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);
    if (_players__WEBPACK_IMPORTED_MODULE_2__.Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(201,201,201)';
    }
  }
  refreshPlayer1Board();
}
function refreshPlayer1Board() {
  //Refresh YOUR board
  const player1GridChildren = _modules_app__WEBPACK_IMPORTED_MODULE_1__.player1Grid.children;
  for (let i = 0; i < player1GridChildren.length; i++) {
    const node = player1GridChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);
    if (_players__WEBPACK_IMPORTED_MODULE_2__.Player1.board[x][y].ship) {
      node.style.backgroundColor = 'rgb(201,201,201)';
    }
    if (_players__WEBPACK_IMPORTED_MODULE_2__.Player1.board[x][y].attacked === 'miss') node.style.backgroundColor = '#ffffff';
    if (_players__WEBPACK_IMPORTED_MODULE_2__.Player1.board[x][y].attacked === 'hit') node.style.backgroundColor = 'rgb(255,64,64)';
  }
}
function refreshComputerBoard() {
  //Refresh COMPUTER's Board
  const player2GridChildren = _modules_app__WEBPACK_IMPORTED_MODULE_1__.player2Grid.children;
  for (let i = 0; i < player2GridChildren.length; i++) {
    const node = player2GridChildren[i];

    //Get the data-label
    const x = parseInt(node.dataset.x);
    const y = parseInt(node.dataset.y);
    const attack = _players__WEBPACK_IMPORTED_MODULE_2__.Player2.board[x][y].attacked;
    if (attack) {
      if (attack === 'miss') {
        node.style.backgroundColor = '#ffffff';
      } else if (attack === 'hit') {
        node.style.backgroundColor = 'rgb(255, 64, 64)';
      }
    }
  }
}

/***/ }),

/***/ "./src/logic/ship.js":
/*!***************************!*\
  !*** ./src/logic/ship.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(size, name) {
    let hits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let sunk = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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

/***/ }),

/***/ "./src/modules/allModules.js":
/*!***********************************!*\
  !*** ./src/modules/allModules.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   app: () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   button: () => (/* reexport safe */ _restartButton__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   footer: () => (/* reexport safe */ _footer__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   header: () => (/* reexport safe */ _header__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   shipPlacing: () => (/* reexport safe */ _placeYourShips__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header */ "./src/modules/header.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/modules/app.js");
/* harmony import */ var _placeYourShips__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeYourShips */ "./src/modules/placeYourShips.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./footer */ "./src/modules/footer.js");
/* harmony import */ var _restartButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./restartButton */ "./src/modules/restartButton.js");







/***/ }),

/***/ "./src/modules/app.js":
/*!****************************!*\
  !*** ./src/modules/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   player1Grid: () => (/* binding */ player1Grid),
/* harmony export */   player2Grid: () => (/* binding */ player2Grid)
/* harmony export */ });
/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.css */ "./src/modules/app.css");
/* harmony import */ var _logic_players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logic/players */ "./src/logic/players.js");
/* harmony import */ var _logic_refreshBoards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../logic/refreshBoards */ "./src/logic/refreshBoards.js");



const app = document.createElement('main');
const eventDisplayer = document.createElement('h3');
eventDisplayer.textContent = 'Choose a target';
const playersContainer = document.createElement('div');
playersContainer.classList.add('players-container');
const player1 = document.createElement('div');
player1.classList.add('player-one');
const player1Display = document.createElement('h4');
player1Display.classList.add('player-display');
player1Display.textContent = 'YOU';
player1.appendChild(player1Display);
const player1Grid = document.createElement('div');
player1Grid.classList.add('player-one-grid');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    let node = document.createElement('div');
    node.classList.add('player-one-grid-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);
    player1Grid.appendChild(node);
  }
}
player1.appendChild(player1Grid);
const player2 = document.createElement('div');
player2.classList.add('player-two');
const player2Display = document.createElement('h4');
player2Display.classList.add('player-display');
player2Display.textContent = 'Computer';
player2.appendChild(player2Display);
const player2Grid = document.createElement('div');
player2Grid.classList.add('player-two-grid');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    let node = document.createElement('div');
    node.classList.add('player-two-grid-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);
    node.addEventListener('click', listener);
    player2Grid.appendChild(node);
  }
}
player2.appendChild(player2Grid);
playersContainer.appendChild(player1);
playersContainer.appendChild(player2);
app.appendChild(eventDisplayer);
app.appendChild(playersContainer);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);
function listener() {
  const x = parseInt(this.dataset.x);
  const y = parseInt(this.dataset.y);
  const message = _logic_players__WEBPACK_IMPORTED_MODULE_1__.Player2.recieveAttack(x, y);
  (0,_logic_refreshBoards__WEBPACK_IMPORTED_MODULE_2__.refreshComputerBoard)();
  if (_logic_players__WEBPACK_IMPORTED_MODULE_1__.Player2.isGameEnded()) {
    eventDisplayer.textContent = 'Enemy fleet completely sunk. YOU WIN!';
    GridRemoveListener();
    return;
  }
  if (message) {
    eventDisplayer.textContent = message;

    //Wait 1.5 seconds between attacks??
    _logic_players__WEBPACK_IMPORTED_MODULE_1__.Player1.huntAndTarget();
    (0,_logic_refreshBoards__WEBPACK_IMPORTED_MODULE_2__.refreshPlayer1Board)();
    if (_logic_players__WEBPACK_IMPORTED_MODULE_1__.Player1.isGameEnded()) {
      eventDisplayer.textContent = 'Game over... Computer wins';
      GridRemoveListener();
      return;
    }
  }
}
function GridRemoveListener() {
  const player2GridChildren = player2Grid.children;
  for (let i = 0; i < player2GridChildren.length; i++) {
    const node = player2GridChildren[i];
    node.removeEventListener('click', listener);
  }
}

/***/ }),

/***/ "./src/modules/footer.js":
/*!*******************************!*\
  !*** ./src/modules/footer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _footer_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footer.css */ "./src/modules/footer.css");

const footer = document.createElement('footer');
const p = document.createElement('p');
p.classList.add('footer-text-content');
p.innerHTML = `Copyright ©
            <script>
                document.write(new Date().getFullYear())
            </script>
            <a href="https://github.com/isiNavarro" target="_blank">
                isiNavarro
            </a>`;
footer.appendChild(p);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (footer);

/***/ }),

/***/ "./src/modules/header.js":
/*!*******************************!*\
  !*** ./src/modules/header.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _header_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.css */ "./src/modules/header.css");

const header = document.createElement('header');
const logo = document.createElement('h1');
logo.textContent = 'BATTLESHIP';
header.appendChild(logo);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (header);

/***/ }),

/***/ "./src/modules/placeYourShips.js":
/*!***************************************!*\
  !*** ./src/modules/placeYourShips.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   shipPlacingContainer: () => (/* binding */ shipPlacingContainer)
/* harmony export */ });
/* harmony import */ var _placeYourShips_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./placeYourShips.css */ "./src/modules/placeYourShips.css");
/* harmony import */ var _logic_refreshBoards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logic/refreshBoards */ "./src/logic/refreshBoards.js");
/* harmony import */ var _logic_players__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../logic/players */ "./src/logic/players.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app */ "./src/modules/app.js");




const shipPlacing = document.createElement('div');
shipPlacing.classList.add('ship-placing');
const heading = document.createElement('h2');
heading.classList.add('ship-placing-h2');
heading.textContent = 'Place your ships!';
shipPlacing.appendChild(heading);
const shipPlacingContainer = document.createElement('div');
shipPlacingContainer.classList.add('ship-placing-container');
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    const node = document.createElement('div');
    node.classList.add('ship-placing-node');

    //Giving index to each node
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);

    //Placing a ship when clicking a node
    node.addEventListener('click', () => {
      const x = parseInt(node.dataset.x);
      const y = parseInt(node.dataset.y);
      _logic_players__WEBPACK_IMPORTED_MODULE_2__.Player1.placeShip(x, y);
      (0,_logic_refreshBoards__WEBPACK_IMPORTED_MODULE_1__.refreshPlacingBoard)();
      if (_logic_players__WEBPACK_IMPORTED_MODULE_2__.Player1.shipsPlacedCount >= 5) {
        shipPlacing.style.display = 'none';
        _app__WEBPACK_IMPORTED_MODULE_3__["default"].style.display = 'flex';
        _logic_players__WEBPACK_IMPORTED_MODULE_2__.Player2.placeShipsRandom();
        return;
      }
    });
    shipPlacingContainer.appendChild(node);
  }
}
shipPlacing.appendChild(shipPlacingContainer);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shipPlacing);


/***/ }),

/***/ "./src/modules/restartButton.js":
/*!**************************************!*\
  !*** ./src/modules/restartButton.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _restartButton_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./restartButton.css */ "./src/modules/restartButton.css");

const button = document.createElement('button');
button.classList.add('restart-button');
button.textContent = 'Restart';
button.addEventListener('click', () => {
  location.reload();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (button);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/style.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/assets/style.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --dark-blue: rgb(19, 49, 87);
  --light-blue: rgb(33, 85, 153);
  --lighter-blue: rgb(48, 123, 221);
  --ship-gray: rgb(201, 201, 201);
  --aiming-yellow: rgb(255, 187, 86);
  --red-hit: rgb(255, 64, 64);
  --white-miss: #ffffff;

  --transition-time: 200ms;
}
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Nunito', 'Times New Roman', Times, serif;
  font-weight: bold;
}
`, "",{"version":3,"sources":["webpack://./src/assets/style.css"],"names":[],"mappings":"AAEA;EACE,4BAA4B;EAC5B,8BAA8B;EAC9B,iCAAiC;EACjC,+BAA+B;EAC/B,kCAAkC;EAClC,2BAA2B;EAC3B,qBAAqB;;EAErB,wBAAwB;AAC1B;AACA;;;EAGE,UAAU;EACV,SAAS;EACT,sBAAsB;EACtB,sDAAsD;EACtD,iBAAiB;AACnB","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap');\n@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');\n:root {\n  --dark-blue: rgb(19, 49, 87);\n  --light-blue: rgb(33, 85, 153);\n  --lighter-blue: rgb(48, 123, 221);\n  --ship-gray: rgb(201, 201, 201);\n  --aiming-yellow: rgb(255, 187, 86);\n  --red-hit: rgb(255, 64, 64);\n  --white-miss: #ffffff;\n\n  --transition-time: 200ms;\n}\n*,\n*::before,\n*::after {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n  font-family: 'Nunito', 'Times New Roman', Times, serif;\n  font-weight: bold;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/modules/app.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/modules/app.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `main {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--dark-blue);
}
h3 {
  font-size: 1.5rem;
  color: var(--dark-blue);
}
.player-one {
  display: flex;
  gap: 5px;
}
h4 {
  font-size: 1.5rem;
  color: var(--lighter-blue);
}
.players-container {
  background-color: aliceblue;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);
}
.player-one {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.player-one-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  background-color: var(--lighter-blue);
  padding: 5px;
  border-radius: 4px;
}

.player-one-grid-node {
  height: 25px;
  width: 25px;
  background-color: var(--dark-blue);
  border-radius: 5px;
  transition: var(--transition-time);
}

.player-two {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.player-two-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  background-color: var(--lighter-blue);
  padding: 5px;
  border-radius: 4px;
}

.player-two-grid-node {
  height: 25px;
  width: 25px;
  background-color: var(--dark-blue);
  border-radius: 5px;
  transition: var(--transition-time);
}
.player-two-grid-node:hover {
  cursor: pointer;
  background-color: var(--aiming-yellow);
  transform: scale(90%);
  transition: var(--transition-time);
}
`, "",{"version":3,"sources":["webpack://./src/modules/app.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;EACT,uBAAuB;EACvB,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,gCAAgC;EAChC,uBAAuB;AACzB;AACA;EACE,iBAAiB;EACjB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,QAAQ;AACV;AACA;EACE,iBAAiB;EACjB,0BAA0B;AAC5B;AACA;EACE,2BAA2B;EAC3B,mBAAmB;EACnB,aAAa;EACb,aAAa;EACb,SAAS;EACT,6CAA6C;AAC/C;AACA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;AACA;EACE,eAAe;EACf,sCAAsC;EACtC,qBAAqB;EACrB,kCAAkC;AACpC","sourcesContent":["main {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n  justify-content: center;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: var(--dark-blue);\n}\nh3 {\n  font-size: 1.5rem;\n  color: var(--dark-blue);\n}\n.player-one {\n  display: flex;\n  gap: 5px;\n}\nh4 {\n  font-size: 1.5rem;\n  color: var(--lighter-blue);\n}\n.players-container {\n  background-color: aliceblue;\n  border-radius: 10px;\n  padding: 20px;\n  display: flex;\n  gap: 20px;\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n.player-one {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.player-one-grid {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.player-one-grid-node {\n  height: 25px;\n  width: 25px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n\n.player-two {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.player-two-grid {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.player-two-grid-node {\n  height: 25px;\n  width: 25px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n.player-two-grid-node:hover {\n  cursor: pointer;\n  background-color: var(--aiming-yellow);\n  transform: scale(90%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/modules/footer.css":
/*!**********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/modules/footer.css ***!
  \**********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.footer-text-content {
  font-size: 1rem;
  color: var(--dark-blue);
}
.footer-text-content > a {
  color: inherit;
}
`, "",{"version":3,"sources":["webpack://./src/modules/footer.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,SAAS;EACT,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,eAAe;EACf,uBAAuB;AACzB;AACA;EACE,cAAc;AAChB","sourcesContent":["footer {\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 50%;\n  transform: translate(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n\n.footer-text-content {\n  font-size: 1rem;\n  color: var(--dark-blue);\n}\n.footer-text-content > a {\n  color: inherit;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/modules/header.css":
/*!**********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/modules/header.css ***!
  \**********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
h1 {
  font-family: 'Roboto', 'Nunito', sans-serif;
  font-size: 2.5rem;
  color: var(--dark-blue);
  padding: 5px;
  background-color: white;
  border: 6px solid var(--dark-blue);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);
}
`, "",{"version":3,"sources":["webpack://./src/modules/header.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,2CAA2C;EAC3C,iBAAiB;EACjB,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,kCAAkC;EAClC,mBAAmB;EACnB,6CAA6C;AAC/C","sourcesContent":["header {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 10px;\n}\nh1 {\n  font-family: 'Roboto', 'Nunito', sans-serif;\n  font-size: 2.5rem;\n  color: var(--dark-blue);\n  padding: 5px;\n  background-color: white;\n  border: 6px solid var(--dark-blue);\n  border-radius: 10px;\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/modules/placeYourShips.css":
/*!******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/modules/placeYourShips.css ***!
  \******************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.ship-placing {
  background-color: white;
  padding: 40px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: fit-content;
  gap: 20px;
  z-index: 3;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);
  font-weight: bold;
  color: var(--dark-blue);
}
.ship-placing-h2 {
  font-size: 1.7rem;
}
.ship-placing-text-container {
  display: flex;
  gap: 1.3rem;
  font-size: 1rem;
}

.ship-placing-container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  background-color: var(--lighter-blue);
  padding: 5px;
  border-radius: 4px;
}

.ship-placing-node {
  height: 25px;
  width: 25px;
  background-color: var(--dark-blue);
  border-radius: 5px;
  transition: var(--transition-time);
}
.ship-placing-node:hover {
  cursor: pointer;
  background-color: var(--ship-gray);
  transform: scale(90%);
  transition: var(--transition-time);
}
`, "",{"version":3,"sources":["webpack://./src/modules/placeYourShips.css"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,mBAAmB;EACnB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,sBAAsB;EACtB,SAAS;EACT,UAAU;EACV,eAAe;EACf,QAAQ;EACR,SAAS;EACT,gCAAgC;EAChC,6CAA6C;EAC7C,iBAAiB;EACjB,uBAAuB;AACzB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,aAAa;EACb,WAAW;EACX,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;AACA;EACE,eAAe;EACf,kCAAkC;EAClC,qBAAqB;EACrB,kCAAkC;AACpC","sourcesContent":[".ship-placing {\n  background-color: white;\n  padding: 40px;\n  border-radius: 14px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  max-width: fit-content;\n  gap: 20px;\n  z-index: 3;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n  font-weight: bold;\n  color: var(--dark-blue);\n}\n.ship-placing-h2 {\n  font-size: 1.7rem;\n}\n.ship-placing-text-container {\n  display: flex;\n  gap: 1.3rem;\n  font-size: 1rem;\n}\n\n.ship-placing-container {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.ship-placing-node {\n  height: 25px;\n  width: 25px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n.ship-placing-node:hover {\n  cursor: pointer;\n  background-color: var(--ship-gray);\n  transform: scale(90%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/modules/restartButton.css":
/*!*****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/modules/restartButton.css ***!
  \*****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.restart-button {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%);
  padding: 8px;
  font-size: 1.3rem;
  border: 4px solid var(--lighter-blue);
  border-radius: 6px;
  color: var(--lighter-blue);
  background-color: white;
  transition: var(--transition-time);
  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);
}
.restart-button:hover {
  cursor: pointer;
  font-size: 1.4rem;
  transform: translate(-50%) scale(98%);
  transition: var(--transition-time);
}
`, "",{"version":3,"sources":["webpack://./src/modules/restartButton.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,qCAAqC;EACrC,kBAAkB;EAClB,0BAA0B;EAC1B,uBAAuB;EACvB,kCAAkC;EAClC,6CAA6C;AAC/C;AACA;EACE,eAAe;EACf,iBAAiB;EACjB,qCAAqC;EACrC,kCAAkC;AACpC","sourcesContent":[".restart-button {\n  position: absolute;\n  bottom: 10%;\n  left: 50%;\n  transform: translate(-50%);\n  padding: 8px;\n  font-size: 1.3rem;\n  border: 4px solid var(--lighter-blue);\n  border-radius: 6px;\n  color: var(--lighter-blue);\n  background-color: white;\n  transition: var(--transition-time);\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n.restart-button:hover {\n  cursor: pointer;\n  font-size: 1.4rem;\n  transform: translate(-50%) scale(98%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/assets/style.css":
/*!******************************!*\
  !*** ./src/assets/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/assets/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/modules/app.css":
/*!*****************************!*\
  !*** ./src/modules/app.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_app_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./app.css */ "./node_modules/css-loader/dist/cjs.js!./src/modules/app.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_app_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_app_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_app_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_app_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/modules/footer.css":
/*!********************************!*\
  !*** ./src/modules/footer.css ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_footer_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./footer.css */ "./node_modules/css-loader/dist/cjs.js!./src/modules/footer.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_footer_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_footer_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_footer_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_footer_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/modules/header.css":
/*!********************************!*\
  !*** ./src/modules/header.css ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./header.css */ "./node_modules/css-loader/dist/cjs.js!./src/modules/header.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/modules/placeYourShips.css":
/*!****************************************!*\
  !*** ./src/modules/placeYourShips.css ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_placeYourShips_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./placeYourShips.css */ "./node_modules/css-loader/dist/cjs.js!./src/modules/placeYourShips.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_placeYourShips_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_placeYourShips_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_placeYourShips_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_placeYourShips_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/modules/restartButton.css":
/*!***************************************!*\
  !*** ./src/modules/restartButton.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_restartButton_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./restartButton.css */ "./node_modules/css-loader/dist/cjs.js!./src/modules/restartButton.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_restartButton_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_restartButton_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_restartButton_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_restartButton_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljL25vZGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9sb2dpYy9wbGF5ZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbG9naWMvcmVmcmVzaEJvYXJkcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2FsbE1vZHVsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2FwcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZm9vdGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYWNlWW91clNoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9yZXN0YXJ0QnV0dG9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXNzZXRzL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYXBwLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZm9vdGVyLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVhZGVyLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxhY2VZb3VyU2hpcHMuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9yZXN0YXJ0QnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9hc3NldHMvc3R5bGUuY3NzPzYwMWQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2FwcC5jc3M/M2ZlYSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZm9vdGVyLmNzcz82ZmZkIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWFkZXIuY3NzP2M4NzUiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYWNlWW91clNoaXBzLmNzcz80NTE2Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9yZXN0YXJ0QnV0dG9uLmNzcz8xYTMzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNzcyBmcm9tICcuL2Fzc2V0cy9zdHlsZS5jc3MnO1xuaW1wb3J0IHsgaGVhZGVyLCBhcHAsIHNoaXBQbGFjaW5nLCBmb290ZXIsIGJ1dHRvbiB9IGZyb20gJy4vbW9kdWxlcy9hbGxNb2R1bGVzJztcblxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbmJvZHkuYXBwZW5kKGhlYWRlcik7XG5ib2R5LmFwcGVuZChhcHApO1xuYm9keS5hcHBlbmRDaGlsZChzaGlwUGxhY2luZyk7XG5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG5ib2R5LmFwcGVuZENoaWxkKGZvb3Rlcik7XG4iLCJleHBvcnQgY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG5cbiAgICB0aGlzLnNoaXAgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrZWQgPSBmYWxzZTsgLy9DYW4gYmUgJ21pc3MnIG9yICdoaXQnXG4gIH1cbn1cbiIsImltcG9ydCB7IFNoaXAgfSBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4vbm9kZSc7XG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNoaXBzID0gW1xuICAgICAgbmV3IFNoaXAoNSwgJ0NBUlJJRVInKSxcbiAgICAgIG5ldyBTaGlwKDQsICdCQVRUTEVTSElQJyksXG4gICAgICBuZXcgU2hpcCgzLCAnREVTVFJPWUVSJyksXG4gICAgICBuZXcgU2hpcCgzLCAnU1VCTUFSSU5FJyksXG4gICAgICBuZXcgU2hpcCgyLCAnUEFUUk9MIEJPQVQnKSxcbiAgICBdO1xuICAgIHRoaXMuc2hpcHNQbGFjZWRDb3VudCA9IDA7XG5cbiAgICB0aGlzLmJvYXJkID0gdGhpcy5jcmVhdGVCb2FyZCgpO1xuXG4gICAgdGhpcy5odW50TnRhcmdldE1vZGUgPSAnaHVudCc7XG4gICAgdGhpcy5sYXN0QXR0YWNrWCA9IDA7XG4gICAgdGhpcy5sYXN0QXR0YWNrWSA9IDA7XG5cbiAgICB0aGlzLm5leHRYID0gMDtcbiAgICB0aGlzLm5leHRZID0gMDtcblxuICAgIHRoaXMubmV4dEF0dGFjayA9ICdsZWZ0JztcblxuICAgIHRoaXMucmVzcG9uc2UgPSAnJztcbiAgfVxuXG4gIGNyZWF0ZUJvYXJkKHNpemUgPSAxMCkge1xuICAgIGNvbnN0IGdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNpemU7IHgrKykge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHNpemU7IHkrKykge1xuICAgICAgICByb3cucHVzaChuZXcgTm9kZSh4LCB5KSk7XG4gICAgICB9XG4gICAgICBncmlkLnB1c2gocm93KTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICBwbGFjZVNoaXAoeCwgeSkge1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLnNoaXBzW3RoaXMuc2hpcHNQbGFjZWRDb3VudF07XG4gICAgY29uc3Qgc2hpcFNpemUgPSBzaGlwLnNpemU7XG5cbiAgICAvL0NoZWNrIHNoaXAgd29uJ3QgYmUgb3V0IG9mIGxpbWl0XG4gICAgaWYgKHNoaXBTaXplID4gdGhpcy5ib2FyZFt4XS5sZW5ndGggLSB5KSByZXR1cm4gbnVsbDtcbiAgICAvL0NoZWNrIG5vIG90aGVyIHNoaXBzIGFyb3VuZFxuICAgIGVsc2Uge1xuICAgICAgLy9DaGVjayBsZWZ0XG4gICAgICBpZiAoeSA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbeF1beSAtIDFdLnNoaXApIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICAgIC8vQ2hlY2sgU2VsZlxuICAgICAgICBpZiAodGhpcy5ib2FyZFt4XVt5ICsgaV0uc2hpcCkgcmV0dXJuIG51bGw7XG4gICAgICAgIC8vQ2hlY2sgQm90dG9tXG4gICAgICAgIGlmICh4IDwgOSkge1xuICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3ggKyAxXVt5ICsgaV0uc2hpcCkgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayB0b3BcbiAgICAgICAgaWYgKHggPiAwKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9hcmRbeCAtIDFdW3kgKyBpXS5zaGlwKSByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHkgKyBzaGlwU2l6ZSA8PSA5KSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3hdW3kgKyBzaGlwU2l6ZV0uc2hpcCkgcmV0dXJuIG51bGw7IC8vUmlnaHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1BsYWNlIHNoaXBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpKyspIHtcbiAgICAgIHRoaXMuYm9hcmRbeF1beSArIGldLnNoaXAgPSBzaGlwO1xuICAgIH1cblxuICAgIHRoaXMuc2hpcHNQbGFjZWRDb3VudCArPSAxO1xuICAgIHJldHVybiBgJHtzaGlwLm5hbWV9IHBsYWNlZGA7XG4gIH1cblxuICBwbGFjZVNoaXBzUmFuZG9tKCkge1xuICAgIHdoaWxlICh0aGlzLnNoaXBzUGxhY2VkQ291bnQgPCA1KSB7XG4gICAgICBjb25zdCBudW0xID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgY29uc3QgbnVtMiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICAgICAgdGhpcy5wbGFjZVNoaXAobnVtMSwgbnVtMik7XG4gICAgfVxuICB9XG4gIHJlY2lldmVBdHRhY2soeCwgeSkge1xuICAgIGNvbnN0IGF0dGFja2VkTm9kZSA9IHRoaXMuYm9hcmRbeF1beV07XG4gICAgaWYgKGF0dGFja2VkTm9kZS5hdHRhY2tlZCkgcmV0dXJuIG51bGw7XG4gICAgZWxzZSB7XG4gICAgICBpZiAoYXR0YWNrZWROb2RlLnNoaXApIHtcbiAgICAgICAgYXR0YWNrZWROb2RlLnNoaXAuaGl0KCk7XG4gICAgICAgIGF0dGFja2VkTm9kZS5hdHRhY2tlZCA9ICdoaXQnO1xuICAgICAgICBpZiAoYXR0YWNrZWROb2RlLnNoaXAuc3VuaylcbiAgICAgICAgICByZXR1cm4gYEVuZW15ICR7YXR0YWNrZWROb2RlLnNoaXAubmFtZX0gaGFzIGJlZW4gc3VuayFgO1xuICAgICAgICBlbHNlIHJldHVybiBgRW5lbXkgJHthdHRhY2tlZE5vZGUuc2hpcC5uYW1lfSB3YXMgaGl0IWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRhY2tlZE5vZGUuYXR0YWNrZWQgPSAnbWlzcyc7XG4gICAgICAgIHJldHVybiBgVGhlIGF0dGFjayBtaXNzZWRgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBodW50QW5kVGFyZ2V0KCkge1xuICAgIGlmICghdGhpcy5yZXNwb25zZSkgdGhpcy5yZXNwb25zZSA9ICcnO1xuICAgIGlmICh0aGlzLnJlc3BvbnNlLmVuZHNXaXRoKCdzdW5rIScpKSB7XG4gICAgICB0aGlzLmh1bnROdGFyZ2V0TW9kZSA9ICdodW50JztcbiAgICAgIHRoaXMubmV4dEF0dGFjayA9ICdsZWZ0JztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5odW50TnRhcmdldE1vZGUgPT09ICdodW50Jykge1xuICAgICAgZG8ge1xuICAgICAgICB0aGlzLmxhc3RBdHRhY2tYID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICB0aGlzLmxhc3RBdHRhY2tZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSB0aGlzLnJlY2lldmVBdHRhY2sodGhpcy5sYXN0QXR0YWNrWCwgdGhpcy5sYXN0QXR0YWNrWSk7XG4gICAgICB9IHdoaWxlICghdGhpcy5yZXNwb25zZSk7XG4gICAgICBpZiAodGhpcy5yZXNwb25zZS5lbmRzV2l0aCgnaGl0IScpKSB7XG4gICAgICAgIHRoaXMuaHVudE50YXJnZXRNb2RlID0gJ3RhcmdldCc7XG4gICAgICAgIHRoaXMubmV4dFggPSB0aGlzLmxhc3RBdHRhY2tYO1xuICAgICAgICB0aGlzLm5leHRZID0gdGhpcy5sYXN0QXR0YWNrWSAtIDE7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmh1bnROdGFyZ2V0TW9kZSA9PT0gJ3RhcmdldCcpIHtcbiAgICAgIGlmICh0aGlzLm5leHRBdHRhY2sgPT09ICdsZWZ0Jykge1xuICAgICAgICBpZiAodGhpcy5uZXh0WSA+PSAwKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZSA9IHRoaXMucmVjaWV2ZUF0dGFjayh0aGlzLm5leHRYLCB0aGlzLm5leHRZKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAvL0lmIGF0dGFja2luZyBvbiBhbiBhdHRhY2tlZCBub2RlXG4gICAgICAgICAgaWYgKCF0aGlzLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLm5leHRZID0gdGhpcy5sYXN0QXR0YWNrWSArIDE7XG4gICAgICAgICAgICB0aGlzLm5leHRBdHRhY2sgPSAncmlnaHQnO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHVudEFuZFRhcmdldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZS5lbmRzV2l0aCgnaGl0IScpKSB7XG4gICAgICAgICAgICB0aGlzLm5leHRZLS07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNlLmVuZHNXaXRoKCdtaXNzZWQnKSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0WSA9IHRoaXMubGFzdEF0dGFja1kgKyAxO1xuICAgICAgICAgICAgdGhpcy5uZXh0QXR0YWNrID0gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gLy9JZiBib3JkZXIgb2YgZ3JpZFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5leHRZID0gdGhpcy5sYXN0QXR0YWNrWSArIDE7XG4gICAgICAgICAgdGhpcy5uZXh0QXR0YWNrID0gJ3JpZ2h0JztcbiAgICAgICAgICByZXR1cm4gdGhpcy5odW50QW5kVGFyZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm5leHRBdHRhY2sgPT09ICdyaWdodCcpIHtcbiAgICAgICAgaWYgKHRoaXMubmV4dFkgPD0gOSkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2UgPSB0aGlzLnJlY2lldmVBdHRhY2sodGhpcy5uZXh0WCwgdGhpcy5uZXh0WSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZS5lbmRzV2l0aCgnaGl0IScpKSB7XG4gICAgICAgICAgICB0aGlzLm5leHRZKys7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5leHRZKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpc0dhbWVFbmRlZCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5zaGlwc1tpXS5zdW5rKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXIxID0gbmV3IFBsYXllcigpO1xuZXhwb3J0IGNvbnN0IFBsYXllcjIgPSBuZXcgUGxheWVyKCk7XG4iLCJpbXBvcnQgeyBzaGlwUGxhY2luZ0NvbnRhaW5lciBhcyBwbGFjZUJvYXJkIH0gZnJvbSAnLi4vbW9kdWxlcy9wbGFjZVlvdXJTaGlwcyc7XG5pbXBvcnQgeyBwbGF5ZXIxR3JpZCwgcGxheWVyMkdyaWQgfSBmcm9tICcuLi9tb2R1bGVzL2FwcCc7XG5pbXBvcnQgeyBQbGF5ZXIxLCBQbGF5ZXIyIH0gZnJvbSAnLi9wbGF5ZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hQbGFjaW5nQm9hcmQoKSB7XG4gIC8vUmVmcmVzaCBQTEFDRSBZT1VSIFNISVBTIE1vZGFsXG4gIGNvbnN0IHBsYWNlQm9hcmRDaGlsZHJlbiA9IHBsYWNlQm9hcmQuY2hpbGRyZW47XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxhY2VCb2FyZENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IHBsYWNlQm9hcmRDaGlsZHJlbltpXTtcblxuICAgIC8vR2V0IHRoZSBkYXRhLWxhYmVsXG4gICAgY29uc3QgeCA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC54KTtcbiAgICBjb25zdCB5ID0gcGFyc2VJbnQobm9kZS5kYXRhc2V0LnkpO1xuXG4gICAgaWYgKFBsYXllcjEuYm9hcmRbeF1beV0uc2hpcCkge1xuICAgICAgbm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDIwMSwyMDEsMjAxKSc7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaFBsYXllcjFCb2FyZCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaFBsYXllcjFCb2FyZCgpIHtcbiAgLy9SZWZyZXNoIFlPVVIgYm9hcmRcbiAgY29uc3QgcGxheWVyMUdyaWRDaGlsZHJlbiA9IHBsYXllcjFHcmlkLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcjFHcmlkQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBub2RlID0gcGxheWVyMUdyaWRDaGlsZHJlbltpXTtcblxuICAgIC8vR2V0IHRoZSBkYXRhLWxhYmVsXG4gICAgY29uc3QgeCA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC54KTtcbiAgICBjb25zdCB5ID0gcGFyc2VJbnQobm9kZS5kYXRhc2V0LnkpO1xuXG4gICAgaWYgKFBsYXllcjEuYm9hcmRbeF1beV0uc2hpcCkge1xuICAgICAgbm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDIwMSwyMDEsMjAxKSc7XG4gICAgfVxuICAgIGlmIChQbGF5ZXIxLmJvYXJkW3hdW3ldLmF0dGFja2VkID09PSAnbWlzcycpXG4gICAgICBub2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmZmZmJztcbiAgICBpZiAoUGxheWVyMS5ib2FyZFt4XVt5XS5hdHRhY2tlZCA9PT0gJ2hpdCcpXG4gICAgICBub2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjU1LDY0LDY0KSc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hDb21wdXRlckJvYXJkKCkge1xuICAvL1JlZnJlc2ggQ09NUFVURVIncyBCb2FyZFxuICBjb25zdCBwbGF5ZXIyR3JpZENoaWxkcmVuID0gcGxheWVyMkdyaWQuY2hpbGRyZW47XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIyR3JpZENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IHBsYXllcjJHcmlkQ2hpbGRyZW5baV07XG5cbiAgICAvL0dldCB0aGUgZGF0YS1sYWJlbFxuICAgIGNvbnN0IHggPSBwYXJzZUludChub2RlLmRhdGFzZXQueCk7XG4gICAgY29uc3QgeSA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC55KTtcblxuICAgIGNvbnN0IGF0dGFjayA9IFBsYXllcjIuYm9hcmRbeF1beV0uYXR0YWNrZWQ7XG4gICAgaWYgKGF0dGFjaykge1xuICAgICAgaWYgKGF0dGFjayA9PT0gJ21pc3MnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmZmZmYnO1xuICAgICAgfSBlbHNlIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNTUsIDY0LCA2NCknO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaXplLCBuYW1lLCBoaXRzID0gMCwgc3VuayA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgIHRoaXMuaGl0cyA9IGhpdHM7XG4gICAgdGhpcy5zdW5rID0gc3VuaztcbiAgfVxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gICAgdGhpcy5zdW5rID0gdGhpcy5oaXRzID49IHRoaXMuc2l6ZSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IGhlYWRlciBmcm9tICcuL2hlYWRlcic7XG5pbXBvcnQgYXBwIGZyb20gJy4vYXBwJztcbmltcG9ydCBzaGlwUGxhY2luZyBmcm9tICcuL3BsYWNlWW91clNoaXBzJztcbmltcG9ydCBmb290ZXIgZnJvbSAnLi9mb290ZXInO1xuaW1wb3J0IGJ1dHRvbiBmcm9tICcuL3Jlc3RhcnRCdXR0b24nO1xuXG5leHBvcnQgeyBoZWFkZXIsIGFwcCwgc2hpcFBsYWNpbmcsIGZvb3RlciwgYnV0dG9uIH07XG4iLCJpbXBvcnQgY3NzIGZyb20gJy4vYXBwLmNzcyc7XG5pbXBvcnQgeyBQbGF5ZXIxLCBQbGF5ZXIyIH0gZnJvbSAnLi4vbG9naWMvcGxheWVycyc7XG5pbXBvcnQge1xuICByZWZyZXNoQ29tcHV0ZXJCb2FyZCxcbiAgcmVmcmVzaFBsYXllcjFCb2FyZCxcbn0gZnJvbSAnLi4vbG9naWMvcmVmcmVzaEJvYXJkcyc7XG5cbmNvbnN0IGFwcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21haW4nKTtcblxuY29uc3QgZXZlbnREaXNwbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuZXZlbnREaXNwbGF5ZXIudGV4dENvbnRlbnQgPSAnQ2hvb3NlIGEgdGFyZ2V0JztcblxuY29uc3QgcGxheWVyc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGxheWVyc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJzLWNvbnRhaW5lcicpO1xuXG5jb25zdCBwbGF5ZXIxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5wbGF5ZXIxLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1vbmUnKTtcbmNvbnN0IHBsYXllcjFEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDQnKTtcbnBsYXllcjFEaXNwbGF5LmNsYXNzTGlzdC5hZGQoJ3BsYXllci1kaXNwbGF5Jyk7XG5wbGF5ZXIxRGlzcGxheS50ZXh0Q29udGVudCA9ICdZT1UnO1xucGxheWVyMS5hcHBlbmRDaGlsZChwbGF5ZXIxRGlzcGxheSk7XG5cbmV4cG9ydCBjb25zdCBwbGF5ZXIxR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGxheWVyMUdyaWQuY2xhc3NMaXN0LmFkZCgncGxheWVyLW9uZS1ncmlkJyk7XG5mb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1vbmUtZ3JpZC1ub2RlJyk7XG5cbiAgICAvL0dpdmluZyBpbmRleCB0byBlYWNoIG5vZGVcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS14JywgeCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHkpO1xuXG4gICAgcGxheWVyMUdyaWQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cbn1cbnBsYXllcjEuYXBwZW5kQ2hpbGQocGxheWVyMUdyaWQpO1xuXG5jb25zdCBwbGF5ZXIyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5wbGF5ZXIyLmNsYXNzTGlzdC5hZGQoJ3BsYXllci10d28nKTtcbmNvbnN0IHBsYXllcjJEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDQnKTtcbnBsYXllcjJEaXNwbGF5LmNsYXNzTGlzdC5hZGQoJ3BsYXllci1kaXNwbGF5Jyk7XG5wbGF5ZXIyRGlzcGxheS50ZXh0Q29udGVudCA9ICdDb21wdXRlcic7XG5wbGF5ZXIyLmFwcGVuZENoaWxkKHBsYXllcjJEaXNwbGF5KTtcblxuZXhwb3J0IGNvbnN0IHBsYXllcjJHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5wbGF5ZXIyR3JpZC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItdHdvLWdyaWQnKTtcbmZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspIHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgncGxheWVyLXR3by1ncmlkLW5vZGUnKTtcblxuICAgIC8vR2l2aW5nIGluZGV4IHRvIGVhY2ggbm9kZVxuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXgnLCB4KTtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgeSk7XG5cbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIpO1xuXG4gICAgcGxheWVyMkdyaWQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cbn1cbnBsYXllcjIuYXBwZW5kQ2hpbGQocGxheWVyMkdyaWQpO1xuXG5wbGF5ZXJzQ29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllcjEpO1xucGxheWVyc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXIyKTtcblxuYXBwLmFwcGVuZENoaWxkKGV2ZW50RGlzcGxheWVyKTtcbmFwcC5hcHBlbmRDaGlsZChwbGF5ZXJzQ29udGFpbmVyKTtcblxuZXhwb3J0IGRlZmF1bHQgYXBwO1xuXG5mdW5jdGlvbiBsaXN0ZW5lcigpIHtcbiAgY29uc3QgeCA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC54KTtcbiAgY29uc3QgeSA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC55KTtcblxuICBjb25zdCBtZXNzYWdlID0gUGxheWVyMi5yZWNpZXZlQXR0YWNrKHgsIHkpO1xuICByZWZyZXNoQ29tcHV0ZXJCb2FyZCgpO1xuXG4gIGlmIChQbGF5ZXIyLmlzR2FtZUVuZGVkKCkpIHtcbiAgICBldmVudERpc3BsYXllci50ZXh0Q29udGVudCA9ICdFbmVteSBmbGVldCBjb21wbGV0ZWx5IHN1bmsuIFlPVSBXSU4hJztcbiAgICBHcmlkUmVtb3ZlTGlzdGVuZXIoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAobWVzc2FnZSkge1xuICAgIGV2ZW50RGlzcGxheWVyLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblxuICAgIC8vV2FpdCAxLjUgc2Vjb25kcyBiZXR3ZWVuIGF0dGFja3M/P1xuICAgIFBsYXllcjEuaHVudEFuZFRhcmdldCgpO1xuICAgIHJlZnJlc2hQbGF5ZXIxQm9hcmQoKTtcbiAgICBpZiAoUGxheWVyMS5pc0dhbWVFbmRlZCgpKSB7XG4gICAgICBldmVudERpc3BsYXllci50ZXh0Q29udGVudCA9ICdHYW1lIG92ZXIuLi4gQ29tcHV0ZXIgd2lucyc7XG4gICAgICBHcmlkUmVtb3ZlTGlzdGVuZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gR3JpZFJlbW92ZUxpc3RlbmVyKCkge1xuICBjb25zdCBwbGF5ZXIyR3JpZENoaWxkcmVuID0gcGxheWVyMkdyaWQuY2hpbGRyZW47XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyMkdyaWRDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5vZGUgPSBwbGF5ZXIyR3JpZENoaWxkcmVuW2ldO1xuICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5lcik7XG4gIH1cbn1cbiIsImltcG9ydCBjc3MgZnJvbSAnLi9mb290ZXIuY3NzJztcblxuY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9vdGVyJyk7XG5jb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xucC5jbGFzc0xpc3QuYWRkKCdmb290ZXItdGV4dC1jb250ZW50Jyk7XG5wLmlubmVySFRNTCA9IGBDb3B5cmlnaHQgwqlcbiAgICAgICAgICAgIDxzY3JpcHQ+XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud3JpdGUobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpKVxuICAgICAgICAgICAgPC9zY3JpcHQ+XG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2lzaU5hdmFycm9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgICAgICAgICBpc2lOYXZhcnJvXG4gICAgICAgICAgICA8L2E+YDtcblxuZm9vdGVyLmFwcGVuZENoaWxkKHApO1xuXG5leHBvcnQgZGVmYXVsdCBmb290ZXI7XG4iLCJpbXBvcnQgY3NzIGZyb20gJy4vaGVhZGVyLmNzcyc7XG5cbmNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xuY29uc3QgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG5sb2dvLnRleHRDb250ZW50ID0gJ0JBVFRMRVNISVAnO1xuXG5oZWFkZXIuYXBwZW5kQ2hpbGQobG9nbyk7XG5cbmV4cG9ydCBkZWZhdWx0IGhlYWRlcjtcbiIsImltcG9ydCBjc3MgZnJvbSAnLi9wbGFjZVlvdXJTaGlwcy5jc3MnO1xuaW1wb3J0IHsgcmVmcmVzaFBsYWNpbmdCb2FyZCB9IGZyb20gJy4uL2xvZ2ljL3JlZnJlc2hCb2FyZHMnO1xuaW1wb3J0IHsgUGxheWVyMSwgUGxheWVyMiB9IGZyb20gJy4uL2xvZ2ljL3BsYXllcnMnO1xuaW1wb3J0IGFwcCBmcm9tICcuL2FwcCc7XG5cbmNvbnN0IHNoaXBQbGFjaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5zaGlwUGxhY2luZy5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNpbmcnKTtcblxuY29uc3QgaGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG5oZWFkaW5nLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcGxhY2luZy1oMicpO1xuaGVhZGluZy50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzISc7XG5zaGlwUGxhY2luZy5hcHBlbmRDaGlsZChoZWFkaW5nKTtcblxuY29uc3Qgc2hpcFBsYWNpbmdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnNoaXBQbGFjaW5nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcGxhY2luZy1jb250YWluZXInKTtcbmZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspIHtcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNpbmctbm9kZScpO1xuXG4gICAgLy9HaXZpbmcgaW5kZXggdG8gZWFjaCBub2RlXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIHgpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXknLCB5KTtcblxuICAgIC8vUGxhY2luZyBhIHNoaXAgd2hlbiBjbGlja2luZyBhIG5vZGVcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC54KTtcbiAgICAgIGNvbnN0IHkgPSBwYXJzZUludChub2RlLmRhdGFzZXQueSk7XG5cbiAgICAgIFBsYXllcjEucGxhY2VTaGlwKHgsIHkpO1xuICAgICAgcmVmcmVzaFBsYWNpbmdCb2FyZCgpO1xuXG4gICAgICBpZiAoUGxheWVyMS5zaGlwc1BsYWNlZENvdW50ID49IDUpIHtcbiAgICAgICAgc2hpcFBsYWNpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgYXBwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgICAgIFBsYXllcjIucGxhY2VTaGlwc1JhbmRvbSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzaGlwUGxhY2luZ0NvbnRhaW5lci5hcHBlbmRDaGlsZChub2RlKTtcbiAgfVxufVxuXG5zaGlwUGxhY2luZy5hcHBlbmRDaGlsZChzaGlwUGxhY2luZ0NvbnRhaW5lcik7XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXBQbGFjaW5nO1xuZXhwb3J0IHsgc2hpcFBsYWNpbmdDb250YWluZXIgfTtcbiIsImltcG9ydCBjc3MgZnJvbSAnLi9yZXN0YXJ0QnV0dG9uLmNzcyc7XG5cbmNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhcnQtYnV0dG9uJyk7XG5idXR0b24udGV4dENvbnRlbnQgPSAnUmVzdGFydCc7XG5cbmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYnV0dG9uO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1OdW5pdG86d2dodEA0MDA7NTAwOzcwMCZkaXNwbGF5PXN3YXApO1wiXSk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Sb2JvdG86d2dodEA0MDA7NTAwOzcwMCZkaXNwbGF5PXN3YXApO1wiXSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1kYXJrLWJsdWU6IHJnYigxOSwgNDksIDg3KTtcbiAgLS1saWdodC1ibHVlOiByZ2IoMzMsIDg1LCAxNTMpO1xuICAtLWxpZ2h0ZXItYmx1ZTogcmdiKDQ4LCAxMjMsIDIyMSk7XG4gIC0tc2hpcC1ncmF5OiByZ2IoMjAxLCAyMDEsIDIwMSk7XG4gIC0tYWltaW5nLXllbGxvdzogcmdiKDI1NSwgMTg3LCA4Nik7XG4gIC0tcmVkLWhpdDogcmdiKDI1NSwgNjQsIDY0KTtcbiAgLS13aGl0ZS1taXNzOiAjZmZmZmZmO1xuXG4gIC0tdHJhbnNpdGlvbi10aW1lOiAyMDBtcztcbn1cbiosXG4qOjpiZWZvcmUsXG4qOjphZnRlciB7XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZm9udC1mYW1pbHk6ICdOdW5pdG8nLCAnVGltZXMgTmV3IFJvbWFuJywgVGltZXMsIHNlcmlmO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Fzc2V0cy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSw0QkFBNEI7RUFDNUIsOEJBQThCO0VBQzlCLGlDQUFpQztFQUNqQywrQkFBK0I7RUFDL0Isa0NBQWtDO0VBQ2xDLDJCQUEyQjtFQUMzQixxQkFBcUI7O0VBRXJCLHdCQUF3QjtBQUMxQjtBQUNBOzs7RUFHRSxVQUFVO0VBQ1YsU0FBUztFQUNULHNCQUFzQjtFQUN0QixzREFBc0Q7RUFDdEQsaUJBQWlCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PU51bml0bzp3Z2h0QDQwMDs1MDA7NzAwJmRpc3BsYXk9c3dhcCcpO1xcbkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzp3Z2h0QDQwMDs1MDA7NzAwJmRpc3BsYXk9c3dhcCcpO1xcbjpyb290IHtcXG4gIC0tZGFyay1ibHVlOiByZ2IoMTksIDQ5LCA4Nyk7XFxuICAtLWxpZ2h0LWJsdWU6IHJnYigzMywgODUsIDE1Myk7XFxuICAtLWxpZ2h0ZXItYmx1ZTogcmdiKDQ4LCAxMjMsIDIyMSk7XFxuICAtLXNoaXAtZ3JheTogcmdiKDIwMSwgMjAxLCAyMDEpO1xcbiAgLS1haW1pbmcteWVsbG93OiByZ2IoMjU1LCAxODcsIDg2KTtcXG4gIC0tcmVkLWhpdDogcmdiKDI1NSwgNjQsIDY0KTtcXG4gIC0td2hpdGUtbWlzczogI2ZmZmZmZjtcXG5cXG4gIC0tdHJhbnNpdGlvbi10aW1lOiAyMDBtcztcXG59XFxuKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmb250LWZhbWlseTogJ051bml0bycsICdUaW1lcyBOZXcgUm9tYW4nLCBUaW1lcywgc2VyaWY7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBtYWluIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAyMHB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XG59XG5oMyB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbn1cbi5wbGF5ZXItb25lIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiA1cHg7XG59XG5oNCB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBjb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcbn1cbi5wbGF5ZXJzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgcGFkZGluZzogMjBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAyMHB4O1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XG59XG4ucGxheWVyLW9uZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLnBsYXllci1vbmUtZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBnYXA6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcbiAgcGFkZGluZzogNXB4O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5wbGF5ZXItb25lLWdyaWQtbm9kZSB7XG4gIGhlaWdodDogMjVweDtcbiAgd2lkdGg6IDI1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cblxuLnBsYXllci10d28ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5wbGF5ZXItdHdvLWdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ2FwOiA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XG4gIHBhZGRpbmc6IDVweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuXG4ucGxheWVyLXR3by1ncmlkLW5vZGUge1xuICBoZWlnaHQ6IDI1cHg7XG4gIHdpZHRoOiAyNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XG59XG4ucGxheWVyLXR3by1ncmlkLW5vZGU6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWFpbWluZy15ZWxsb3cpO1xuICB0cmFuc2Zvcm06IHNjYWxlKDkwJSk7XG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9tb2R1bGVzL2FwcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztFQUNoQyx1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGFBQWE7RUFDYixRQUFRO0FBQ1Y7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQiwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLDJCQUEyQjtFQUMzQixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLGFBQWE7RUFDYixTQUFTO0VBQ1QsNkNBQTZDO0FBQy9DO0FBQ0E7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGFBQWE7RUFDYixzQ0FBc0M7RUFDdEMsUUFBUTtFQUNSLHFDQUFxQztFQUNyQyxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7RUFDWCxrQ0FBa0M7RUFDbEMsa0JBQWtCO0VBQ2xCLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxRQUFRO0VBQ1IscUNBQXFDO0VBQ3JDLFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVztFQUNYLGtDQUFrQztFQUNsQyxrQkFBa0I7RUFDbEIsa0NBQWtDO0FBQ3BDO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysc0NBQXNDO0VBQ3RDLHFCQUFxQjtFQUNyQixrQ0FBa0M7QUFDcENcIixcInNvdXJjZXNDb250ZW50XCI6W1wibWFpbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDIwcHg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG59XFxuaDMge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG59XFxuLnBsYXllci1vbmUge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGdhcDogNXB4O1xcbn1cXG5oNCB7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGNvbG9yOiB2YXIoLS1saWdodGVyLWJsdWUpO1xcbn1cXG4ucGxheWVycy1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYWxpY2VibHVlO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gIHBhZGRpbmc6IDIwcHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAyMHB4O1xcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xcbn1cXG4ucGxheWVyLW9uZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLnBsYXllci1vbmUtZ3JpZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxuICBnYXA6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxufVxcblxcbi5wbGF5ZXItb25lLWdyaWQtbm9kZSB7XFxuICBoZWlnaHQ6IDI1cHg7XFxuICB3aWR0aDogMjVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xcbn1cXG5cXG4ucGxheWVyLXR3byB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuLnBsYXllci10d28tZ3JpZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxuICBnYXA6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxufVxcblxcbi5wbGF5ZXItdHdvLWdyaWQtbm9kZSB7XFxuICBoZWlnaHQ6IDI1cHg7XFxuICB3aWR0aDogMjVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xcbn1cXG4ucGxheWVyLXR3by1ncmlkLW5vZGU6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYWltaW5nLXllbGxvdyk7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDkwJSk7XFxuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGZvb3RlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbi5mb290ZXItdGV4dC1jb250ZW50IHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbn1cbi5mb290ZXItdGV4dC1jb250ZW50ID4gYSB7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9kdWxlcy9mb290ZXIuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxTQUFTO0VBQ1QsU0FBUztFQUNULDBCQUEwQjtFQUMxQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsdUJBQXVCO0FBQ3pCO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImZvb3RlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvdHRvbTogMDtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDIwcHg7XFxufVxcblxcbi5mb290ZXItdGV4dC1jb250ZW50IHtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIGNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xcbn1cXG4uZm9vdGVyLXRleHQtY29udGVudCA+IGEge1xcbiAgY29sb3I6IGluaGVyaXQ7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDEwcHg7XG59XG5oMSB7XG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgJ051bml0bycsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMi41cmVtO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbiAgcGFkZGluZzogNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiA2cHggc29saWQgdmFyKC0tZGFyay1ibHVlKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9kdWxlcy9oZWFkZXIuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsYUFBYTtBQUNmO0FBQ0E7RUFDRSwyQ0FBMkM7RUFDM0MsaUJBQWlCO0VBQ2pCLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osdUJBQXVCO0VBQ3ZCLGtDQUFrQztFQUNsQyxtQkFBbUI7RUFDbkIsNkNBQTZDO0FBQy9DXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImhlYWRlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuaDEge1xcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCAnTnVuaXRvJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogNnB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5zaGlwLXBsYWNpbmcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWF4LXdpZHRoOiBmaXQtY29udGVudDtcbiAgZ2FwOiAyMHB4O1xuICB6LWluZGV4OiAzO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbn1cbi5zaGlwLXBsYWNpbmctaDIge1xuICBmb250LXNpemU6IDEuN3JlbTtcbn1cbi5zaGlwLXBsYWNpbmctdGV4dC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDEuM3JlbTtcbiAgZm9udC1zaXplOiAxcmVtO1xufVxuXG4uc2hpcC1wbGFjaW5nLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBnYXA6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcbiAgcGFkZGluZzogNXB4O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5zaGlwLXBsYWNpbmctbm9kZSB7XG4gIGhlaWdodDogMjVweDtcbiAgd2lkdGg6IDI1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cbi5zaGlwLXBsYWNpbmctbm9kZTpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1ncmF5KTtcbiAgdHJhbnNmb3JtOiBzY2FsZSg5MCUpO1xuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9kdWxlcy9wbGFjZVlvdXJTaGlwcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSx1QkFBdUI7RUFDdkIsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixzQkFBc0I7RUFDdEIsU0FBUztFQUNULFVBQVU7RUFDVixlQUFlO0VBQ2YsUUFBUTtFQUNSLFNBQVM7RUFDVCxnQ0FBZ0M7RUFDaEMsNkNBQTZDO0VBQzdDLGlCQUFpQjtFQUNqQix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsYUFBYTtFQUNiLFdBQVc7RUFDWCxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxRQUFRO0VBQ1IscUNBQXFDO0VBQ3JDLFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVztFQUNYLGtDQUFrQztFQUNsQyxrQkFBa0I7RUFDbEIsa0NBQWtDO0FBQ3BDO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysa0NBQWtDO0VBQ2xDLHFCQUFxQjtFQUNyQixrQ0FBa0M7QUFDcENcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnNoaXAtcGxhY2luZyB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHBhZGRpbmc6IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxNHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgbWF4LXdpZHRoOiBmaXQtY29udGVudDtcXG4gIGdhcDogMjBweDtcXG4gIHotaW5kZXg6IDM7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG59XFxuLnNoaXAtcGxhY2luZy1oMiB7XFxuICBmb250LXNpemU6IDEuN3JlbTtcXG59XFxuLnNoaXAtcGxhY2luZy10ZXh0LWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAxLjNyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5zaGlwLXBsYWNpbmctY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdhcDogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG59XFxuXFxuLnNoaXAtcGxhY2luZy1ub2RlIHtcXG4gIGhlaWdodDogMjVweDtcXG4gIHdpZHRoOiAyNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxufVxcbi5zaGlwLXBsYWNpbmctbm9kZTpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWdyYXkpO1xcbiAgdHJhbnNmb3JtOiBzY2FsZSg5MCUpO1xcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAucmVzdGFydC1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xuICBwYWRkaW5nOiA4cHg7XG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1saWdodGVyLWJsdWUpO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGNvbG9yOiB2YXIoLS1saWdodGVyLWJsdWUpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xufVxuLnJlc3RhcnQtYnV0dG9uOmhvdmVyIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXNpemU6IDEuNHJlbTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSkgc2NhbGUoOTglKTtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vZHVsZXMvcmVzdGFydEJ1dHRvbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFNBQVM7RUFDVCwwQkFBMEI7RUFDMUIsWUFBWTtFQUNaLGlCQUFpQjtFQUNqQixxQ0FBcUM7RUFDckMsa0JBQWtCO0VBQ2xCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsa0NBQWtDO0VBQ2xDLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixxQ0FBcUM7RUFDckMsa0NBQWtDO0FBQ3BDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5yZXN0YXJ0LWJ1dHRvbiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDEwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xcbiAgcGFkZGluZzogOHB4O1xcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1saWdodGVyLWJsdWUpO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XFxufVxcbi5yZXN0YXJ0LWJ1dHRvbjpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmb250LXNpemU6IDEuNHJlbTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpIHNjYWxlKDk4JSk7XFxuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9hcHAuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9hcHAuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2Zvb3Rlci5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2Zvb3Rlci5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaGVhZGVyLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaGVhZGVyLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9wbGFjZVlvdXJTaGlwcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3BsYWNlWW91clNoaXBzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXN0YXJ0QnV0dG9uLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzdGFydEJ1dHRvbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyJdLCJuYW1lcyI6WyJjc3MiLCJoZWFkZXIiLCJhcHAiLCJzaGlwUGxhY2luZyIsImZvb3RlciIsImJ1dHRvbiIsImJvZHkiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJhcHBlbmQiLCJhcHBlbmRDaGlsZCIsIk5vZGUiLCJjb25zdHJ1Y3RvciIsIngiLCJ5Iiwic2hpcCIsImF0dGFja2VkIiwiU2hpcCIsIlBsYXllciIsInNoaXBzIiwic2hpcHNQbGFjZWRDb3VudCIsImJvYXJkIiwiY3JlYXRlQm9hcmQiLCJodW50TnRhcmdldE1vZGUiLCJsYXN0QXR0YWNrWCIsImxhc3RBdHRhY2tZIiwibmV4dFgiLCJuZXh0WSIsIm5leHRBdHRhY2siLCJyZXNwb25zZSIsInNpemUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJncmlkIiwicm93IiwicHVzaCIsInBsYWNlU2hpcCIsInNoaXBTaXplIiwiaSIsIm5hbWUiLCJwbGFjZVNoaXBzUmFuZG9tIiwibnVtMSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIm51bTIiLCJyZWNpZXZlQXR0YWNrIiwiYXR0YWNrZWROb2RlIiwiaGl0Iiwic3VuayIsImh1bnRBbmRUYXJnZXQiLCJlbmRzV2l0aCIsImNvbnNvbGUiLCJsb2ciLCJpc0dhbWVFbmRlZCIsIlBsYXllcjEiLCJQbGF5ZXIyIiwic2hpcFBsYWNpbmdDb250YWluZXIiLCJwbGFjZUJvYXJkIiwicGxheWVyMUdyaWQiLCJwbGF5ZXIyR3JpZCIsInJlZnJlc2hQbGFjaW5nQm9hcmQiLCJwbGFjZUJvYXJkQ2hpbGRyZW4iLCJjaGlsZHJlbiIsIm5vZGUiLCJwYXJzZUludCIsImRhdGFzZXQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsInJlZnJlc2hQbGF5ZXIxQm9hcmQiLCJwbGF5ZXIxR3JpZENoaWxkcmVuIiwicmVmcmVzaENvbXB1dGVyQm9hcmQiLCJwbGF5ZXIyR3JpZENoaWxkcmVuIiwiYXR0YWNrIiwiaGl0cyIsImNyZWF0ZUVsZW1lbnQiLCJldmVudERpc3BsYXllciIsInRleHRDb250ZW50IiwicGxheWVyc0NvbnRhaW5lciIsImNsYXNzTGlzdCIsImFkZCIsInBsYXllcjEiLCJwbGF5ZXIxRGlzcGxheSIsInNldEF0dHJpYnV0ZSIsInBsYXllcjIiLCJwbGF5ZXIyRGlzcGxheSIsImFkZEV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIm1lc3NhZ2UiLCJHcmlkUmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicCIsImlubmVySFRNTCIsImxvZ28iLCJoZWFkaW5nIiwiZGlzcGxheSIsImxvY2F0aW9uIiwicmVsb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==