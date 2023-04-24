import requests from '@/utils/request'

// 创建卫星
export const reqCreateSat = (satellite) => requests({
  url: `satellite/create`,
  method: 'post',
  data: satellite,
})

// 获取指定卫星
export const reqSatById = (id) => requests({
  url: `satellite/info`,
  method: 'get',
  params: {
    id,
  }
})

export const reqSatByIdList = (idList) => requests({
  url: `satellite/info_list`,
  method: 'get',
  params: {
    idList,
  }
})

// 获取所有卫星
export const reqAllSats = () => requests.get('satellite/info_all')


// 更新数据库中的卫星信息
export const reqUpdateSat = (satellite) => requests({
  url: `satellite/update`,
  method: 'put',
  data: satellite,
})

// 根据Id删除一个卫星信息
export const reqDeleteSat = (id) => requests({
  url: `satellite/delete`,
  method: 'delete',
  params: {
    id,
  }
})

// 删除所有卫星信息
export const reqDeleteAllSats = () => requests.delete('satellite/delete_all')