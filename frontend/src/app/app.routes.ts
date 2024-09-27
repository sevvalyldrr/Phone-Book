import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { RehberComponent } from './rehber/rehber.component';

export const routes: Routes = [
    { path: 'details/:id', component: DetailsComponent },
    { path: 'edit/:id', component: EditComponent },
    { path: 'add-contact', component: AddContactComponent },
    { path: 'rehber', component: RehberComponent },
];
