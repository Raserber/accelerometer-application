<template>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="$route.path!=='/home'">
          <ion-button router-link="/home" icon-only>
            <ion-icon :icon="homeOutline"/>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button router-link="/documentation">
            <ion-icon :icon="helpOutline"/>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ this.$route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <slot/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonTitle, IonHeader, IonToolbar, IonContent, IonPage, IonIcon, IonButton, IonButtons} from "@ionic/vue"
import {helpOutline, homeOutline} from "ionicons/icons"


export default {
  name: "baseLayout",

  components: {
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    IonIcon,
    IonButton,
    IonButtons
  },

  data: () => ({
    helpOutline,
    homeOutline
  })
}
</script>

<style scoped>

</style>
