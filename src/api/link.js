import requests from '@/utils/request'

// 创建Link
export const reqCreateLink = (link) => requests({
  url: `link/create`,
  method: 'post',
  data: {
    link
  }
})

// 创建多个Link
export const reqCreateLinkList = (collection_id, list) => requests({
  url: `link/create_many`,
  method: 'post',
  data: {
    collection_id,
    list,
  }
})

// 获取指定Link
export const reqLinkById = (id) => requests({
  url: `link/info`,
  method: 'get',
  params: {
    id,
  }
})

// 获取指定Collection的Link信息
export const reqLinkByCollection = (id) => requests({
  url: `link/info_collection`,
  method: 'get',
  params: {
    id,
  }
})

// 获取指定Satellite的Link信息
export const reqLinkBySatellite = (id) => requests({
  url: `link/info_satellite`,
  method: 'get',
  params: {
    id,
  }
})

// 获取所有Link
export const reqAllLinks = () => requests.get('link/info_all')


// 根据Id删除一个Link信息
export const reqDeleteLink = (id) => requests({
  url: `link/delete`,
  method: 'delete',
  params: {
    id,
  }
})

// 根据collection_id删除Link信息
export const reqDeleteLinkByCollection = (id) => requests({
  url: `link/delete_collection`,
  method: 'delete',
  params: {
    id,
  }
})

// 根据satellite_id删除Link信息
export const reqDeleteLinkBySatellite = (id) => requests({
  url: `link/delete_satellite`,
  method: 'delete',
  params: {
    id,
  }
})

// 根据satellite_id删除Link信息
export const reqDeleteLinkByColSat = (collection_id, satellite_id) => requests({
  url: `link/delete_col_sat`,
  method: 'delete',
  params: {
    collection_id,
    satellite_id
  }
})

// 删除所有Link信息
export const reqDeleteAllLinks = () => requests.delete('link/delete_all')

