import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestApiPage } from './test-api';

@NgModule({
  declarations: [
    TestApiPage,
  ],
  imports: [
    IonicPageModule.forChild(TestApiPage),
  ],
})
export class TestApiPageModule {}
