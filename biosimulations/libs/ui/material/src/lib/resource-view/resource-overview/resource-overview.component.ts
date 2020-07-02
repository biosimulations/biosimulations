import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss'],
})
export class ResourceOverviewComponent implements OnInit {
  @Input()
  imageUrl = 'https://via.placeholder.com/300';

  @Input()
  name = 'Model 001';

  @Input()
  authors: string = 'Bilal Shaikh and Jonathan Karr';

  @Input()
  owner: string = 'User';

  @Input()
  summary: string = 'A <b>model</b> that does something';

  @Input()
  tags: string[] = ['Cancer', 'SBML'];

  @Input()
  description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elementum lacus malesuada, rutrum nibh at, porta mauris. Duis auctor in risus ac fermentum. Donec fermentum mauris mauris, sed imperdiet dui finibus at. Sed condimentum egestas nisl. Integer tristique vulputate lectus, interdum mattis eros sodales id. Integer ac vestibulum lectus, at sagittis leo. Sed volutpat viverra scelerisque. Maecenas euismod enim dolor, in facilisis justo viverra ut. Pellentesque auctor sapien vel nisi tincidunt molestie. Nam quis rutrum risus, nec molestie purus. Maecenas aliquam sollicitudin lorem, efficitur convallis tellus cursus ut. Vivamus ac iaculis mauris. Suspendisse bibendum egestas augue, eget blandit ligula dapibus eget. Etiam luctus fermentum fringilla. Nullam varius pulvinar purus, sed pharetra turpis. Nam hendrerit metus ac elit pretium imperdiet. Mauris finibus odio ac risus ultrices, non vestibulum urna efficitur. Nulla odio lorem, aliquet a sem dictum, cursus venenatis urna.    Morbi rhoncus faucibus sodales. In est neque, iaculis a nisi ut, pretium bibendum lectus. Ut interdum fermentum lectus ut dapibus. Nulla et viverra augue. Cras sit amet ligula lectus. Vestibulum auctor ornare fermentum. Sed quis sodales enim. Cras ut rhoncus ligula, eget bibendum lorem. Nunc suscipit ligula nec nulla porttitor feugiat. Ut rutrum magna vel quam placerat, at convallis ex varius. Mauris orci arcu, luctus a quam et, finibus pretium ligula. Nam id arcu in massa sodales auctor ut quis nunc. Sed mollis lorem non facilisis dapibus. Mauris fermentum libero nec lorem porta interdum. Vestibulum id sapien nulla. Sed fringilla justo mi, nec commodo ante eleifend nec. Curabitur quis tincidunt urna. Nam id euismod dolor. Donec vitae elementum mi. Duis ornare eu neque id tristique. Donec vulputate nibh fermentum, auctor ex eu, pellentesque magna. Aliquam sodales, risus at iaculis egestas, nisi metus bibendum diam, quis accumsan odio urna sit amet dolor. Quisque rutrum porta dolor placerat fringilla. Nam eros sapien, sodales sed enim non, convallis facilisis elit. Praesent at nibh ultrices, imperdiet orci a, venenatis nisl. Donec convallis porttitor ligula a ultrices. Sed at dolor lorem.Pellentesque vehicula interdum massa nec congue. Integer ac aliquet felis. Donec faucibus turpis suscipit scelerisque tristique. Nulla hendrerit mollis risus in pulvinar. Aliquam scelerisque libero ornare condimentum consequat. Aenean malesuada rutrum orci, et elementum augue porta in. Curabitur semper elementum diam, nec ultricies ipsum convallis non. Quisque aliquam cursus diam, et consectetur velit rhoncus ac. Cras tristique leo sit amet magna auctor maximus.';
  constructor() {}

  ngOnInit(): void {}
}
