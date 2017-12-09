<template>
  <v-layout row wrap>
    <v-flex xs12 md6>
      <router-link :to="{name: 'Train'}">Liste des trains</router-link>
      <train></train>
    </v-flex>
    <v-flex xs12 md6>
      <router-link :to="{name: 'BookTrain'}">Liste des réservations</router-link>
      <book-train></book-train>
    </v-flex>
  </v-layout>
</template>

<script>
  import Train from './Train';
  import BookTrain from './BookTrain';

  export default {
    name: 'Home',
    components: { Train, BookTrain },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
