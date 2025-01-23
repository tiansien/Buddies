import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EventRoutingModule } from './event-routing.module';
import { EventsListComponent } from './events-list/events-list.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { PaticipantManagmentComponent } from './paticipant-managment/paticipant-managment.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ParticipationRequestDrawerComponent } from './participation-request-drawer/participation-request-drawer.component';
import { EditEventComponent } from './edit-event/edit-event.component';

@NgModule({
  declarations: [
    EventsListComponent,
    CreateEventComponent,
    EventDetailComponent,
    PaticipantManagmentComponent,
    ParticipationRequestDrawerComponent,
    EditEventComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EventRoutingModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzSpinModule,
    NzTableModule,
    NzInputModule,
    NzAvatarModule,
    NzTagModule,
    NzMessageModule,
    NzToolTipModule,
  ],
})
export class EventModule {}
