import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img [src]="getImageUrl()" class="contact-photo" />
  `,
  styleUrls: ['./image-cell-renderer.component.css']
})
export class ImageCellRendererComponent {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  getImageUrl(): string {
    // Sütun türünü belirlemek için `params`'i doğrudan kontrol edin
    const isFavouriteColumn = this.params.colDef?.headerName === 'Favourite' || this.params.colDef?.headerName === 'Favori';
    const isFavourite = this.params.value;

    if (isFavouriteColumn) {
      // Favori sütunu için ikonları ayarlayın
      return isFavourite
        ? `../assets/starrrr.png` // Favori ikonunu göster
        : `../assets/stariki.png`; // Varsayılan ikon
    } else {
      // Profil resmi sütunu için profil resmini ayarlayın
      const profileImageUrl = this.params.value;
      return profileImageUrl
        ? profileImageUrl // Kişinin profil resmini göster
        : `../../assets/profile.png`; // Varsayılan profil resmi
    }
  }
}
