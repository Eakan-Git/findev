type TResponse = {
  error?: boolean;
  status_code: number;
  message?: string[] | string;
  data?: object | object[any];
  error?: string;
};
