import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AuthModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    AuthModalComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
