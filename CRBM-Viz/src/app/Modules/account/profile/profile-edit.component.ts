import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.sass'],
})

export class ProfileEditComponent implements OnInit {
  user: User;
  showSavedMessage = false;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService) {}

  ngOnInit() {
    const crumbs: Object[] = [
      {label: 'Profile', route: ['/profile']},
      {label: 'Edit'},
    ];
    const buttons: Object[] = [
      {iconType: 'mat', icon: 'person', label: 'View', route: ['/profile']},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
    
    const auth0Id: string = (this.auth.token.sub as unknown) as string;
    this.user = this.userService.getByAuth0Id(auth0Id);
    // this.users.get().subscribe(res => (this.user = res));
  }

  save (): void {
    this.showSavedMessage = true;
    setTimeout(() => {
      this.showSavedMessage = false;
    }, 2500);
  }
}
