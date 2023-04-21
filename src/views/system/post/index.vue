<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
      @submit.native.prevent
    >
      <el-form-item
        label="搜索产品"
        prop="fileName
                                      "
      >
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addGroup"
          v-hasPermi="['system:post:remove']"
          >添加分类
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="100" align="center" type="index" />
      <el-table-column label="产品分类" align="center" prop="productType" />
      <el-table-column label="产品名称" align="center" prop="fileName" />
      <el-table-column label="产品图片" align="center" prop="fileUrl">
        <template scope="scope">
          <img
            :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${scope.row.fileUrl}`"
            width="100px"
            height="100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="产品说明" align="center" prop="manual" />
      <el-table-column label="产品参数" align="center" prop="productParam">
        <template scope="scope">
          <img
            :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${scope.row.productParam}`"
            width="100px"
            height="100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteById(scope.row)"
            v-hasPermi="['system:post:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入产品名称" />
        </el-form-item>
        <!-- 新增或者修改产品 -->
        <el-form-item label="产品图片" prop="fileUrl">
          <el-upload
            class="upload-demo"
            :action="`${GLOBAL.BASE_URL}/api/common/upload`"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="onSuccess"
            :headers="headers"
          >
            <el-button size="small" type="primary" v-if="!this.form.id"
              >点击上传</el-button
            >
            <div v-else>
              <img
                :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${this.form.fileUrl}`"
                width="100px"
                height="100px"
                style="display: block; margin-bottom: 10px"
              />
              <el-button size="small" type="primary"
                >点击更换产品图片</el-button
              >
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品分类" prop="productType">
          <el-cascader
            v-model="form.productType"
            :options="selectForm"
            :props="{
              label: 'groupName',
              value: 'id',
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="产品说明" prop="manual">
          <el-input v-model="form.manual" placeholder="请输入产品说明" />
        </el-form-item>
        <!-- 新增或者修改产品参数 -->
        <el-form-item label="产品参数" prop="productParam">
          <el-upload
            class="upload-demo"
            :action="`${GLOBAL.BASE_URL}/api/common/upload`"
            :on-preview="productParamHandlePreview"
            :on-remove="productParamHandleRemove"
            :before-remove="productParamHandBeforeRemove"
            multiple
            :limit="1"
            :on-exceed="productParamHandleExceed"
            :file-list="productParamFileList"
            :on-success="productParamOnSuccess"
            :headers="headers"
          >
            <el-button size="small" type="primary" v-if="!this.form.id"
              >点击上传</el-button
            >
            <div v-else>
              <img
                :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${this.form.productParam}`"
                width="100px"
                height="100px"
                style="display: block; margin-bottom: 10px"
                alt=""
              />
              <el-button size="small" type="primary"
                >点击更换产品参数图片</el-button
              >
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProductForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类表单 -->
    <el-dialog title="编辑分类" :visible.sync="dialogFormVisible">
      <PageTools :is-show-left="true">
        <!-- <template v-slot:left>一共有{{ total }}条数据</template> -->
        <template v-slot:right>
          <el-button type="primary" size="small" @click="onAddPer(0, '0')"
            >添加权限</el-button
          >
        </template>
      </PageTools>
      <el-card>
        <el-table
          border
          stripe
          :data="groupList"
          default-expand-all
          row-key="id"
        >
          <el-table-column align="center" label="名称" prop="groupName" />
          <el-table-column
            align="center"
            label="操作"
            width="280px
                      "
          >
            <template v-slot="{ row }">
              <el-button
                v-if="row.pid === 0"
                type="primary"
                size="small"
                @click="onAddPer(row.id, row.id)"
                >添加
              </el-button>
              <el-button type="warning" size="small" @click="delPerm(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <el-dialog title="添加分类" :visible.sync="parantGroupVisible">
      <el-form
        :model="options"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="groupName">
          <el-input
            type="text"
            v-model="options.groupName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import PageTools from "@/views/components/PageTools/index.vue";
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
  delImg,
  getGroupList,
  addGroup,
  deleteGroup,
  getByGroupById,
} from "@/api/system/post";

export default {
  name: "Post",
  dicts: ["sys_normal_disable"],
  components: {
    PageTools,
  },
  data() {
    return {
      productType: [],
      groupName: [],
      selectForm: [],
      parantGroupVisible: false,
      ruleForm: {},
      groupList: [],
      options: { groupName: "" },
      dialogFormVisible: false,
      headers: {
        Authorization: "Bearer " + store.getters.token, //headers属性中添加token，这个属性是el-upload自带的用来设置上传请求头部
      },
      fileList: [],
      productParamFileList: [],
      // 图片的路径
      imgUrl: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" },
        ],
        productType: [
          { required: true, message: "产品类型不能为空", trigger: "blur" },
        ],
        manual: [
          { required: true, message: "产品说明不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    submitProductForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updatePost(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleChange(value) {
      console.log(value);
    },
    async addGroup() {
      this.dialogFormVisible = true;
      const res = await getGroupList();
      this.groupList = res.data;
      console.log(this.groupList);
    },
    async delPerm(id) {
      try {
        await this.$confirm("你确定要删除该权限点吗");
        console.log(id);
        let axiosResponse = await deleteGroup(id);
        this.$message.success("删除成功");
        await this.addGroup();
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
    onAddPer(type, id) {
      this.parantGroupVisible = true;
      this.type = type;
      this.id = id;
      this.isVisible = true;
    },
    updateList() {
      this.loadPermissionList();
      this.type = 1;
      this.id = "";
    },
    async onEdit(id) {
      this.parantGroupVisible = true;
      let groupByIdRes = await getByGroupById(id);
      console.log(groupByIdRes.data.groupName);
      this.options.groupName = groupByIdRes.data.groupName;
    },
    handleDeleteById(row) {
      let deleteArr = [];
      deleteArr.push(row.id);
      this.$modal
        .confirm("是否确认删除产品")
        .then(function () {
          return delPost(deleteArr);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 查询产品列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then((response) => {
        this.postList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fileName: "",
        fileUrl: "",
        productType: "",
        manual: "",
      };
      this.fileList = [];
      (this.productParamFileList = []), this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.resetForm("queryForm");
    //   this.handleQuery();
    // },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品";

      const groupRes = await getGroupList();
      this.selectForm = groupRes.data;
      console.log(this.selectForm);
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      const groupRes = await getGroupList();
      this.selectForm = groupRes.data;
      console.log(this.selectForm);
      this.reset();
      const id = row.id || this.ids;
      getPost(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品";
      });
    },
    /** 提交按钮 */
    async submitForm() {
      console.log(this.options);
      this.options.pid = this.type;

      let response = await addGroup(this.options);
      if (response.code === 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
      this.parantGroupVisible = false;
      await this.addGroup();
    },
    /** 删除按钮操作 */
    handleDelete() {
      let _this = this;
      this.$modal
        .confirm("是否确认删除产品")
        .then(function () {
          return delPost(_this.ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/post/export",
        {
          ...this.queryParams,
        },
        `post_${new Date().getTime()}.xlsx`
      );
    },

    async handleRemove(file, fileList) {
      console.log(file, this.fileList, "file, this.fileList==");
      console.log(
        this.fileList[0].response.msg,
        "this.fileList[0].response.msg=="
      );
      await delImg(this.fileList[0].response.msg);
      this.$modal.msgSuccess("删除成功");
    },
    productParamHandleRemove(file, productParamFileList) {
      console.log(file, productParamFileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    productParamHandlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    productParamHandleExceed(files, productParamFileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + productParamFileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    productParamHandBeforeRemove(file, productParamFileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.form.fileUrl = response.msg;
    },
    productParamOnSuccess(response, file, productParamFileList) {
      console.log("response===productParam", response.msg);
      this.productParamFileList = productParamFileList;
      this.form.productParam = response.msg;
    },
  },
};
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
