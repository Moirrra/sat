import requests from '@/utils/request'

// 初始化场景轨道数据
export const reqInitOrbit = (start, end) => requests({
  url: 'orbit/init',
  method: 'post',
  data: {
    start,
    end,
  }
})

// 创建卫星轨道数据
export const reqCreateOrbit = (start, end, satellite) => requests({
  url: 'orbit/create',
  method: 'post',
  data: {
    start,
    end,
    satellite
  }
})