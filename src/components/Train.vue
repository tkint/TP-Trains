<template>
  <v-layout v-if="train" row wrap>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12>
          Train {{ train.numTrain }}
        </v-flex>
        <v-flex xs12>
          <book-train :numTrain="train.numTrain"></book-train>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            name="train"
            label="Train"
            :value="train.numTrain"
            readonly
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            name="places"
            label="Places"
            v-model="newBookTrain.numberPlaces"
            type="number"
          >
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn
            color="info"
            @click.stop="bookTrain"
          >Réserver
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <div v-else>
    <v-data-table
      v-bind:headers="headers"
      :items="trains"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <router-link :to="{name: 'TrainDetail', params: {id: props.item.numTrain}}">
          {{ props.item.numTrain }}
        </router-link>
        <td>{{ props.item.villeDepart }}</td>
        <td>{{ props.item.villeArrivee }}</td>
        <td>{{ props.item.heureDepart }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import BookTrain from './BookTrain';

  export default {
    name: 'Train',
    components: { BookTrain },
    data() {
      return {
        headers: [
          { text: 'Numéro', align: 'left', value: 'numTrain' },
          { text: 'Départ', align: 'left', value: 'villeDepart' },
          { text: 'Arrivée', align: 'left', value: 'villeArrivee' },
          { text: 'Heure départ', align: 'left', value: 'heureDepart' },
        ],
        train: null,
        trains: [],
        newBookTrain: {
          bookNumber: null,
          currentTrain: null,
          numberPlaces: null,
        },
      };
    },
    created() {
      if (this.$route.params.id) {
        this.getTrain(this.$route.params.id);
      } else {
        this.getTrains();
      }
    },
    methods: {
      getTrain(numTrain) {
        this.axios.get(`trains/numTrain-${numTrain}`).then((response) => {
          const text = response.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const train = xmlDoc.getElementsByTagName('train')[0];
          this.train = this.parseTrain(train);
        });
      },
      getTrains() {
        this.axios.get('trains').then((response) => {
          const text = response.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const trains = xmlDoc.getElementsByTagName('trains')[0];
          const trainsList = trains.getElementsByTagName('train');
          let i = 0;
          while (i < trainsList.length) {
            this.trains.push(this.parseTrain(trainsList[i]));
            i += 1;
          }
        });
      },
      parseTrain(train) {
        const t = {
          numTrain: train.getElementsByTagName('numTrain')[0].innerHTML,
          villeDepart: train.getElementsByTagName('villeDepart')[0].innerHTML,
          villeArrivee: train.getElementsByTagName('villeArrivee')[0].innerHTML,
          heureDepart: train.getElementsByTagName('heureDepart')[0].innerHTML,
        };
        return t;
      },
      bookTrain() {
        const bookTrain = '<newbooktrain>' +
          `<numTrain>${this.train.numTrain}</numTrain>` +
          `<numberPlaces>${this.newBookTrain.numberPlaces}</numberPlaces>` +
          '</newbooktrain>';
        this.axios.post('trains/booktrains', bookTrain).then((response) => {
          console.log(response.data);
        });
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
