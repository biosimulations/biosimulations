import validator from 'validator';
export const isEmail = {
  validator: (value: any): boolean => {
    return value == null || validator.isEmail(value);
  },
  message: (props: any): string => `${props.value} is not a valid email`,
};

export const isUrl = {
  validator: (value: any): boolean => {
    return value == null || validator.isURL(value);
  },
  message: (props: any): string => `${props.value} is not a valid email`,
};
