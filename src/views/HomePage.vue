<template>
  <base-layout>
    <ion-button href="/test">Test</ion-button>
    <ion-card class="ionCard">
      <ion-card-header>
        <ion-card-title class="title">Acquisition de l'accélération</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-list class="ionList">

          <ion-item>
            <ion-list lines="none">

              <ion-list-header>Accélération à étudier en :</ion-list-header>
              <ion-item>
                <ion-select interface="popover" v-model="accel" class="ionSelect" placeholder="T/R">
                  <ion-select-option value="0">
                    translation
                  </ion-select-option>
                  <ion-select-option value="1">
                    rotation
                  </ion-select-option>
                </ion-select>
              </ion-item>

            </ion-list>
          </ion-item>

          <ion-item>
            <ion-list lines="none">
              <ion-list-header> Axes à étudier :</ion-list-header>
              <ion-item>
                <ion-label>x</ion-label>
                <ion-checkbox mode="ios" color="danger" @click="X" slot="start"/>
              </ion-item>
              <ion-item>
                <ion-label>y</ion-label>
                <ion-checkbox mode="ios" color="success" @click="Y" slot="start"/>
              </ion-item>
              <ion-item>
                <ion-label>z</ion-label>
                <ion-checkbox mode="ios" color="primary" @click="Z" slot="start"/>
              </ion-item>
            </ion-list>
          </ion-item>

          <ion-item lines="none" class="divider"></ion-item>

          <ion-item lines="none" class="button">
            <ion-button mode="ios" size="large" @click="createLink" :href="linkChart">
              <ion-icon slot="start" :icon="pulseOutline"/>
              Commencer
            </ion-button>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </base-layout>
</template>

<script>
import BaseLayout from "../components/layouts/baseLayout"

import {
  IonIcon,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonListHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  alertController
} from "@ionic/vue"

import {pulseOutline, refresh, move} from "ionicons/icons"

export default {

  components: {
    BaseLayout,
    IonIcon,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonListHeader,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },

  data: () => ({
    pulseOutline,
    refresh,
    move,
    x: false,
    y: false,
    z: false,
    accel: ""
  }),

  methods: {
    X: function () {
      this.x = !this.x
    },
    Y: function () {
      this.y = !this.y
    },
    Z: function () {
      this.z = !this.z
    },

    alert: async function () {
      const alert = await alertController.create({
        header: 'Remplissez tous les champs !',
        message: "Les champs ne peuvent pas être vides.",
        buttons: ['Compris !'],
        mode: "ios"
      });

      await alert.present();
    },

    createLink: function () {
      if ((!this.x && !this.y && !this.z) || (this.accel !== "0" && this.accel !== "1")) {
        this.alert()
      }
    }
  },

  computed: {
    linkChart: function () {

      if ((this.x || this.y || this.z) && (this.accel === "0" || this.accel === "1")) {
        return `/chart?axes=${this.axes}&accel=${this.accel}`
      } else {
        return null
      }
    },

    axes: function () {
      let axes = ""
      if (this.x) {
        axes += "0"
      }
      if (this.y) {
        axes += "1"
      }
      if (this.z) {
        axes += "2"
      }

      return axes
    }
  }

}
</script>

<style lang="scss" scoped>
.ionCard {
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(-50%);
  width: 75vw;
  height: 70vh;

  .ionList {
    height: 100%;

    .ionSelect {
      margin: auto;
    }

    .button {
      margin: auto;
    }
  }
}
</style>
