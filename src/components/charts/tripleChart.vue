<template>
  <chart-template @timeLimit="timeLimitChange" :axes="axes" :chartTime="{time,counter,counterSave}" @time="getTime"
                  @requestCSV="requestCSV" :call="callCSV" :csv="csv">
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
  name: 'tripleChart',

  props: {
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
          name: "en x",
          data: [],
          color: "red"
        },
        {
          name: "en y",
          data: [],
          color: "green"
        },
        {
          name: "en z",
          data: [],
          color: "blue"
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
        this.chartOptions.series[0].data.push([this.counter * 0.1, parseFloat(this.acceleration1.toFixed(3))])
        this.chartOptions.series[1].data.push([this.counter * 0.1, parseFloat(this.acceleration2.toFixed(3))])
        this.chartOptions.series[2].data.push([this.counter * 0.1, parseFloat(this.acceleration3.toFixed(3))])

        if(this.pointsLimited) {
          this.chartOptions.series[0].data.shift()
          this.chartOptions.series[1].data.shift()
          this.chartOptions.series[2].data.shift()
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
      switch (this.accel) {

        case "0":
          this.chartOptions.title.text = "Accélérations linéaires"
          this.chartOptions.yAxis.title.text = "Accélération (m/s^2)"
          break

        case "1":
          this.chartOptions.title.text = "Accélérations angulaires"
          this.chartOptions.yAxis.title.text = "Accélération (rad/s^2)"
          break
      }
    },

    timeLimitChange: function (e) {
        this.pointsLimitedTime = e*1000
    }
  },

  setup(props) {
    const store = useStore()

    const highcharts = Highcharts

    return {
      acceleration1: computed(() => store.state.acceleration[props.accel * 3]),

      acceleration2: computed(() => store.state.acceleration[1 + Number(props.accel) * 3]),

      acceleration3: computed(() => store.state.acceleration[2 + Number(props.accel) * 3]),

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
      this.chartOptions.series[2].data = []
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
  }

}
</script>

<style scoped>

</style>
