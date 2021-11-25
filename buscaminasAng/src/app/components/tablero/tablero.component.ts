import { Component, OnInit } from '@angular/core';
import { Cell } from 'src/app/models/cell';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  gridSide: number = 10;
  cells: Cell[] =[];
  bombAmount: number = 20;

  constructor() { 
    this.createBoard();
  }

  ngOnInit(): void {
  }

  createBoard(){
    let amountCells = this.gridSide*this.gridSide;
    for(let i = 0; i < amountCells; i++) {
      let cell: Cell = {
        amountBombs: 0,
        bomb: false,
        checked: false,
        flag: false
      }
      if(this.cells.length >= (amountCells - this.bombAmount)){
        cell.bomb = true;
      }
      this.cells.push(cell);
    }
    this.cells.sort(() => Math.random() -0.5);
    this.fillBombAmount();
  }

  fillBombAmount(){
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];
      let total = 0
      const isLeftEdge = (i % this.gridSide === 0)
      const isRightEdge = (i % this.gridSide === this.gridSide -1)
      if(!cell.bomb){
        if (i > 0 && !isLeftEdge && this.cells[i -1].bomb) total ++;//izquierda
        if (i > 9 && !isRightEdge && this.cells[i +1 - this.gridSide].bomb) total ++;//derecha arriba
        if (i > 9 && this.cells[i -this.gridSide].bomb) total ++; //arriba
        if (i > 10 && !isLeftEdge && this.cells[i -1 -this.gridSide].bomb) total ++;//izquierda arriba
        if (i < 98 && !isRightEdge && this.cells[i +1].bomb) total ++;//derecha
        if (i < 90 && !isLeftEdge && this.cells[i -1 +this.gridSide].bomb) total ++;//izquierda abajo
        if (i < 88 && !isRightEdge && this.cells[i +1 +this.gridSide].bomb) total ++;//derecha abajo
        if (i < 89 && this.cells[i +this.gridSide].bomb) total ++;//abajo
        cell.amountBombs = total;
        this.cells[i] = cell;
      }
    };
  }

}
