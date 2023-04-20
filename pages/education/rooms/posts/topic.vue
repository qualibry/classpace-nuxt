<template>
  <div>
      <DataTable v-if="user?.id != room?.author?.id" :value="topics" tableStyle="width: 100%;">
        <Column field="title" header="Темы">
          <template #body="slotProps">
            <p class="ml-5 lg:ml-0">{{ slotProps.data.title }}</p>
          </template>
        </Column>
      </DataTable>
      <DaragAndDrop v-if="room?.author?.id === user?.id" v-model="topics" class="mt-5"></DaragAndDrop>
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
  },
  components:{
    DataTable, Column, Button,
    OrderList, DaragAndDrop
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions({
      queryRoom: 'rooms/getRoom',
      getTopics : 'roomTopics/getTopics'
    }),
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