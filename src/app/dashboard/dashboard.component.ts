import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,
    private authService: Auth,
   private userService: UserService
   ) { }
  userName: string = ''

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => this.userName = res.userName,
      error: (err: any) => console.log('error while retrieving user profile:\n', err)
    })
  }

}
