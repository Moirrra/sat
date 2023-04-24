import requests from '@/utils/request'

// 创建卫星
export const reqCreateCollection = (collection) => requests({
  url: `collection/create`,
  method: 'post',
  data: collection,
})

// 获取指定Collection
export const reqCollectionById = (id) => requests({
  url: `collection/info`,
  method: 'get',
  params: {
    id,
  }
})

// 获取所有Collection
export const reqAllCollections = () => requests.get('collection/info_all')


// 更新数据库中的Collection信息
export const reqUpdateCollection = (collection) => requests({
  url: `collection/update`,
  method: 'put',
  data: collection,
})

// 根据Id删除一个Collection信息
export const reqDeleteCollection = (id) => requests({
  url: `collection/delete`,
  method: 'delete',
  params: {
    id,
  }
})

// 删除所有卫星信息
export const reqDeleteAllCollections = () => requests.delete('collection/delete_all')