<template>
  <!--  这部分都是 上面的 form 表单 和查询 -->
  <div id="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="书籍ID">
        <el-input v-model="bookQuery.id" placeholder="书籍ID"/>
      </el-form-item >
      <el-form-item label="书名">
        <el-input v-model="bookQuery.bookName" placeholder="书名"/>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="bookQuery.author" placeholder="作者"/>
      </el-form-item>
      <el-form-item label="连载">
        <el-select v-model="bookQuery.lianzai" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="状态">
        <el-select v-model="bookQuery.zhuangtai" clearable placeholder="请选择">
          <el-option :value="1" label="已上线"/>
          <el-option :value="0" label="未上线"/>
        </el-select>
      </el-form-item>

      <el-form-item label="原创">
        <el-select v-model="bookQuery.yuanchuang" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>

      <el-form-item label="一级分类">
        <el-select v-model="bookQuery.yijiFenlei" clearable placeholder="请选择">
<!--          <el-option :value="1" label="是"/>-->
<!--          <el-option :value="0" label="否"/>-->
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="bookQuery.erjiFenlei" clearable placeholder="请选择">
<!--          <el-option :value="1" label="是"/>-->
<!--          <el-option :value="0" label="否"/>-->
        </el-select>
      </el-form-item>

      <el-form-item label="全本收费">
        <el-select v-model="bookQuery.shoufei" clearable placeholder="请选择">
          <el-option :value="1" label="收费"/>
          <el-option :value="0" label="免费"/>
        </el-select>
      </el-form-item>

      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="bookQuery.shouquankaishiDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="bookQuery.shouquanjieshuDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <!-- 原型上的按钮-->
      <el-button type="primary" @click="pageBook">查询</el-button>
      <el-button type="primary" @click="reset()">清空</el-button>
      <router-link :to="'/cms/book/create'">
        <el-button type="primary">添加书籍</el-button>
      </router-link>
      <el-button type="primary" @click="daochuExcel">导出<i class="el-icon-download el-icon--right"></i></el-button>
      <el-button type="primary" @click="excelDialogVisible=true">导入<i class="el-icon-upload el-icon--right"></i></el-button>



    </el-form>

    <!--&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7-->

    <!-- 列表 -->
    <el-table :data="bookList" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="书籍ID" width="80"/>
      <el-table-column prop="bookName" label="书名"/>
      <el-table-column prop="author" label="作者"/>
      <el-table-column prop="yijiFenlei" label="一级分类" :formatter="formatYiji"/>
      <el-table-column prop="erjiFenlei" label="二级分类" :formatter="formatErji"/>
      <!--      **********************************************************-->
      <el-table-column label="连载">
        <template slot-scope="scope">
          {{ scope.row.lianzai === 1 ? '是' : '否'}}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column prop="wordNumber" label="总字数"/>
      <!--      **********************************************************-->
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.zhuangtai === 1 ? '上线' : '未上线'}}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column label="全本收费">
        <template slot-scope="scope">
          {{ scope.row.shoufei === 1 ? '收费' : '免费' }}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column prop="shouquankaishiTime" label="授权开始时间"/>
      <el-table-column prop="shouquanjieshuTime" label="授权结束时间"/>
      <!--      **********************************************************-->
      <el-table-column label="原创">
        <template slot-scope="scope">
          {{ scope.row.yuanchuang === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          <!-- 当前时间大于授权结束时间 则是 过期-->
          {{ currentTime > scope.row.shouquanjieshuTime ? '过期' : '有效' }}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteBook(scope.row.id, scope.row.zhuangtai)">删除</el-button>
          <!--##########################################################################################################################################-->
          <router-link :to="'/cms/book/update/'+scope.row.id">
            <el-button type="primary" size="mini">修改</el-button>
          </router-link>
          <!--##########################################################################################################################################-->
          <el-button v-if="scope.row.zhuangtai === 0" type="danger" size="mini" icon="el-icon-delete"
                     @click="shangxiajiaBook(scope.row.id, 1)">上架书籍
          </el-button>
          <el-button v-else type="danger" size="mini" @click="shangxiajiaBook(scope.row.id, 0)">下架书籍</el-button>
          <!--##########################################################################################################################################-->




        </template>
      </el-table-column>
    </el-table>
    <!--    **********************************************************-->
    <!-- 分页-->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :page-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total,prev,pager,next,jumper"
      @current-change="pageBook1">
    </el-pagination>
    <!--    **********************************************************-->
    <!--EasyExcel导入窗口-->
    <el-dialog
      title="Excel导入"
      :visible.sync="excelDialogVisible"
      width="30%">
      <el-upload
        ref="upload"
        name="file"
        accept="application/vnd.ms-excel"
        :action="BASE_API + '/cms/book/daoruExcel'"
        :on-success="fileUploadSuccess"
        :on-error="fileUploadError"
        :disabled="importBtnDisabled"
        :limit="1"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="daoruExcel">上传到服务器</el-button>
      </el-upload>
    </el-dialog>

  </div>
</template>
<!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
<script>
  //③
  import book from '@/api/cms/book';
  import category from "@/api/cms/category";
  //①
  export default {
    // ##data用来定义变量，并为其初始化内容
    data() {
      return {
        bookList: null, // ##数据列表
        bookQuery: {},// ##查询条件封装对象
        total: 0, // ## 总计路数
        pageNo: 1, // ##页码
        pageSize: 5,// ## 每页显示记录数
        currentTime: '',// ##当前时间
        BASE_API: process.env.VUE_APP_BASE_API, // ## 接口API地址
        excelDialogVisible: false, // ## 导入Excel窗口, false为关闭
        importBtnDisabled: false, // ## 按钮是否禁用,false为不禁用
        yijiFenleiList:[], // 一级分类列表
        erjiFenleiList:[]  // 二级分类列表
      }

    },
    //④
    created() { //生命周期，在页面尚未渲染之前调用， data与methods 已经被初始化
      this.pageBook()
      this.getYijiCategoryList()
    },
    methods: {
      // ## 查询数据列表
      pageBook() {
        book.pageBook(this.pageNo, this.pageSize, this.bookQuery)
          .then(response => {
            // ## 赋值
            this.bookList = response.data.items
            this.total = response.data.total
            this.currentTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          })
      },
      //分页的方法
      pageBook1(pageNo = 1) {
        this.pageNo = pageNo
        book.pageBook(this.pageNo, this.pageSize, this.bookQuery)
          .then(response => {
            // ## 赋值
            this.bookList = response.data.items
            this.total = response.data.total
          })
      },
      //授权状态 有效 过期 通过当前时间
      format(date, fmt) { // ## 格式化日期
        let o = {
          'M+': date.getMonth() + 1, // ## 月份
          'd+': date.getDate(), // ## 日
          'H+': date.getHours(), // ## 小时
          'm+': date.getMinutes(), // ## 分
          's+': date.getSeconds(), // ## 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // ## 季度
          'S': date.getMilliseconds() // ## 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o)
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
      },
      reset() { //根据查询条件内容
        //清空
        this.bookQuery = {}
        // 重新查询对象，指向空对象
        this.pageBook()
      },
      deleteBook(bookId, zhuangtai) {
        //状态为上线，不能删除  上面的弹出消息框
        if (zhuangtai === 1) {
          this.$message({
            type: 'error',
            message: '此书籍为上线状态，不允许删除！'
          })
          return
        }
        //点击删除按钮 ，弹出的 确定删除 按钮 的提示框
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {  // 确定删除的话 走下面的删除
          book.deleteBook(bookId)
            .then(response => {
              // 调用删除的api
              this.$message({   // 提示消息
                type: 'success',
                message: '删除成功!'
              })
              // 删除成功后 需要重新查询一下，才能的到最新的数据
              this.pageBook()
            })
        }).catch(() => {  // 如果不删除了，点击取消了 然后会弹出取消删除的 消息框，这个也可以不写
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      shangxiajiaBook(bookId, zhuangtai) {
        //点击上下架按钮 ，弹出的 确定 按钮 的提示框
        this.$confirm('此操作将改变书籍状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {  // 确定改变的话 走下面的删除
          book.shangxiajiaBook(bookId, zhuangtai)
            .then(response => {
              // 调用删除的api
              this.$message({   // 提示消息
                type: 'success',
                message: '设置成功!'
              })
              // 设置成功后 需要重新查询一下，才能的到最新的数据
              this.pageBook()
            })
        }).catch(() => {  // 如果不设置了，点击取消了 然后会弹出取消设置的 消息框，这个也可以不写
          this.$message({
            type: 'info',
            message: '已取消设置'
          })
        })
      },
      daochuExcel(){ // EasyExvel导出
        document.location.href = this.BASE_API + '/cms/book/daochuExcel'
      },

      daoruExcel() { // ## 导入Excel
        this.importBtnDisabled = true   // ## 禁用按钮
        this.$refs.upload.submit()    // ## 上传
      },
      fileUploadSuccess(response) { // ## 导入成功后执行方法
        // ## 导入成功后关闭窗口
        this.excelDialogVisible = false
        // ## 重新查询获取新数据
        this.pageBook();
        // ## 提示信息
        this.$message({
          type: 'success',
          message: '导入成功'
        })
      },
      fileUploadError() { // ## 导入失败后执行方法
         // ## 提示信息
        this.$message({
          type: 'error',
          message: '导入失败'
        })
      },
      getYijiCategoryList() {   // 获取一级分类列表
        category.getCategoryList()
          .then(response => {
            this.yijiFenleiList = response.data.items
          })
      },
      formatYiji(row){ // 一级分类显示    row表示当前这一行
        //循环一级分类
        for (let i = 0; i <this.yijiFenleiList.length ; i++) {
          // 判断当前行的一级分类是否等于 一级分类的id
          if (row.yijiFenlei === this.yijiFenleiList[i].id){
                 // 等于 则返回 一级分类的分类名称
                 return this.yijiFenleiList[i].title
          }
        }
      },
      formatErji(row){ // 二级分类显示
          // row 表示当前这一行的属于一级分类  循环一级分类
        for (let i = 0; i <this.yijiFenleiList.length ; i++) {
          // 判断当前行的一级分类是否等与 一级分类的id
          if (row.yijiFenlei === this.yijiFenleiList[i].id){
            // 等于 则继续循环 二级分类，   因为一级分类包含二级分类， 所以通过一级分类循环二级分类
            for (let j = 0; j <this.yijiFenleiList[i].erjiFenleiList.length ; j++) {
              // 判断当前行的二级分类 是否 等于二级分类id
              if (row.erjiFenlei === this.yijiFenleiList[i].erjiFenleiList[j].id ){
                //等于  则 返还二级分类的分类名称
                return this.yijiFenleiList[i].erjiFenleiList[j].title
              }
            }
          }
        }
      }
    }
  }
</script>
<style scoped>
</style>
