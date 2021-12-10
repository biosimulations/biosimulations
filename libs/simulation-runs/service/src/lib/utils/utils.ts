import * as arrayShape from '@stdlib/array-shape';
import * as array2iterator from '@stdlib/array-to-iterator';
import * as iterLast from '@stdlib/iter-last';
import * as iterSlice from '@stdlib/iter-slice';
import * as array from '@stdlib/ndarray-array';
import * as ndarray2array from '@stdlib/ndarray-base-to-array';
import * as ind2sub from '@stdlib/ndarray-ind2sub';
import * as iterprod from '@stdlib/stats-iter-prod';
import { ndarray } from '@stdlib/types/ndarray';

export interface FlatTaskResults {
  data: any[][];
  outerShape: number[];
}

export function flattenTaskResults(data: any[][]): FlatTaskResults {
  const shape: number[] = arrayShape([data[0]]);
  const outerShape: number[] = shape.slice(1, shape.length - 1);
  const flatShape: number[] = [
    iterprod(iterSlice(array2iterator(shape), 0, shape.length - 1)),
    iterLast(array2iterator(shape)),
  ];
  return {
    data: data
      .map((datum): any[][] => {
        const datumNdArray = array([datum], {shape: shape});
        return ndarray2array(datumNdArray.data, flatShape, [ 2, 1 ], 0, 'row-major');
      }),
    outerShape: outerShape,
  };
}

export function getRepeatedTaskTraceLabel(index: number, shape: number[]): string {
  const subs = ind2sub(shape, index);
  return `Subtask ${subs.map((i: number) => { return (i + 1).toString()}).join('-')}`;
}
