<template>
  <div>
    <v-data-table
      v-bind:headers="headers"
      :items="bookTrains"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.bookNumber }}</td>
        <td>
          <router-link :to="{name: 'TrainDetail', params: {id: props.item.currentTrain}}">
            {{ props.item.currentTrain }}
          </router-link>
        </td>
        <td>{{ props.item.numberPlaces }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: 'BookTrain',
    props: ['numTrain'],
    data() {
      return {
        headers: [
          { text: 'Numéro', align: 'left', value: 'bookNumber' },
          { text: 'Train', align: 'left', value: 'currentTrain' },
          { text: 'Places', align: 'left', value: 'numberPlaces' },
        ],
        bookTrains: [],
      };
    },
    created() {
      this.getBookTrains();
    },
    methods: {
      getBookTrains() {
        let url = 'trains/booktrains';
        if (this.numTrain) {
          url += `/numTrain-${this.numTrain}`;
        }
        this.axios.get(url).then((response) => {
          const text = response.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const bookTrains = xmlDoc.getElementsByTagName('bookTrains')[0];
          const bookTrainsList = bookTrains.getElementsByTagName('booktrain');
          let i = 0;
          while (i < bookTrainsList.length) {
            this.bookTrains.push(this.parseBookTrain(bookTrainsList[i]));
            i += 1;
          }
        });
      },
      parseBookTrain(bookTrain) {
        const bt = {
          bookNumber: bookTrain.getElementsByTagName('bookNumber')[0].innerHTML,
          currentTrain: bookTrain.getElementsByTagName('currentTrain')[0].getElementsByTagName('numTrain')[0].innerHTML,
          numberPlaces: bookTrain.getElementsByTagName('numberPlaces')[0].innerHTML,
        };
        return bt;
      },
    },
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
