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
        flag: false,
        id: i
      }
      if(this.cells.length >= (amountCells - this.bombAmount)){
        cell.bomb = true;
      }
      this.cells.push(cell);
    }
    this.cells.sort(() => Math.random() -0.5);

  }

  countBombAmount()

}
