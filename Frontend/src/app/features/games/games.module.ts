import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GameComponent } from './components/game/game.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { SharedModule } from '../../shared/shared.module';
import { GameDetailPageComponent } from './pages/game-detail-page/game-detail-page.component';

@NgModule({
  declarations: [GameListComponent, GameComponent, MainPageComponent, GameDetailPageComponent],
  imports: [CommonModule, GamesRoutingModule, SharedModule],
  exports: [GameListComponent, MainPageComponent],
})
export class GamesModule {}
