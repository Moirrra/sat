import requests from '@/utils/request'

// 创建卫星
export const reqCreateSatInfo = (satelliteInfo) => requests({
  url: `satellite_info/create`,
  method: 'post',
  data: satelliteInfo,
})

// 获取指定卫星
export const reqSatInfoById = (id) => requests({
  url: `satellite_info/info`,
  method: 'get',
  params: {
    id,
  }
})

// 获取所有卫星
export const reqAllSatInfo = () => requests.get('satellite_info/info_all')


// 更新数据库中的卫星信息
export const reqUpdateSatInfo = (satellite) => requests({
  url: `satellite_info/update`,
  method: 'put',
  data: satellite,
})

// 根据Id删除一个卫星信息
export const reqDeleteSatInfo = (id) => requests({
  url: `satellite_info/delete`,
  method: 'delete',
  params: {
    id,
  }
})

// 删除所有卫星信息
export const reqDeleteAllSatInfo = () => requests.delete('satellite_info/delete_all')