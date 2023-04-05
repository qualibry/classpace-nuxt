<template>
  <div>
    <h1>Роут топиков</h1>
    <DataTable :value="products">
      <Column field="title" header="Title">
        <template #body="slotProps">
            {{ slotProps.data.title }}
        </template>
      </Column>
      <Column v-if="true">
        <template #body="slotProps">
            <Button></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
export default {
  components:{
    DataTable, Column, Button
  },
  data() {
    return {
      products:[
        {
          "title": "string1",
          "room_id": 0,
          "id": 0,
          "order": 0
        },
        {
          "title": "string2",
          "room_id": 0,
          "id": 1,
          "order": 0
        },
        {
          "title": "string3",
          "room_id": 0,
          "id": 2,
          "order": 0
        },
      ],
      columns: [
        { field: 'title', header: 'Title' },
      ]
    }
  },
  methods: {
    
  },
}
</script>