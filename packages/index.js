import ProductSelector from './components/ProductSelector';
import ImageUploader from './components/ImageUploader';

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
};

// 判断是否是直接引入文件，如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.0',
  install,
  ProductSelector,
  ImageUploader
};

// 按需引入
export {
  ProductSelector,
  ImageUploader
};
