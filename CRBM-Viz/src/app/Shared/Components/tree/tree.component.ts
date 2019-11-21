import { Component, Input } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass']
})
export class TreeComponent {
  @Input() nodes: object[];
  @Input() highlightedNodeId: string | number;
  options = {
    nodeClass: (node: TreeNode) => {
      if (node.data.id === this.highlightedNodeId) {
        return 'node-highlighted';
      }
    }
  };

  constructor(private router: Router) { }
}

