import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageData } from 'src/app/models/dialogMessageData';
import { DialogMessageComponent } from '../components/dialog-message/dialog-message.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  gridSide: number = 8;
  bombAmount: number = 10;
  constructor(public dialog: MatDialog) { }

  openDialogMensaje(data: DialogMessageData) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '600px',
      height:'350px',
      data: data,
    });
    return new Promise((resolve,reject)=>{
      dialogRef.afterClosed().subscribe((result:boolean) => {
        let menu = false;
        if(result){
          menu = result;
        }
        resolve(result)
      },error =>{
        reject(false);
      });
    })
    
  }
}
