import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface Node {
  id: (string | number);
  name: string;
  route: (string | number)[];
  isExpanded?: boolean;
  children?: Node[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass']
})
export class TreeComponent {
  get nodes(): Node[] {
    return this.dataSource.data;
  }

  @Input()
  set nodes(val: Node[]) {
    this.dataSource.data = val;
    this.expandHighlightedNode();
  }

  private _highlightedNodeId: string | number;

  get highlightedNodeId(): string | number {
    return this._highlightedNodeId;
  }

  @Input()
  set highlightedNodeId(val: string | number) {
    this._highlightedNodeId = val;
    this.expandHighlightedNode();
  }

  treeControl = new NestedTreeControl<Node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node>();

  constructor(private router: Router) { }

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;
  isNodeHighlighted = (node: Node) => this.highlightedNodeId !== undefined && node.id === this.highlightedNodeId;

  private expandHighlightedNode(): void {
    if (this.dataSource.data && this._highlightedNodeId !== undefined) {
      this.treeControl.collapseAll();

      const stack = [];
      for (const node of this.dataSource.data) {
        stack.push([node]);
      }

      while (stack.length > 0) {
        const nodes: Node[] = stack.pop();
        const node: Node = nodes.slice(-1)[0];

        if (node.id === this._highlightedNodeId) {
          for (const parentNode of nodes) {
            this.treeControl.expand(parentNode);
          }
          break;
        }

        if (node.children) {
          for (const childNode of node.children) {
            stack.push(nodes.concat([childNode]));
          }
        }
      }
    }
  }
}
