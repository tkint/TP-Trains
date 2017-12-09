<template>
  <v-layout row wrap>
    <v-flex xs12 md6>
      <train></train>
    </v-flex>
    <v-flex xs12 md6>
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

</style>
