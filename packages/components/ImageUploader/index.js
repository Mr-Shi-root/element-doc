import ImageUploader from './index.vue';

ImageUploader.install = function(Vue) {
  Vue.component(ImageUploader.name, ImageUploader);
};

export default ImageUploader;
