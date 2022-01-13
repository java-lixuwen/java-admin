<template>
  <!--  这部分都是 上面的 form 表单 和查询 -->
  <div id="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="书籍ID">
        <el-input v-model="bookQuery.id" placeholder="书籍ID"/>
      </el-form-item>

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
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="bookQuery.erjiFenlei" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
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

      <!--    **********************************************************-->
      <el-table-column label="一级分类">
        <template slot-scope="scope">
          {{ scope.row.yijiFenlei === 1 ? '是' : '否'}}
        </template>
      </el-table-column>
      <!--      **********************************************************-->
      <el-table-column label="二级分类">
        <template slot-scope="scope">
          {{ scope.row.erjiFenlei === 1 ? '是' : '否'}}
        </template>
      </el-table-column>
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
  </div>
</template>
<!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
<script>
  //③
  import book from '@/api/cms/book';
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
        importBtnDisabled: false // ## 按钮是否禁用,false为不禁用
      }

    },
    //④
    created() { //生命周期，在页面尚未渲染之前调用， data与methods 已经被初始化
      this.pageBook()
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
      }
    }
  }
</script>
<style scoped>
</style>
