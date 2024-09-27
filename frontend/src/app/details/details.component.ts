import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { contact } from '../../models/contact.models';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  selectedContact: contact | null = null;
  private translate = inject(TranslateService);

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam; // ID'yi number'a dönüştürün
        if (id) {
          this.contactService.getContactById(id).subscribe({
            next: (contact: contact) => {
              this.selectedContact = contact;
            },
            error: (err) => {
              console.error('Error fetching contact:', err);
            }
          });
        }
      }
    });
  }
  onDelete(id: number): void {
    if (confirm(this.translate.instant('DELETE_CONFIRMATION'))) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          alert(this.translate.instant('DELETE_SUCCESS'));
          this.router.navigate(['/details']); // Silme işlemi sonrası listeye dön
        },
        error: (err) => {
          console.error('Silme işlemi sırasında hata oluştu:', err);
          alert(this.translate.instant('DELETE_ERROR'));
        }
      });
    }
  }

  onUpdate(): void {
    if (this.selectedContact) {
      this.router.navigate(['/edit', this.selectedContact.id]);
    }
  }

}

