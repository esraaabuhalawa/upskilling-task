import { HttpInterceptorFn } from '@angular/common/http';

export const loaderInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
