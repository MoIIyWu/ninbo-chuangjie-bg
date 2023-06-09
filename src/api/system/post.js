import request from "@/utils/request";

// 根据ID获取分类
export function getByGroupById(id) {
  return request({
    url: "/api/group/open/getByGroupById?id=" + id,
    method: "get",
  });
}

// 删除分类
export function deleteGroup(id) {
  return request({
    url: "/api/group/deleteGroupById?id=" + id,
    method: "delete",
  });
}


// 添加分类
export function addGroup(group) {
  return request({
    url: "/api/group/addGroup",
    method: "post",
    data: group
  });
}

// 获取所有分类
export function getGroupList() {
  return request({
    url: "/api/group/open/getAllGroup",
    method: "get"
  });
}

// 查询产品列表
export function listPost(data) {
  return request({
    url: "/api/product/open/getProduct",
    method: "post",
    data: data,
  });
}

// 查询商品详细
export function getPost(id) {
  return request({
    url: `/api/product/getProductById?id=${id}`,
    method: "get",
  });
}

// 新增商品
export function addPost(data) {
  return request({
    url: "/api/product/uploadProduct",
    method: "post",
    data: data,
  });
}

// 修改商品
export function updatePost(data) {
  return request({
    url: "/api/product/updateProduct",
    method: "put",
    data: data,
  });
}

// 删除商品
export function delPost(data) {
  return request({
    url: "/api/product/deleteProducts",
    method: "post",
    data,
  });
}

// 删除图片
export function delImg(fileName) {
  return request({
    url: `/api/common/deleteData?fileName=${fileName}`,
    method: "delete",
  });
}
