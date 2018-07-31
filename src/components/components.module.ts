import { NgModule } from '@angular/core';
import { SquareComponent } from './square/square';
import { BoardComponent } from './board/board';
@NgModule({
	declarations: [SquareComponent,
    BoardComponent],
	imports: [],
	exports: [SquareComponent,
    BoardComponent]
})
export class ComponentsModule {}
