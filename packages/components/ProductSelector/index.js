import ProductSelector from './index.vue';

ProductSelector.install = function(Vue) {
  Vue.component(ProductSelector.name, ProductSelector);
};

export default ProductSelector;
