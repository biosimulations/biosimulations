import { Injectable } from '@angular/core';
import {
  AlgorithmKisaoDescriptionFragment,
  AlgorithmKisaoDescriptionFragmentType,
} from '../../../../simulation-logs-datamodel';

@Injectable({ providedIn: 'root' })
export class StructuredSimulationLogElementService {
  public constructor() {}
  public formatKisaoDescription(
    value: string | null,
  ): AlgorithmKisaoDescriptionFragment[] | undefined {
    if (!value) {
      return undefined;
    }

    const formattedValue: AlgorithmKisaoDescriptionFragment[] = [];
    let prevEnd = 0;

    const regExp = /\[(https?:\/\/.*?)\]/gi;
    let match;
    while ((match = regExp.exec(value)) !== null) {
      if (match.index > 0) {
        formattedValue.push({
          type: AlgorithmKisaoDescriptionFragmentType.text,
          value: value.substring(prevEnd, match.index),
        });
      }
      prevEnd = match.index + match[0].length;
      formattedValue.push({
        type: AlgorithmKisaoDescriptionFragmentType.href,
        value: match[1],
      });
    }
    if (prevEnd < value?.length) {
      formattedValue.push({
        type: AlgorithmKisaoDescriptionFragmentType.text,
        value: value.substring(prevEnd),
      });
    }
    return formattedValue;
  }
}
