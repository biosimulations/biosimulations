import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DispatchService } from '../../../services/dispatch/dispatch.service';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements AfterViewInit {
  @ViewChild('table') table!: any;

  columns: any[] = [
    {
      id: 'id',
      heading: "Id",
      key: 'id',
      container: 'plain',
      minWidth: 34
    },
    {
      id: 'name',
      heading: "Name",
      key: 'name',
      container: 'plain',
      minWidth: 34
    },
    {
      id: 'status',
      heading: "Status",
      key: 'status',
      container: 'plain',
      formatter: (value: string) => {
        if (value) {
          return value.substring(0, 1).toUpperCase() + value.substring(1);
        } else {
          return value;
        }
      },
      comparator: (aVal: any, bVal: any) => {
        if (aVal === 'queued') aVal = 0;
        if (aVal === 'succeeded') aVal = 1;
        if (aVal === 'failed') aVal = 2;
        if (aVal == null) aVal = 3;

        if (bVal === 'queued') bVal = 0;
        if (bVal === 'succeeded') bVal = 1;
        if (bVal === 'failed') bVal = 2;
        if (bVal == null) bVal = 3;

        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      },
      minWidth: 77,
    },
    {
      id: 'runtime',
      heading: "Runtime",
      key: 'runtime',
      formatter: (value: number) => {
        if (value == null) {
          return null;
        }

        if (value > 7 * 24 * 60 * 60) {
          return (value / (7 * 24 * 60 * 60)).toFixed(1) + ' w';

        } else if (value > 24 * 60 * 60) {
          return (value / (24 * 60 * 60)).toFixed(1) + ' d';

        } else if (value > 60 * 60) {
          return (value / (60 * 60)).toFixed(1) + ' h';

        } else if (value > 60) {
          return (value / 60).toFixed(1) + ' m';

        } else if (value > 1) {
          return (value).toFixed(1) + ' s';

        } else {
          return (value * 1000).toFixed(1) + ' ms';
        }
      },
      filterType: 'number',
      show: false,
    },
    {
      id: 'submitted',
      heading: "Submitted",
      key: 'submitted',
      formatter: (value: Date) => {
        if (value == null) {
          return null;
        }
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0')
          + ' ' + value.getHours().toString().padStart(2, '0')
          + ':' + value.getMinutes().toString().padStart(2, '0')
          + ':' + value.getSeconds().toString().padStart(2, '0');
      },
      filterType: 'date',
      minWidth: 140,
    },
    {
      id: 'completed',
      heading: "Completed",
      key: 'completed',
      formatter: (value: Date) => {
        if (value == null) {
          return null;
        }
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0')
          + ' ' + value.getHours().toString().padStart(2, '0')
          + ':' + value.getMinutes().toString().padStart(2, '0')
          + ':' + value.getSeconds().toString().padStart(2, '0');
      },
      filterType: 'date',
      minWidth: 140,
    },
    {
      id: 'visualize',
      heading: "Visualize",
      center: true,
      container: 'route',
      route: (element: any) => {
        if (element.id) {
          return ['/simulations', element.id];
        } else {
          return null;
        }
      },
      icon: 'chart',
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
    {
      id: 'download',
      heading: "Download",
      center: true,
      container: 'href',
      href: (element: any) => {
        if (element.id) {
          return 'download-results/' + element.id;
        } else {
          return null;
        }
      },
      icon: 'download',
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
    {
      id: 'log',
      heading: "Log",
      center: true,
      container: 'route',
      route: (element: any) => {
        if (element.id) {
          return ['/simulations', element.id];
        } else {
          return null;
        }
      },
      icon: 'logs',
      minWidth: 66,
      filterable: false,
      sortable: false,
    },
  ];

  data: any[] = [];

  constructor(private dispatchService: DispatchService) {}

  ngAfterViewInit() {
    this.dispatchService.uuidUpdateEvent.subscribe(
      (uuid: string) => {
        // TODO: get name, status, runtime, dates from dispatch service
        this.data.push({
          id: uuid,
          name: null,
          status: null,
          runtime: null,
          submitted: null,
          completed: null,
        });
        this.table.setData(this.data);
      },
      (error) => {
        console.log('Error occured while fetching UUIds: ', error);
      },
    );
  }
}
