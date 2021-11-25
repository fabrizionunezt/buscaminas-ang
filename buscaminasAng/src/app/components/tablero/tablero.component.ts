import { Component, OnInit } from '@angular/core';
import { Cell } from 'src/app/models/cell';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  gridSide: number = 10;
  cells: Cell[] = [];
  bombAmount: number = 20;
  isGameOver: boolean = false;

  constructor() {
    this.createBoard();
  }

  ngOnInit(): void {
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
        innerMsg: ''
      }
      if (this.cells.length >= (amountCells - this.bombAmount)) {
        cell.bomb = true;
        cell.innerMsg = '💣';
      }
      this.cells.push(cell);
    }
    this.cells.sort(() => Math.random() - 0.5);
    this.fillBombAmount();
  }

  fillBombAmount() {
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      let total = 0
      const isLeftEdge = (i % this.gridSide === 0)
      const isRightEdge = (i % this.gridSide === this.gridSide - 1)
      if (!cell.bomb) {
        if (i > 0 && !isLeftEdge && this.cells[i - 1].bomb) total++;//izquierda
        if (i > 9 && !isRightEdge && this.cells[i + 1 - this.gridSide].bomb) total++;//derecha arriba
        if (i > 9 && this.cells[i - this.gridSide].bomb) total++; //arriba
        if (i > 10 && !isLeftEdge && this.cells[i - 1 - this.gridSide].bomb) total++;//izquierda arriba
        if (i < 98 && !isRightEdge && this.cells[i + 1].bomb) total++;//derecha
        if (i < 90 && !isLeftEdge && this.cells[i - 1 + this.gridSide].bomb) total++;//izquierda abajo
        if (i < 88 && !isRightEdge && this.cells[i + 1 + this.gridSide].bomb) total++;//derecha abajo
        if (i < 89 && this.cells[i + this.gridSide].bomb) total++;//abajo
        cell.amountBombs = total;
        cell.id = i;
        this.cells[i] = cell;
      }
    };
  }

  clickCell(cell: Cell) {
    if (this.isGameOver) return
    if (cell.checked || cell.flag) return
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
      /*if (cell.id > 9 && !isRightEdge) {
        const newId = this.cells[cell.id +1 -this.gridSide].id
        const newSquare = this.cells[newId]
        this.clickCell(newSquare)
      }*/
      if (cell.id > 9) {
        const newId = this.cells[cell.id - this.gridSide].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
      /*if (cell.id > 11 && !isLeftEdge) {
        const newId = this.cells[cell.id -1 -this.gridSide].id
        const newSquare = this.cells[newId]
        this.clickCell(newSquare)
      }*/
      if (cell.id < 98 && !isRightEdge) {
        const newId = this.cells[cell.id + 1].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
      /*if (cell.id < 90 && !isLeftEdge) {
        const newId = this.cells[cell.id -1 +this.gridSide].id
        const newSquare = this.cells[newId]
        this.clickCell(newSquare)
      }
      if (cell.id < 88 && !isRightEdge) {
        const newId = this.cells[cell.id +1 +this.gridSide].id
        const newSquare = this.cells[newId]
        this.clickCell(newSquare)
      }*/
      if (cell.id < 89) {
        const newId = this.cells[cell.id + this.gridSide].id
        const newSquare = this.cells[newId]
        if (!newSquare.bomb)
          this.clickCell(newSquare)
      }
    }, 30)
  }

  gameOver() {
    console.log('GAME OVER');
    this.isGameOver = true;
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      if (cell.bomb) {
        cell.checked = true;
        this.cells[i] = cell;
      }
    }
  }

}
