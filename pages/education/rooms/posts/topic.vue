<template>
  <div>
      <DataTable v-if="!(room?.author?.id === user?.id)" :value="products" tableStyle="width: 100%;">
        <Column field="title" header="Темы">
          <template #body="slotProps">
            <p class="ml-5">{{ slotProps.data.title }}</p>
          </template>
        </Column>
      </DataTable>

      <DaragAndDrop v-if="room?.author?.id === user?.id" v-model="topics" class="mt-5"></DaragAndDrop> <!-- v-if="room?.author?.id === user?.id" -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import OrderList from 'primevue/orderlist';
import DaragAndDrop from '@/components/rooms/DaragAndDrop.vue';

export default {
  async mounted() {
    const roomId = this.$route.params.roomId
    await this.queryRoom(roomId)
    await this.getTopics(roomId)
    console.log(this.topics)
  },
  components:{
    DataTable, Column, Button,
    OrderList, DaragAndDrop
  },
  data() {
    return {
      products:[
        {
          "title": "Первый и самый могущественный владыка демонов Анос Вольдигоад, носящий титул Тирана, уже почти освоился после своего долгого отсутствия. И хотя его не было две тысячи лет, он уже успел вернуть себе часть своей истинной силы",
          "room_id": 0,
          "id": 0,
          "order": 0
        },
        {
          "title": "Список интегралов от логарифмических функций",
          "room_id": 0,
          "id": 1,
          "order": 1
        },
        {
          "title": "324235345234",
          "room_id": 0,
          "id": 2,
          "order": 2
        },
        {
          "title": "Первый и самый могущественный владыка демонов Анос Вольдигоад, носящий титул Тирана, уже почти освоился после своего долгого отсутствия. И хотя его не было две тысячи лет, он уже успел вернуть себе часть своей истинной силы",
          "room_id": 0,
          "id": 3,
          "order": 3
        },
        {
          "title": "Список интегралов от логарифмических функций",
          "room_id": 0,
          "id": 4,
          "order": 4
        },
        {
          "title": "324235345234",
          "room_id": 0,
          "id": 5,
          "order": 5
        },
      ],
    }
  },
  methods: {
    ...mapActions({
      queryRoom: 'rooms/getRoom',
      getTopics : 'roomTopics/getTopics'
    }),
    onRowReorder(event){
      this.products = event.value;
    },
    
  },
  computed: {
    ...mapGetters({
      room: 'rooms/item',
      user: 'users/currentUser',
      topics : 'roomTopics/topics'
    })
  },
}
</script>