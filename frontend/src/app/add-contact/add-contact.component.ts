import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, AsyncPipe, RouterModule, FormsModule, TranslateModule],
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  person = {
    id: 0,
    name: '',
    surname: '',
    phoneNumber: '',
    companyName: '',
    companyPhoneNumber: '',
    email: '',
    birthday: undefined,
    profileImage: '',  // Bu string türünde olmalı.
    favourite: false,
  };

  profileImageFile: File | null = null;
  formSubmitted = false;
  private translate = inject(TranslateService);

  constructor(private contactService: ContactService, private router: Router) { }

  ngOnInit(): void {
    this.person.profileImage = '../../assets/profile.png';
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
    console.log(this.translate.instant('PHONE_NUMBER_CHANGED'), this.person.phoneNumber);
  }

  toggleFavourite(): void {
    this.person.favourite = !this.person.favourite;
  }

  onSubmit(): void {
    // Telefon numarasının veritabanında olup olmadığını kontrol et
    this.contactService.checkPhoneNumber(this.person.phoneNumber).subscribe(
      (exists: boolean) => {
        if (exists) {
          // Eğer telefon numarası zaten varsa, uyarı mesajı gösteriliyor
          alert(this.translate.instant('PHONE_EXISTS_ERROR'));
        } else {
          // Telefon numarası yoksa, kişiyi kaydet
          this.contactService.addContact(this.person).subscribe((contact) => {
            alert(this.translate.instant('CONTACT_ADDED_SUCCESS')); // Kişi kaydı başarılı olduğunda uyarı mesajı gösteriliyor
            if (this.profileImageFile) {
              this.contactService.uploadProfileImage(contact.id, this.profileImageFile).subscribe(() => {
                this.router.navigate(['/details']);
              }, (err) => {
                console.error(this.translate.instant('IMAGE_UPLOAD_ERROR'), err);
                alert(this.translate.instant('IMAGE_UPLOAD_ERROR'));
              });
            } else {
              this.router.navigate(['/details']);
            }
          }, (err) => {
            console.error(this.translate.instant('CONTACT_ADD_ERROR'), err);
            alert(this.translate.instant('CONTACT_ADD_ERROR'));
          });
        }
      });
  }




}
