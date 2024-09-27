import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { contact } from '../../models/contact.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule]
})
export class EditComponent implements OnInit {
  person: contact = {
    id: 0,
    name: '',
    surname: '',
    phoneNumber: '',
    companyName: '',
    companyPhoneNumber: '',
    email: '',
    birthday: undefined,
    profileImage: '',
    favourite: false,
  };

  originalPhoneNumber: string | undefined;
  profileImageFile: File | null = null;
  private translate = inject(TranslateService);

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.contactService.getContactById(id).subscribe((data: contact) => {
        this.person = data;
        this.originalPhoneNumber = this.person.phoneNumber;
      });
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.person.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Resim seçilmediğinde sabit bir resim ata
      this.person.profileImage = '../../assets/profile.png';
    }
  }

  onPhoneNumberChange() {
    // Burada özel bir kontrol yapabilirsiniz
    console.log('Phone number changed:', this.person.phoneNumber);
  }

  toggleFavourite(): void {
    this.person.favourite = !this.person.favourite;
  }

  onUpdate(): void {
    if (!this.person.phoneNumber) {
      alert(this.translate.instant('PHONE_REQUIRED'));
      return;
    }
  
    // Eğer telefon numarası değiştirilmemişse, güncelleme işlemini direkt yap
    if (this.person.id && this.person.phoneNumber === this.originalPhoneNumber) {
      this.contactService.updateContact(this.person).subscribe({
        next: () => {
          // Başarı mesajını göster ve yönlendir
          alert(this.translate.instant('UPDATE_SUCCESS'));
          this.router.navigate(['/details']); // Güncelleme sonrası listeye dön
        },
        error: (err) => {
          // Hata mesajını göster
          console.error('Güncelleme işlemi sırasında hata oluştu:', err);
          alert(this.translate.instant('UPDATE_ERROR'));
        }
      });
    } else {
      // Telefon numarasının veritabanında olup olmadığını kontrol et
      this.contactService.checkPhoneNumber(this.person.phoneNumber).subscribe({
        next: (exists: boolean) => {
          if (exists && this.person.id) {
            alert(this.translate.instant('PHONE_EXISTS_ERROR'));
          } else if (this.person.id) {
            // Telefon numarası başka bir kişiyle çakışmıyorsa, güncelleme işlemi yap
            this.contactService.updateContact(this.person).subscribe({
              next: () => {
                // Başarı mesajını göster ve yönlendir
                alert(this.translate.instant('UPDATE_SUCCESS'));
                this.router.navigate(['/details']); // Güncelleme sonrası listeye dön
              },
              error: (err) => {
                // Hata mesajını göster
                console.error('Güncelleme işlemi sırasında hata oluştu:', err);
                alert(this.translate.instant('UPDATE_ERROR'));
              }
            });
          }
        },
        error: (err) => {
          // Hata mesajını göster
          console.error('Telefon numarası kontrol hatası:', err);
          alert(this.translate.instant('PHONE_CHECK_ERROR'));
        }
      });
    }
  }
  
  

}
