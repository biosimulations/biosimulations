import { Injectable } from '@angular/core';
import { Taxon } from 'src/app/Shared/Models/taxon';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private http: HttpClient) {}

  getTaxa(taxonName?: string): Taxon[] {
    const taxa: Taxon[] = [
      new Taxon(2, 'Bacillus subtilis'),
      new Taxon(1, 'Escherichia coli'),
      new Taxon(9606, 'Homo sapiens'),
    ];

    if (taxonName) {
      const lowCaseTaxonName: string = taxonName.toLowerCase();
      return taxa.filter(taxon => taxon.name.toLowerCase().includes(lowCaseTaxonName));
    } else {
      return taxa;
    }
  }
}
