import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { RouterModule} from '@angular/router';
import { Router } from '@angular/router';
import { DetailsComponent } from '../details/details.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, DetailsComponent, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
  export class MenuComponent implements OnInit {

    contacts: any[] = [];
    filteredContacts: any[] = [];
    private translate = inject(TranslateService);

    constructor(private contactService: ContactService, private router: Router  ) {}


    ngOnInit(): void {
      this.contactService.getContacts().subscribe((data: any[]) => {
        this.contacts = data;
        this.filteredContacts = data;
      });
    }
  
    expandedId: number | null = null;
  
    expand(id: number) {
      this.expandedId = id;
    }
  
    collapse() {
      this.expandedId = null;
    }

    searchContacts(searchTerm: string) {
      if (searchTerm === '') {
        this.filteredContacts = this.contacts;
      } else {
        this.filteredContacts = this.contacts.filter(contact => {
          return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.surname.toLowerCase().includes(searchTerm.toLowerCase()) || contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || contact.companyPhoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
    }

  }
  