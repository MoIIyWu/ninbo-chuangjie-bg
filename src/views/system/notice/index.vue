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
      <el-form-item label="新闻标题" prop="title">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入新闻标题"
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
          v-hasPermi="['system:notice:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:notice:remove']"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="noticeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="100" align="center" type="index" />
      <el-table-column
        label="新闻标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="新闻图片" align="center" :formatter="formatter">
        <template scope="scope">
          <img
            :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${scope.row.fileUrl}`"
            width="100px"
            height="100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" prop="source" width="100" />
      <el-table-column
        label="点击次数"
        align="center"
        prop="clickCount"
        width="100"
      />
      <el-table-column
        label="新闻内容"
        align="center"
        prop="content"
        width="100"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <p v-html="scope.row.content"></p>
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
            v-hasPermi="['system:notice:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteById(scope.row)"
            v-hasPermi="['system:notice:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改新闻对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="新闻标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入新闻标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-input v-model="form.source" placeholder="请输入新闻来源" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="新闻图片" prop="fileUrl" v-if="!form.id">
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
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="新闻图片" prop="fileUrl" v-else>
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
              <div>
              <img
                :src="`${GLOBAL.BASE_URL}/api/common/open/download?name=${this.form.fileUrl}`"
                width="100px"
                height="100px"
              />
            </div>
                <el-button size="small" type="primary">点击更换新闻图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <editor v-model="form.content" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNotice,
  getNotice,
  delNotice,
  addNotice,
  updateNotice,
} from "@/api/system/notice";
import store from "@/store";

export default {
  name: "Notice",
  dicts: ["sys_notice_status", "sys_notice_type"],
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.token, //headers属性中添加token，这个属性是el-upload自带的用来设置上传请求头部
      },
      fileList: [],
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
      // 新闻表格数据
      noticeList: [],
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
        title: [
          { required: true, message: "新闻标题不能为空", trigger: "blur" },
        ],
        source: [
          { required: true, message: "新闻来源不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询新闻列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then((response) => {
        this.noticeList = response.data.records;
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
        title: "",
        content: "",
        fileUrl: "",
        source:''
      };
      this.fileList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加新闻";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getNotice(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新闻";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != "") {
            updateNotice(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      let _this = this;
      this.$modal
        .confirm('是否确认删除该新闻?')
        .then(function () {
          return delNotice(_this.ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleDeleteById(row){
      let deleteArr = [];
      deleteArr.push(row.id);
      this.$modal
        .confirm('是否确认删除该新闻?')
        .then(function () {
          return delNotice(deleteArr);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    formatter(row, column) {
      return row.fileUrl;
    },

    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSuccess(response, file, fileList) {
      console.log("response===", response.msg);
      this.form.fileUrl = response.msg;
    },
  },
};
</script>
<style lang="scss" scoped></style>
<style>
.el-tooltip__popper {
  max-width: 500px;
  background: rgb(0, 13, 53);
  border: 1px solid #1e88c6;
}
</style>
