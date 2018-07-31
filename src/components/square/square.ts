import { Component, Input } from '@angular/core';
import { GameProvider, Players } from '../../providers/game/game';


/**
 *
 */
@Component({
  selector: 'square',
  templateUrl: 'square.html'
})
export class SquareComponent {

  @Input()
  public row: number;

  @Input()
  public col: number;

  @Input()
  public value: number;

  constructor(
    private gameProvider: GameProvider
  ) {
  }

  public get isDisabled(): boolean {
    return this.value !== Players.NONE; 
  }

  public get backgroundColor(): string {
    switch(this.value) {
      case Players.CIRCLE:
        return 'blue';
      case Players.CROSS:
        return 'red';
      case Players.NONE:
        return 'grey';
    }
  }

  public onClick(): void {
    console.log(this.value);
    console.debug(`SquareComponent col=${this.col} row=${this.row} clicked.`);
    this.gameProvider.move(this.row, this.col);
  }
}
