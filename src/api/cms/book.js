import request from '@/utils/request'       //封装 axios    实现 异步请求

const api_name = '/cms/book'     //因为需要都访问这个路径，所以直接定义出来
//默认导出
export default {
  //根据条件进行分页查询
  pageBook(pageNum,pageSize,bookQuery){           //
    return request({
      url:`${api_name}/${pageNum}/${pageSize}`,     // 请求的路径
      method:'post',           //请求方式
      data:bookQuery         // 发送的参数
    })
  },
  //新增（添加）书籍
  saveBook(book){
    return request({
      url:`${api_name}/saveBook`,
      method:'post',
      data:book
    })
  },
  //回显
  view(bookId){
    return request({
      url:`${api_name}/${bookId}`,
      method:'get'
    })
  },
  updateBook(book){ //修改书籍
    return request({
      url: `${api_name}/updateBook`,
      method: 'put',
      data: book
    })
  },
  deleteBook(bookId){ //删除书籍
    return request({
      url: `${api_name}/${bookId}`,
      method: 'delete',
    })
  },
  shangxiajiaBook(bookId,zhuangtai){  // 上下架书籍
    return request({
      url:`${api_name}/${bookId}/${zhuangtai}`,
      method: 'put',
    })
  }
}
