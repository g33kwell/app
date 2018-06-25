import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StandingOrdersPage } from './standing-orders';

@NgModule({
  declarations: [
    StandingOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(StandingOrdersPage),
  ],
})
export class StandingOrdersPageModule {}
