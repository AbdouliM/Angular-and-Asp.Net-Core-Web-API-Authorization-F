import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl  } from '@angular/forms';
import { Auth} from '../../shared/services/auth';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ ReactiveFormsModule,RouterLink ,CommonModule],
  templateUrl: './forget-password.component.html',
  styles: ``
})
export class ForgetPasswordComponent  implements OnInit {
  form!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private authService: Auth,
    private toastr: ToastrService
  ) {}

   ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]

  })
  }
  isSubmitted: boolean = false;

  onSubmit(): void {

    if (this.form.valid) {


    const email = this.form.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.toastr.success('Reset link sent to your email.', 'Success');
        this.form.reset();
      },
      error: (err) => {
        this.toastr.error('Email not found or error occurred.', 'Error');
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
