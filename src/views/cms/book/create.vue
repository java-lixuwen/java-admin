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
    <el-form-item>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveBook()">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import book from '@/api/cms/book'

    export default {
      data() {
        return {
          book: {},
          saveBtnDisabled: false, // ##不禁用保存按钮
          BASE_API: process.env.VUE_APP_BASE_API
        }
      },
      methods:{
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
         }
      }
    }
</script>

<style scoped>

</style>
