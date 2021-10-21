export class FormatService {
  static formatDate(value: Date): string {
    return (
      value.getFullYear() +
      '-' +
      ('0' + (value.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + value.getDate()).slice(-2)
    );
  }

  static formatTime(value: Date): string {
    return (
      value.getFullYear().toString() +
      '-' +
      (value.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      value.getDate().toString().padStart(2, '0') +
      ' ' +
      (((value.getHours() - 1) % 12) + 1).toString().padStart(2, '0') +
      ':' +
      value.getMinutes().toString().padStart(2, '0') +
      ':' +
      value.getSeconds().toString().padStart(2, '0') +
      ' ' +
      (value.getHours() <= 11 ? 'AM' : 'PM')
    );
  }

  static formatNumberOfOrderUnity(value: number, digits = 2): string {
    if (value === Math.round(value)) {
      return Math.round(value).toString();
    } else {
      return value.toFixed(digits);
    }
  }

  static formatDuration(valueSec: number): string {
    let magnitude!: number;
    let units!: string;
    if (valueSec >= 7 * 24 * 60 * 60) {
      magnitude = valueSec / (7 * 24 * 60 * 60);
      units = 'w';
    } else if (valueSec >= 24 * 60 * 60) {
      magnitude = valueSec / (24 * 60 * 60);
      units = 'd';
    } else if (valueSec >= 60 * 60) {
      magnitude = valueSec / (60 * 60);
      units = 'h';
    } else if (valueSec >= 60) {
      magnitude = valueSec / 60;
      units = 'm';
    } else if (valueSec >= 1) {
      magnitude = valueSec;
      units = 's';
    } else {
      magnitude = valueSec * 1000;
      units = 'ms';
    }

    if (magnitude === Math.round(magnitude)) {
      return magnitude.toString() + ' ' + units;
    } else {
      return magnitude.toFixed(1) + ' ' + units;
    }
  }

  static formatDigitalSize(valueBytes: number, base=1e3): string {
    let quantity!: number;
    let suffix!: string;

    if (valueBytes >= base ** 5) {
      quantity = valueBytes / (base ** 5);
      suffix = 'PB';
    } else if (valueBytes >= base ** 4) {
      quantity = valueBytes / (base ** 4);
      suffix = 'TB';
    } else if (valueBytes >= base ** 3) {
      quantity = valueBytes / (base ** 3);
      suffix = 'GB';
    } else if (valueBytes >= base ** 2) {
      quantity = valueBytes / (base ** 2);
      suffix = 'MB';
    } else if (valueBytes >= base) {
      quantity = valueBytes / base;
      suffix = 'KB';
    } else {
      quantity = valueBytes;
      suffix = 'B';
    }

    let quantityStr!: string;

    if (quantity === Math.round(quantity)) {
      quantityStr = Math.round(quantity).toString();
    } else if (quantity >= 100) {
      quantityStr = quantity.toFixed(1);
    } else if (quantity >= 10) {
      quantityStr = quantity.toFixed(2);
    } else {
      quantityStr = quantity.toFixed(3);
    }

    return quantityStr + ' ' + suffix;
  }
}