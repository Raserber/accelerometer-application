<template>
  <ion-app>
    <ion-menu side="start" menu-id="menu" content-id="main-content">
      <ion-header>
        <ion-toolbar translucent>
          <ion-title>Aide: accélérations</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
            <ion-accordion-group id="accordion" multiple="false">
              <ion-accordion>
                <ion-item slot="header">
                  <ion-icon :icon="move" slot="start" />
                  <ion-label>Linéaires</ion-label>
                </ion-item>

                <ion-list @click="closeMenu" slot="content" lines="none">
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/lineaires/x">
                    en x
                  </ion-item>
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/lineaires/y">
                    en y
                  </ion-item>
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/lineaires/z">
                    en z
                  </ion-item>
                </ion-list>
              </ion-accordion>

              <ion-accordion>
                <ion-item slot="header">
                  <ion-icon :icon="refresh" slot="start" />
                  <ion-label>Angulaires</ion-label>
                </ion-item>

                <ion-list @click="closeMenu" slot="content" lines="none">
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/angulaires/x">
                    en x
                  </ion-item>
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/angulaires/y">
                    en y
                  </ion-item>
                  <ion-item @click="isAngular=0; isLinear=0" router-link="/documentation/angulaires/z">
                    en z
                  </ion-item>
                </ion-list>
              </ion-accordion>
            </ion-accordion-group>
        </ion-content>
    </ion-menu>

    <ion-router-outlet />
  </ion-app>
</template>

<script>
import {
  IonApp,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonList,
  IonMenu,
  IonAccordionGroup,
  IonAccordion,
  menuController
} from '@ionic/vue';
import { move, refresh, helpBuoyOutline } from "ionicons/icons"

export default {

  name: 'App',

  components: {
    IonAccordionGroup,
    IonAccordion,
    IonApp,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonMenu,
  },

  data: () => ({
    helpBuoyOutline,
    move,
    refresh
  }),

  methods: {
    closeMenu: function () {
      menuController.close("menu")
      document.querySelector("#accordion").value = undefined
    }
  }
}
</script>
