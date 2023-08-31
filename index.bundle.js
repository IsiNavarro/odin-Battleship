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
  font-size: 3rem;
  color: var(--dark-blue);
}
.player-one {
  display: flex;
  gap: 5px;
}
h4 {
  font-size: 3rem;
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
  height: 30px;
  width: 30px;
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
  height: 30px;
  width: 30px;
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
`, "",{"version":3,"sources":["webpack://./src/modules/app.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;EACT,uBAAuB;EACvB,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,gCAAgC;EAChC,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,QAAQ;AACV;AACA;EACE,eAAe;EACf,0BAA0B;AAC5B;AACA;EACE,2BAA2B;EAC3B,mBAAmB;EACnB,aAAa;EACb,aAAa;EACb,SAAS;EACT,6CAA6C;AAC/C;AACA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;AACA;EACE,eAAe;EACf,sCAAsC;EACtC,qBAAqB;EACrB,kCAAkC;AACpC","sourcesContent":["main {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n  justify-content: center;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: var(--dark-blue);\n}\nh3 {\n  font-size: 3rem;\n  color: var(--dark-blue);\n}\n.player-one {\n  display: flex;\n  gap: 5px;\n}\nh4 {\n  font-size: 3rem;\n  color: var(--lighter-blue);\n}\n.players-container {\n  background-color: aliceblue;\n  border-radius: 10px;\n  padding: 20px;\n  display: flex;\n  gap: 20px;\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n.player-one {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.player-one-grid {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.player-one-grid-node {\n  height: 30px;\n  width: 30px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n\n.player-two {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.player-two-grid {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.player-two-grid-node {\n  height: 30px;\n  width: 30px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n.player-two-grid-node:hover {\n  cursor: pointer;\n  background-color: var(--aiming-yellow);\n  transform: scale(90%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
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
  font-size: 1.3rem;
  color: var(--dark-blue);
}
.footer-text-content > a {
  color: inherit;
}
`, "",{"version":3,"sources":["webpack://./src/modules/footer.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,SAAS;EACT,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,iBAAiB;EACjB,uBAAuB;AACzB;AACA;EACE,cAAc;AAChB","sourcesContent":["footer {\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 50%;\n  transform: translate(-50%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n\n.footer-text-content {\n  font-size: 1.3rem;\n  color: var(--dark-blue);\n}\n.footer-text-content > a {\n  color: inherit;\n}\n"],"sourceRoot":""}]);
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
  font-size: 3.5rem;
  color: var(--dark-blue);
  padding: 5px;
  background-color: white;
  border: 6px solid var(--dark-blue);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);
}
`, "",{"version":3,"sources":["webpack://./src/modules/header.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,2CAA2C;EAC3C,iBAAiB;EACjB,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,kCAAkC;EAClC,mBAAmB;EACnB,6CAA6C;AAC/C","sourcesContent":["header {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 10px;\n}\nh1 {\n  font-family: 'Roboto', 'Nunito', sans-serif;\n  font-size: 3.5rem;\n  color: var(--dark-blue);\n  padding: 5px;\n  background-color: white;\n  border: 6px solid var(--dark-blue);\n  border-radius: 10px;\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n"],"sourceRoot":""}]);
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
  font-size: 3rem;
}
.ship-placing-text-container {
  display: flex;
  gap: 2rem;
  font-size: 1.4rem;
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
  height: 30px;
  width: 30px;
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
`, "",{"version":3,"sources":["webpack://./src/modules/placeYourShips.css"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,aAAa;EACb,mBAAmB;EACnB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,sBAAsB;EACtB,SAAS;EACT,UAAU;EACV,eAAe;EACf,QAAQ;EACR,SAAS;EACT,gCAAgC;EAChC,6CAA6C;EAC7C,iBAAiB;EACjB,uBAAuB;AACzB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;EACb,SAAS;EACT,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,sCAAsC;EACtC,QAAQ;EACR,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kCAAkC;EAClC,kBAAkB;EAClB,kCAAkC;AACpC;AACA;EACE,eAAe;EACf,kCAAkC;EAClC,qBAAqB;EACrB,kCAAkC;AACpC","sourcesContent":[".ship-placing {\n  background-color: white;\n  padding: 40px;\n  border-radius: 14px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  max-width: fit-content;\n  gap: 20px;\n  z-index: 3;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n  font-weight: bold;\n  color: var(--dark-blue);\n}\n.ship-placing-h2 {\n  font-size: 3rem;\n}\n.ship-placing-text-container {\n  display: flex;\n  gap: 2rem;\n  font-size: 1.4rem;\n}\n\n.ship-placing-container {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  gap: 5px;\n  background-color: var(--lighter-blue);\n  padding: 5px;\n  border-radius: 4px;\n}\n\n.ship-placing-node {\n  height: 30px;\n  width: 30px;\n  background-color: var(--dark-blue);\n  border-radius: 5px;\n  transition: var(--transition-time);\n}\n.ship-placing-node:hover {\n  cursor: pointer;\n  background-color: var(--ship-gray);\n  transform: scale(90%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
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
  font-size: 1, 4rem;
  transform: translate(-50%) scale(98%);
  transition: var(--transition-time);
}
`, "",{"version":3,"sources":["webpack://./src/modules/restartButton.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,qCAAqC;EACrC,kBAAkB;EAClB,0BAA0B;EAC1B,uBAAuB;EACvB,kCAAkC;EAClC,6CAA6C;AAC/C;AACA;EACE,eAAe;EACf,kBAAkB;EAClB,qCAAqC;EACrC,kCAAkC;AACpC","sourcesContent":[".restart-button {\n  position: absolute;\n  bottom: 10%;\n  left: 50%;\n  transform: translate(-50%);\n  padding: 8px;\n  font-size: 1.3rem;\n  border: 4px solid var(--lighter-blue);\n  border-radius: 6px;\n  color: var(--lighter-blue);\n  background-color: white;\n  transition: var(--transition-time);\n  box-shadow: 0 4px 6px rgba(36, 20, 255, 0.25);\n}\n.restart-button:hover {\n  cursor: pointer;\n  font-size: 1, 4rem;\n  transform: translate(-50%) scale(98%);\n  transition: var(--transition-time);\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLGlGQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9sb2dpYy9ub2RlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbG9naWMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljL3JlZnJlc2hCb2FyZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9sb2dpYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9hbGxNb2R1bGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9hcHAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVhZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGFjZVlvdXJTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcmVzdGFydEJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Fzc2V0cy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2Zvb3Rlci5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2hlYWRlci5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYWNlWW91clNoaXBzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcmVzdGFydEJ1dHRvbi5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXNzZXRzL3N0eWxlLmNzcz82MDFkIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9hcHAuY3NzPzNmZWEiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2Zvb3Rlci5jc3M/NmZmZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvaGVhZGVyLmNzcz9jODc1Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGFjZVlvdXJTaGlwcy5jc3M/NDUxNiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcmVzdGFydEJ1dHRvbi5jc3M/MWEzMyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjc3MgZnJvbSAnLi9hc3NldHMvc3R5bGUuY3NzJztcbmltcG9ydCB7IGhlYWRlciwgYXBwLCBzaGlwUGxhY2luZywgZm9vdGVyLCBidXR0b24gfSBmcm9tICcuL21vZHVsZXMvYWxsTW9kdWxlcyc7XG5cbmNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5ib2R5LmFwcGVuZChoZWFkZXIpO1xuYm9keS5hcHBlbmQoYXBwKTtcbmJvZHkuYXBwZW5kQ2hpbGQoc2hpcFBsYWNpbmcpO1xuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuYm9keS5hcHBlbmRDaGlsZChmb290ZXIpO1xuIiwiZXhwb3J0IGNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgdGhpcy5zaGlwID0gbnVsbDtcbiAgICB0aGlzLmF0dGFja2VkID0gZmFsc2U7IC8vQ2FuIGJlICdtaXNzJyBvciAnaGl0J1xuICB9XG59XG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSAnLi9zaGlwJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuL25vZGUnO1xuXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zaGlwcyA9IFtcbiAgICAgIG5ldyBTaGlwKDUsICdDQVJSSUVSJyksXG4gICAgICBuZXcgU2hpcCg0LCAnQkFUVExFU0hJUCcpLFxuICAgICAgbmV3IFNoaXAoMywgJ0RFU1RST1lFUicpLFxuICAgICAgbmV3IFNoaXAoMywgJ1NVQk1BUklORScpLFxuICAgICAgbmV3IFNoaXAoMiwgJ1BBVFJPTCBCT0FUJyksXG4gICAgXTtcbiAgICB0aGlzLnNoaXBzUGxhY2VkQ291bnQgPSAwO1xuXG4gICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcblxuICAgIHRoaXMuaHVudE50YXJnZXRNb2RlID0gJ2h1bnQnO1xuICAgIHRoaXMubGFzdEF0dGFja1ggPSAwO1xuICAgIHRoaXMubGFzdEF0dGFja1kgPSAwO1xuXG4gICAgdGhpcy5uZXh0WCA9IDA7XG4gICAgdGhpcy5uZXh0WSA9IDA7XG5cbiAgICB0aGlzLm5leHRBdHRhY2sgPSAnbGVmdCc7XG5cbiAgICB0aGlzLnJlc3BvbnNlID0gJyc7XG4gIH1cblxuICBjcmVhdGVCb2FyZChzaXplID0gMTApIHtcbiAgICBjb25zdCBncmlkID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaXplOyB5KyspIHtcbiAgICAgICAgcm93LnB1c2gobmV3IE5vZGUoeCwgeSkpO1xuICAgICAgfVxuICAgICAgZ3JpZC5wdXNoKHJvdyk7XG4gICAgfVxuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgcGxhY2VTaGlwKHgsIHkpIHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5zaGlwc1t0aGlzLnNoaXBzUGxhY2VkQ291bnRdO1xuICAgIGNvbnN0IHNoaXBTaXplID0gc2hpcC5zaXplO1xuXG4gICAgLy9DaGVjayBzaGlwIHdvbid0IGJlIG91dCBvZiBsaW1pdFxuICAgIGlmIChzaGlwU2l6ZSA+IHRoaXMuYm9hcmRbeF0ubGVuZ3RoIC0geSkgcmV0dXJuIG51bGw7XG4gICAgLy9DaGVjayBubyBvdGhlciBzaGlwcyBhcm91bmRcbiAgICBlbHNlIHtcbiAgICAgIC8vQ2hlY2sgbGVmdFxuICAgICAgaWYgKHkgPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3hdW3kgLSAxXS5zaGlwKSByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkrKykge1xuICAgICAgICAvL0NoZWNrIFNlbGZcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbeF1beSArIGldLnNoaXApIHJldHVybiBudWxsO1xuICAgICAgICAvL0NoZWNrIEJvdHRvbVxuICAgICAgICBpZiAoeCA8IDkpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2FyZFt4ICsgMV1beSArIGldLnNoaXApIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vQ2hlY2sgdG9wXG4gICAgICAgIGlmICh4ID4gMCkge1xuICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3ggLSAxXVt5ICsgaV0uc2hpcCkgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh5ICsgc2hpcFNpemUgPD0gOSkge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFt4XVt5ICsgc2hpcFNpemVdLnNoaXApIHJldHVybiBudWxsOyAvL1JpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9QbGFjZSBzaGlwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkW3hdW3kgKyBpXS5zaGlwID0gc2hpcDtcbiAgICB9XG5cbiAgICB0aGlzLnNoaXBzUGxhY2VkQ291bnQgKz0gMTtcbiAgICByZXR1cm4gYCR7c2hpcC5uYW1lfSBwbGFjZWRgO1xuICB9XG5cbiAgcGxhY2VTaGlwc1JhbmRvbSgpIHtcbiAgICB3aGlsZSAodGhpcy5zaGlwc1BsYWNlZENvdW50IDwgNSkge1xuICAgICAgY29uc3QgbnVtMSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIGNvbnN0IG51bTIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cbiAgICAgIHRoaXMucGxhY2VTaGlwKG51bTEsIG51bTIpO1xuICAgIH1cbiAgfVxuICByZWNpZXZlQXR0YWNrKHgsIHkpIHtcbiAgICBjb25zdCBhdHRhY2tlZE5vZGUgPSB0aGlzLmJvYXJkW3hdW3ldO1xuICAgIGlmIChhdHRhY2tlZE5vZGUuYXR0YWNrZWQpIHJldHVybiBudWxsO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKGF0dGFja2VkTm9kZS5zaGlwKSB7XG4gICAgICAgIGF0dGFja2VkTm9kZS5zaGlwLmhpdCgpO1xuICAgICAgICBhdHRhY2tlZE5vZGUuYXR0YWNrZWQgPSAnaGl0JztcbiAgICAgICAgaWYgKGF0dGFja2VkTm9kZS5zaGlwLnN1bmspXG4gICAgICAgICAgcmV0dXJuIGBFbmVteSAke2F0dGFja2VkTm9kZS5zaGlwLm5hbWV9IGhhcyBiZWVuIHN1bmshYDtcbiAgICAgICAgZWxzZSByZXR1cm4gYEVuZW15ICR7YXR0YWNrZWROb2RlLnNoaXAubmFtZX0gd2FzIGhpdCFgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0YWNrZWROb2RlLmF0dGFja2VkID0gJ21pc3MnO1xuICAgICAgICByZXR1cm4gYFRoZSBhdHRhY2sgbWlzc2VkYDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaHVudEFuZFRhcmdldCgpIHtcbiAgICBpZiAoIXRoaXMucmVzcG9uc2UpIHRoaXMucmVzcG9uc2UgPSAnJztcbiAgICBpZiAodGhpcy5yZXNwb25zZS5lbmRzV2l0aCgnc3VuayEnKSkge1xuICAgICAgdGhpcy5odW50TnRhcmdldE1vZGUgPSAnaHVudCc7XG4gICAgICB0aGlzLm5leHRBdHRhY2sgPSAnbGVmdCc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaHVudE50YXJnZXRNb2RlID09PSAnaHVudCcpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgdGhpcy5sYXN0QXR0YWNrWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgdGhpcy5sYXN0QXR0YWNrWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICAgICAgICB0aGlzLnJlc3BvbnNlID0gdGhpcy5yZWNpZXZlQXR0YWNrKHRoaXMubGFzdEF0dGFja1gsIHRoaXMubGFzdEF0dGFja1kpO1xuICAgICAgfSB3aGlsZSAoIXRoaXMucmVzcG9uc2UpO1xuICAgICAgaWYgKHRoaXMucmVzcG9uc2UuZW5kc1dpdGgoJ2hpdCEnKSkge1xuICAgICAgICB0aGlzLmh1bnROdGFyZ2V0TW9kZSA9ICd0YXJnZXQnO1xuICAgICAgICB0aGlzLm5leHRYID0gdGhpcy5sYXN0QXR0YWNrWDtcbiAgICAgICAgdGhpcy5uZXh0WSA9IHRoaXMubGFzdEF0dGFja1kgLSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5odW50TnRhcmdldE1vZGUgPT09ICd0YXJnZXQnKSB7XG4gICAgICBpZiAodGhpcy5uZXh0QXR0YWNrID09PSAnbGVmdCcpIHtcbiAgICAgICAgaWYgKHRoaXMubmV4dFkgPj0gMCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2UgPSB0aGlzLnJlY2lldmVBdHRhY2sodGhpcy5uZXh0WCwgdGhpcy5uZXh0WSk7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgLy9JZiBhdHRhY2tpbmcgb24gYW4gYXR0YWNrZWQgbm9kZVxuICAgICAgICAgIGlmICghdGhpcy5yZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0WSA9IHRoaXMubGFzdEF0dGFja1kgKyAxO1xuICAgICAgICAgICAgdGhpcy5uZXh0QXR0YWNrID0gJ3JpZ2h0JztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh1bnRBbmRUYXJnZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVzcG9uc2UuZW5kc1dpdGgoJ2hpdCEnKSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0WS0tO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZS5lbmRzV2l0aCgnbWlzc2VkJykpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dFkgPSB0aGlzLmxhc3RBdHRhY2tZICsgMTtcbiAgICAgICAgICAgIHRoaXMubmV4dEF0dGFjayA9ICdyaWdodCc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vSWYgYm9yZGVyIG9mIGdyaWRcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5uZXh0WSA9IHRoaXMubGFzdEF0dGFja1kgKyAxO1xuICAgICAgICAgIHRoaXMubmV4dEF0dGFjayA9ICdyaWdodCc7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaHVudEFuZFRhcmdldCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5uZXh0QXR0YWNrID09PSAncmlnaHQnKSB7XG4gICAgICAgIGlmICh0aGlzLm5leHRZIDw9IDkpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlID0gdGhpcy5yZWNpZXZlQXR0YWNrKHRoaXMubmV4dFgsIHRoaXMubmV4dFkpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVzcG9uc2UuZW5kc1dpdGgoJ2hpdCEnKSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0WSsrO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5uZXh0WSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaXNHYW1lRW5kZWQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuc2hpcHNbaV0uc3VuaykgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUGxheWVyMSA9IG5ldyBQbGF5ZXIoKTtcbmV4cG9ydCBjb25zdCBQbGF5ZXIyID0gbmV3IFBsYXllcigpO1xuIiwiaW1wb3J0IHsgc2hpcFBsYWNpbmdDb250YWluZXIgYXMgcGxhY2VCb2FyZCB9IGZyb20gJy4uL21vZHVsZXMvcGxhY2VZb3VyU2hpcHMnO1xuaW1wb3J0IHsgcGxheWVyMUdyaWQsIHBsYXllcjJHcmlkIH0gZnJvbSAnLi4vbW9kdWxlcy9hcHAnO1xuaW1wb3J0IHsgUGxheWVyMSwgUGxheWVyMiB9IGZyb20gJy4vcGxheWVycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoUGxhY2luZ0JvYXJkKCkge1xuICAvL1JlZnJlc2ggUExBQ0UgWU9VUiBTSElQUyBNb2RhbFxuICBjb25zdCBwbGFjZUJvYXJkQ2hpbGRyZW4gPSBwbGFjZUJvYXJkLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYWNlQm9hcmRDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5vZGUgPSBwbGFjZUJvYXJkQ2hpbGRyZW5baV07XG5cbiAgICAvL0dldCB0aGUgZGF0YS1sYWJlbFxuICAgIGNvbnN0IHggPSBwYXJzZUludChub2RlLmRhdGFzZXQueCk7XG4gICAgY29uc3QgeSA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC55KTtcblxuICAgIGlmIChQbGF5ZXIxLmJvYXJkW3hdW3ldLnNoaXApIHtcbiAgICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyMDEsMjAxLDIwMSknO1xuICAgIH1cbiAgfVxuXG4gIHJlZnJlc2hQbGF5ZXIxQm9hcmQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hQbGF5ZXIxQm9hcmQoKSB7XG4gIC8vUmVmcmVzaCBZT1VSIGJvYXJkXG4gIGNvbnN0IHBsYXllcjFHcmlkQ2hpbGRyZW4gPSBwbGF5ZXIxR3JpZC5jaGlsZHJlbjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIxR3JpZENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IHBsYXllcjFHcmlkQ2hpbGRyZW5baV07XG5cbiAgICAvL0dldCB0aGUgZGF0YS1sYWJlbFxuICAgIGNvbnN0IHggPSBwYXJzZUludChub2RlLmRhdGFzZXQueCk7XG4gICAgY29uc3QgeSA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC55KTtcblxuICAgIGlmIChQbGF5ZXIxLmJvYXJkW3hdW3ldLnNoaXApIHtcbiAgICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyMDEsMjAxLDIwMSknO1xuICAgIH1cbiAgICBpZiAoUGxheWVyMS5ib2FyZFt4XVt5XS5hdHRhY2tlZCA9PT0gJ21pc3MnKVxuICAgICAgbm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZmZmZic7XG4gICAgaWYgKFBsYXllcjEuYm9hcmRbeF1beV0uYXR0YWNrZWQgPT09ICdoaXQnKVxuICAgICAgbm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI1NSw2NCw2NCknO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoQ29tcHV0ZXJCb2FyZCgpIHtcbiAgLy9SZWZyZXNoIENPTVBVVEVSJ3MgQm9hcmRcbiAgY29uc3QgcGxheWVyMkdyaWRDaGlsZHJlbiA9IHBsYXllcjJHcmlkLmNoaWxkcmVuO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyMkdyaWRDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5vZGUgPSBwbGF5ZXIyR3JpZENoaWxkcmVuW2ldO1xuXG4gICAgLy9HZXQgdGhlIGRhdGEtbGFiZWxcbiAgICBjb25zdCB4ID0gcGFyc2VJbnQobm9kZS5kYXRhc2V0LngpO1xuICAgIGNvbnN0IHkgPSBwYXJzZUludChub2RlLmRhdGFzZXQueSk7XG5cbiAgICBjb25zdCBhdHRhY2sgPSBQbGF5ZXIyLmJvYXJkW3hdW3ldLmF0dGFja2VkO1xuICAgIGlmIChhdHRhY2spIHtcbiAgICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgICBub2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmZmZmJztcbiAgICAgIH0gZWxzZSBpZiAoYXR0YWNrID09PSAnaGl0Jykge1xuICAgICAgICBub2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjU1LCA2NCwgNjQpJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2l6ZSwgbmFtZSwgaGl0cyA9IDAsIHN1bmsgPSBmYWxzZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICB0aGlzLmhpdHMgPSBoaXRzO1xuICAgIHRoaXMuc3VuayA9IHN1bms7XG4gIH1cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICAgIHRoaXMuc3VuayA9IHRoaXMuaGl0cyA+PSB0aGlzLnNpemUgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBoZWFkZXIgZnJvbSAnLi9oZWFkZXInO1xuaW1wb3J0IGFwcCBmcm9tICcuL2FwcCc7XG5pbXBvcnQgc2hpcFBsYWNpbmcgZnJvbSAnLi9wbGFjZVlvdXJTaGlwcyc7XG5pbXBvcnQgZm9vdGVyIGZyb20gJy4vZm9vdGVyJztcbmltcG9ydCBidXR0b24gZnJvbSAnLi9yZXN0YXJ0QnV0dG9uJztcblxuZXhwb3J0IHsgaGVhZGVyLCBhcHAsIHNoaXBQbGFjaW5nLCBmb290ZXIsIGJ1dHRvbiB9O1xuIiwiaW1wb3J0IGNzcyBmcm9tICcuL2FwcC5jc3MnO1xuaW1wb3J0IHsgUGxheWVyMSwgUGxheWVyMiB9IGZyb20gJy4uL2xvZ2ljL3BsYXllcnMnO1xuaW1wb3J0IHtcbiAgcmVmcmVzaENvbXB1dGVyQm9hcmQsXG4gIHJlZnJlc2hQbGF5ZXIxQm9hcmQsXG59IGZyb20gJy4uL2xvZ2ljL3JlZnJlc2hCb2FyZHMnO1xuXG5jb25zdCBhcHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYWluJyk7XG5cbmNvbnN0IGV2ZW50RGlzcGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbmV2ZW50RGlzcGxheWVyLnRleHRDb250ZW50ID0gJ0Nob29zZSBhIHRhcmdldCc7XG5cbmNvbnN0IHBsYXllcnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnBsYXllcnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgncGxheWVycy1jb250YWluZXInKTtcblxuY29uc3QgcGxheWVyMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGxheWVyMS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItb25lJyk7XG5jb25zdCBwbGF5ZXIxRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XG5wbGF5ZXIxRGlzcGxheS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItZGlzcGxheScpO1xucGxheWVyMURpc3BsYXkudGV4dENvbnRlbnQgPSAnWU9VJztcbnBsYXllcjEuYXBwZW5kQ2hpbGQocGxheWVyMURpc3BsYXkpO1xuXG5leHBvcnQgY29uc3QgcGxheWVyMUdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnBsYXllcjFHcmlkLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1vbmUtZ3JpZCcpO1xuZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCsrKSB7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7IHkrKykge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItb25lLWdyaWQtbm9kZScpO1xuXG4gICAgLy9HaXZpbmcgaW5kZXggdG8gZWFjaCBub2RlXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIHgpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXknLCB5KTtcblxuICAgIHBsYXllcjFHcmlkLmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG59XG5wbGF5ZXIxLmFwcGVuZENoaWxkKHBsYXllcjFHcmlkKTtcblxuY29uc3QgcGxheWVyMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGxheWVyMi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItdHdvJyk7XG5jb25zdCBwbGF5ZXIyRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XG5wbGF5ZXIyRGlzcGxheS5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItZGlzcGxheScpO1xucGxheWVyMkRpc3BsYXkudGV4dENvbnRlbnQgPSAnQ29tcHV0ZXInO1xucGxheWVyMi5hcHBlbmRDaGlsZChwbGF5ZXIyRGlzcGxheSk7XG5cbmV4cG9ydCBjb25zdCBwbGF5ZXIyR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGxheWVyMkdyaWQuY2xhc3NMaXN0LmFkZCgncGxheWVyLXR3by1ncmlkJyk7XG5mb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ3BsYXllci10d28tZ3JpZC1ub2RlJyk7XG5cbiAgICAvL0dpdmluZyBpbmRleCB0byBlYWNoIG5vZGVcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS14JywgeCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHkpO1xuXG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxpc3RlbmVyKTtcblxuICAgIHBsYXllcjJHcmlkLmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG59XG5wbGF5ZXIyLmFwcGVuZENoaWxkKHBsYXllcjJHcmlkKTtcblxucGxheWVyc0NvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXIxKTtcbnBsYXllcnNDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyMik7XG5cbmFwcC5hcHBlbmRDaGlsZChldmVudERpc3BsYXllcik7XG5hcHAuYXBwZW5kQ2hpbGQocGxheWVyc0NvbnRhaW5lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcblxuZnVuY3Rpb24gbGlzdGVuZXIoKSB7XG4gIGNvbnN0IHggPSBwYXJzZUludCh0aGlzLmRhdGFzZXQueCk7XG4gIGNvbnN0IHkgPSBwYXJzZUludCh0aGlzLmRhdGFzZXQueSk7XG5cbiAgY29uc3QgbWVzc2FnZSA9IFBsYXllcjIucmVjaWV2ZUF0dGFjayh4LCB5KTtcbiAgcmVmcmVzaENvbXB1dGVyQm9hcmQoKTtcblxuICBpZiAoUGxheWVyMi5pc0dhbWVFbmRlZCgpKSB7XG4gICAgZXZlbnREaXNwbGF5ZXIudGV4dENvbnRlbnQgPSAnRW5lbXkgZmxlZXQgY29tcGxldGVseSBzdW5rLiBZT1UgV0lOISc7XG4gICAgR3JpZFJlbW92ZUxpc3RlbmVyKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG1lc3NhZ2UpIHtcbiAgICBldmVudERpc3BsYXllci50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cbiAgICAvL1dhaXQgMS41IHNlY29uZHMgYmV0d2VlbiBhdHRhY2tzPz9cbiAgICBQbGF5ZXIxLmh1bnRBbmRUYXJnZXQoKTtcbiAgICByZWZyZXNoUGxheWVyMUJvYXJkKCk7XG4gICAgaWYgKFBsYXllcjEuaXNHYW1lRW5kZWQoKSkge1xuICAgICAgZXZlbnREaXNwbGF5ZXIudGV4dENvbnRlbnQgPSAnR2FtZSBvdmVyLi4uIENvbXB1dGVyIHdpbnMnO1xuICAgICAgR3JpZFJlbW92ZUxpc3RlbmVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIEdyaWRSZW1vdmVMaXN0ZW5lcigpIHtcbiAgY29uc3QgcGxheWVyMkdyaWRDaGlsZHJlbiA9IHBsYXllcjJHcmlkLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcjJHcmlkQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBub2RlID0gcGxheWVyMkdyaWRDaGlsZHJlbltpXTtcbiAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGlzdGVuZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgY3NzIGZyb20gJy4vZm9vdGVyLmNzcyc7XG5cbmNvbnN0IGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvb3RlcicpO1xuY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbnAuY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXRleHQtY29udGVudCcpO1xucC5pbm5lckhUTUwgPSBgQ29weXJpZ2h0IMKpXG4gICAgICAgICAgICA8c2NyaXB0PlxuICAgICAgICAgICAgICAgIGRvY3VtZW50LndyaXRlKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSlcbiAgICAgICAgICAgIDwvc2NyaXB0PlxuICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9pc2lOYXZhcnJvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICAgICAgICAgICAgaXNpTmF2YXJyb1xuICAgICAgICAgICAgPC9hPmA7XG5cbmZvb3Rlci5hcHBlbmRDaGlsZChwKTtcblxuZXhwb3J0IGRlZmF1bHQgZm9vdGVyO1xuIiwiaW1wb3J0IGNzcyBmcm9tICcuL2hlYWRlci5jc3MnO1xuXG5jb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoZWFkZXInKTtcbmNvbnN0IGxvZ28gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xubG9nby50ZXh0Q29udGVudCA9ICdCQVRUTEVTSElQJztcblxuaGVhZGVyLmFwcGVuZENoaWxkKGxvZ28pO1xuXG5leHBvcnQgZGVmYXVsdCBoZWFkZXI7XG4iLCJpbXBvcnQgY3NzIGZyb20gJy4vcGxhY2VZb3VyU2hpcHMuY3NzJztcbmltcG9ydCB7IHJlZnJlc2hQbGFjaW5nQm9hcmQgfSBmcm9tICcuLi9sb2dpYy9yZWZyZXNoQm9hcmRzJztcbmltcG9ydCB7IFBsYXllcjEsIFBsYXllcjIgfSBmcm9tICcuLi9sb2dpYy9wbGF5ZXJzJztcbmltcG9ydCBhcHAgZnJvbSAnLi9hcHAnO1xuXG5jb25zdCBzaGlwUGxhY2luZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuc2hpcFBsYWNpbmcuY2xhc3NMaXN0LmFkZCgnc2hpcC1wbGFjaW5nJyk7XG5cbmNvbnN0IGhlYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuaGVhZGluZy5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNpbmctaDInKTtcbmhlYWRpbmcudGV4dENvbnRlbnQgPSAnUGxhY2UgeW91ciBzaGlwcyEnO1xuc2hpcFBsYWNpbmcuYXBwZW5kQ2hpbGQoaGVhZGluZyk7XG5cbmNvbnN0IHNoaXBQbGFjaW5nQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5zaGlwUGxhY2luZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNpbmctY29udGFpbmVyJyk7XG5mb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnc2hpcC1wbGFjaW5nLW5vZGUnKTtcblxuICAgIC8vR2l2aW5nIGluZGV4IHRvIGVhY2ggbm9kZVxuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXgnLCB4KTtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgeSk7XG5cbiAgICAvL1BsYWNpbmcgYSBzaGlwIHdoZW4gY2xpY2tpbmcgYSBub2RlXG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHggPSBwYXJzZUludChub2RlLmRhdGFzZXQueCk7XG4gICAgICBjb25zdCB5ID0gcGFyc2VJbnQobm9kZS5kYXRhc2V0LnkpO1xuXG4gICAgICBQbGF5ZXIxLnBsYWNlU2hpcCh4LCB5KTtcbiAgICAgIHJlZnJlc2hQbGFjaW5nQm9hcmQoKTtcblxuICAgICAgaWYgKFBsYXllcjEuc2hpcHNQbGFjZWRDb3VudCA+PSA1KSB7XG4gICAgICAgIHNoaXBQbGFjaW5nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGFwcC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBQbGF5ZXIyLnBsYWNlU2hpcHNSYW5kb20oKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2hpcFBsYWNpbmdDb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cbn1cblxuc2hpcFBsYWNpbmcuYXBwZW5kQ2hpbGQoc2hpcFBsYWNpbmdDb250YWluZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBzaGlwUGxhY2luZztcbmV4cG9ydCB7IHNoaXBQbGFjaW5nQ29udGFpbmVyIH07XG4iLCJpbXBvcnQgY3NzIGZyb20gJy4vcmVzdGFydEJ1dHRvbi5jc3MnO1xuXG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbmJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdyZXN0YXJ0LWJ1dHRvbicpO1xuYnV0dG9uLnRleHRDb250ZW50ID0gJ1Jlc3RhcnQnO1xuXG5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGJ1dHRvbjtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9TnVuaXRvOndnaHRANDAwOzUwMDs3MDAmZGlzcGxheT1zd2FwKTtcIl0pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Um9ib3RvOndnaHRANDAwOzUwMDs3MDAmZGlzcGxheT1zd2FwKTtcIl0pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XG4gIC0tZGFyay1ibHVlOiByZ2IoMTksIDQ5LCA4Nyk7XG4gIC0tbGlnaHQtYmx1ZTogcmdiKDMzLCA4NSwgMTUzKTtcbiAgLS1saWdodGVyLWJsdWU6IHJnYig0OCwgMTIzLCAyMjEpO1xuICAtLXNoaXAtZ3JheTogcmdiKDIwMSwgMjAxLCAyMDEpO1xuICAtLWFpbWluZy15ZWxsb3c6IHJnYigyNTUsIDE4NywgODYpO1xuICAtLXJlZC1oaXQ6IHJnYigyNTUsIDY0LCA2NCk7XG4gIC0td2hpdGUtbWlzczogI2ZmZmZmZjtcblxuICAtLXRyYW5zaXRpb24tdGltZTogMjAwbXM7XG59XG4qLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW46IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZvbnQtZmFtaWx5OiAnTnVuaXRvJywgJ1RpbWVzIE5ldyBSb21hbicsIFRpbWVzLCBzZXJpZjtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9hc3NldHMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUVBO0VBQ0UsNEJBQTRCO0VBQzVCLDhCQUE4QjtFQUM5QixpQ0FBaUM7RUFDakMsK0JBQStCO0VBQy9CLGtDQUFrQztFQUNsQywyQkFBMkI7RUFDM0IscUJBQXFCOztFQUVyQix3QkFBd0I7QUFDMUI7QUFDQTs7O0VBR0UsVUFBVTtFQUNWLFNBQVM7RUFDVCxzQkFBc0I7RUFDdEIsc0RBQXNEO0VBQ3RELGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1OdW5pdG86d2dodEA0MDA7NTAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcXG5AaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Sb2JvdG86d2dodEA0MDA7NTAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcXG46cm9vdCB7XFxuICAtLWRhcmstYmx1ZTogcmdiKDE5LCA0OSwgODcpO1xcbiAgLS1saWdodC1ibHVlOiByZ2IoMzMsIDg1LCAxNTMpO1xcbiAgLS1saWdodGVyLWJsdWU6IHJnYig0OCwgMTIzLCAyMjEpO1xcbiAgLS1zaGlwLWdyYXk6IHJnYigyMDEsIDIwMSwgMjAxKTtcXG4gIC0tYWltaW5nLXllbGxvdzogcmdiKDI1NSwgMTg3LCA4Nik7XFxuICAtLXJlZC1oaXQ6IHJnYigyNTUsIDY0LCA2NCk7XFxuICAtLXdoaXRlLW1pc3M6ICNmZmZmZmY7XFxuXFxuICAtLXRyYW5zaXRpb24tdGltZTogMjAwbXM7XFxufVxcbiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIHBhZGRpbmc6IDA7XFxuICBtYXJnaW46IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZm9udC1mYW1pbHk6ICdOdW5pdG8nLCAnVGltZXMgTmV3IFJvbWFuJywgVGltZXMsIHNlcmlmO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgbWFpbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMjBweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xufVxuaDMge1xuICBmb250LXNpemU6IDNyZW07XG4gIGNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xufVxuLnBsYXllci1vbmUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDVweDtcbn1cbmg0IHtcbiAgZm9udC1zaXplOiAzcmVtO1xuICBjb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcbn1cbi5wbGF5ZXJzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgcGFkZGluZzogMjBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAyMHB4O1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XG59XG4ucGxheWVyLW9uZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLnBsYXllci1vbmUtZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBnYXA6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcbiAgcGFkZGluZzogNXB4O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5wbGF5ZXItb25lLWdyaWQtbm9kZSB7XG4gIGhlaWdodDogMzBweDtcbiAgd2lkdGg6IDMwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cblxuLnBsYXllci10d28ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5wbGF5ZXItdHdvLWdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ2FwOiA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XG4gIHBhZGRpbmc6IDVweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuXG4ucGxheWVyLXR3by1ncmlkLW5vZGUge1xuICBoZWlnaHQ6IDMwcHg7XG4gIHdpZHRoOiAzMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XG59XG4ucGxheWVyLXR3by1ncmlkLW5vZGU6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWFpbWluZy15ZWxsb3cpO1xuICB0cmFuc2Zvcm06IHNjYWxlKDkwJSk7XG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9tb2R1bGVzL2FwcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztFQUNoQyx1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGVBQWU7RUFDZix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGFBQWE7RUFDYixRQUFRO0FBQ1Y7QUFDQTtFQUNFLGVBQWU7RUFDZiwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLDJCQUEyQjtFQUMzQixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLGFBQWE7RUFDYixTQUFTO0VBQ1QsNkNBQTZDO0FBQy9DO0FBQ0E7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGFBQWE7RUFDYixzQ0FBc0M7RUFDdEMsUUFBUTtFQUNSLHFDQUFxQztFQUNyQyxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7RUFDWCxrQ0FBa0M7RUFDbEMsa0JBQWtCO0VBQ2xCLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxRQUFRO0VBQ1IscUNBQXFDO0VBQ3JDLFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVztFQUNYLGtDQUFrQztFQUNsQyxrQkFBa0I7RUFDbEIsa0NBQWtDO0FBQ3BDO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysc0NBQXNDO0VBQ3RDLHFCQUFxQjtFQUNyQixrQ0FBa0M7QUFDcENcIixcInNvdXJjZXNDb250ZW50XCI6W1wibWFpbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDIwcHg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG59XFxuaDMge1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxufVxcbi5wbGF5ZXItb25lIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDVweDtcXG59XFxuaDQge1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XFxufVxcbi5wbGF5ZXJzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgcGFkZGluZzogMjBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDIwcHg7XFxuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XFxufVxcbi5wbGF5ZXItb25lIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4ucGxheWVyLW9uZS1ncmlkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdhcDogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG59XFxuXFxuLnBsYXllci1vbmUtZ3JpZC1ub2RlIHtcXG4gIGhlaWdodDogMzBweDtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxufVxcblxcbi5wbGF5ZXItdHdvIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4ucGxheWVyLXR3by1ncmlkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdhcDogNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRlci1ibHVlKTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG59XFxuXFxuLnBsYXllci10d28tZ3JpZC1ub2RlIHtcXG4gIGhlaWdodDogMzBweDtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxufVxcbi5wbGF5ZXItdHdvLWdyaWQtbm9kZTpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1haW1pbmcteWVsbG93KTtcXG4gIHRyYW5zZm9ybTogc2NhbGUoOTAlKTtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgZm9vdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogMTAwJTtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogMjBweDtcbn1cblxuLmZvb3Rlci10ZXh0LWNvbnRlbnQge1xuICBmb250LXNpemU6IDEuM3JlbTtcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XG59XG4uZm9vdGVyLXRleHQtY29udGVudCA+IGEge1xuICBjb2xvcjogaW5oZXJpdDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vZHVsZXMvZm9vdGVyLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsU0FBUztFQUNULFNBQVM7RUFDVCwwQkFBMEI7RUFDMUIsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UsY0FBYztBQUNoQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJmb290ZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBib3R0b206IDA7XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlKTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAyMHB4O1xcbn1cXG5cXG4uZm9vdGVyLXRleHQtY29udGVudCB7XFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xcbn1cXG4uZm9vdGVyLXRleHQtY29udGVudCA+IGEge1xcbiAgY29sb3I6IGluaGVyaXQ7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDEwcHg7XG59XG5oMSB7XG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgJ051bml0bycsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMy41cmVtO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbiAgcGFkZGluZzogNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiA2cHggc29saWQgdmFyKC0tZGFyay1ibHVlKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9kdWxlcy9oZWFkZXIuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsYUFBYTtBQUNmO0FBQ0E7RUFDRSwyQ0FBMkM7RUFDM0MsaUJBQWlCO0VBQ2pCLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osdUJBQXVCO0VBQ3ZCLGtDQUFrQztFQUNsQyxtQkFBbUI7RUFDbkIsNkNBQTZDO0FBQy9DXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImhlYWRlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuaDEge1xcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCAnTnVuaXRvJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMy41cmVtO1xcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxuICBwYWRkaW5nOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogNnB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMzYsIDIwLCAyNTUsIDAuMjUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5zaGlwLXBsYWNpbmcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWF4LXdpZHRoOiBmaXQtY29udGVudDtcbiAgZ2FwOiAyMHB4O1xuICB6LWluZGV4OiAzO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tZGFyay1ibHVlKTtcbn1cbi5zaGlwLXBsYWNpbmctaDIge1xuICBmb250LXNpemU6IDNyZW07XG59XG4uc2hpcC1wbGFjaW5nLXRleHQtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAycmVtO1xuICBmb250LXNpemU6IDEuNHJlbTtcbn1cblxuLnNoaXAtcGxhY2luZy1jb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ2FwOiA1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XG4gIHBhZGRpbmc6IDVweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuXG4uc2hpcC1wbGFjaW5nLW5vZGUge1xuICBoZWlnaHQ6IDMwcHg7XG4gIHdpZHRoOiAzMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XG59XG4uc2hpcC1wbGFjaW5nLW5vZGU6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtZ3JheSk7XG4gIHRyYW5zZm9ybTogc2NhbGUoOTAlKTtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vZHVsZXMvcGxhY2VZb3VyU2hpcHMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLFNBQVM7RUFDVCxVQUFVO0VBQ1YsZUFBZTtFQUNmLFFBQVE7RUFDUixTQUFTO0VBQ1QsZ0NBQWdDO0VBQ2hDLDZDQUE2QztFQUM3QyxpQkFBaUI7RUFDakIsdUJBQXVCO0FBQ3pCO0FBQ0E7RUFDRSxlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsU0FBUztFQUNULGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQ0FBc0M7RUFDdEMsUUFBUTtFQUNSLHFDQUFxQztFQUNyQyxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7RUFDWCxrQ0FBa0M7RUFDbEMsa0JBQWtCO0VBQ2xCLGtDQUFrQztBQUNwQztBQUNBO0VBQ0UsZUFBZTtFQUNmLGtDQUFrQztFQUNsQyxxQkFBcUI7RUFDckIsa0NBQWtDO0FBQ3BDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5zaGlwLXBsYWNpbmcge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBwYWRkaW5nOiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMTRweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1heC13aWR0aDogZml0LWNvbnRlbnQ7XFxuICBnYXA6IDIwcHg7XFxuICB6LWluZGV4OiAzO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiA1MCU7XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCByZ2JhKDM2LCAyMCwgMjU1LCAwLjI1KTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6IHZhcigtLWRhcmstYmx1ZSk7XFxufVxcbi5zaGlwLXBsYWNpbmctaDIge1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbn1cXG4uc2hpcC1wbGFjaW5nLXRleHQtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDJyZW07XFxuICBmb250LXNpemU6IDEuNHJlbTtcXG59XFxuXFxuLnNoaXAtcGxhY2luZy1jb250YWluZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xcbiAgZ2FwOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodGVyLWJsdWUpO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbn1cXG5cXG4uc2hpcC1wbGFjaW5nLW5vZGUge1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgd2lkdGg6IDMwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJsdWUpO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcXG59XFxuLnNoaXAtcGxhY2luZy1ub2RlOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtZ3JheSk7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDkwJSk7XFxuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5yZXN0YXJ0LWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAxMCU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSk7XG4gIHBhZGRpbmc6IDhweDtcbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLWxpZ2h0ZXItYmx1ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiB2YXIoLS10cmFuc2l0aW9uLXRpbWUpO1xuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XG59XG4ucmVzdGFydC1idXR0b246aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtc2l6ZTogMSwgNHJlbTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSkgc2NhbGUoOTglKTtcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vZHVsZXMvcmVzdGFydEJ1dHRvbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFNBQVM7RUFDVCwwQkFBMEI7RUFDMUIsWUFBWTtFQUNaLGlCQUFpQjtFQUNqQixxQ0FBcUM7RUFDckMsa0JBQWtCO0VBQ2xCLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsa0NBQWtDO0VBQ2xDLDZDQUE2QztBQUMvQztBQUNBO0VBQ0UsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixxQ0FBcUM7RUFDckMsa0NBQWtDO0FBQ3BDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5yZXN0YXJ0LWJ1dHRvbiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDEwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xcbiAgcGFkZGluZzogOHB4O1xcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1saWdodGVyLWJsdWUpO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgY29sb3I6IHZhcigtLWxpZ2h0ZXItYmx1ZSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIHRyYW5zaXRpb246IHZhcigtLXRyYW5zaXRpb24tdGltZSk7XFxuICBib3gtc2hhZG93OiAwIDRweCA2cHggcmdiYSgzNiwgMjAsIDI1NSwgMC4yNSk7XFxufVxcbi5yZXN0YXJ0LWJ1dHRvbjpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmb250LXNpemU6IDEsIDRyZW07XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlKSBzY2FsZSg5OCUpO1xcbiAgdHJhbnNpdGlvbjogdmFyKC0tdHJhbnNpdGlvbi10aW1lKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYXBwLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYXBwLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9mb290ZXIuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9mb290ZXIuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2hlYWRlci5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2hlYWRlci5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcGxhY2VZb3VyU2hpcHMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9wbGFjZVlvdXJTaGlwcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzdGFydEJ1dHRvbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc3RhcnRCdXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiXSwibmFtZXMiOlsiY3NzIiwiaGVhZGVyIiwiYXBwIiwic2hpcFBsYWNpbmciLCJmb290ZXIiLCJidXR0b24iLCJib2R5IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYXBwZW5kIiwiYXBwZW5kQ2hpbGQiLCJOb2RlIiwiY29uc3RydWN0b3IiLCJ4IiwieSIsInNoaXAiLCJhdHRhY2tlZCIsIlNoaXAiLCJQbGF5ZXIiLCJzaGlwcyIsInNoaXBzUGxhY2VkQ291bnQiLCJib2FyZCIsImNyZWF0ZUJvYXJkIiwiaHVudE50YXJnZXRNb2RlIiwibGFzdEF0dGFja1giLCJsYXN0QXR0YWNrWSIsIm5leHRYIiwibmV4dFkiLCJuZXh0QXR0YWNrIiwicmVzcG9uc2UiLCJzaXplIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiZ3JpZCIsInJvdyIsInB1c2giLCJwbGFjZVNoaXAiLCJzaGlwU2l6ZSIsImkiLCJuYW1lIiwicGxhY2VTaGlwc1JhbmRvbSIsIm51bTEiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJudW0yIiwicmVjaWV2ZUF0dGFjayIsImF0dGFja2VkTm9kZSIsImhpdCIsInN1bmsiLCJodW50QW5kVGFyZ2V0IiwiZW5kc1dpdGgiLCJjb25zb2xlIiwibG9nIiwiaXNHYW1lRW5kZWQiLCJQbGF5ZXIxIiwiUGxheWVyMiIsInNoaXBQbGFjaW5nQ29udGFpbmVyIiwicGxhY2VCb2FyZCIsInBsYXllcjFHcmlkIiwicGxheWVyMkdyaWQiLCJyZWZyZXNoUGxhY2luZ0JvYXJkIiwicGxhY2VCb2FyZENoaWxkcmVuIiwiY2hpbGRyZW4iLCJub2RlIiwicGFyc2VJbnQiLCJkYXRhc2V0Iiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJyZWZyZXNoUGxheWVyMUJvYXJkIiwicGxheWVyMUdyaWRDaGlsZHJlbiIsInJlZnJlc2hDb21wdXRlckJvYXJkIiwicGxheWVyMkdyaWRDaGlsZHJlbiIsImF0dGFjayIsImhpdHMiLCJjcmVhdGVFbGVtZW50IiwiZXZlbnREaXNwbGF5ZXIiLCJ0ZXh0Q29udGVudCIsInBsYXllcnNDb250YWluZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5ZXIxIiwicGxheWVyMURpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJwbGF5ZXIyIiwicGxheWVyMkRpc3BsYXkiLCJhZGRFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJtZXNzYWdlIiwiR3JpZFJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInAiLCJpbm5lckhUTUwiLCJsb2dvIiwiaGVhZGluZyIsImRpc3BsYXkiLCJsb2NhdGlvbiIsInJlbG9hZCJdLCJzb3VyY2VSb290IjoiIn0=