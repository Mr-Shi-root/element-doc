import { VueConstructor } from 'vue';

export interface ProductSelectorProps {
  /** 绑定值 */
  value?: string | number | Array<string | number>;
  /** 是否多选 */
  multiple?: boolean;
  /** 占位文本 */
  placeholder?: string;
  /** 搜索占位文本 */
  searchPlaceholder?: string;
  /** 对话框标题 */
  title?: string;
  /** 对话框宽度 */
  dialogWidth?: string;
  /** 表格高度 */
  tableHeight?: string | number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 静态数据源 */
  data?: Array<any>;
  /** 获取数据的方法 */
  fetchData?: (params: {
    keyword: string;
    page: number;
    pageSize: number;
  }) => Promise<{
    list: Array<any>;
    total: number;
  }>;
  /** 值的键名 */
  valueKey?: string;
  /** 显示的键名 */
  labelKey?: string;
}

export interface ProductSelectorEvents {
  /** 值改变事件 */
  change: (value: any) => void;
  /** 输入事件 */
  input: (value: any) => void;
}

declare class ProductSelector extends VueConstructor {
  $props: ProductSelectorProps;
}

export default ProductSelector;
