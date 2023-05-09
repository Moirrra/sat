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
    // // 获取卫星信息
    // getSatInfoById(id) {
    //   this.$store.dispatch('getSatById', id)
    // },
    goSatInfo() {
      let url = this.$router.resolve(`satellite_info/${this.satOnShow.id}`)
      window.open(url.href)
    }
  },
}