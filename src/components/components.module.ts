import { NgModule } from '@angular/core';
import { SquareComponent } from './square/square';
import { BoardComponent } from './board/board';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		SquareComponent,
		BoardComponent
	],
	imports: [
		IonicModule
	],
	exports: [
		SquareComponent,
		BoardComponent
	]
})
export class ComponentsModule { }
