import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private prefix: string;
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.prefix = 'tickets-app-';
  }

  getItem(key: string) {
    console.log('getItem')
    if (this.isBrowser) {
      console.log('this.isBrowser')
      return localStorage.getItem(this.prefix + key);
    }
    return undefined;
  }

  setItem(key: string, value: string) {
    if (this.isBrowser) {
      return localStorage.setItem(this.prefix + key, value);
    }
  }

  clear() {
    if (this.isBrowser) {
      for (const key in localStorage) {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

}