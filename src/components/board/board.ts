import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameProvider, GameState, Players } from '../../providers/game/game';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent implements OnInit, OnDestroy{

  board = [
    [Players.NONE, Players.NONE, Players.NONE],
    [Players.NONE, Players.NONE, Players.NONE],
    [Players.NONE, Players.NONE, Players.NONE]
  ];

  private subscription: Subscription;

  constructor(
    public gameProvider: GameProvider
  ) {
  }

  ngOnInit() {
    console.log('Hello BoardComponent Component');
    this.subscription = this.gameProvider.boardSubject.subscribe(
      (gameState: GameState) => {
        this.board = gameState.board;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
