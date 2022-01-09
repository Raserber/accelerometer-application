<template>
  <base-layout>
    <simple-chart @changeAxes="changeAxes" v-if="axes.length === 1" :axes="axes" :accel="accel"/>
    <double-chart @changeAxes="changeAxes" v-else-if="axes.length === 2" :axes="axes" :accel="accel"/>
    <triple-chart v-else-if="axes.length === 3" :axes="axes" :accel="accel"/>
  </base-layout>
</template>

<script>
import BaseLayout from "../../../components/layouts/baseLayout"
import SimpleChart from "../../../components/charts/simpleChart";
import {useStore} from "vuex";
import DoubleChart from "../../../components/charts/doubleChart";
import TripleChart from "../../../components/charts/tripleChart";


export default {

  name: "chartPage",

  components: {
    TripleChart,
    DoubleChart,
    SimpleChart,
    BaseLayout
  },

  data: () => ({
    axes: undefined,
    accel: undefined
  }),

  methods: {
    changeAxes: function (newAxes) {
      this.axes = newAxes
    }
  },

  beforeMount() {
    this.axes = this.$route.query.axes
    this.accel = this.$route.query.accel

  },

  setup() {
    const store = useStore()

    return {
      start: () => store.commit("startAcquisition"),
      stop: () => store.commit("stopAcquisition")
    }
  }
}
</script>

<style scoped>

</style>
