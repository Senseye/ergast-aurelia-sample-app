import moment from 'moment';
export const defaultDateFormat = 'MMMM Do, YYYY';

export class DateFormatValueConverter {
  toView(value, format) {
    format = format || defaultDateFormat;
    return moment(value).format(format);
  }
}
