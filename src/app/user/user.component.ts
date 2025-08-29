import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet],
  templateUrl: './user.Component.html',
  styles: ``
})
export class UserComponent {

}
