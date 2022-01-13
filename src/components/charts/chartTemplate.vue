<template>
  <ion-popover trigger="openPopoverTime" popover-id="popover-time" reference="event">
    <ion-content>
      <ion-input type="number" inputmode="numeric" placeholder="secondes" v-model="seconds"></ion-input>
      <ion-button @click="testPopover" expand="block">START</ion-button>
    </ion-content>
  </ion-popover>
  <ion-popover trigger="openPopoverOptionsChart" popover-id="popoverOptionsChart" reference="event">
    <ion-header>
      <ion-toolbar>
        <ion-title>Petites options</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-accordion-group :multiple="true">
        <ion-accordion :disabled="checkAcquisition">

          <ion-item slot="header">
            <ion-checkbox style="pointer-events: none" v-model="accordionLimitedTime" :clearInput="true"
                          slot="start"></ion-checkbox>
            <ion-label>plage de temps</ion-label>
            <ion-label>limite d'affichage</ion-label>
          </ion-item>
          <ion-item slot="content" lines="none">
            temps :
            <ion-input type="number" placeholder="secondes" v-model="timeLimit"></ion-input>
          </ion-item>
        </ion-accordion>
        <ion-accordion v-if="allowChangingAxes">
          <ion-item slot="header">
            <ion-label>Changement rapide</ion-label>
          </ion-item>
          <ion-radio-group slot="content" @IonChange="popoverAxesDismiss" :value="newAxes" v-model="newAxes">
            <ion-list v-if="String(axes).length === 1" lines="none">
              <ion-item>
                <ion-label>
                  x
                </ion-label>
                <ion-radio value="0" slot="start"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>
                  y
                </ion-label>
                <ion-radio value="1" slot="start"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>
                  z
                </ion-label>
                <ion-radio value="2" slot="start"></ion-radio>
              </ion-item>
            </ion-list>
            <ion-list v-if="String(axes).length === 2" lines="none">
              <ion-item>
                <ion-label>
                  x + y
                </ion-label>
                <ion-radio value="01" slot="start"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>
                  x + z
                </ion-label>
                <ion-radio value="02" slot="start"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>
                  y + z
                </ion-label>
                <ion-radio value="12" slot="start"></ion-radio>
              </ion-item>
            </ion-list>
          </ion-radio-group>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-popover>
  <ion-card>
    <ion-card-content>
      <ion-list lines="none">
        <ion-item>

          <ion-buttons slot="start">
            <ion-button @click="acquisition ? stopAquisition() : startAquisition()" color="primary" fill="solid"
                        slot="start" mode="ios" shape="round" icon-only>
              <ion-icon :icon="!acquisition ? play : pause"/>
            </ion-button>
            <ion-button id="openPopoverTime" :disabled="acquisition" color="primary" fill="solid" slot="start" mode="ios"
                        shape="round">
              <span v-if="chartTimeNumber">{{ chartTimeNumber }}</span>
              <ion-icon v-else :icon="timerOutline"/>
            </ion-button>
          </ion-buttons>

          <ion-buttons slot="end">
            <ion-button :disabled="acquisition" id="openPopoverOptionsChart" color="primary"
                        fill="solid"
                        slot="end" mode="ios"
                        shape="round" icon-only>
              <ion-icon :icon="pencilOutline"/>
            </ion-button>
            <ion-button @click="doReset" color="primary" fill="solid" slot="end" mode="ios" shape="round" icon-only>
              <ion-icon :icon="reloadOutline"/>
            </ion-button>
          </ion-buttons>

        </ion-item>

        <ion-item>
          <slot/>
        </ion-item>

        <ion-item>

          <ion-buttons mode="ios" slot="start">
            <ion-button @click="requestCSV" fill="outline" color="primary" mode="ios">
              <ion-icon :icon="codeDownloadOutline" slot="start"/>
              CSV
            </ion-button>
            <ion-button @click="ThreeJSFeature" fill="outline" color="primary" mode="ios">
              <ion-icon slot="start" :icon="prismOutline"/>
              3D
            </ion-button>
          </ion-buttons>
          <ion-buttons mode="ios" slot="end">
            <ion-button :disabled="!buttonSpeed && !acquisition" @click="toSpeed" fill="outline" color="primary" mode="ios">
              <ion-icon :icon="!haveSpeed ? speedometerOutline : caretBack"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>

  <ion-modal
      :is-open="isOpen"
      :swipe-to-close="true"
      @didDismiss="isOpen = false"
      mode="ios"
  >
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Exporter sous CSV</ion-title>
        <ion-buttons @click="isOpen = false" slot="end">
          <ion-button>
            <ion-icon :icon="closeCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card button @click="writeToClipboard">
        <ion-card-header>
          <ion-card-title>
            <ion-icon class="ionIcon" :icon="copyOutline"/>
            Copier <span v-if="alertSpeedomeeter && !haveSpeed" style="font-style: italic">(Accélération)</span><span
              v-if="alertSpeedomeeter && haveSpeed" style="font-style: italic">(Vitesse)</span>
          </ion-card-title>
        </ion-card-header>
      </ion-card>
      <ion-card button @click="shareCSV">
        <ion-card-header>
          <ion-card-title>
            <ion-icon class="ionIcon" :icon="shareSocialOutline"/>
            Partager <span v-if="alertSpeedomeeter && !haveSpeed" style="font-style: italic">(Accélération)</span><span
              v-if="alertSpeedomeeter && haveSpeed" style="font-style: italic">(Vitesse)</span>
          </ion-card-title>
        </ion-card-header>
      </ion-card>
      <ion-card button @click="downloadCSV">
        <ion-card-header>
          <ion-card-title>
            <ion-icon class="ionIcon" :icon="downloadOutline"/>
            Télécharger <span v-if="alertSpeedomeeter && !haveSpeed" style="font-style: italic">(Accélération)</span><span
              v-if="alertSpeedomeeter && haveSpeed" style="font-style: italic">(Vitesse)</span>
          </ion-card-title>
        </ion-card-header>
      </ion-card>
    </ion-content>
  </ion-modal>
</template>

<script>

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonList,
  IonItem,
  IonModal,
  alertController,
  IonTitle,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonContent,
  toastController,
  IonPopover,
  popoverController,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox
} from "@ionic/vue"

import {
  speedometerOutline,
  codeDownloadOutline,
  prismOutline,
  copyOutline,
  checkmarkCircle,
  hammer,
  timerOutline,
  reloadOutline,
  play,
  pause,
  pencilOutline,
  close,
  closeCircle,
  caretBack,
  downloadOutline,
  shareSocialOutline
} from "ionicons/icons";


import {Clipboard} from '@capacitor/clipboard';
import {useStore} from "vuex";
import {computed} from "vue";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {Share} from "@capacitor/share";

export default {
  name: "chartTemplate",


  props: {
    haveSpeed: {
      type: Boolean,
      default: null
    },
    csv: {
      type: String,
      default: null
    },
    call: {
      type: Boolean,
      default: false
    },
    allowChangingAxes: {
      type: Boolean,
      default: false
    },
    chartTime: {
      type: Object,
      default: undefined
    },
    axes: {
      type: String
    }
  },

  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonList,
    IonItem,
    IonModal,
    IonContent,
    IonTitle,
    IonHeader,
    IonButtons,
    IonButton,
    IonToolbar,
    IonPopover,
    IonInput,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    IonCheckbox
  },

  data: () => ({
    statut: null,
    caretBack,
    speedometerOutline,
    close,
    codeDownloadOutline,
    prismOutline,
    copyOutline,
    checkmarkCircle,
    hammer,
    timerOutline,
    reloadOutline,
    play,
    pause,
    pencilOutline,
    closeCircle,
    downloadOutline,
    shareSocialOutline,
    isOpen: false,
    alert: false,
    newAxes: "1",
    date1: null,
    seconds: "",
    time: "",
    timeBoo: false,
    errorPopover: "Error",
    accordionLimitedTime: false,
    timeLimit: null,
    alertSpeedomeeter: false,
    buttonSpeed: false
  }),

  methods: {

    changeAxe: function () {
      this.$emit("changeAxes", this.newAxes)
    },

    requestCSV: function () {
      this.$emit('requestCSV', '.')
    },

    toSpeed: async function () {
      if (this.alertSpeedomeeter) {
        this.$emit("toSpeed", !this.haveSpeed)
      } else {
        await this.openToastAdvertingSpeedometeer()
      }
      this.alertSpeedomeeter = true
    },

    writeToClipboard: async function () {
      await Clipboard.write({
        string: this.csv
      })

      await this.openToastClipboardSuccess()
    },

    shareCSV: async function () {
      const date = new Date()
      const fileName = `acquisition-${date.getFullYear()}${date.getDate()}${date.getHours()}${date.getMinutes()}` + ".csv"
      await Filesystem.writeFile({
        path: fileName,
        data: this.csv,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      })
          .then(() => {
            let a = Filesystem.getUri({
              directory: Directory.Cache,
              encoding: Encoding.UTF8,
              path: fileName
            })

            Filesystem.readFile({
              directory: Directory.Cache,
              encoding: Encoding.UTF8,
              path: fileName
            }).then((res) => {
              this.test2 = res.data
            })

            return a
          })
          .then((uriResult) => {
            return Share.share({
              title: fileName,
              text: fileName,
              url: uriResult.uri,
            });
          });

      await this.openToastShareSuccess()
    },

    downloadCSV: async function () {
      const date = new Date()
      const fileName = `acquisition-${date.getFullYear()}${date.getDate()}${date.getHours()}${date.getMinutes()}` + ".csv"
      await Filesystem.writeFile({
        path: fileName,
        data: this.csv,
        directory: Directory.ExternalStorage,
        encoding: Encoding.UTF8
      })

      await this.openToastDownloadSuccess()
    },

    testPopover: async function () {
      if (!this.seconds || this.seconds % 1 !== 0) {
        this.errorPopover = "Les secondes doivent être des nombres entiers !"
        await this.openToastPopover()
      } else {

        if (this.seconds == 0 || this.seconds <= 0) {
          this.errorPopover = "restrictions : positifs, nombres entiers"
          await this.openToastPopover()
        } else {

          this.time = Number(this.seconds) * 1000
          this.timeBoo = !this.timeBoo
          await popoverController.dismiss("popover-time")
        }
      }
    },

    openToastPopover: async function () {
      const toast = await toastController.create({
        position: "top",
        mode: "ios",
        duration: 3000,
        icon: close,
        message: this.errorPopover,
        showCloseButton: false,
        color: "danger"
      });

      await toast.present();
    },

    ThreeJSFeature: async function () {
      const toast = await toastController.create({
        position: "bottom",
        mode: "ios",
        duration: 2000,
        icon: hammer,
        message: 'This feature is in development',
        showCloseButton: false
      });

      await toast.present();
    },

    openToastClipboardSuccess: async function () {
      const toast = await toastController.create({
        position: "bottom",
        mode: "ios",
        duration: 2000,
        icon: checkmarkCircle,
        message: 'Saved in your clipboard',
        showCloseButton: false,
        color: "success"
      });

      await toast.present();
    },
    openToastShareSuccess: async function () {
      const toast = await toastController.create({
        position: "bottom",
        mode: "ios",
        duration: 500,
        icon: checkmarkCircle,
        message: 'Share',
        showCloseButton: false,
        color: "success"
      });

      await toast.present();
    },

    openToastDownloadSuccess: async function () {
      const toast = await toastController.create({
        position: "bottom",
        mode: "ios",
        duration: 2000,
        icon: checkmarkCircle,
        message: 'Saved in your Downloads directory',
        showCloseButton: false,
        color: "success"
      });

      await toast.present();
    },

    openToastAdvertingSpeedometeer: async function () {
      const toast = await toastController.create({
        position: "bottom",
        mode: "ios",
        duration: 2000,
        icon: hammer,
        message: "This feature don't work correctly (click again to lauch anyway)",
        showCloseButton: false
      });

      await toast.present();
    },

    popoverAxesDismiss: function () {
      popoverController.dismiss("popoverOptionsChart")
      this.doReset()
      this.changeAxe()
    },

  },

  watch: {

    acquisition: function () {
      this.buttonSpeed = true
    },

    alert: async function () {

      const alert = await alertController.create({
        header: 'Erreur rien à exporter !',
        message: "Faites d'abord une acquisition.",
        buttons: ['Compris !'],
        mode: "ios"
      });

      await alert.present()
    },

    call: function () {
      this.isOpen = false
      this.csv ? this.isOpen = true : this.alert = !this.alert
    },

    timeBoo: function () {
      this.$emit("time", this.time)
      this.startAquisition()
    },

    timeLimit: function (now) {
      if (now && now > 0) {
        this.$emit("timeLimit", now)
        this.accordionLimitedTime = true
      } else {
        this.$emit("timeLimit", -1)
        this.accordionLimitedTime = false
      }
    }
  },

  computed: {
    chartTimeNumber: function () {
      return (this.chartTime.time - ((this.chartTime.counter - this.chartTime.counterSave) * 100)) / 1000
    }
  },

  mounted() {
    this.newAxes = this.axes
  },

  setup() {
    const store = useStore()

    return {
      acquisition: computed(() => store.state.acquisition),

      reset: computed(() => store.state.reset),

      checkAcquisition: computed(() => store.state.checkAcquisition),

      startAquisition: () => store.commit("startAcquisition"),

      stopAquisition: () => store.commit("stopAcquisition"),

      doReset: () => store.commit("reset")
    }
  },

  emits: ["requestCSV", "changeAxes", "time", "timeLimit", "toSpeed"]
}
</script>

<style scoped>
.ionIcon {
  color: #1a8edd;
}
</style>
