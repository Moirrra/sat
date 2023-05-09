const satellite = require('satellite.js')
const dayjs = require('dayjs')
const deg2rad = Math.PI / 180
const orbitPeriod = 10

function positionECI(satrec, time) {
  return satellite.propagate(satrec, time).position
}

function positionECF(satrec, time) {
  const positionEci = positionECI(satrec, time)
  const gmst = satellite.gstime(time)
  const positionEcf = satellite.eciToEcf(positionEci, gmst)
  return positionEcf;
}

function pad2(num) {
  return String(num).padStart(2, "0");
}

export function computePasses(
  tle,
  groundStationPosition,
  startDate = dayjs().toDate(),
  endDate = dayjs(startDate).add(1, "day").toDate(),
  minElevation = 10,
  maxPasses = 50
) {

  const satrec = satellite.twoline2satrec(tle.tle1, tle.tle2)

  const groundStation = { ...groundStationPosition }
  groundStation.latitude *= deg2rad
  groundStation.longitude *= deg2rad
  groundStation.height /= 1000

  const date = new Date(startDate)
  const passes = []
  let pass = false
  let ongoingPass = false
  let lastElevation = 0

  while (date < endDate) {
    const positionEcf = positionECF(satrec, date)
    const lookAngles = satellite.ecfToLookAngles(groundStation, positionEcf)
    const elevation = lookAngles.elevation / deg2rad

    if (elevation > minElevation) {
      if (!ongoingPass) {
        // start of new pass
        pass = {
          start: date.getTime(),
          azimuthStart: lookAngles.azimuth,
          maxElevation: elevation,
          azimuthApex: lookAngles.azimuth
        }
        ongoingPass = true
      } else if (elevation > pass.maxElevation) {
        // ongoing pass
        pass.maxElevation = elevation
        pass.apex = date.getTime()
        pass.azimuthApex = lookAngles.azimuth
      }
      date.setSeconds(date.getSeconds() + 5)
    } else if (ongoingPass) {
      // end of pass
      pass.end = date.getTime()
      pass.duration = pass.end - pass.start
      pass.azimuthEnd = lookAngles.azimuth
      pass.azimuthStart /= deg2rad
      pass.azimuthApex /= deg2rad
      pass.azimuthEnd /= deg2rad
      passes.push(pass)
      if (passes.length > maxPasses) break
      ongoingPass = false
      lastElevation = -180
      date.setMinutes(date.getMinutes() + orbitPeriod * 0.5)
    } else {
      const deltaElevation = elevation - lastElevation
      lastElevation = elevation
      if (deltaElevation < 0) {
        date.setMinutes(date.getMinutes() + orbitPeriod * 0.5)
        lastElevation = -180
      } else if (elevation < -20) {
        date.setMinutes(date.getMinutes() + 5)
      } else if (elevation < -5) {
        date.setMinutes(date.getMinutes() + 1)
      } else if (elevation < -1) {
        date.setSeconds(date.getSeconds() + 5)
      } else {
        date.setSeconds(date.getSeconds() + 2)
      }
    }
  }

  return passes
}

export function processPasses(passes, time) {
  // console.log('processPasses')
  let passList = []
  time = new Date(time.toString())

  // 时区差 单位：小时
  let offset = new Date().getTimezoneOffset() / 60

  for (let i = 0; i < passes.length; i++) {
    let pass = passes[i]
    let countdown = "ONGOING"
    if (dayjs(pass.end).diff(time) < 0) {
      countdown = "PREVIOUS";
    } else if (dayjs(pass.start).diff(time) > 0) {
      countdown = `${pad2(dayjs(pass.start).diff(time, "days"))}:${pad2(dayjs(pass.start).diff(time, "hours") % 24)}:${pad2(dayjs(pass.start).diff(time, "minutes") % 60)}:${pad2(dayjs(pass.start).diff(time, "seconds") % 60)}`
    }
    // 原来时间为本地时间 需转化为UTC时间
    let start = dayjs(pass.start).add(offset, 'hour')
    let end = dayjs(pass.end).add(offset, 'hour')

    passList.push({
      countdown: countdown,
      start: dayjs(start).format("MM.DD HH:mm:ss"),
      end: dayjs(end).format("HH:mm:ss"),
      el: pass.maxElevation.toFixed(0) + '°',
      az: pass.azimuthApex.toFixed(2) + '°',
    })
  }

  return passList
}
