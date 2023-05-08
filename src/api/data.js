import requests from '@/utils/request'

// 更新数据库atellite
export const reqDownloadSat = () => requests.get('data/update_tle')

// 更新数据库satellite_info
export const reqDownloadSatInfo = () => requests.get('data/update_sat')

export const reqDownloadTLE = (id) => requests({
  url: 'data/download_tle',
  method: 'get',
  params: {
    id
  }
})

export const reqDownloadTLEList = (idList) => requests({
  url: 'data/download_tle_list',
  method: 'post',
  data: {
    idList
  },
  responseType: 'blob'
})

export const reqUploadTLE = (formData) => requests({
  url: 'data/upload_tle',
  method: 'post',
  data: formData,
  
})