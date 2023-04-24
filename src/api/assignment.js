import requests from '@/utils/request'

// 创建Assignment
export const reqCreateAssignment = (collection_id, satellite_id) => requests({
  url: `assignment/create`,
  method: 'post',
  data: {
    collection_id,
    satellite_id,
  }
})

// 获取指定Assignment
export const reqAssignmentById = (id) => requests({
  url: `assignment/info`,
  method: 'get',
  params: {
    id,
  }
})

// 获取指定Collection的Assignment信息
export const reqAssignmentByCollection =  (id) => requests({
  url: `assignment/info_collection`,
  method: 'get',
  params: {
    id,
  }
})

// 获取指定Satellite的Assignment信息
export const reqAssignmentBySatellite =  (id) => requests({
  url: `assignment/info_satellite`,
  method: 'get',
  params: {
    id,
  }
})

// 获取所有Assignment
export const reqAllAssignments = () => requests.get('assignment/info_all')


// 根据Id删除一个Assignment信息
export const reqDeleteAssignment = (id) => requests({
  url: `assignment/delete`,
  method: 'delete',
  params: {
    id,
  }
})

// 根据collection_id删除Assignment信息
export const reqDeleteAssignmentByCollection = (id) => requests({
  url: `assignment/delete_collection`,
  method: 'delete',
  params: {
    id,
  }
})

// 根据satellite_id删除Assignment信息
export const reqDeleteAssignmentBySatellite = (id) => requests({
  url: `assignment/delete_satellite`,
  method: 'delete',
  params: {
    id,
  }
})

// 删除所有Assignment信息
export const reqDeleteAllAssignments = () => requests.delete('assignment/delete_all')

