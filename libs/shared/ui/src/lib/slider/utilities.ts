/*Utilities */
export class Utilities {
  public isNumberArray(arr: number[]): boolean {
    return arr && arr.length && arr.filter((value) => !isNaN(value)).length === arr.length ? true : false;
  }
  public isNullOrEmpty(obj: any): boolean {
    return obj === undefined || obj === null || obj === '';
  }
  public toBoolean(obj: any, ...allowedValues: any): boolean {
    return obj === '' || obj === 'true' || allowedValues.indexOf(obj) !== -1 ? true : false;
  }
  public findNextValidStepValue(n: number, step: number): number {
    const divisorsSet1: number[] = [];
    const divisorsSet2: number[] = [];
    const sqrtNum = Math.sqrt(n);
    let newStep = -1;
    for (let i = 0; i < sqrtNum; i++) {
      if (n % i === 0) {
        if (n / i === i) {
          divisorsSet1.push(i);
        } else {
          divisorsSet1.push(i);
          divisorsSet2.push(n / i);
        }
      }
    }
    // Picking newStep by checking large set of divisors first
    for (let i = 0; i < divisorsSet2.length; i++) {
      if (step > divisorsSet2[i]) {
        newStep = divisorsSet2[i];
        break;
      }
    }
    if (newStep === -1) {
      // checking set of small divisors if newStep didn't find out till.
      for (let i = divisorsSet1.length - 1; i >= 0; i--) {
        if (step > divisorsSet1[i]) {
          newStep = divisorsSet1[i];
          break;
        }
      }
    }
    return newStep === -1 ? 1 : newStep;
  }
}
