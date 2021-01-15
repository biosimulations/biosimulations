import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker"

@Injectable()
export class UpdateService {

    constructor(private updates: SwUpdate) {
        updates.unrecoverable.subscribe(event => {
            alert(
                `An error occurred that we cannot recover from:\n${event.reason}\n\n` +
                'Please reload the page.');



        })

        updates.checkForUpdate()
        this.update()
    }

    update() {
        this.updates.available.subscribe(
            event => {
                this.updates.activateUpdate().then(() => document.location.reload());
            }
        )
    }
}