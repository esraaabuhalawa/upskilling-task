import { HttpInterceptorFn } from '@angular/common/http';

export const headingInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const cloneHeader = req.clone({
     setHeaders: {
      'app-id': '64fc4a747b1786417e354f31'
    }
  })

  return next(cloneHeader);
};
