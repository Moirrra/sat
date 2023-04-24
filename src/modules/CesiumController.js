import * as Cesium from 'cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'

export class CesiumController {
  constructor() {
    this.minimalUI = false
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      geocoder: false,
      baseLayerPicker: false,
      infoBox: false,
      timeline: !this.minimalUI,
      vrButton: !this.minimalUI,
    })

    // 默认设置
    this.viewer.clock.shouldAnimate = true
    this.viewer.scene.maximumRenderTimeChange = 1 / 30
    this.viewer.scene.requestRenderMode = true
  }
}