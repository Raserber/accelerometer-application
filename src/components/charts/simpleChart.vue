<template>
  <chart-template @timeLimit="timeLimitChange" :axes="axes" :chartTime="{time,counter,counterSave}" @toSpeed="requestSpeed"
                  @time="getTime" @changeAxes="changeAxes"
                  :allowChangingAxes="true" @requestCSV="requestCSV" :call="callCSV" :csv="csv" :haveSpeed="haveSpeed">
    <highcharts class="hc" :options="!haveSpeed ? chartOptions : chartOptionsSpeed"/>
  </chart-template>
</template>

<script>
import {Chart} from "highcharts-vue"
import Highcharts from "highcharts"

import {useStore} from "vuex";
import {computed} from "vue";

import exportingInit from "highcharts/modules/exporting"
import exportDataInit from "highcharts/modules/export-data"

import ChartTemplate from "./chartTemplate";

exportingInit(Highcharts)
exportDataInit(Highcharts)

export default {
  name: 'simpleChart',

  props: {
    axes: {
      type: String,
      default: "0"
    },
    accel: {
      type: String,
      default: "0"
    }
  },

  components: {
    ChartTemplate,
    highcharts: Chart
  },

  data: () => ({
    callCSV: false,
    isOpen: false,
    counter: 0,
    counterSave: 0,
    chartOptions: {
      chart: {
        type: "spline",
        width: 400,
        boostThreshold: 1,
        turboThreshold: 0,
        animation: false
      },
      exporting: {
        fallbackToExportServer: false,
        enabled: false
      },
      xAxis: {
        title: {
          text: "Temps (s)"
        }
      },
      yAxis: {
        title: {
          text: "Acceleration $"
        }
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      title: {
        text: 'Accélération $ de votre téléphone',
        align: "center",
        widthAdjust: -200
      },
      series: [
        {
          name: "en $",
          data: [],
          color: "$"
        }]
    },
    chartOptionsSpeed: {
      chart: {
        type: "spline",
        width: 400,
        boostThreshold: 1,
        turboThreshold: 0,
        animation: true
      },
      exporting: {
        fallbackToExportServer: false,
        enabled: false
      },
      xAxis: {
        title: {
          text: "Temps (s)"
        }
      },
      yAxis: {
        title: {
          text: "Vitesse $"
        }
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      title: {
        text: 'Vitesse $ de votre téléphone',
        align: "center",
        widthAdjust: -200
      },
      series: [
        {
          name: "en $",
          data: [],
          color: "$"
        }]
    },
    interval: undefined,
    timeout: undefined,
    csv: undefined,
    time: undefined,
    pointsLimited: false,
    pointsLimitedTime: -2,
    tPrec: 1,
    vPrec: 0
  }),

  methods: {

    getTime: function (e) {
      this.time = e
      this.counterSave = this.counter
    },

    requestSpeed: function (info) {
      if (!info) {
        this.chartOptionsSpeed.series[0].data = []
      } else {
        this.chartOptionsSpeed.series[0].data = this.chartOptions.series[0].data.map((x) => {


          let a = Number(x[0]) === 0 ? 0 : (Number(x[1]).toFixed(1) * (Number(x[0] - this.tPrec)).toFixed(1) + this.vPrec)
          this.tPrec = Number(x[0])
          this.vPrec = a
          return ([x[0], a])
        })
      }
    },

    intervalSet: function () {

      if (this.pointsLimitedTime > 0) {
        setTimeout(() => {
          this.pointsLimited = true
        }, this.pointsLimitedTime)
      }

      this.interval = setInterval(() => {


        this.chartOptions.series[0].data.push([this.counter * 0.1, parseFloat(this.acceleration.toFixed(2))])

        if (this.pointsLimited) {
          this.chartOptions.series[0].data.shift()
        }

        this.counter++
      }, 100)
    },

    timeoutSet: function (time) {
      this.timeout = setTimeout(() => {
        this.stopAcquisition()
        this.time = undefined
      }, time)
    },

    requestCSV: function () {
      this.csv = this.csvResponse().search("0") !== -1 ? this.csvResponse() : undefined
      this.callCSV = !this.callCSV
    },

    init: function () {
      switch (this.axes % 3) {

        case 0:
          this.chartOptions.series[0].name = "en x"
          this.chartOptions.series[0].color = "red"
          this.chartOptionsSpeed.series[0].name = "en x"
          this.chartOptionsSpeed.series[0].color = "red"
          break

        case 1:
          this.chartOptions.series[0].name = "en y"
          this.chartOptions.series[0].color = "green"
          this.chartOptionsSpeed.series[0].name = "en y"
          this.chartOptionsSpeed.series[0].color = "green"
          break

        case 2:
          this.chartOptions.series[0].name = "en z"
          this.chartOptions.series[0].color = "blue"
          this.chartOptionsSpeed.series[0].name = "en z"
          this.chartOptionsSpeed.series[0].color = "blue"
          break
      }

      switch (this.accel) {

        case "0":
          this.chartOptions.title.text = this.axes.length === 1 ? "Accélération linéaire" : "Accélérations linéaires"
          this.chartOptions.yAxis.title.text = "Accélération (m/s^1)"
          this.chartOptionsSpeed.title.text = this.axes.length === 1 ? "Vitesse linéaire" : "Vitesses linéaires"
          this.chartOptionsSpeed.yAxis.title.text = "Vitesse (m/s^1)"
          break

        case "1":
          this.chartOptions.title.text = this.axes.length === 1 ? "Accélération angulaire" : "Accélérations angulaires"
          this.chartOptions.yAxis.title.text = "Accélération (rad/s^1)"
          this.chartOptions.title.text = this.axes.length === 1 ? "Vitesse angulaire" : "Vitesses angulaires"
          this.chartOptions.yAxis.title.text = "Vitesse (rad/s^1)"
          break
      }
    },

    changeAxes: function (newAxes) {
      this.$emit("changeAxes", newAxes)
    },

    timeLimitChange: function (e) {
      this.pointsLimitedTime = e * 1000
    }
  },

  setup(props) {
    const store = useStore()

    const highcharts = Highcharts

    return {
      acceleration: computed(() => store.state.acceleration[Number(props.axes) + Number(props.accel) * 3]),

      acquisition: computed(() => store.state.acquisition),

      reset: computed(() => store.state.reset),

      stopAcquisition: () => store.commit("stopAcquisition"),

      csvResponse: () => (highcharts.charts[0].getCSV(false))
    }
  },

  watch: {
    acquisition: function (now) {
      this.chartOptionsSpeed.series[0].data = []
      if (now) {
        this.intervalSet()
        if (this.time) {
          this.timeoutSet(this.time - this.counter * 0.1)
        }
      } else {
        clearInterval(this.interval)
        try {
          clearTimeout(this.timeout)
        } catch (e) {
          console.log(e)
        }
      }
    },


    reset: function () {
      this.chartOptionsSpeed.series[0].data = []
      this.pointsLimited = false
      try {
        clearInterval(this.interval)
        clearTimeout(this.timeout)
      } catch (e) {
        console.log(e)
      }
      this.chartOptions.series[0].data = []
      this.counter = 0
      this.time = undefined
    },

    axes: function () {
      this.init()
    }
  },

  mounted() {
    this.chartOptions.chart.width = (window.screen.width * 0.8) || 400
    this.chartOptionsSpeed.chart.width = (window.screen.width * 0.8) || 400

    this.init()
  },

  computed: {
    haveSpeed: function () {
      return (this.chartOptionsSpeed.series[0].data.length > 1)
    }
  },

  emits: ["changeAxes"]
}
</script>

<style scoped>

</style>
