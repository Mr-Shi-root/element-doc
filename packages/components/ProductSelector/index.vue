<template>
  <div class="product-selector">
    <el-input
      v-model="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      @focus="handleOpen"
    >
      <el-button slot="append" icon="el-icon-search" @click="handleOpen"></el-button>
    </el-input>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="product-selector-dialog">
        <!-- 搜索区域 -->
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            :placeholder="searchPlaceholder"
            clearable
            @keyup.enter.native="handleSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>

        <!-- 商品列表 -->
        <el-table
          ref="productTable"
          :data="productList"
          :height="tableHeight"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="multiple"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            v-else
            width="55"
          >
            <template slot-scope="scope">
              <el-radio
                :label="scope.row[valueKey]"
                v-model="selectedRadio"
                @change="handleRadioChange(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="商品名称"
            min-width="200"
          ></el-table-column>
          <el-table-column
            prop="productCode"
            label="商品编码"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="120"
          >
            <template slot-scope="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            label="库存"
            width="100"
          ></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductSelector',
  props: {
    // 绑定值
    value: {
      type: [String, Number, Array],
      default: ''
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '请选择商品'
    },
    // 搜索占位文本
    searchPlaceholder: {
      type: String,
      default: '请输入商品名称或编码'
    },
    // 对话框标题
    title: {
      type: String,
      default: '选择商品'
    },
    // 对话框宽度
    dialogWidth: {
      type: String,
      default: '800px'
    },
    // 表格高度
    tableHeight: {
      type: [String, Number],
      default: 400
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 数据源（如果不传则需要通过 fetchData 方法获取）
    data: {
      type: Array,
      default: () => []
    },
    // 获取数据的方法
    fetchData: {
      type: Function,
      default: null
    },
    // 值的键名
    valueKey: {
      type: String,
      default: 'productId'
    },
    // 显示的键名
    labelKey: {
      type: String,
      default: 'productName'
    }
  },
  data() {
    return {
      dialogVisible: false,
      searchKeyword: '',
      productList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectedProducts: [],
      selectedRadio: ''
    };
  },
  computed: {
    displayValue() {
      if (this.multiple) {
        return this.selectedProducts.map(item => item[this.labelKey]).join(', ');
      } else {
        const selected = this.selectedProducts[0];
        return selected ? selected[this.labelKey] : '';
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.initSelectedProducts(val);
      }
    }
  },
  methods: {
    // 初始化已选商品
    initSelectedProducts(val) {
      if (!val) {
        this.selectedProducts = [];
        return;
      }
      // 这里需要根据实际业务逻辑来获取已选商品的详细信息
      // 示例中简化处理
    },
    // 打开对话框
    handleOpen() {
      if (this.disabled) return;
      this.dialogVisible = true;
      this.loadData();
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
      this.searchKeyword = '';
      this.currentPage = 1;
    },
    // 加载数据
    async loadData() {
      this.loading = true;
      try {
        if (this.fetchData && typeof this.fetchData === 'function') {
          // 通过自定义方法获取数据
          const params = {
            keyword: this.searchKeyword,
            page: this.currentPage,
            pageSize: this.pageSize
          };
          const result = await this.fetchData(params);
          this.productList = result.list || [];
          this.total = result.total || 0;
        } else {
          // 使用传入的静态数据
          this.productList = this.data;
          this.total = this.data.length;
        }
      } catch (error) {
        this.$message.error('获取商品列表失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },
    // 多选改变
    handleSelectionChange(selection) {
      this.selectedProducts = selection;
    },
    // 单选改变
    handleRadioChange(row) {
      this.selectedProducts = [row];
    },
    // 确认选择
    handleConfirm() {
      if (this.selectedProducts.length === 0) {
        this.$message.warning('请选择商品');
        return;
      }

      if (this.multiple) {
        const values = this.selectedProducts.map(item => item[this.valueKey]);
        this.$emit('input', values);
        this.$emit('change', this.selectedProducts);
      } else {
        const value = this.selectedProducts[0][this.valueKey];
        this.$emit('input', value);
        this.$emit('change', this.selectedProducts[0]);
      }

      this.handleClose();
    }
  }
};
</script>

<style scoped>
.product-selector {
  width: 100%;
}

.product-selector-dialog {
  padding: 0 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}
</style>
