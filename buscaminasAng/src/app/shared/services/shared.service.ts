import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(public dialog: MatDialog) { }

  openDialogMensaje() {
  }
}
