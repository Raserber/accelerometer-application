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

      <img v-if="notHome" @click="openSplineSite" src="https://app.spline.design/_assets/_icons/icon_favicon32x32.png" alt="spline logo"  id="logo" class="logo">
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonMenuButton,
  IonPage,
  menuController,
  IonIcon,
  IonButton,
  IonButtons
} from "@ionic/vue"
import {homeOutline} from "ionicons/icons";
import {Browser} from "@capacitor/browser"

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

  props: {
    notHome: {
      default : true,
      type: Boolean
    }
  },

  methods: {
    openMenu: async function () {
      await menuController.open();
    },

    openSplineSite() {
      const logo = document.getElementById("logo")
      logo.classList.add("active")
      setTimeout(async () => {
        logo.classList.remove("active")
        await Browser.open({url: "https://spline.design/"})
      }, 900)
    }
  },

  data: () => ({
    homeOutline
  })
}
</script>

<style lang="scss" scoped>

@-webkit-keyframes bound {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@keyframes bound {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.logo {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  z-index: 1000000;

  -webkit-animation: 0.9s both;
  animation: 0.9s both;

  &.active {
    -webkit-animation: bound 0.9s both;
    animation: bound 0.9s both;
  }
}
</style>
