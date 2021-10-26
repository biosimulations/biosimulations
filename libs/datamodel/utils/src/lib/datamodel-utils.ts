import { ValueType } from '@biosimulations/datamodel/common';

export function parseValue<T>(
  getKisaoTermName: (id: string) => T,
  type: string,
  val: string | null,
): boolean | number | string | T | null {
  if (val == null || val === '') {
    return null;
  } else {
    if (type === ValueType.kisaoId) {
      return getKisaoTermName(val);
    } else if (type === ValueType.boolean) {
      return ['1', 'true'].includes(val.toLowerCase());
    } else if (type === ValueType.integer) {
      return parseInt(val);
    } else if (type === ValueType.float) {
      return parseFloat(val);
    } else {
      return val;
    }
  }
}

export function formatValue(
  type: ValueType,
  value: boolean | number | string | null,
): string | null {
  if (value == null) {
    return value;
  } else if (type === ValueType.boolean) {
    return value.toString();
  } else if (type === ValueType.integer || type === ValueType.float) {
    const numValue = value as number;
    if (numValue === 0) {
      return '0';
    } else if (numValue < 1e-3 || numValue > 1e3) {
      const exp = Math.floor(Math.log10(numValue));
      const val = numValue / Math.pow(10, exp);
      let valStr: string;
      if (Math.abs((val * 1 - Math.round(val * 1)) / (val * 1)) < 1e-12) {
        valStr = val.toFixed(0);
      } else if (
        Math.abs((val * 1e1 - Math.round(val * 1e1)) / (val * 1e1)) < 1e-12
      ) {
        valStr = val.toFixed(1);
      } else if (
        Math.abs((val * 1e2 - Math.round(val * 1e2)) / (val * 1e2)) < 1e-12
      ) {
        valStr = val.toFixed(2);
      } else {
        valStr = val.toFixed(3);
      }
      return `${valStr}e${exp}`;
    } else {
      return numValue.toString();
    }
  } else {
    return value as string;
  }
}

export function validateValue(
  value: string,
  type: ValueType,
  isKisaoId: (id: string) => boolean,
): boolean {
  let parsedValue: any;
  switch (type) {
    case ValueType.boolean: {
      return ['true', 'false', '1', '0'].includes(value.toLowerCase());
    }
    case ValueType.integer: {
      parsedValue = parseInt(value);
      return !isNaN(parsedValue) && parsedValue === parseFloat(value);
    }
    case ValueType.float: {
      return !isNaN(parseFloat(value));
    }
    case ValueType.string: {
      return true;
    }
    case ValueType.kisaoId: {
      return isKisaoId(value);
    }
    case ValueType.list: {
      try {
        return Array.isArray(JSON.parse(value));
      } catch {
        return false;
      }
    }
    case ValueType.object: {
      try {
        parsedValue = JSON.parse(value);
        return (
          parsedValue != null &&
          typeof parsedValue !== 'string' &&
          typeof parsedValue !== 'number' &&
          !Array.isArray(parsedValue)
        );
      } catch {
        return false;
      }
    }
    case ValueType.any: {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
    default: {
      throw new Error(`type '${type}' is not supported`);
    }
  }
}

export function getFileExtension(filename: string): string {
  return filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
  );
}
