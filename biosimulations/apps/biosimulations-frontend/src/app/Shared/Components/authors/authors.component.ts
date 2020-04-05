import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../Models/person';
import { User } from '../../Models/user';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.sass'],
})
export class AuthorsComponent {
  @Input() authors: (User | Person)[];
  @Input() owner: User;
  @Input() route = true;

  constructor(private router: Router) {}
}
