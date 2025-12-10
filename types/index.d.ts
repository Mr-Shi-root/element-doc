import { VueConstructor, PluginObject } from 'vue';

// 组件类型定义
export interface ProductSelectorProps {
  value?: string | number | Array<string | number>;
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  title?: string;
  dialogWidth?: string;
  tableHeight?: string | number;
  disabled?: boolean;
  data?: Array<any>;
  fetchData?: (params: { keyword: string; page: number; pageSize: number }) => Promise<{ list: Array<any>; total: number }>;
  valueKey?: string;
  labelKey?: string;
}

export interface ImageUploaderProps {
  value?: string | Array<string>;
  action: string;
  headers?: Record<string, any>;
  uploadData?: Record<string, any>;
  name?: string;
  multiple?: boolean;
  limit?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  showTip?: boolean;
  tipText?: string;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
}

// 组件声明
export declare class ProductSelector extends VueConstructor {
  $props: ProductSelectorProps;
}

export declare class ImageUploader extends VueConstructor {
  $props: ImageUploaderProps;
}

// 插件声明
export interface ElementBusinessComponentsPlugin extends PluginObject<any> {
  version: string;
  ProductSelector: typeof ProductSelector;
  ImageUploader: typeof ImageUploader;
}

declare const ElementBusinessComponents: ElementBusinessComponentsPlugin;

export default ElementBusinessComponents;

// 按需导入
export { ProductSelector, ImageUploader };

// 全局组件类型扩展
declare module 'vue/types/vue' {
  interface Vue {
    $ELEMENT: any;
  }
}
