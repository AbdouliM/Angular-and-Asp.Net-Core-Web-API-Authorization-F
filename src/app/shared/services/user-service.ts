import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient,
    private authService: Auth) { }
  baseURL = 'http://localhost:5145/api/User/'

  getUserProfile(): Observable<any> {
  const token = localStorage.getItem('token'); 
  console.log('Token envoyé:', token); 
  const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
  return this.http.get(this.baseURL+ 'userprofile', { headers });
}
}