<template>
  <docs-layout :not-home="false">
    <div class="div">
      Vous pouvez cliquer sur <ion-icon :icon="menuOutline"></ion-icon> pour choisir l'accélération à étudier.
    </div>
  </docs-layout>
</template>

<script>
import { IonIcon, alertController } from "@ionic/vue";
import { menuOutline } from "ionicons/icons"
import DocsLayout from "../../components/layouts/docsLayout";
import  { Network } from "@capacitor/network"
export default {
  name: "docsHome",

  components: {DocsLayout, IonIcon},

  data: () => ({
    menuOutline,
  }),

  methods: {
    logCurrentNetworkStatus: async function () {
      const status = await Network.getStatus();

      if (!status) {
        await this.alert()
      }
    },
    alert: async function () {
      const alert = await alertController.create({
        header: "Besoin d'une connexion internet !",
        message: "Les animations ont besoins d'une connexion internet pour fonctionner.",
        buttons: ['Compris !'],
        mode: "ios"
      });

      await alert.present();
    }
  },

  mounted() {
    this.logCurrentNetworkStatus()
  }
}
</script>

<style scoped>
.div {
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
  vertical-align: center;
}
</style>
