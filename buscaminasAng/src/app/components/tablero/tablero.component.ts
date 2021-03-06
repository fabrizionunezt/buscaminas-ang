import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cell } from 'src/app/models/cell';
import { DialogMessageData } from 'src/app/models/dialogMessageData';
import { emojis } from 'src/app/shared/const/constantes';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  gridSide: number = 0;
  cellsAmount: number = 0;
  cells: Cell[] = [];
  bombAmount: number = 0;
  isGameOver: boolean = false;
  flags: number = 0;
  time: number = 0;
  timerId!: any;
  image: string = '🙂';



  constructor(private svcShared: SharedService, private router: Router) {
    this.initialize();
    this.createBoard();
  }

  ngOnInit(): void {
  }
  initialize() {
    this.bombAmount = this.svcShared.bombAmount;
    this.gridSide = this.svcShared.gridSide;
    this.cellsAmount = this.gridSide * this.gridSide;
  }

  createBoard() {
    let amountCells = this.gridSide * this.gridSide;
    for (let i = 0; i < amountCells; i++) {
      let cell: Cell = {
        amountBombs: 0,
        bomb: false,
        checked: false,
        flag: false,
        id: 0,
        innerMsg: '',
        questionMark: false
      }
      if (this.cells.length >= (amountCells - this.bombAmount)) {
        cell.bomb = true;
        cell.innerMsg = '💣';
      }
      this.cells.push(cell);
    }
    this.cells.sort(() => Math.random() - 0.5);
    this.fillBombAmount();
    this.initializeTimer();
  }

  fillBombAmount() {
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      let total = 0
      const isLeftEdge = (i % this.gridSide === 0)
      const isRightEdge = (i % this.gridSide === this.gridSide - 1)
      if (!cell.bomb) {
        if (i > 0 && !isLeftEdge && this.cells[i - 1].bomb) total++;//izquierda
        if (i > (this.gridSide - 1) && !isRightEdge && this.cells[i + 1 - this.gridSide].bomb) total++;//derecha arriba
        if (i > (this.gridSide - 1) && this.cells[i - this.gridSide].bomb) total++; //arriba
        if (i > this.gridSide && !isLeftEdge && this.cells[i - 1 - this.gridSide].bomb) total++;//izquierda arriba
        if (i < (this.cellsAmount - 2) && !isRightEdge && this.cells[i + 1].bomb) total++;//derecha
        if (i < (this.cellsAmount - this.gridSide) && !isLeftEdge && this.cells[i - 1 + this.gridSide].bomb) total++;//izquierda abajo
        if (i < (this.cellsAmount - (this.gridSide + 2)) && !isRightEdge && this.cells[i + 1 + this.gridSide].bomb) total++;//derecha abajo
        if (i < (this.cellsAmount - (this.gridSide + 1)) && this.cells[i + this.gridSide].bomb) total++;//abajo
        cell.amountBombs = total;
        cell.id = i;
        this.cells[i] = cell;
      }
    };
  }
  addFlag(event: any, cell: Cell) {
    event.preventDefault();
    if (this.isGameOver) return

    if (!cell.checked) {
      if (!cell.questionMark && cell.flag) {
        cell.flag = false;
        cell.questionMark = true;
        cell.innerMsg = ' ? ';
        this.flags--;
        return;
      }
      else if (cell.questionMark) {
        cell.innerMsg = '';
        cell.questionMark = false;
        return;
      }
    }

    if (!cell.checked && (this.flags < this.bombAmount) && !cell.questionMark) {
      if (!cell.flag) {
        cell.flag = true;
        cell.innerMsg = ' 🚩';
        this.flags++;
        this.checkForWin()
        return;
      }
    }

  }

  clickCell(cell: Cell) {
    if (this.isGameOver) return
    if (cell.checked || cell.flag || cell.questionMark) return
    if (cell.bomb) {
      this.gameOver()
    } else {
      cell.innerMsg = cell.amountBombs > 0 ? cell.amountBombs.toString() : '';
      if (cell.amountBombs == 0) {
        this.checkCell(cell)
      }
    }
    cell.checked = true;
  }
  checkCell(cell: Cell) {
    const isLeftEdge = (cell.id % this.gridSide === 0)
    const isRightEdge = (cell.id % this.gridSide === this.gridSide - 1)

    setTimeout(() => {
      if (cell.id > 0 && !isLeftEdge) {
        const newId = this.cells[cell.id - 1].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
      if (cell.id > (this.gridSide - 1)) {
        const newId = this.cells[cell.id - this.gridSide].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
      if (cell.id < (this.cellsAmount - (this.gridSide + 2)) && !isRightEdge) {
        const newId = this.cells[cell.id + 1].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
      if (cell.id < (this.cellsAmount - (this.gridSide + 2))) {
        const newId = this.cells[cell.id + this.gridSide].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
    }, 30)
  }

  async gameOver() {
    this.isGameOver = true;
    this.updateImage('exploto');
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      if (cell.bomb) {
        cell.checked = true;
        cell.innerMsg = '💣';
        this.cells[i] = cell;
      }
    }
    this.stopTimer();

    let dataDialog: DialogMessageData = {
      state: false,
      bodyMsg: 'No has podido finalizar el juego!!',
      time: this.getFinishTime(),
      title: 'Has Perdido'
    };
    let reiniciar = await this.svcShared.openDialogMensaje(dataDialog);
    if (reiniciar) {
      this.restartGame()
    } else {
      this.redirectMenu();
    }
  }

  async checkForWin() {
    let bombs = this.cells.filter(x => x.bomb);
    let match = bombs.every(x => x.flag);
    if (match) {
      this.isGameOver = true;
      this.updateImage('ganador');
      this.stopTimer();
      let dataDialog: DialogMessageData = {
        state: true,
        bodyMsg: 'Has podido finalizar el juego exitosamente!!',
        time: this.getFinishTime(),
        title: 'Felicitaciones'
      };
      let reiniciar = await this.svcShared.openDialogMensaje(dataDialog);
      if (reiniciar) {
        this.restartGame()
      } else {
        this.redirectMenu();
      }
    }


  }

  public getStylesTablero() {
    return {
      'grid-template-columns': `repeat(${this.gridSide}, 1fr)`,
      'grid-template-rows': `repeat(${this.gridSide}, 1fr)`
    };
  }
  public getStylesCells() {
    return {
      'width': `${500 / this.gridSide}px`,
    };
  }

  initializeTimer() {
    this.timerId = setInterval(() => {
      this.time++;
      this.changeImage();
    }, 1000);

  }
  stopTimer() {
    if (this.isGameOver) {
      clearInterval(this.timerId);
    }
  }

  changeImage() {
    const images = ['guino', 'sonriendo', 'asustado', 'pensando', 'revez'];
    if (this.time % 3 == 0) {
      let selected = images[Math.floor(Math.random() * images.length)];
      this.updateImage(selected);
    }

  }

  leadingZeros(value: number, size: number) {
    let num = value.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  getFinishTime() {
    var minutes = Math.floor(this.time / 60);
    var seconds = this.time - minutes * 60;
    let result = `${this.leadingZeros(minutes, 2)}:${this.leadingZeros(seconds, 2)}`;
    return result;
  }
  cleanData() {

    this.cells = [];
    this.isGameOver = false;
    this.flags = 0;
    this.time = 0;

  }

  updateImage(filter: string) {
    let emoji = emojis.filter(x => x.name == filter).pop()?.msg;
    if (emoji) {
      this.image = emoji;
    }
  }

  restartGame() {
    this.cleanData();
    this.createBoard();
  }

  redirectMenu() {
    this.router.navigateByUrl('menu');
  }
}
