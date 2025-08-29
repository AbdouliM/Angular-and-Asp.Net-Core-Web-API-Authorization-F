import { Component, OnInit  } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstKeyPipe } from '../../shared/pipes/firstkey-pipe';
import { Auth } from '../../shared/services/auth';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-registration',
  standalone: true, 
  imports: [ReactiveFormsModule,CommonModule,FirstKeyPipe,RouterLink],
  templateUrl: './registration.Component.html',
  styles: ``
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;

  constructor(public formBuilder: FormBuilder,
    private service: Auth,
    private toastr: ToastrService
  ) {}

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['',[Validators.required,Validators.email]],
      password: ['',[
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
      confirmPassword: [''],
      role: [[],Validators.required]

    }, {validators: this.passwordMatchValidator});
  }
  
  isSubmitted: boolean = false;

  onSubmit(){
    if (this.form.valid) {
    const formValue = this.form.value;
    const payload = {
      username: formValue.username,
      password: formValue.password,
      roles: [formValue.role] 
    };
    //console.log('Payload:', payload);

      this.service.createUser(payload)
        .subscribe({
          next: (res: any) => {
            if (res.succeeded) {
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('New user created!', 'Registration Successful')
            }
          },
          error: err => {
            if (err.error.errors)
              err.error.errors.forEach((x: any) => {
                switch (x.code) {
                  case "DuplicateUserName":
                    this.toastr.error('Username is already taken.', 'Registration Failed');
                    break;

                  case "DuplicateEmail":
                    this.toastr.error('Email is already taken.', 'Registration Failed')
                    break;

                  default:
                    this.toastr.error('Contact the developer', 'Registration Failed')
                    console.log(x);
                    break;
                }
              })
            else
              console.log('error:',err);
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


