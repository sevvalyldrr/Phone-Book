import { Component, Inject, PLATFORM_ID, OnInit, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ContactService } from '../contact.service';
import { contact } from '../../models/contact.models';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { ImageCellRendererComponent } from '../image-cell-renderer/image-cell-renderer.component';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rehber',
  standalone: true,
  providers: [TranslateService], 
  imports: [CommonModule, AgGridModule, ActionCellRendererComponent, ImageCellRendererComponent, TranslateModule],
  templateUrl: './rehber.component.html',
  styleUrls: ['./rehber.component.css']
})
export class RehberComponent implements OnInit {
  columnDefs: ColDef[] = [];
  rowData: contact[] = [];
  isBrowser: boolean;
  rowHeight: number = 70;

  constructor(
    private contactService: ContactService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.contactService.getContacts().subscribe(data => {
        this.rowData = data.map((item, index) => ({
          ...item,
          rowId: index + 1  
        }));
      });
    }
  
    this.setColumnDefs(); 
  
    this.translate.onLangChange.subscribe(() => {
      this.setColumnDefs();
    });
  }
  
  setColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: this.translate.instant('FAVOURITE'),
        field: 'favourite',
        cellRenderer: ImageCellRendererComponent,
        width: 115,
      },
      {
        headerName: this.translate.instant('PROFILE_IMAGE'),
        field: 'profileImage',
        cellRenderer: ImageCellRendererComponent,
        width: 115,
      },
      { headerName: this.translate.instant('NAME'), field: 'name' },
      { headerName: this.translate.instant('SURNAME'), field: 'surname' },
      { headerName: this.translate.instant('PHONE_NUMBER'), field: 'phoneNumber' },
      { headerName: this.translate.instant('EMAIL'), field: 'email', width:250, },
      {
        headerName: this.translate.instant('BIRTHDAY'),
        field: 'birthday',
        valueFormatter: (params) => {
          if (params.value) {
            const date = new Date(params.value);
            return date.toLocaleDateString(this.translate.currentLang);
          }
          return '';
        }
      },
      {
        headerName: this.translate.instant('ACTIONS'),
        cellRenderer: ActionCellRendererComponent,
        cellRendererParams: {
          context: { componentParent: this }
        },
        width: 140,
      }
    ];
  }

  onRowClicked(event: any): void {
    const contactId = event.data.id; 
    this.router.navigate(['/details', contactId]);
  }

  editContact(id: number): void {
    this.router.navigate(['/edit', id]);  
  }

  deleteContact(id: number): void {
    if (confirm(this.translate.instant('DELETE_CONFIRMATION'))) {
      console.log(`Contact with id ${id} deleted`);
  
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.rowData = this.rowData.filter(contact => contact.id !== id);
          alert(this.translate.instant('DELETE_SUCCESS'));
          this.router.navigate(['/contacts']);
        },
        error: (err) => {
          console.error('Silme işlemi sırasında hata oluştu:', err);
          alert(this.translate.instant('DELETE_ERROR'));
        }
      });
    }
  }  
}
