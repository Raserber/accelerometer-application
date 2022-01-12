<template>
  <base-layout>
    <ion-input v-model="test"></ion-input>
    <ion-button @click="share('file.csv', test)">
      Test
    </ion-button>
    {{test2}}
  </base-layout>
</template>

<script>
import BaseLayout from "@/components/layouts/baseLayout";
import { IonInput, IonButton } from "@ionic/vue"

export default {
//eslint-disable-next-line
  name: "test",
  components: {
    BaseLayout,
    IonInput,
    IonButton
  },
  data: () => ({
    test2: null
  }),

  mounted() {
  }
}
</script>

<style scoped>

</style>
