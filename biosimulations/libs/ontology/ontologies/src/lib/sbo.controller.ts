import { Controller, Get, Param, Query } from '@nestjs/common';
import { sboTerms } from '@biosimulations/ontology/sources'
@Controller("/sbo")
export class SboController {
    constructor() { }


    @Get("list")
    getAll() {
        const terms = []
        for (const term in sboTerms) {
            terms.push(sboTerms[term])
        }
        return terms

    }

    @Get(':id')
    getTerm(@Param('id') id: string) {
        console.log(id)
        return sboTerms[id]
    }

    @Get("")
    describeOntology() {

    }



}