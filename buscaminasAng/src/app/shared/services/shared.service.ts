import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageData } from 'src/app/models/dialogMessageData';
import { DialogMessageComponent } from '../components/dialog-message/dialog-message.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(public dialog: MatDialog) { }

  openDialogMensaje(data: DialogMessageData) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '600px',
      height:'600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      let menu = false;
      if(result){
        menu = result;
      }
      return result;
    });
  }
}
