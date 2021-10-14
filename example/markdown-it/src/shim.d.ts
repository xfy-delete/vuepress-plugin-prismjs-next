declare module '*.vue' {
  import { defineComponent, FunctionalComponent } from 'vue';

  const Component: ReturnType<typeof defineComponent> | FunctionalComponent;
  export default Component;
}
