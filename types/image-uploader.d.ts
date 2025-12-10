import { VueConstructor } from 'vue';

export interface ImageUploaderProps {
  /** 绑定值（图片URL或URL数组） */
  value?: string | Array<string>;
  /** 上传地址 */
  action: string;
  /** 请求头 */
  headers?: Record<string, any>;
  /** 上传时附带的额外参数 */
  uploadData?: Record<string, any>;
  /** 上传的文件字段名 */
  name?: string;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 最大上传数量 */
  limit?: number;
  /** 列表类型 */
  listType?: 'text' | 'picture' | 'picture-card';
  /** 接受的文件类型 */
  accept?: string;
  /** 文件大小限制（MB） */
  maxSize?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示提示 */
  showTip?: boolean;
  /** 提示文本 */
  tipText?: string;
  /** 自定义上传前校验 */
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
}

export interface ImageUploaderEvents {
  /** 值改变事件 */
  change: (value: string | Array<string>) => void;
  /** 输入事件 */
  input: (value: string | Array<string>) => void;
  /** 上传成功事件 */
  success: (response: any, file: any, fileList: Array<any>) => void;
  /** 上传失败事件 */
  error: (err: any, file: any, fileList: Array<any>) => void;
  /** 超出限制事件 */
  exceed: (files: Array<File>, fileList: Array<any>) => void;
  /** 删除文件事件 */
  remove: (file: any, fileList: Array<any>) => void;
  /** 预览图片事件 */
  preview: (file: any) => void;
}

export interface ImageUploaderMethods {
  /** 清空文件列表 */
  clearFiles: () => void;
}

declare class ImageUploader extends VueConstructor {
  $props: ImageUploaderProps;
}

export default ImageUploader;
