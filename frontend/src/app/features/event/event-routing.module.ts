import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsListComponent } from './events-list/events-list.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { PaticipantManagmentComponent } from './paticipant-managment/paticipant-managment.component';
import { EditEventComponent } from './edit-event/edit-event.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EventsListComponent },
      { path: 'create', component: CreateEventComponent },
      { path: 'detail/:id', component: EventDetailComponent },
      { path: 'managementEvent', component: PaticipantManagmentComponent },
      { path: 'edit/:id', component: EditEventComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }