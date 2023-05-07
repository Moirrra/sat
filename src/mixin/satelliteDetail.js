import { mapState } from 'vuex'
export const mixins = {
  data() {
    return {
      longitude: '',
      latitude: '',
      height: '',
    }
  },
  computed: {
    ...mapState({
      satOnShow: state => state.satOnShow,
    }),
  },
  mounted() {
    this.$store.commit('INIT_SAT_ON_SHOW')
  },
  methods: {
    // 获取卫星信息
    getSatInfoById(id) {
      this.$store.dispatch('getSatById', id)
    },
    // 更新卫星位置信息
    updateInfo(obj) {
      // console.log('updateInfo in satDetail')
      this.longitude = obj.longitude.toFixed(2) + '°'
      this.latitude = obj.latitude.toFixed(2) + '°'
      this.height = (obj.height / 1000).toFixed(2) + ' km'
    },
    goSatInfo() {
      let url = this.$router.resolve(`satellite_info/${this.satOnShow.id}`)
      window.open(url.href)
    }
  },
}