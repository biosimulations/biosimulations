import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/Shared/Models/person';
import { User } from 'src/app/Shared/Models/user';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.sass']
})
export class AuthorsComponent {
  @Input() authors: (User | Person)[];
  @Input() owner: User;

  constructor(private router: Router) { }
}
