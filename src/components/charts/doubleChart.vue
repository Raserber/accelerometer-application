<template>
  <chart-template @timeLimit="timeLimitChange" :axes="axes" :chartTime="{time,counter,counterSave}" @time="getTime" @changeAxes="changeAxes"
                  :allowChangingAxes="true" @requestCSV="requestCSV" :call="callCSV" :csv="csv">
    <highcharts class="hc" :options="chartOptions"/>
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
  name: 'doubleChart',

  props: {
    axes: {
      type: String,
      default: "01"
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
        },
        {
          name: "en $",
          data: [],
          color: "$"
        }
      ]
    },
    interval: undefined,
    timeout: undefined,
    csv: undefined,
    time: undefined,
    pointsLimited: false,
    pointsLimitedTime: -2
  }),

  methods: {

    getTime: function (e) {
      this.time = e
      this.counterSave = this.counter
    },

    intervalSet: function () {

      if (this.pointsLimitedTime>0) {
        setTimeout(()=>{
          this.pointsLimited = true
        }, this.pointsLimitedTime)
      }

      this.interval = setInterval(() => {
        this.chartOptions.series[0].data.push([this.counter * 0.1, parseFloat(this.acceleration1.toFixed(2))])
        this.chartOptions.series[1].data.push([this.counter * 0.1, parseFloat(this.acceleration2.toFixed(2))])

        if(this.pointsLimited) {
          this.chartOptions.series[0].data.shift()
          this.chartOptions.series[1].data.shift()
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
      for (let i = 0; i < 2; i++) {
        switch (this.axes.split("")[i] % 3) {

          case 0:
            this.chartOptions.series[i].name = "en x"
            this.chartOptions.series[i].color = "red"
            break

          case 1:
            this.chartOptions.series[i].name = "en y"
            this.chartOptions.series[i].color = "green"
            break

          case 2:
            this.chartOptions.series[i].name = "en z"
            this.chartOptions.series[i].color = "blue"
            break
        }
      }

      switch (this.accel) {

        case "0":
          this.chartOptions.title.text = this.axes.length === 1 ? "Accélération linéaire" : "Accélérations linéaires"
          this.chartOptions.yAxis.title.text = "Accélération (m/s^2)"
          break

        case "1":
          this.chartOptions.title.text = this.axes.length === 1 ? "Accélération angulaire" : "Accélérations angulaires"
          this.chartOptions.yAxis.title.text = "Accélération (rad/s^2)"
          break
      }
    },

    changeAxes: function (newAxes) {
      this.$emit("changeAxes", newAxes)
    },

    timeLimitChange: function (e) {
        this.pointsLimitedTime = e*1000
    }
  },

  setup(props) {
    const store = useStore()

    const highcharts = Highcharts

    return {
      acceleration1: computed(() => store.state.acceleration[Number(props.axes.split("")[0]) + Number(props.accel) * 3]),

      acceleration2: computed(() => store.state.acceleration[Number(props.axes.split("")[1]) + Number(props.accel) * 3]),

      acquisition: computed(() => store.state.acquisition),

      reset: computed(() => store.state.reset),

      stopAcquisition: () => store.commit("stopAcquisition"),

      csvResponse: () => (highcharts.charts[0].getCSV(false))
    }
  },

  watch: {
    acquisition: function (now) {
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
      this.pointsLimited = false
      try {
        clearInterval(this.interval)
        clearTimeout(this.timeout)
      } catch (e) {
        console.log(e)
      }
      this.chartOptions.series[0].data = []
      this.chartOptions.series[1].data = []
      this.counter = 0
      this.time = undefined
    },

    axes: function () {
      this.init()
    }
  },

  mounted() {
    this.chartOptions.chart.width = (window.screen.width * 0.8) || 400

    this.init()
  },

  emits: ["changeAxes"]
}
</script>

<style scoped>

</style>
