<template>
  <div class="image-uploader">
    <el-upload
      :action="action"
      :headers="headers"
      :data="uploadData"
      :name="name"
      :multiple="multiple"
      :limit="limit"
      :file-list="fileList"
      :list-type="listType"
      :accept="accept"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :disabled="disabled"
    >
      <template v-if="listType === 'picture-card'">
        <i class="el-icon-plus"></i>
      </template>
      <template v-else>
        <el-button size="small" type="primary" :disabled="disabled">
          <i class="el-icon-upload"></i> 点击上传
        </el-button>
      </template>
      <div slot="tip" class="el-upload__tip" v-if="showTip">
        {{ tipText }}
      </div>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog
      :visible.sync="previewVisible"
      :append-to-body="true"
      width="800px"
    >
      <img :src="previewUrl" style="width: 100%;" alt="预览图片">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  props: {
    // 绑定值（图片URL或URL数组）
    value: {
      type: [String, Array],
      default: ''
    },
    // 上传地址
    action: {
      type: String,
      required: true
    },
    // 请求头
    headers: {
      type: Object,
      default: () => ({})
    },
    // 上传时附带的额外参数
    uploadData: {
      type: Object,
      default: () => ({})
    },
    // 上传的文件字段名
    name: {
      type: String,
      default: 'file'
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 最大上传数量
    limit: {
      type: Number,
      default: 1
    },
    // 列表类型
    listType: {
      type: String,
      default: 'picture-card',
      validator: (val) => ['text', 'picture', 'picture-card'].includes(val)
    },
    // 接受的文件类型
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png,image/gif'
    },
    // 文件大小限制（MB）
    maxSize: {
      type: Number,
      default: 5
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示提示
    showTip: {
      type: Boolean,
      default: true
    },
    // 提示文本
    tipText: {
      type: String,
      default: ''
    },
    // 自定义上传前校验
    beforeUpload: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewUrl: ''
    };
  },
  computed: {
    computedTipText() {
      if (this.tipText) return this.tipText;
      const types = this.accept.split(',').map(t => t.split('/')[1]).join('/');
      return `支持 ${types} 格式，单个文件不超过 ${this.maxSize}MB`;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.initFileList(val);
      }
    }
  },
  methods: {
    // 初始化文件列表
    initFileList(val) {
      if (!val) {
        this.fileList = [];
        return;
      }

      if (Array.isArray(val)) {
        this.fileList = val.map((url, index) => ({
          uid: Date.now() + index,
          name: this.getFileName(url),
          url: url,
          status: 'success'
        }));
      } else if (typeof val === 'string' && val) {
        this.fileList = [{
          uid: Date.now(),
          name: this.getFileName(val),
          url: val,
          status: 'success'
        }];
      } else {
        this.fileList = [];
      }
    },
    // 从URL中提取文件名
    getFileName(url) {
      if (!url) return '';
      const parts = url.split('/');
      return parts[parts.length - 1] || 'image';
    },
    // 上传前校验
    handleBeforeUpload(file) {
      // 文件类型校验
      const acceptTypes = this.accept.split(',').map(t => t.trim());
      const isValidType = acceptTypes.some(type => {
        if (type.endsWith('/*')) {
          const mainType = type.split('/')[0];
          return file.type.startsWith(mainType + '/');
        }
        return file.type === type;
      });

      if (!isValidType) {
        this.$message.error(`只能上传 ${this.accept} 格式的图片`);
        return false;
      }

      // 文件大小校验
      const isValidSize = file.size / 1024 / 1024 < this.maxSize;
      if (!isValidSize) {
        this.$message.error(`图片大小不能超过 ${this.maxSize}MB`);
        return false;
      }

      // 自定义校验
      if (this.beforeUpload && typeof this.beforeUpload === 'function') {
        return this.beforeUpload(file);
      }

      return true;
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      // 根据实际后端返回格式调整
      const url = response.data?.url || response.url || '';

      if (!url) {
        this.$message.error('上传失败：未获取到图片地址');
        return;
      }

      file.url = url;
      this.updateValue(fileList);
      this.$emit('success', response, file, fileList);
      this.$message.success('上传成功');
    },
    // 上传失败
    handleError(err, file, fileList) {
      this.$message.error('上传失败，请重试');
      this.$emit('error', err, file, fileList);
    },
    // 超出限制
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传 ${this.limit} 张图片`);
      this.$emit('exceed', files, fileList);
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.updateValue(fileList);
      this.$emit('remove', file, fileList);
    },
    // 预览图片
    handlePreview(file) {
      this.previewUrl = file.url;
      this.previewVisible = true;
      this.$emit('preview', file);
    },
    // 更新绑定值
    updateValue(fileList) {
      const urls = fileList
        .filter(file => file.status === 'success' && file.url)
        .map(file => file.url);

      if (this.multiple) {
        this.$emit('input', urls);
        this.$emit('change', urls);
      } else {
        const value = urls[0] || '';
        this.$emit('input', value);
        this.$emit('change', value);
      }
    },
    // 清空文件列表
    clearFiles() {
      this.fileList = [];
      this.$emit('input', this.multiple ? [] : '');
      this.$emit('change', this.multiple ? [] : '');
    }
  }
};
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.image-uploader >>> .el-upload--picture-card {
  width: 148px;
  height: 148px;
  line-height: 148px;
}

.image-uploader >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 148px;
  height: 148px;
}
</style>
