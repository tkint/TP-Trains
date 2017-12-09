<template>
  <v-app>
    <v-toolbar color="indigo" dark fixed app>
      <v-btn flat icon :to="{ name: 'Home' }" exact>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn flat icon :to="{ name: 'Train' }" exact>
        <v-icon>fa-train</v-icon>
      </v-btn>
      <v-btn flat icon :to="{ name: 'BookTrain' }" exact>
        <v-icon>fa-book</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>TP Trains</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <router-view :key="$route.name"></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  require('vuetify/dist/vuetify.min.css');

  export default {
    name: 'app',
  };
</script>

<style>

</style>
