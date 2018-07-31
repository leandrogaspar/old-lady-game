import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export enum Players {
  NONE = -1,
  CROSS = 1,
  CIRCLE = 2
};

export enum State {
  PLAYING = 0,
  COMPLETED = 1
}

export interface GameState {
  board: number[][],
  gameState: State,
  currentTurn: Players,
  winner?: Players
}

/**
 * Controls the game state
 */
@Injectable()
export class GameProvider {

  private board = [
    [Players.NONE, Players.NONE, Players.NONE],
    [Players.NONE, Players.NONE, Players.NONE],
    [Players.NONE, Players.NONE, Players.NONE]
  ];
  private currentState: State;
  private currentTurn: Players;
  private winner: Players;

  public boardSubject = new Subject<GameState>();

  constructor(
  ) {
    console.debug('Starting GameProvider Provider');
  }

  /**
   * @returns true if current state is PLAYING
   */
  public isPlaying(): boolean {
    return this.currentState === State.PLAYING;
  }

  /**
   * @returns true if current state is COMPLETED
   */
  public isCompleted(): boolean {
    return this.currentState === State.COMPLETED;
  }

  /**
   * Resets the board and choose a new starting player
   */
  public restartGame(): void {
    console.debug('Restarting the game');
    this.currentState = State.PLAYING;
    this.currentTurn = (Math.random() < 0.5) ? Players.CIRCLE : Players.CROSS;
    this.winner = undefined;
    this.board = [
      [Players.NONE, Players.NONE, Players.NONE],
      [Players.NONE, Players.NONE, Players.NONE],
      [Players.NONE, Players.NONE, Players.NONE]
    ];
    this.sendGameState();
  }

  /**
   * Propagate the new GameState on the board subject
   */
  public sendGameState(): void {
    const currentState: GameState = {
      board: this.board.slice(),
      gameState: this.currentState,
      currentTurn: this.currentTurn,
      winner: this.winner
    };
    console.debug('New game state:', currentState);
    this.boardSubject.next(currentState);
  }

  /**
   * If the game game is in 'COMPLETED' state do nothing.
   * If the game is in the 'PLAYING' state:
   * 1) Change one board square to the current player.
   * 2) Check if game is 'COMPLETED'.
   * 3) If game state still 'PLAYING' move the turn.
   * 
   * @param row Which row should be changed
   * @param col Which column should be changed
   */
  public move(row: number, col: number) {
    // Ignore the move
    if (this.isCompleted()) { return; }

    this.board[row][col] = this.currentTurn;

    this.computeMove();

    // If still playing advance the turn
    if (this.isPlaying()) {
      this.currentTurn = this.currentTurn === Players.CIRCLE ? Players.CROSS  : Players.CIRCLE;
    }

    // Let everybody known the game state
    this.sendGameState();
  }

  /**
   * Checks if we have a winner and the game is completed
   */
  private computeMove(): void {
    // TODO: Rally naive algorithm
    // Would be nice to have different boards sizes..

    const winConditions = [
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      [[0,0], [1,1], [2,2]],
      [[2,0], [1,1], [0,2]]
    ];

    // To find a win, every cell in the win condition
    // must match the currentTurn value
    for (let winCond of winConditions) {
      let found = 0;
      for (let cell of winCond) {
        if(this.currentTurn === this.board[cell[0]][cell[1]]) {
          found++;
        }
      }
      if (found === 3) {
        return this.setWinner(this.currentTurn);
      }
    }

    let drawCount = 0;
    for (let row of this.board) {
      for (let value of row) {
        if (value !== Players.NONE) {
          drawCount++;
        }
      }
    }
    if (drawCount === 9) {
      this.setWinner(Players.NONE);
    }
  }

  private setWinner(player: Players) {
    this.winner = player;
    this.currentState = State.COMPLETED;
  }
}
