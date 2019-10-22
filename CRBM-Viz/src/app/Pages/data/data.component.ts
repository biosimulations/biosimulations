import { Component, OnInit } from '@angular/core';
import { Timecourse } from 'src/app/Models/timecourse';
import { DataService } from 'src/app/Services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.sass'],
})
export class DataComponent implements OnInit {
  timecourse: Timecourse[] = [];
  id: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.getData();
      }
    });
  }

  getData() {
    this.dataService.getTimecourse(this.id).subscribe((res: Timecourse[]) => {
      this.timecourse = res;
      console.log(this.timecourse);
    });
  }
}
