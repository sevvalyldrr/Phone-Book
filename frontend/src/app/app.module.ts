import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient,withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ContactService } from './contact.service';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { DetailsComponent } from './details/details.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditComponent } from './edit/edit.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RehberComponent } from './rehber/rehber.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageCellRendererComponent } from './image-cell-renderer/image-cell-renderer.component';
import { ActionCellRendererComponent } from './action-cell-renderer/action-cell-renderer.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [],
  imports: [ AppComponent, BrowserModule, BrowserAnimationsModule ,MenuComponent, DetailsComponent, AddContactComponent, EditComponent, NavbarComponent, RehberComponent, AgGridModule, ImageCellRendererComponent, ActionCellRendererComponent,     
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers: [
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    ContactService,
    HttpClient,
    TranslateService
  ],
  bootstrap: []
})
export class AppModule {}
