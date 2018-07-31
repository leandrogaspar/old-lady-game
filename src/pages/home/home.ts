import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { GameProvider, Players, GameState } from '../../providers/game/game';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public winnerMessage: string;

  private currentTurn: Players;
  private subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public gameProvider: GameProvider
  ) { }

  ngOnInit() {
    console.log('Hello HomePage Component');
    this.subscription = this.gameProvider.boardSubject.subscribe(
      (gameState: GameState) => {
        this.currentTurn = gameState.currentTurn;

        // If we received a winner the game finished
        if (gameState.winner) {
          this.winnerMessage = gameState.winner === Players.NONE ?
            'Match draw!' : `${this.playerToString(gameState.winner)} won!`;
          this.winnerAlert();
        } else {
          this.winnerMessage = undefined;
        }
      });
    this.gameProvider.restartGame();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Ask the user if he want to restart the game
   */
  private winnerAlert() {
    let alert = this.alertCtrl.create({
      title: this.winnerMessage,
      message: 'Do you want to start again?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Restart',
          handler: () => {
            this.gameProvider.restartGame();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Translate Player enum to a legible string.
   */
  private playerToString(player: Players): string {
    switch (player) {
      case Players.CROSS:
        return 'Red';
      case Players.CIRCLE:
        return 'Blue';
      default:
        return '';
    }
  }

  /**
   * Get the current player as a formatted string
   */
  public get currentPlayer(): string {
    return this.playerToString(this.currentTurn);
  }

  /**
   * Reacts to the restart game button
   */
  public onRestartGame(): void {
    this.gameProvider.restartGame();
  }
}
