import { Controller, Get, Param, Query } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';
import { edamTerms } from '@biosimulations/ontology/sources'
@Controller("/edam")
export class EdamController {
    constructor() { }


    @Get("list")
    getAll() {
        const terms = []
        for (const term in edamTerms) {
            terms.push(edamTerms[term])
        }
        return terms

    }

    @Get(':id')
    getKisao(@Param('id') id: string) {
        console.log(id)
        return edamTerms[id]
    }

    @Get("")
    describeKisao() {

    }



}