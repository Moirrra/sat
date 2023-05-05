const moment = require('moment')
const satellite = require('satellite.js')
const julian = require('julian')


module.exports = function tles2czml(start, end, tles, gap = 300, completed = false, fixedColor = false, colorStr = "") {
  // 间隔的分钟数
  let minsInDuration = (end.getTime() - start.getTime()) / 60000
  // 设置开始时间
  let startTime = moment(start.toISOString()).toISOString()
  // 设置结束时间
  let endTime = moment(end.toISOString()).toISOString()
  // 初始化czml数据
  let tempCZML = []
  // 第一个packet代表Cesium场景
  tempCZML.push({
    "id": "document",
    "name": "CZML Point - Time Dynamic",
    "version": "1.0",
    "clock": {
      "interval": `${startTime}/${endTime}`, // 仿真时间
      "multiplier": 60, // 启动场景后的仿真倍速
      "range": "LOOP_STOP", // 达到终止时间后重新循环
      "step": "SYSTEM_CLOCK_MULTIPLIER"
    }
  })

  // 轨道颜色
  // fixedColor true所有卫星轨道固定一种颜色 false随机
  let color = fixedColor ? rgba2array(colorStr) : ""

  // 处理每一个卫星
  for (let index = 0; index < tles.length; index++) {
    if (!tles[index].name || !tles[index].tle1 || !tles[index].tle2) {
      console.log('wrong tle')
      return
    }
    let sat_id = tles[index].id
    let sat_name = tles[index].name
    let pos = [] // 保存位置信息

    if (!fixedColor) color = getColor()
    // console.log(color)

    // 初始化一条卫星记录
    let satrec = satellite.twoline2satrec(tles[index].tle1, tles[index].tle2)
    //satrec.no：以弧度/分钟为单位的平均运动，一天有1440分钟，一弧度是0.159155圈
    // 每天绕地旋转圈数
    let totalIntervalsInDay = satrec.no * 1440 * 0.159155

    // 运行一圈的分钟数
    let minsPerInterval = 1440 / totalIntervalsInDay

    // current time 和 epoch time 之间的秒数 原单位是毫秒
    let sec = (start - julian.toDate(satrec.jdsatepoch)) / 1000
    // 每gap秒计算一个位置信息 获得一圈的位置
    for (let i = sec; i <= sec + minsInDuration * gap; i += gap) {
      // 计算当前卫星位置和速度
      let positionAndVelocity = satellite.sgp4(satrec, i * 0.0166667) // 0.0166667min = 1sec
      // 地惯坐标系
      let positionEci = positionAndVelocity.position
      positionEci.x = positionEci.x * 1000
      positionEci.y = positionEci.y * 1000
      positionEci.z = positionEci.z * 1000
      pos.push(i - sec, positionEci.x, positionEci.y, positionEci.z)
    }

    // 轨迹保留
    let leadTime = completed ? minsPerInterval*60 : 0

    let initialCZMLProps =
    {
      "id": `${sat_id}`,
      "name": `${sat_name}`,
      "availability": `${startTime}/${endTime}`, // 仿真时间
      "label": {
        "fillColor": {
          "rgba": [
            255, 255, 255, 255
          ]
        },
        "font": "24pt Helvetica",
        scale: 0.5,
        "horizontalOrigin": "LEFT",
        "outlineColor": {
          "rgba": [
            0, 0, 0, 255
          ]
        },
        "outlineWidth": 1,
        "pixelOffset": {
          "cartesian2": [
            12, 0
          ]
        },
        "show": true,
        "style": "FILL_AND_OUTLINE",
        "text": `${sat_name}`,
        "verticalOrigin": "CENTER"
      },
      "path": { // 轨迹
        "material": {
          "solidColor": {
            "color": {
              "rgba": color,
            }
          }
        },
        "resolution": 120,
        // 动画绘制前方的轨迹时间 
        "leadTime": leadTime,
        // 动画绘制出的轨迹时间
        "trailTime": minsPerInterval*60
      },
      // "model": {
      //   "show": true,
      //   "gltf": "models/satellite.glb",
      //   "minimumPixelSize": 55,
      // },
      "point": {
        "color": {
            "rgba": color
        },
        "pixelSize": 10
      },
      "position": {
        // 采用拉格朗日插值法
        "interpolationAlgorithm": "LAGRANGE",
        // 差值算法填补轨道
        "interpolationDegree": 5,
        // 参考坐标系，地惯坐标系
        "referenceFrame": "INERTIAL",
        "epoch": `${startTime}`,
        "cartesian": pos // 卫星位置数据
      }
    }
    tempCZML.push(initialCZMLProps)
  }
  return tempCZML
}

// 随机生成一种颜色
function getColor() {
  return [
    Math.floor(100 + 155 * Math.random(0, 1)),
    Math.floor(100 + 155 * Math.random(0, 1)),
    Math.floor(100 + 155 * Math.random(0, 1)),
    255
  ]
}

function rgba2array(rgba) {
  let val = rgba.match(/(\d(\.\d+)?)+/g)
  let res = val.map(x => parseInt(x))
  res[3] = 255
  return res
}