import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { contact } from '../models/contact.models';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:5177/api/contact';

  constructor(private http: HttpClient) { }

  getContacts(): Observable<contact[]> {
    return this.http.get<contact[]>(this.apiUrl);
  }

  getContactById(id: number): Observable<contact> {
    return this.http.get<contact>(`${this.apiUrl}/${id}`);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateContact(person: contact): Observable<contact> {
    return this.http.put<contact>(`${this.apiUrl}/${person.id}`, person).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Kişi güncelleme hatası:', error);
        return throwError(error);
      })
    );
  }

  addContact(contact: contact): Observable<contact> {
    return this.http.post<contact>(this.apiUrl, contact);
  }

  uploadProfileImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/${id}/upload-image`, formData);
  }

  checkPhoneNumber(phoneNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-phone/${phoneNumber}`);
  }

  

}