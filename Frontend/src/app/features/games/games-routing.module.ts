import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { GameDetailPageComponent } from './pages/game-detail-page/game-detail-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: ':id', component: GameDetailPageComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {}
