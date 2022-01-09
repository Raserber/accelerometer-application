<template>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-buttons slot="end" icon-only>
          <ion-button router-link="/home" icon-only>
            <ion-icon :icon="homeOutline"/>
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
import {IonTitle, IonHeader, IonToolbar, IonContent, IonMenuButton, IonPage, menuController, IonIcon, IonButton, IonButtons} from "@ionic/vue"
import { homeOutline } from "ionicons/icons";

export default {
  name: "docsLayout",

  components: {
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonMenuButton,
    IonPage,
    IonIcon,
    IonButton,
    IonButtons
  },

  methods: {
    openMenu: async function () {
      await menuController.open();
    }
  },

  data: () => ({
    homeOutline
  })
}
</script>

<style scoped>

</style>
