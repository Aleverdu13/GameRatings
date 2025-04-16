import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GameComponent } from './components/game/game.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { GameListComponent } from './components/game-list/game-list.component';

@NgModule({
  declarations: [GameListComponent, GameComponent, MainPageComponent],
  imports: [CommonModule, GamesRoutingModule],
  exports: [MainPageComponent],
})
export class GamesModule {}
