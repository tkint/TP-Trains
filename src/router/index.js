import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Train from '@/components/Train';
import BookTrain from '@/components/BookTrain';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/train',
      name: 'Train',
      component: Train,
    },
    {
      path: '/train/:id',
      name: 'TrainDetail',
      component: Train,
    },
    {
      path: '/booktrain',
      name: 'BookTrain',
      component: BookTrain,
    },
  ],
});
