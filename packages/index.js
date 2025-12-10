import ProductSelector from './components/ProductSelector';
import ImageUploader from './components/ImageUploader';
import { checkVersion } from './utils/version-check';

// 组件版本信息
const componentVersions = {
  ProductSelector: '1.0.0',
  ImageUploader: '1.0.0'
};

// 所有组件列表
const components = [
  ProductSelector,
  ImageUploader
];

// 定义 install 方法
const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;

  // 注册所有组件
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  // 开发环境检查版本更新
  if (process.env.NODE_ENV === 'development') {
    checkVersion();
  }
};

// 判断是否是直接引入文件，如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.0',
  componentVersions,
  install,
  ProductSelector,
  ImageUploader
};

// 按需引入
export {
  ProductSelector,
  ImageUploader,
  componentVersions
};
