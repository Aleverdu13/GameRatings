import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { By } from '@angular/platform-browser';
import { Game } from '../../../../interfaces/game.interface';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  const mockGame: Game = {
    id: 1,
    name: 'The Witcher 3',
    score: 95,
    about: 'Un gran RPG de mundo abierto.',
    about_es: 'Un gran RPG de mundo abierto (ES).',
    release_date: '2015-05-19',
    price: 29.99,
    screenshot: ['screenshot1.jpg'],
    videos: ['video1.mp4'],
    platforms: ['PC'],
    sys_req: {
      window: { min: 'Windows 7', recomm: 'Windows 10' },
      linux: { min: 'Ubuntu 18.04', recomm: 'Ubuntu 20.04' }
    },
    tags: ['RPG', 'Acción'],
    reviews: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el nombre del juego', () => {
    component.game = mockGame;
    fixture.detectChanges();

    const gameTitle = fixture.debugElement.query(By.css('.game-title'));
    expect(gameTitle.nativeElement.textContent).toContain('The Witcher 3');
  });

  /*it('debería mostrar la puntuación del juego', () => {
    component.game = mockGame;
    fixture.detectChanges();

    const scoreElement = fixture.debugElement.query(By.css('.game-score'));
    expect(scoreElement.nativeElement.textContent).toContain('95');
  });*/
});