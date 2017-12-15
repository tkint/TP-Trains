<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout v-if="train" row wrap>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12>
              Train {{ train.numTrain }}
            </v-flex>
            <v-flex xs12>
              <book-train :numTrain="train.numTrain" ref="books"></book-train>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="places"
                label="Places"
                v-model="numberPlaces"
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
        <v-flex xs12 v-if="$route.name === 'Train'">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="Value"
                label="Value"
                v-model="searchValue"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-radio-group v-model="searchCriteria" :mandatory="false">
                <v-radio label="Depart" value="departure"></v-radio>
                <v-radio label="Arrivee" value="arrival"></v-radio>
                <v-radio label="Heure d'arrivée" value="arrivalHour"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <v-btn
                color="info"
                @click.stop="searchTrain"
              >Chercher
              </v-btn>
              <v-btn
                color="warning"
                @click.stop="getTrains"
              >Réinitialiser
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
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
        <v-flex xs12 v-if="$route.name === 'Train'">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                name="numTrain"
                label="Numéro"
                v-model="newTrain.numTrain"
              >
              </v-text-field>
              <v-text-field
                name="depart"
                label="Départ"
                v-model="newTrain.villeDepart"
              >
              </v-text-field>
              <v-text-field
                name="arrivee"
                label="Arrivée"
                v-model="newTrain.villeArrivee"
              >
              </v-text-field>
              <v-text-field
                name="heure"
                label="Heure"
                v-model="newTrain.heureDepart"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                color="info"
                @click.stop="createTrain"
              >Créer train
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </div>
    </v-flex>
  </v-layout>
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
        newTrain: {
          numTrain: null,
          villeDepart: null,
          villeArrivee: null,
          heureDepart: null,
        },
        numberPlaces: null,
        searchValue: null,
        searchCriteria: null,
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
          this.trains = [];
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
      searchTrain() {
        if (this.searchCriteria) {
          this.searchTrainByCriteria();
        } else {
          this.searchTrainByValue();
        }
      },
      searchTrainByCriteria() {
        if (this.searchCriteria === 'departure') {
          this.searchTrainByValues(this.searchValue, '', '');
        } else if (this.searchCriteria === 'arrival') {
          this.searchTrainByValues('', this.searchValue, '');
        } else if (this.searchCriteria === 'arrivalHour') {
          this.searchTrainByValues('', '', this.searchValue);
        }
      },
      searchTrainByValue() {
        this.searchTrainByValues(this.searchValue, this.searchValue, this.searchValue);
      },
      searchTrainByValues(departure, arrival, arrivalHour) {
        const param = [];
        if (departure) {
          param.push(`departure=${departure}`);
        }
        if (arrival) {
          param.push(`arrival=${arrival}`);
        }
        if (arrivalHour) {
          param.push(`arrivalHour=${arrivalHour}`);
        }
        let req = 'trains/search?';
        let i = 0;
        while (param[i]) {
          if (i > 0) {
            req += '&';
          }
          req += param[i];
          i += 1;
        }
        this.axios.get(req).then((response) => {
          const text = response.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const trains = xmlDoc.getElementsByTagName('trains')[0];
          const trainsList = trains.getElementsByTagName('train');
          i = 0;
          this.trains = [];
          while (i < trainsList.length) {
            this.trains.push(this.parseTrain(trainsList[i]));
            i += 1;
          }
        });
      },
      bookTrain() {
        const bookTrain = '<newbooktrain>' +
          `<numTrain>${this.train.numTrain}</numTrain>` +
          `<numberPlaces>${this.numberPlaces}</numberPlaces>` +
          '</newbooktrain>';
        this.axios.post('trains/booktrains', bookTrain).then(() => {
          this.$refs.books.getBookTrains();
          this.numberPlaces = null;
        });
      },
      createTrain() {
        const train = '<train>' +
          `<numTrain>${this.newTrain.numTrain}</numTrain>` +
          `<villeDepart>${this.newTrain.villeDepart}</villeDepart>` +
          `<villeArrivee>${this.newTrain.villeArrivee}</villeArrivee>` +
          `<heureDepart>${this.newTrain.heureDepart}</heureDepart>` +
          '</train>';
        this.axios.post('trains', train).then(() => {
          this.getTrains();
          this.newTrain = {
            numTrain: null,
            villeDepart: null,
            villeArrivee: null,
            heureDepart: null,
          };
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
