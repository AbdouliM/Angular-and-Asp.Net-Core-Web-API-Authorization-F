import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../shared/services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipes/firstkey-pipe';


@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,RouterLink,FirstKeyPipe],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  email: string = '';
  token: string = '';

  constructor(public formBuilder: FormBuilder,
      private service: Auth,
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute

  ) {}
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('newPassword')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newPassword:['',[
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
      confirmPassword: [''],
    }, {validators: this.passwordMatchValidator});

      this.email = this.route.snapshot.queryParamMap.get('email') || '';
  this.token = this.route.snapshot.queryParamMap.get('token') || '';
       }

   isSubmitted: boolean = false;


  onSubmit(): void {
    if (this.form.valid) {
      const newPassword = this.form.value.newPassword;
      this.service.resetPassword(this.email, this.token, newPassword).subscribe({
        next: (res) => {
          if (res.success){
          console.log(res);
          this.toastr.success('Password successfully reset.', 'Success');
          this.router.navigate(['/signin']);}
        },
        error: (err) => {
          console.log(err);

          this.toastr.error('Reset failed. Please try again.', 'Error');
        }
      });
        }else this.form.markAllAsTouched();

    
  }
  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched)|| Boolean(control?.dirty) )
  }
}
