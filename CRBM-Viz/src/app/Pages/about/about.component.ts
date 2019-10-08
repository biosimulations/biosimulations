import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass'],
})
export class AboutComponent implements OnInit {
  fillerContent = Array.from(
    { length: 3 },
    () =>
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla risus ac aliquam commodo. Ut pellentesque, \
      ligula sit amet condimentum lacinia, sapien tortor malesuada justo, et finibus nulla tellus vel velit. Aliquam erat volutpat. \
      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras a scelerisque urna. \
      Sed sodales ex vel sapien condimentum, at rhoncus nisi mollis. Sed blandit lobortis sagittis. Ut pretium quam odio, \
      nec dictum erat aliquet quis. Quisque elementum, leo sagittis convallis suscipit, libero nisi faucibus nibh, \
      eu malesuada mauris dolor a orci. Aliquam erat volutpat. Cras tortor augue, euismod at neque non, aliquet feugiat libero.\
      Integer ullamcorper est laoreet, cursus odio sit amet, molestie libero. Etiam iaculis purus at felis interdum, \
      vel lobortis turpis consequat. Etiam faucibus libero finibus, posuere lacus vel, malesuada libero. Vestibulum augue est,\
      cursus eget purus vitae, tincidunt aliquet ligula.\
      Proin auctor risus enim, et pellentesque tortor porta in. Morbi vel eleifend lacus.\
      Cras pulvinar lacus a efficitur porttitor. Suspendisse at ligula mi.\
      Praesent ornare blandit arcu, vel pellentesque dolor fermentum a.\
      Cras tortor massa, volutpat eget urna in, varius sollicitudin ante. Pellentesque interdum nisi felis, ut pharetra enim efficitur a. \
      Praesent cursus ac lorem quis convallis. Nullam semper turpis dolor, ac mollis erat faucibus vel.'
  );

  constructor() {}

  ngOnInit() {}
}
