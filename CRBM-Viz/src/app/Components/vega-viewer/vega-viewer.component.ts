import { Component, OnInit, Input } from '@angular/core';
import vegaEmbed from 'vega-embed';
import { Visualization } from 'src/app/Models/visualization';
@Component({
    selector: 'app-vega-viewer',
    templateUrl: './vega-viewer.component.html',
    styleUrls: ['./vega-viewer.component.sass'],
})
export class VegaViewerComponent implements OnInit {
    @Input() viz: Visualization;
    spec: string;
    specid: string;
    @Input() name: string;
    vizname: string;

    constructor() {}

    ngOnInit() {
        console.log('on init');
        console.log(this.viz);
        this.spec = this.viz.spec;
        this.specid = 'id' + this.viz.id;
        this.name = this.viz.name;
        this.load();
    }
    load() {
        vegaEmbed('#' + this.specid, this.spec)
            // result.view provides access to the Vega View API
            .then(result => console.log(result))
            .catch(console.warn);
    }
}
