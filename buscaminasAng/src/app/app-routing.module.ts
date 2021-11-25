import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { TableroComponent } from './components/tablero/tablero.component';

const routes: Routes = [
  {path:'buscaminas', component: TableroComponent},
  {path:'menu', component: MenuComponent},
  {path: '', redirectTo: 'menu', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
