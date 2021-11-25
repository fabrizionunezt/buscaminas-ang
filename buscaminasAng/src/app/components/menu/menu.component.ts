import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  difficulty: string = 'easy';
  constructor(private svcShared: SharedService, private router: Router) { }

  ngOnInit(): void {
  }

  play() {
    let gridSize = 0;
    let bombCount = 0;
    if (this.difficulty == 'easy') { 
      gridSize = 8;
      bombCount = 10;
    } else if (this.difficulty == 'medium') { 
      gridSize = 16;
      bombCount = 40;
    } else if (this.difficulty == 'hard') { 
      gridSize = 20;
      bombCount = 100;
    }
    this.svcShared.bombAmount = bombCount;
    this.svcShared.gridSide = gridSize;
    this.router.navigateByUrl('buscaminas');
  }

}
