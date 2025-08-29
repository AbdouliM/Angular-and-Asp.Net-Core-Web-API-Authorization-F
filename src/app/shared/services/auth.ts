import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
 constructor(private http:HttpClient) { }
  baseURL = 'http://localhost:5145/api/Auth/';

  createUser(formData:any){
    return this.http.post(this.baseURL+'Register',formData);
    //return this.http.post(this.baseURL+'MyAppAuth/signup',formData);
  }
   signin(formData:any){
    return this.http.post(this.baseURL+'Login',formData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.baseURL+'ForgotPassword', { email });
}
resetPassword(email: string, token: string, newPassword: string): Observable<any> {
  const payload = { email, token, newPassword };
  return this.http.post(this.baseURL+ 'ResetPassword', payload);
}

}