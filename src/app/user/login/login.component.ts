
import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../shared/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private service: Auth,
    private router: Router,
    private toastr: ToastrService) { }
  isSubmitted: boolean = false;
 onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.toastr.success('', 'Login Successful');
          this.router.navigateByUrl('/dashboard');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 400)
            this.toastr.error('Incorrect email or password.', 'Login failed')
          else if (err.status === 401) {
          this.toastr.warning('Compte bloqué', 'Try Later');
          }
          else
            console.log('error during login:\n', err);

        }
      })
    }else this.form.markAllAsTouched();
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  }
  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
  onForgotPasswordSubmit() {
  this.service.forgotPassword(this.form.value).subscribe({
    next: () => {
      this.toastr.success('Email envoyé', 'Réinitialisation');
    },
    error: () => {
      this.toastr.error('Email introuvable', 'Erreur');
    }
  });
}


 

}