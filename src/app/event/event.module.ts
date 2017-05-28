import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EventComponent } from './event.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EventComponent
  ]
})
export class EventModule { }
