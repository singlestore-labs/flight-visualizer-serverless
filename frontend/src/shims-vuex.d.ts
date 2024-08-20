import { Store } from './store';

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
