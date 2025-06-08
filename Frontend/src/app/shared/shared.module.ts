import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { AvatarUrlPipe } from './pipes/avatar-url.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    AuthModalComponent,
    AvatarUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
    AuthModalComponent,
    CommonModule,
    FormsModule,
    AvatarUrlPipe
  ]
})
export class SharedModule { }
