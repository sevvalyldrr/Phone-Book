import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private translate = inject(TranslateService);
  constructor(private router: Router ) {
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|tr/) ? browserLang : 'en');
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  navigateToAddContact(): void {
    this.router.navigate(['/add-contact']);
  }

  goToContacts(): void {
    this.router.navigate(['/rehber']);
  }

}
