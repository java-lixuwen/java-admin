<template>
  <el-form label-width="130px">
    <el-form-item label="书名">
      <el-col :span="5">
        <el-input v-model="book.bookName"/>
      </el-col>
    </el-form-item>
    <el-form-item label="作者">
      <el-col :span="5">
        <el-input v-model="book.author"/>
      </el-col>
    </el-form-item>
    <!-- TODO 分类 -->
    <el-form-item label="一级分类">
      <el-select @change="getErjiCategoryList" v-model="book.yijiFenlei" placeholder="请选择">
        <el-option
          v-for="item in yijiFenleiList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="book.erjiFenlei" placeholder="请选择">
        <el-option
          v-for="item in erjiFenleiList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>







    <!-- TODO 版权 -->
    <!-- TODO 批次 -->
    <!-- TODO 书单 -->
    <el-form-item label="授权开始时间">
      <el-date-picker
        v-model="book.shouquankaishiTime"
        type="datetime"
        placeholder="选择开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>
    <el-form-item label="授权结束时间">
      <el-date-picker
        v-model="book.shouquanjieshuTime"
        type="datetime"
        placeholder="选择结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>
    <el-form-item label="连载">
      <el-select v-model="book.lianzai" clearable placeholder="请选择">
        <el-option :value="1" label="是"/>
        <el-option :value="0" label="否"/>
      </el-select>
    </el-form-item>
    <el-form-item label="全本收费">
      <el-select v-model="book.shoufei" clearable placeholder="请选择">
        <el-option :value="1" label="收费"/>
        <el-option :value="0" label="免费"/>
      </el-select>
    </el-form-item>
    <el-form-item label="原创">
      <el-select v-model="book.yuanchuang" clearable placeholder="请选择">
        <el-option :value="1" label="是"/>
        <el-option :value="0" label="否"/>
      </el-select>
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="book.jianjie" :rows="10" type="textarea"/>
    </el-form-item>
    <!-- TODO 书封 -->
    <el-form-item label="书封">
      <el-upload
        class="avatar-uploader"
        :action="BASE_API+'/oss/uploadFile'"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="book.imageUrl" :src="book.imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveBook()">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import book from '@/api/cms/book'
  import category from '@/api/cms/category'

    export default {
      data() {
        return {
          book: {
            imageUrl: '',
            yijiFenlei: '',
            erjiFenlei: ''
          },
          saveBtnDisabled: false, // ##不禁用保存按钮
          BASE_API: process.env.VUE_APP_BASE_API, //后端服务地址  相当于后端的登录时候的 localhost：
          yijiFenleiList: [], //一级分类列表
          erjiFenleiList: []  //二级分类列表

        }
      },
      created() {
        this.getYijiCategoryList()
      },
      methods: {
        saveBook() {
          // 禁用按钮
          this.saveBtnDisabled = true
          //新增书籍方法
          book.saveBook(this.book)
            .then(response => {
              //提示信息
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              //保存成功后跳转到list 页面
              this.$router.push('/cms/book/list')
            })
        },
        handleAvatarSuccess(res, file) {
          this.book.imageUrl = res.data.uploadUrl
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M;
        },
        getYijiCategoryList() {
          category.getCategoryList()
            .then(response => {
              this.yijiFenleiList = response.data.items
            })
        },
        getErjiCategoryList(value) {
          //清空
          this.book.erjiFenlei = '';

          for (let i = 0; i < this.yijiFenleiList.length; i++) {
            if (value === this.yijiFenleiList[i].id) {
              this.erjiFenleiList = this.yijiFenleiList[i].erjiFenleiList
            }
          }
        }
      }
    }


</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style scoped>

</style>
