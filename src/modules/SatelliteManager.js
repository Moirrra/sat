

export class SatelliteManager {
  constructor(viewer) {
    this.viewer = viewer
    this.satellites = []

  }

  addSatFromTle(tle) {
    const sat = new Satellite()
    this.addSat(sat)
  }

  addSat(newSat) {
    // 判断是否存在

    this.satellites.push(newSat)
  }
}