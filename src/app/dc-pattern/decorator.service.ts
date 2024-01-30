import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(message: string) {
    console.log(`LoggingService: ${message}`);
  }
}

export function LoggingDecorator(loggingService: LoggingService) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;


    descriptor.value = function(...args: any[]) {
      loggingService.log(`${key} method called with arguments: ${args}`);
      const result = originalMethod.apply(this, args);
      loggingService.log(`${key} method finished with result: ${result}`);
      return result;
    };

    return descriptor;
  };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(loggingService: LoggingService) {}

  @LoggingDecorator(LoggingService.prototype)
  getData(args: any) {
    // some data processing logic
    return 'data';
  }
}
