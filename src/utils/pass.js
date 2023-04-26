const satellite = require('satellite.js')
const deg2rad = Math.PI / 180
const orbitPeriod = 10 

function positionECI(time) {
  return satellite.propagate(this.satrec, time).position;
}

function positionECF(time) {
  const positionEci = this.positionECI(time);
  const gmst = satellite.gstime(time);
  const positionEcf = satellite.eciToEcf(positionEci, gmst);
  return positionEcf;
}

function computePasses(
  groundStationPosition, 
  startDate, 
  endDate, 
  minElevation = 10, 
  maxPasses = 50
  ) {
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
      const positionEcf = positionECF(date)
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
        pass.eng = date.getTime()
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