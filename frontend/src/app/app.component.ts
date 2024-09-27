import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import { contact } from '../models/contact.models';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { DetailsComponent } from './details/details.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditComponent } from './edit/edit.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RehberComponent } from './rehber/rehber.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageCellRendererComponent } from './image-cell-renderer/image-cell-renderer.component';
import { ActionCellRendererComponent } from './action-cell-renderer/action-cell-renderer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, MenuComponent, DetailsComponent, AddContactComponent, EditComponent, MenuComponent, NavbarComponent, RehberComponent, CommonModule, ImageCellRendererComponent, ActionCellRendererComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient],
})
export class AppComponent implements OnInit{

  contacts: contact[] = [];

  showSidebar: boolean = true;
  constructor(private contactService: ContactService, private router: Router, private translate: TranslateService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = event.urlAfterRedirects !== '/rehber';
      }
    });
  }

  ngOnInit(): void {
    this.contactService.getContacts().subscribe(data => {
      this.contacts = data;
    });
    this.translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }




}
