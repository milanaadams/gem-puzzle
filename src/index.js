import addZero from './stat';
import './assets/1.jpg';
import './assets/2.jpg';
import './assets/3.jpg';
import './assets/4.jpg';
import './assets/5.jpg';
import './assets/6.jpg';
import './assets/7.jpg';
import './assets/8.jpg';
import './assets/9.jpg';
import './assets/10.jpg';
import './assets/tink.wav';

const puzzleGame = {
  elements: {
    puzzle: null,
    puzzleBoard: null,
    blackout: null,
    movesCount: null,
    timeCounter: null,
    paused: null,
    startScreen: null,
    resultBoard: null,
    resumeSavedGame: null,
    burgerMenu: null,
    mobileMenuPopup: null,
    mobileBestResults: null,
    header: null,
    boardSizeBtns: [],
    puzzleTypeBtns: [],
    cards: [],
    moves: [],
    menuButtons: [],
    mobileButtons: [],
    bestResults: [],
  },

  properties: {
    boardSize: 600,
    puzzleSize: 4,
    picturePuzzle: false,
    cellSize: 0,
    movesCounter: 0,
    currentImg: null,
    audio: false,
    timer: false,
    firstMove: false,
    canDrop: false,
    isAdjacent: false,
  },

  emptyCell: {
    top: 0,
    left: 0,
    element: null,
  },

  timer: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },

  init() {
    this.boardSize();
    this.createDOM();
    this.burgerMenu();
    this.loadBestResults();
    this.setMediaQueries();
    this.elements.menuButtons = document.querySelectorAll('.btn');
    this.elements.menuButtons.forEach((key) => {
      const btn = key.textContent;
      switch (btn) {
        case 'solve puzzle':
          key.addEventListener('click', () => {
            this.properties.timer = false;
            this.solvePuzzle();
          });
          break;
        case 'restart game':
          key.addEventListener('click', () => {
            this.restart();
          });
          break;
        case 'pause':
          key.addEventListener('click', () => {
            this.elements.paused.classList.add('paused--active');
            this.properties.timer = false;
            this.elements.blackout.style.display = 'block';
          });
          break;
        case 'save game':
          key.addEventListener('click', () => {
            this.saveGame();
          });
          break;
        case 'quit':
          key.addEventListener('click', () => {
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
            this.properties.puzzleSize = 4;
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
            this.elements.startScreen.classList.add('start-screen--active');
            this.resetCounters();
            this.endGame();
          });
          break;
        default:
          break;
      }
    });
  },

  boardSize() {
    const width = window.innerWidth || document.documentElement.clientWidth
    || document.body.clientWidth;
    if (width > 1301) this.properties.boardSize = 600;
    if (window.innerWidth < 1301 && window.innerWidth > 900) this.properties.boardSize = 500;
    if (window.innerWidth < 901 && window.innerWidth > 600) this.properties.boardSize = 400;
    if (window.innerWidth < 600) this.properties.boardSize = 280;
  },

  createDOM() {
    // Create main elements
    this.elements.puzzle = document.createElement('div');
    this.elements.puzzleBoard = document.createElement('div');

    this.elements.header = document.createElement('div');
    const headerLogo = document.createElement('div');
    this.elements.timeCounter = document.createElement('div');
    this.elements.movesCount = document.createElement('div');
    const puzzleWrapper = document.createElement('div');
    this.elements.resultBoard = document.createElement('div');
    const buttonsMenu = document.createElement('div');
    const audio = document.createElement('audio');
    this.elements.paused = document.createElement('div');
    this.elements.startScreen = document.createElement('div');
    this.elements.blackout = document.createElement('div');

    this.elements.burgerMenu = document.createElement('button');
    const burgerMiddle = document.createElement('span');
    this.elements.burgerMenu.appendChild(burgerMiddle);

    // add classes to main elements
    this.elements.puzzle.classList.add('puzzle');
    this.elements.puzzleBoard.classList.add('puzzle-board');
    this.elements.header.classList.add('header');
    headerLogo.classList.add('header-logo');
    this.elements.timeCounter.classList.add('time-counter');
    this.elements.movesCount.classList.add('moves-counter');
    puzzleWrapper.classList.add('puzzle-wrapper');
    this.elements.resultBoard.classList.add('best-results');
    buttonsMenu.classList.add('buttons-menu');
    audio.classList.add('audio-twink');
    this.elements.paused.className = ('paused');
    this.elements.startScreen.className = ('start-screen');
    this.elements.blackout.className = 'blackout';
    this.elements.burgerMenu.className = 'header__burger';

    // add custom styles to board
    this.elements.puzzleBoard.style.width = `${this.properties.boardSize}px`;
    this.elements.puzzleBoard.style.height = `${this.properties.boardSize}px`;
    this.elements.header.style.width = `${this.properties.boardSize}px`;

    // add inner text and attributes
    headerLogo.textContent = 'Gem Puzzle';
    this.elements.timeCounter.innerHTML = `Time: <span>${addZero(this.timer.hours)}</span>:<span>${addZero(this.timer.minutes)}</span>:<span>${addZero(this.timer.seconds)}</span>`;
    this.elements.movesCount.innerHTML = `Moves: <span>${this.properties.movesCounter}</span>`;
    audio.setAttribute('src', 'assets/tink.wav');
    this.elements.paused.innerHTML = '<span>Paused</span>';

    // add to DOM
    this.elements.header.appendChild(headerLogo);
    this.elements.header.appendChild(this.elements.timeCounter);
    this.elements.header.appendChild(this.elements.movesCount);
    this.elements.header.appendChild(this.elements.burgerMenu);
    this.elements.puzzle.appendChild(this.elements.blackout);
    this.elements.puzzle.appendChild(this.elements.header);
    this.elements.puzzle.appendChild(puzzleWrapper);
    puzzleWrapper.appendChild(this.elements.resultBoard);
    puzzleWrapper.appendChild(this.elements.puzzleBoard);
    buttonsMenu.appendChild(this.createMenuButtons());
    puzzleWrapper.appendChild(buttonsMenu);
    this.elements.startScreen.appendChild(this.openStartScreen());
    this.elements.paused.appendChild(this.createPausedButtons());
    document.body.appendChild(this.elements.puzzle);
    document.body.appendChild(audio);
    document.body.appendChild(this.elements.paused);
    document.body.appendChild(this.elements.startScreen);
  },

  openStartScreen() {
    this.elements.startScreen.innerHTML = '<span>New Game</span>';
    this.elements.startScreen.classList.add('start-screen--active');

    this.elements.burgerMenu.disabled = true;

    const fragment = document.createDocumentFragment();

    const boardSize = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];
    const puzzleType = ['Numbers', 'Picture'];

    // create boardSize buttons
    const boardSizeFragment = document.createElement('ul');
    boardSizeFragment.className = 'board-size-list';

    boardSize.forEach((key) => {
      const keyElement = document.createElement('button');
      const keyElementWrapper = document.createElement('li');
      keyElementWrapper.appendChild(keyElement);

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('start-screen__btn');
      keyElement.classList.add('board-size__btn');

      keyElement.textContent = key;

      this.elements.boardSizeBtns.push(keyElement);
      boardSizeFragment.appendChild(keyElementWrapper);
    });
    for (let i = 0; i < this.elements.boardSizeBtns.length; i += 1) {
      this.elements.boardSizeBtns[i].addEventListener('click', () => {
        this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
        this.elements.boardSizeBtns[i].classList.add('board-size__btn--active');
        this.properties.puzzleSize = i + 3;
      });
    }

    // Set default size to active
    this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
    // create puzzle type buttons
    const puzzleTypeFragment = document.createElement('ul');
    puzzleTypeFragment.className = 'puzzle-type-list';

    puzzleType.forEach((key) => {
      const keyElement = document.createElement('button');
      const keyElementWrapper = document.createElement('li');
      keyElementWrapper.appendChild(keyElement);

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('start-screen__btn');
      keyElement.classList.add('puzzle-type__btn');

      keyElement.textContent = key;
      if (key === 'Numbers') keyElement.classList.add('puzzle-type__btn--active');

      this.elements.puzzleTypeBtns.push(keyElement);
      puzzleTypeFragment.appendChild(keyElementWrapper);
    });
    // iterate over buttons and add eventlistener on clicks
    this.elements.puzzleTypeBtns.forEach((key) => {
      key.addEventListener('click', () => {
        if (key === this.elements.puzzleTypeBtns[0]) {
          this.elements.puzzleTypeBtns[1].classList.remove('puzzle-type__btn--active');
          this.properties.picturePuzzle = false;
          key.classList.add('puzzle-type__btn--active');
        } else {
          this.elements.puzzleTypeBtns[0].classList.remove('puzzle-type__btn--active');
          this.properties.picturePuzzle = true;
          key.classList.add('puzzle-type__btn--active');
        }
      });
    });
    // Create play button

    const playBtn = document.createElement('button');
    playBtn.setAttribute('type', 'button');
    playBtn.classList.add('start-screen__btn');
    playBtn.classList.add('play-btn');
    playBtn.textContent = 'Play';

    playBtn.addEventListener('click', () => {
      this.playGame();
      this.elements.burgerMenu.disabled = false;
    });

    // Create resume saves game button

    this.elements.resumeSavedGame = document.createElement('button');
    this.elements.resumeSavedGame.setAttribute('type', 'button');
    this.elements.resumeSavedGame.className = 'resume-saved';
    this.elements.resumeSavedGame.textContent = 'Resume Saved Game';

    if (localStorage.getItem('savedGame')) {
      this.elements.resumeSavedGame.textContent = 'Resume Saved Game';
      this.elements.resumeSavedGame.classList.remove('resume-saved--disabled');

      this.elements.resumeSavedGame.addEventListener('click', this.resumeSavedGame);
    } else {
      this.elements.resumeSavedGame.textContent = 'No Saved Games Yet';
      this.elements.resumeSavedGame.classList.add('resume-saved--disabled');

      this.elements.resumeSavedGame.removeEventListener('click', this.resumeSavedGame);
    }
    // construct the fragment
    fragment.appendChild(boardSizeFragment);
    fragment.appendChild(puzzleTypeFragment);
    fragment.appendChild(playBtn);
    fragment.appendChild(this.elements.resumeSavedGame);
    return fragment;
  },

  createMenuButtons() {
    const fragment = document.createElement('ul');
    fragment.classList.add('buttons-menu');
    const menuBtns = ['sound', 'restart game', 'save game', 'solve puzzle', 'pause', 'quit'];

    menuBtns.forEach((key) => {
      const keyElement = document.createElement('button');
      const keyElementWrapper = document.createElement('li');
      keyElementWrapper.appendChild(keyElement);
      // Add atributes and classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('btn');

      switch (key) {
        case 'sound':
          if (this.properties.audio) {
            keyElement.textContent = 'sound on';
            keyElement.style.backgroundColor = '';
          } else {
            keyElement.textContent = 'sound off';
            keyElement.style.backgroundColor = 'grey';
          }
          keyElement.addEventListener('click', () => {
            this.properties.audio = !this.properties.audio;
            if (this.properties.audio) {
              keyElement.textContent = 'sound on';
              keyElement.style.backgroundColor = '';
            } else {
              keyElement.textContent = 'sound off';
              keyElement.style.backgroundColor = 'grey';
            }
          });
          break;
        default:
          keyElement.textContent = key;
          break;
      }

      fragment.appendChild(keyElementWrapper);
    });
    return fragment;
  },
  createPausedButtons() {
    const fragment = document.createElement('ul');
    fragment.classList.add('paused-menu');
    const pausedBtns = ['resume', 'restart', 'save game', 'quit'];
    pausedBtns.forEach((key) => {
      const keyElement = document.createElement('button');
      const keyElementWrapper = document.createElement('li');
      keyElementWrapper.appendChild(keyElement);
      // Add atributes and classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('btn-paused');

      switch (key) {
        case 'resume':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.elements.blackout.style.display = 'none';
            this.elements.paused.classList.remove('paused--active');
            if (this.properties.firstMove) this.properties.timer = true;
            setTimeout(() => {
              this.timeCount();
            }, 1000);
          });
          break;
        case 'restart':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.restart();
            this.elements.paused.classList.remove('paused--active');
          });
          break;
        case 'save game':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.saveGame();
          });
          break;
        case 'quit':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.elements.paused.classList.remove('paused--active');
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
            this.properties.puzzleSize = 4;
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
            this.elements.startScreen.classList.add('start-screen--active');
            this.resetCounters();
            this.endGame();
          });
          break;
        default:
          keyElement.textContent = key;
          break;
      }
      fragment.appendChild(keyElementWrapper);
    });
    return fragment;
  },

  createCells() {
    const fragment = document.createDocumentFragment();
    const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    if (!this.properties.currentImg) {
      this.properties.currentImg = Math.floor(Math.random() * 10);
    }
    const cellsNum = (this.properties.puzzleSize ** 2) - 1;
    for (let i = 0; i < cellsNum; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'puzzle-cell';
      this.properties.cellSize = this.properties.boardSize / this.properties.puzzleSize;
      cell.setAttribute('draggable', 'true');

      const leftPosition = i % this.properties.puzzleSize;
      const topPosition = (i - leftPosition) / this.properties.puzzleSize;
      // Set cell type
      if (this.properties.picturePuzzle === false) {
        cell.innerHTML = i + 1;
        cell.style.width = `${this.properties.cellSize - 10}px`;
        cell.style.height = `${this.properties.cellSize - 10}px`;
      } else if (this.properties.picturePuzzle === true) {
        cell.style.width = `${this.properties.cellSize - 5}px`;
        cell.style.height = `${this.properties.cellSize - 5}px`;
        cell.style.margin = '2px';
        cell.style.backgroundImage = `url("assets/${images[this.properties.currentImg]}")`;
        cell.style.backgroundSize = `${this.properties.boardSize}px ${this.properties.boardSize}px`;
        cell.style.backgroundPositionX = `-${leftPosition * this.properties.cellSize}px`;
        cell.style.backgroundPositionY = `-${topPosition * this.properties.cellSize}px`;
      }

      // put cell into array
      this.elements.cards.push({
        left: leftPosition,
        top: topPosition,
        startLeft: leftPosition,
        startTop: topPosition,
        element: cell, // dom element
        value: i + 1,
      });

      cell.style.left = `${leftPosition * this.properties.cellSize}px`;
      cell.style.top = `${topPosition * this.properties.cellSize}px`;

      // Move cells on click
      cell.addEventListener('click', () => {
        this.moveCell(i);
        this.playAudio();
        this.isFinished();
        //  start timer on first move
        if (!this.properties.timer) {
          this.properties.timer = true;
          setTimeout(() => {
            this.timeCount();
          }, 1000);
        }
      });

      // Move cells on drag
      cell.addEventListener('dragstart', () => this.dragStart(i));
      cell.addEventListener('dragover', this.dragOver);
      cell.addEventListener('dragend', () => this.dragEnd(i));

      fragment.appendChild(cell);
    }
    this.createEmptyCell();
    fragment.appendChild(this.emptyCell.element);
    return fragment;
  },

  createEmptyCell() {
    const cellNum = (this.properties.puzzleSize ** 2) - 1;
    this.emptyCell.top = cellNum % this.properties.puzzleSize;
    this.emptyCell.left = cellNum % this.properties.puzzleSize;
    this.emptyCell.element = document.createElement('div');
    this.emptyCell.element.classList.add('empty-cell');

    this.emptyCell.element.style.width = `${this.properties.cellSize - 10}px`;
    this.emptyCell.element.style.height = `${this.properties.cellSize - 10}px`;

    this.emptyCell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
    this.emptyCell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;

    this.emptyCell.element.addEventListener('dragover', this.dragOver);
    this.emptyCell.element.addEventListener('dragenter', this.dragEnter);
    this.emptyCell.element.addEventListener('dragleave', this.dragLeave);
    this.emptyCell.element.addEventListener('drop', this.drop);
  },

  moveCell(index) {
    const cell = this.elements.cards[index];

    // check if current cell is adjecent and can be moved
    const leftDifference = Math.abs(this.emptyCell.left - cell.left);
    const topDifference = Math.abs(this.emptyCell.top - cell.top);

    if (leftDifference + topDifference > 1) {
      return;
    }
    // move cell to new address
    cell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
    cell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;
    // create temporary coordinates for previous cell address
    const currentCellLeft = this.emptyCell.left;
    const currentCellTop = this.emptyCell.top;
    // change empty cell address
    this.elements.moves.push([this.emptyCell.left, this.emptyCell.top]);
    this.emptyCell.left = cell.left;
    this.emptyCell.top = cell.top;
    // update current cell address
    this.elements.cards[index].left = currentCellLeft;
    this.elements.cards[index].top = currentCellTop;
    // update empty cell position
    this.emptyCell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
    this.emptyCell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;
    // update moves counter
    this.properties.movesCounter += 1;
    this.elements.movesCount.innerHTML = `Moves: <span>${this.properties.movesCounter}</span>`;
    if (!this.properties.firstMove) this.properties.firstMove = true;
  },

  dragStart(index) {
    const cell = this.elements.cards[index];
    setTimeout(() => cell.element.classList.add('invisible'), 0);
    // check if current cell is adjecent and can be moved
    const leftDifference = Math.abs(this.emptyCell.left - cell.left);
    const topDifference = Math.abs(this.emptyCell.top - cell.top);

    if (leftDifference + topDifference <= 1) {
      this.properties.isAdjacent = true;
    }
  },

  dragEnd(index) {
    const cell = this.elements.cards[index];
    // check if element can be moved
    if (this.properties.canDrop && this.properties.isAdjacent) {
      // move cell to new address
      cell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
      cell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;
      // create temporary coordinates for previous cell address
      const currentCellLeft = this.emptyCell.left;
      const currentCellTop = this.emptyCell.top;
      // change empty cell address
      this.elements.moves.push([this.emptyCell.left, this.emptyCell.top]);
      this.emptyCell.left = cell.left;
      this.emptyCell.top = cell.top;
      // update current cell address
      this.elements.cards[index].left = currentCellLeft;
      this.elements.cards[index].top = currentCellTop;
      // update empty cell position
      this.emptyCell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
      this.emptyCell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;
      // update moves counter
      this.properties.movesCounter += 1;
      this.elements.movesCount.innerHTML = `Moves: <span>${this.properties.movesCounter}</span>`;
      // start move counter
      if (!this.properties.firstMove) {
        this.properties.firstMove = true;
        this.properties.timer = true;
        setTimeout(() => {
          this.timeCount();
        }, 1000);
      }
    }
    cell.element.classList.remove('invisible');
    this.properties.isAdjacent = false;
    this.properties.canDrop = false;

    this.isFinished();
  },

  dragOver(e) {
    e.preventDefault();
  },

  dragEnter() {
    puzzleGame.properties.canDrop = true;
  },

  dragLeave() {
    puzzleGame.properties.canDrop = false;
  },

  mixCards() {
    // determine number of steps to switch the cards
    this.elements.moves = [];
    let minSteps = 0;
    let maxSteps = 0;
    switch (this.properties.puzzleSize) {
      case 3:
        minSteps = 30;
        maxSteps = 60;
        break;
      case 4:
        minSteps = 50;
        maxSteps = 130;
        break;
      case 5:
        minSteps = 80;
        maxSteps = 210;
        break;
      case 6:
        minSteps = 100;
        maxSteps = 250;
        break;
      case 7:
        minSteps = 150;
        maxSteps = 270;
        break;
      default:
        minSteps = 200;
        maxSteps = 400;
    }
    const steps = Math.ceil(Math.random() * (maxSteps - minSteps) + minSteps);
    for (let i = 0; i < steps; i += 1) {
      const possibleMoves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      const randomMove = Math.floor(Math.random() * 4);
      const newLeft = parseInt(possibleMoves[randomMove][0], 10)
      + parseInt(this.emptyCell.left, 10);
      const newTop = parseInt(possibleMoves[randomMove][1], 10) + parseInt(this.emptyCell.top, 10);
      const check = newLeft < this.properties.puzzleSize
                    && newLeft > -1
                    && newTop < this.properties.puzzleSize
                    && newTop > -1;
      if (check) {
        for (let j = 0; j < this.elements.cards.length; j += 1) {
          if (this.elements.cards[j].left === newLeft
              && this.elements.cards[j].top === newTop) {
            const activeCell = this.elements.cards[j];
            this.elements.cards[j].left = this.emptyCell.left;
            this.elements.cards[j].top = this.emptyCell.top;
            this.elements.moves.push([this.emptyCell.left, this.emptyCell.top]);
            this.emptyCell.left = newLeft;
            this.emptyCell.top = newTop;
            activeCell.element.style.left = `${activeCell.left * this.properties.cellSize}px`;
            activeCell.element.style.top = `${activeCell.top * this.properties.cellSize}px`;
            // update empty cell position
            this.emptyCell.element.style.left = `${this.emptyCell.left * this.properties.cellSize}px`;
            this.emptyCell.element.style.top = `${this.emptyCell.top * this.properties.cellSize}px`;
          }
        }
      }
    }
  },

  refactorMoves() {
    if (this.elements.moves.length > 2) {
      let currentIndex = this.elements.moves.length - 1;
      let compareIndex = this.elements.moves.length - 3;
      while (compareIndex >= 0) {
        if (this.elements.moves[currentIndex][0] === this.elements.moves[compareIndex][0]
            && this.elements.moves[currentIndex][1] === this.elements.moves[compareIndex][1]) {
          this.elements.moves.splice(compareIndex - 1, 2);
          currentIndex -= 2;
          compareIndex -= 2;
        } else {
          currentIndex -= 1;
          compareIndex -= 1;
        }
      }
    }
  },

  isFinished() {
    const hasWon = this.elements.cards.every((key) => {
      const cell = key;
      const cellPosition = (cell.top * this.properties.puzzleSize + cell.left) + 1;
      return cell.value === cellPosition;
    });
    if (hasWon) {
      this.properties.timer = false;
      this.properties.firstMove = false;

      this.setBestResults();

      setTimeout(() => {
        this.createYouWinMsg();
      }, 1000);
    }
  },
  createYouWinMsg() {
    // remove oled best results
    while (this.elements.resultBoard.children.length > 0) {
      this.elements.resultBoard.children[0].remove();
    }
    // Create the popup
    const youWinPopUp = document.createElement('div');
    const youWinWrapper = document.createElement('div');
    const youWinPopUpMsg = document.createElement('p');

    youWinPopUp.className = 'you-win-popup';
    youWinWrapper.className = 'you-win-popup__wrapper';
    youWinPopUpMsg.className = 'you-win-popup__message';

    youWinPopUpMsg.innerHTML = `<span>You Win!</span> You solved the puzzle in:<br> ${addZero(this.timer.hours)}:${addZero(this.timer.minutes)}:${addZero(this.timer.seconds)} and ${this.properties.movesCounter} steps.`;

    youWinWrapper.appendChild(youWinPopUpMsg);

    // Create buttons
    const youWinBtns = ['play again', 'quit'];
    youWinBtns.forEach((key) => {
      const keyElement = document.createElement('button');
      keyElement.className = 'you-win-popup__btn';
      keyElement.classList.add('btn-paused');
      keyElement.textContent = key;

      switch (key) {
        case 'quit':
          keyElement.addEventListener('click', () => {
            document.body.removeChild(youWinPopUp);
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
            this.properties.puzzleSize = 4;
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
            this.elements.startScreen.classList.add('start-screen--active');
            this.resetCounters();
            this.endGame();
          });
          break;
        case 'play again':
          keyElement.addEventListener('click', () => {
            document.body.removeChild(youWinPopUp);
            this.restart();
          });
          break;
        default:
          keyElement.textContent = key;
      }
      return youWinWrapper.appendChild(keyElement);
    });
    youWinPopUp.appendChild(youWinWrapper);
    document.body.appendChild(youWinPopUp);
    this.properties.timer = false;

    // load new best results
    this.loadBestResults();
  },

  setBestResults() {
    const currentMoves = this.properties.movesCounter;
    const currentHours = this.timer.hours;
    const currentMinutes = this.timer.minutes;
    const currentSeconds = this.timer.seconds + 1;

    const newBestResult = [currentMoves, `${addZero(currentHours)}:${addZero(currentMinutes)}:${addZero(currentSeconds)}`,
      currentHours * 60 + currentMinutes * 60 + currentSeconds * 60];

    if (this.elements.bestResults.length < 10) {
      this.elements.bestResults.push(newBestResult);
    } else {
      // find the biggest current result
      let biggestNum = parseInt(this.elements.bestResults[0][0], 10);
      for (let i = 0; i < this.elements.bestResults.length; i += 1) {
        const currentNum = parseInt(this.elements.bestResults[i][0], 10);
        if (currentNum > biggestNum) biggestNum = currentNum;
      }
      // check if new result is better and replace if it is
      if (currentMoves < biggestNum) this.elements.bestResults.splice(9, 1, newBestResult);
    }

    const bestResultsString = this.elements.bestResults.join('|');
    localStorage.setItem('bestResults', bestResultsString);
  },

  loadBestResults() {
    this.elements.resultBoard.innerHTML = 'Your 10 best results';
    if (localStorage.getItem('bestResults')) {
      const bestResults = localStorage.getItem('bestResults').split('|');
      const bestResultsArr = bestResults
        .map((key) => key.split(','))
        .sort((a, b) => {
          if (parseInt(a[0], 10) > parseInt(b[0], 10)) return 1;
          return -1;
        });
      this.elements.bestResults = bestResultsArr;
      // Load results on page
      const resultList = document.createElement('ul');
      resultList.className = 'result-list';
      for (let i = 0; i < this.elements.bestResults.length; i += 1) {
        const resultListElement = document.createElement('li');
        const resultString = `${i + 1}. Steps: ${this.elements.bestResults[i][0]} / Time: ${this.elements.bestResults[i][1]}`;
        resultListElement.textContent = resultString;
        resultList.appendChild(resultListElement);
      }
      this.elements.resultBoard.appendChild(resultList);
    }
  },

  solvePuzzle() {
    if (this.elements.moves.length > 0) {
      // make nemu buttons disabled exept for quit and restart
      this.elements.menuButtons.forEach((key) => {
        if (key.textContent !== 'quit') {
          const element = key;
          element.disabled = true;
        }
      });
      const current = this.elements.moves.pop();
      const moveX = current[0];
      const moveY = current[1];

      for (let j = 0; j < this.elements.cards.length; j += 1) {
        const activeCell = this.elements.cards[j];
        if (activeCell.left === moveX && activeCell.top === moveY) {
          activeCell.left = this.emptyCell.left;
          activeCell.top = this.emptyCell.top;

          activeCell.element.style.left = `${activeCell.left * this.properties.cellSize}px`;
          activeCell.element.style.top = `${activeCell.top * this.properties.cellSize}px`;

          this.emptyCell.left = moveX;
          this.emptyCell.top = moveY;
        }
      }
      setTimeout(() => {
        this.solvePuzzle();
      }, 300);
    } else {
      this.elements.menuButtons.forEach((key) => {
        const element = key;
        element.disabled = false;
      });
      this.elements.blackout.style.display = 'block';
      setTimeout(() => {
        this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
        this.properties.puzzleSize = 4;
        this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
        this.elements.startScreen.classList.add('start-screen--active');
        this.resetCounters();
        this.endGame();
      }, 2000);
    }
  },
  playGame() {
    if (this.elements.puzzleTypeBtns[0].className === 'start-screen__btn puzzle-type__btn puzzle-type__btn--active') {
      this.properties.picturePuzzle = false;
    } else {
      this.properties.picturePuzzle = true;
    }
    this.elements.puzzleBoard.appendChild(this.createCells());
    this.mixCards();
    this.elements.startScreen.classList.remove('start-screen--active');
    this.elements.blackout.style.display = 'none';
  },
  playAudio() {
    let audio;
    if (this.properties.audio) {
      audio = document.querySelector('.audio-twink');
      audio.play();
    }
  },
  timeCount() {
    const countTime = () => {
      if (this.properties.timer) {
        this.timer.seconds += 1;
        // when to incriment
        if (this.timer.seconds / 60 === 1) {
          this.timer.seconds = 0;
          this.timer.minutes += 1;
          if (this.timer.minutes / 60 === 1) {
            this.timer.minutes = 0;
            this.timer.hours += 1;
          }
        }
        this.elements.timeCounter.innerHTML = `Time: <span>${addZero(this.timer.hours)}</span>:<span>${addZero(this.timer.minutes)}</span>:<span>${addZero(this.timer.seconds)}</span>`;
        setTimeout(countTime, 1000);
      }
    };
    countTime();
  },

  endGame() {
    this.elements.moves = [];
    this.elements.cards = [];
    while (this.elements.puzzleBoard.children.length > 0) {
      this.elements.puzzleBoard.children[0].remove();
    }
    this.emptyCell.top = 0;
    this.emptyCell.left = 0;
    this.emptyCell.element = null;
    this.properties.firstMove = false;
    this.properties.currentImg = null;
    this.elements.blackout.style.display = 'block';
    this.elements.resumeSavedGame.removeEventListener('click', this.resumeSavedGame);

    if (localStorage.getItem('savedGame')) {
      this.elements.resumeSavedGame.textContent = 'Resume Saved Game';
      this.elements.resumeSavedGame.classList.remove('resume-saved--disabled');

      this.elements.resumeSavedGame.addEventListener('click', this.resumeSavedGame);
    } else {
      this.elements.resumeSavedGame.removeEventListener('click', this.resumeSavedGame);
      this.elements.resumeSavedGame.textContent = 'No Saved Games Yet';
      this.elements.resumeSavedGame.classList.add('resume-saved--disabled');
    }
  },
  restart() {
    this.endGame();
    setTimeout(() => {
      this.elements.puzzleBoard.appendChild(this.createCells());
    }, 0);
    this.elements.blackout.style.display = 'none';
    this.resetCounters();
    setTimeout(() => {
      this.mixCards();
    }, 200);
  },

  resetCounters() {
    this.properties.timer = false;
    this.timer.hours = 0;
    this.timer.minutes = 0;
    this.timer.seconds = 0;
    this.elements.timeCounter.innerHTML = `Time: <span>${addZero(this.timer.hours)}</span>:<span>${addZero(this.timer.minutes)}</span>:<span>${addZero(this.timer.seconds)}</span>`;
    this.properties.movesCounter = 0;
    this.elements.movesCount.innerHTML = `Moves: <span>${this.properties.movesCounter}</span>`;
  },

  saveGame() {
    localStorage.removeItem('savedGame');
    const size = this.properties.puzzleSize;
    const type = this.properties.picturePuzzle;
    const hoursTimer = this.timer.hours;
    const minutesTimer = this.timer.minutes;
    const secondsTimer = this.timer.seconds;
    const emptyCellLeft = this.emptyCell.left;
    const emptyCellTop = this.emptyCell.top;
    const movesCount = this.properties.movesCounter;
    const img = this.properties.currentImg;
    let movesRoute = '';

    this.elements.moves.forEach((key) => {
      movesRoute += `${key}/`;
    });

    const saveGameStringInfo = `${size}|${type}|${hoursTimer}|${minutesTimer}|${secondsTimer}|${emptyCellLeft}|${emptyCellTop}|${movesCount}|${movesRoute}|${img}`;
    localStorage.setItem('savedGame', saveGameStringInfo);

    // save game popup
    const savedGamePopup = document.createElement('div');
    savedGamePopup.className = 'saved-game-popup';
    const message = document.createElement('p');
    message.className = 'saved-game-popup__message';
    message.textContent = 'Your current game was saved!';
    const btn = document.createElement('button');
    btn.className = 'saved-game-popup__btn';
    btn.classList.add('btn');
    btn.textContent = 'Close';

    savedGamePopup.appendChild(message);
    savedGamePopup.appendChild(btn);

    document.body.appendChild(savedGamePopup);

    btn.addEventListener('click', () => {
      document.body.removeChild(savedGamePopup);
    });
  },

  loadSavedGame() {
    const savedGame = localStorage.getItem('savedGame');
    const savedGameInfoArr = savedGame.split('|');

    const [size, type, hoursTimer, minutesTimer, secondsTimer, emptyCellLeft,
      emptyCellTop, movesCount, moves, currentImg] = savedGameInfoArr;

    const typeToBool = (type === 'false') ? 0 : 1;

    this.properties.puzzleSize = parseInt(size, 10);
    this.properties.picturePuzzle = Boolean(typeToBool);
    this.timer.hours = parseInt(hoursTimer, 10);
    this.timer.minutes = parseInt(minutesTimer, 10);
    this.timer.seconds = parseInt(secondsTimer, 10);
    this.properties.movesCounter = parseInt(movesCount, 10);
    this.properties.currentImg = parseInt(currentImg, 10);

    puzzleGame.elements.puzzleBoard.appendChild(puzzleGame.createCells());

    const movesRoute = moves.split('/');
    // remove the last one as it's empty
    movesRoute.pop();
    const savedMoves = [];
    movesRoute.forEach((key) => {
      const splitArr = key.split(',');
      const elementsToNumbers = splitArr.map((el) => parseInt(el, 10));
      savedMoves.push(elementsToNumbers);
    });

    // load the empty cell position
    const lastMove = [];
    lastMove.push(parseInt(emptyCellLeft, 10));
    lastMove.push(parseInt(emptyCellTop, 10));
    savedMoves.push(lastMove);

    // load the saved board
    savedMoves.forEach((key) => {
      const moveX = key[0];
      const moveY = key[1];

      for (let i = 0; i < this.elements.cards.length; i += 1) {
        const activeCell = this.elements.cards[i];
        if (activeCell.left === moveX && activeCell.top === moveY) {
          activeCell.left = this.emptyCell.left;
          activeCell.top = this.emptyCell.top;

          activeCell.element.style.left = `${activeCell.left * this.properties.cellSize}px`;
          activeCell.element.style.top = `${activeCell.top * this.properties.cellSize}px`;

          this.emptyCell.left = moveX;
          this.emptyCell.top = moveY;
        }
      }
    });

    // Update counters
    this.elements.movesCount.innerHTML = `Moves: <span>${this.properties.movesCounter}</span>`;
    this.elements.timeCounter.innerHTML = `Time: <span>${addZero(this.timer.hours)}</span>:<span>${addZero(this.timer.minutes)}</span>:<span>${addZero(this.timer.seconds)}</span>`;

    // Copy the moves to current moves array
    savedMoves.forEach((key) => this.elements.moves.push(key));
  },
  // callback for click event
  resumeSavedGame() {
    puzzleGame.loadSavedGame();
    puzzleGame.elements.startScreen.classList.remove('start-screen--active');
    puzzleGame.elements.blackout.style.display = 'none';
  },

  burgerMenu() {
    const burgerBtn = this.elements.burgerMenu;

    burgerBtn.addEventListener('click', () => {
      if (this.elements.burgerMenu.className === 'header__burger active') {
        this.elements.burgerMenu.classList.remove('active');
        this.elements.blackout.style.display = 'none';
        document.body.removeChild(this.elements.mobileMenuPopup);
      } else {
        this.elements.burgerMenu.classList.add('active');
        this.elements.blackout.style.display = 'block';
        this.properties.timer = false;
        this.createMobileMenu();
      }
    });
  },

  createMobileMenu() {
    this.elements.mobileMenuPopup = document.createElement('div');
    this.elements.mobileMenuPopup.className = 'mobile-menu-popup';
    const mobileMenuHeader = document.createElement('p');
    mobileMenuHeader.className = 'mobile-menu__header';
    mobileMenuHeader.textContent = 'Menu';
    this.elements.mobileMenuPopup.appendChild(mobileMenuHeader);

    const burgerBtns = ['sound', 'resume', 'restart', 'save game', 'solve puzzle', 'best results', 'quit'];
    const fragment = document.createElement('ul');
    fragment.classList.add('mobile-menu');
    burgerBtns.forEach((key) => {
      const keyElement = document.createElement('button');
      const keyElementWrapper = document.createElement('li');
      keyElementWrapper.appendChild(keyElement);
      // Add atributes and classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('mobile-menu__btn');

      switch (key) {
        case 'sound':
          if (this.properties.audio) {
            keyElement.textContent = 'sound on';
            keyElement.style.backgroundColor = '';
          } else {
            keyElement.textContent = 'sound off';
            keyElement.style.backgroundColor = 'grey';
          }
          keyElement.addEventListener('click', () => {
            this.properties.audio = !this.properties.audio;
            if (this.properties.audio) {
              keyElement.textContent = 'sound on';
              keyElement.style.backgroundColor = '';
            } else {
              keyElement.textContent = 'sound off';
              keyElement.style.backgroundColor = 'grey';
            }
          });
          break;
        case 'resume':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            if (this.properties.firstMove) this.properties.timer = true;
            document.body.removeChild(this.elements.mobileMenuPopup);
            this.elements.burgerMenu.classList.remove('active');
            this.elements.blackout.style.display = 'none';
            setTimeout(() => {
              this.timeCount();
            }, 1000);
          });
          break;
        case 'restart':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.restart();
            document.body.removeChild(this.elements.mobileMenuPopup);
            this.elements.burgerMenu.classList.remove('active');
            this.elements.blackout.style.display = 'none';
          });
          break;
        case 'save game':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.saveGame();
          });
          break;
        case 'solve puzzle':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.properties.timer = false;
            this.solvePuzzle();
            document.body.removeChild(this.elements.mobileMenuPopup);
            this.elements.burgerMenu.classList.remove('active');
            this.elements.blackout.style.display = 'none';
          });
          break;
        case 'best results':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.loadBestResultsMobile();
          });
          break;
        case 'quit':
          keyElement.textContent = key;
          keyElement.addEventListener('click', () => {
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.remove('board-size__btn--active');
            this.properties.puzzleSize = 4;
            this.elements.boardSizeBtns[this.properties.puzzleSize - 3].classList.add('board-size__btn--active');
            this.elements.startScreen.classList.add('start-screen--active');
            this.resetCounters();
            this.endGame();
            document.body.removeChild(this.elements.mobileMenuPopup);
            this.elements.burgerMenu.classList.remove('active');
            this.elements.blackout.style.display = 'none';
          });
          break;
        default:
          keyElement.textContent = key;
          break;
      }
      fragment.appendChild(keyElementWrapper);
    });
    this.elements.mobileMenuPopup.appendChild(fragment);
    document.body.appendChild(this.elements.mobileMenuPopup);
  },

  loadBestResultsMobile() {
    this.elements.mobileBestResults = document.createElement('div');
    this.elements.mobileBestResults.className = 'mobile-best-results';
    const mobileMenuHeader = document.createElement('p');
    mobileMenuHeader.className = 'mobile-menu__header';
    mobileMenuHeader.textContent = 'Best results';
    this.elements.mobileBestResults.appendChild(mobileMenuHeader);

    if (localStorage.getItem('bestResults')) {
      const bestResults = localStorage.getItem('bestResults').split('|');
      const bestResultsArr = bestResults
        .map((key) => key.split(','))
        .sort((a, b) => {
          if (parseInt(a[0], 10) > parseInt(b[0], 10)) return 1;
          return -1;
        });
      this.elements.bestResults = bestResultsArr;
      // Load results on page
      const resultList = document.createElement('ul');
      resultList.className = 'mobile-result-list';
      for (let i = 0; i < this.elements.bestResults.length; i += 1) {
        const resultListElement = document.createElement('li');
        const resultString = `${i + 1}. Steps: ${this.elements.bestResults[i][0]} / Time: ${this.elements.bestResults[i][1]}`;
        resultListElement.textContent = resultString;
        resultList.appendChild(resultListElement);
      }
      this.elements.mobileBestResults.appendChild(resultList);
    }

    const mobileBtn = document.createElement('button');
    mobileBtn.setAttribute('type', 'button');
    mobileBtn.className = 'mobile-menu__btn';

    mobileBtn.textContent = 'Close';
    mobileBtn.addEventListener('click', () => {
      document.body.removeChild(this.elements.mobileBestResults);
    });
    this.elements.mobileBestResults.appendChild(mobileBtn);
    document.body.appendChild(this.elements.mobileBestResults);
  },

  setMediaQueries() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1300) {
        puzzleGame.properties.boardSize = 600;
        this.properties.cellSize = this.properties.boardSize / this.properties.puzzleSize;
        puzzleGame.elements.puzzleBoard.style.width = `${this.properties.boardSize}px`;
        puzzleGame.elements.puzzleBoard.style.height = `${this.properties.boardSize}px`;
        this.elements.header.style.width = `${this.properties.boardSize}px`;
        this.elements.cards.forEach((key) => {
          const cell = key;
          if (this.properties.picturePuzzle === false) {
            cell.element.style.width = `${this.properties.cellSize - 10}px`;
            cell.element.style.height = `${this.properties.cellSize - 10}px`;
          } else if (this.properties.picturePuzzle === true) {
            cell.element.style.width = `${this.properties.cellSize - 5}px`;
            cell.element.style.height = `${this.properties.cellSize - 5}px`;
            cell.element.style.margin = '2px';
            cell.element.style.backgroundSize = `${this.properties.boardSize}px ${this.properties.boardSize}px`;
            cell.element.style.backgroundPositionX = `-${cell.startLeft * this.properties.cellSize}px`;
            cell.element.style.backgroundPositionY = `-${cell.startTop * this.properties.cellSize}px`;
          }
          cell.element.style.left = `${cell.left * this.properties.cellSize}px`;
          cell.element.style.top = `${cell.top * this.properties.cellSize}px`;
        });
      } else if (window.innerWidth < 1301 && window.innerWidth > 900) {
        puzzleGame.properties.boardSize = 500;
        this.properties.cellSize = this.properties.boardSize / this.properties.puzzleSize;
        puzzleGame.elements.puzzleBoard.style.width = `${this.properties.boardSize}px`;
        puzzleGame.elements.puzzleBoard.style.height = `${this.properties.boardSize}px`;
        this.elements.header.style.width = `${this.properties.boardSize}px`;
        this.elements.cards.forEach((key) => {
          const cell = key;
          if (this.properties.picturePuzzle === false) {
            cell.element.style.width = `${this.properties.cellSize - 10}px`;
            cell.element.style.height = `${this.properties.cellSize - 10}px`;
          } else if (this.properties.picturePuzzle === true) {
            cell.element.style.width = `${this.properties.cellSize - 5}px`;
            cell.element.style.height = `${this.properties.cellSize - 5}px`;
            cell.element.style.margin = '2px';
            cell.element.style.backgroundSize = `${this.properties.boardSize}px ${this.properties.boardSize}px`;
            cell.element.style.backgroundPositionX = `-${cell.startLeft * this.properties.cellSize}px`;
            cell.element.style.backgroundPositionY = `-${cell.startTop * this.properties.cellSize}px`;
          }
          cell.element.style.left = `${cell.left * this.properties.cellSize}px`;
          cell.element.style.top = `${cell.top * this.properties.cellSize}px`;
        });
      } else if (window.innerWidth < 901 && window.innerWidth > 600) {
        puzzleGame.properties.boardSize = 400;
        this.properties.cellSize = this.properties.boardSize / this.properties.puzzleSize;
        puzzleGame.elements.puzzleBoard.style.width = `${this.properties.boardSize}px`;
        puzzleGame.elements.puzzleBoard.style.height = `${this.properties.boardSize}px`;
        this.elements.header.style.width = `${this.properties.boardSize}px`;
        this.elements.cards.forEach((key) => {
          const cell = key;
          if (this.properties.picturePuzzle === false) {
            cell.element.style.width = `${this.properties.cellSize - 10}px`;
            cell.element.style.height = `${this.properties.cellSize - 10}px`;
          } else if (this.properties.picturePuzzle === true) {
            cell.element.style.width = `${this.properties.cellSize - 5}px`;
            cell.element.style.height = `${this.properties.cellSize - 5}px`;
            cell.element.style.margin = '2px';
            cell.element.style.backgroundSize = `${this.properties.boardSize}px ${this.properties.boardSize}px`;
            cell.element.style.backgroundPositionX = `-${cell.startLeft * this.properties.cellSize}px`;
            cell.element.style.backgroundPositionY = `-${cell.startTop * this.properties.cellSize}px`;
          }
          cell.element.style.left = `${cell.left * this.properties.cellSize}px`;
          cell.element.style.top = `${cell.top * this.properties.cellSize}px`;
        });
      } else {
        puzzleGame.properties.boardSize = 280;
        this.properties.cellSize = this.properties.boardSize / this.properties.puzzleSize;
        puzzleGame.elements.puzzleBoard.style.width = `${this.properties.boardSize}px`;
        puzzleGame.elements.puzzleBoard.style.height = `${this.properties.boardSize}px`;
        this.elements.header.style.width = `${this.properties.boardSize}px`;
        this.elements.cards.forEach((key) => {
          const cell = key;
          if (this.properties.picturePuzzle === false) {
            cell.element.style.width = `${this.properties.cellSize - 5}px`;
            cell.element.style.height = `${this.properties.cellSize - 5}px`;
          } else if (this.properties.picturePuzzle === true) {
            cell.element.style.width = `${this.properties.cellSize - 3}px`;
            cell.element.style.height = `${this.properties.cellSize - 3}px`;
            cell.element.style.margin = '2px';
            cell.element.style.backgroundSize = `${this.properties.boardSize}px ${this.properties.boardSize}px`;
            cell.element.style.backgroundPositionX = `-${cell.startLeft * this.properties.cellSize}px`;
            cell.element.style.backgroundPositionY = `-${cell.startTop * this.properties.cellSize}px`;
          }
          cell.element.style.left = `${cell.left * this.properties.cellSize}px`;
          cell.element.style.top = `${cell.top * this.properties.cellSize}px`;
        });
      }
    });
  },
};

window.addEventListener('DOMContentLoaded', () => {
  puzzleGame.init();
});
