import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { SharedZorroModule } from 'src/app/shared/shared-zorro.module';
import { MessagingPageComponent } from './messaging-page/messaging-page.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';


@NgModule({
  declarations: [
    MessagingPageComponent,
    ContactListComponent,
    ChatAreaComponent
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    SharedZorroModule
  ]
})
export class MessageModule { }
