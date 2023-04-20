<template>
  <div class="cards-container">
    <header class="topics-header">Темы</header>
    <ul>
      <!-- @dragstart="dragStartHendler(topic, $event)"  
            @dragover.prevent="dragOverHendler(topic, $event)">  draggable="true" -->
      <transition-group name="topic-list" mode="out-in" >
        <li v-for="topic, index in topics" :key="topic.id" class="card flex justify-content-between" :ref="topic.id">
          <div class="topic-title">{{ topic.title }}</div>
          <div class="topics-actions flex ml-2" style="cursor: default;">
            <div class="flex flex-column align-items-between mr-2">
              <i v-if="index > 0" @click="upElement(topic)" class="pi pi-chevron-up cursor-pointer"></i>
              <i v-if="index < topics.length-1" @click="downElement(topic)" class="pi pi-chevron-down cursor-pointer mt-2"></i>
            </div>
            <i @click="displayChange = true" class="pi pi-file cursor-pointer flex align-items-center"
              style="font-size: 20px;"></i>
            <i @click="removeTopic(topic)" class="pi pi-trash cursor-pointer ml-2  flex align-items-center"
              style="font-size: 20px;"></i>
          </div>
          <Dialog @hide="TopicName = ''" :visible.sync="displayChange" header="Новое название темы" modal
            :style="{ minWidth: '50vw' }">
            <div class="flex flex-column align-content-center justify-content-between md:flex-row p-1">
              <InputText placeholder="Новый заголовок" v-model="TopicName" />
              <Button @click="changeTopic(topic)" class="mt-2 md:mt-0 md:ml-2">Изменить</Button>
            </div>
          </Dialog>
        </li>
      </transition-group>
      <li @click="displayCreate = true" class="card-adder">
        <i class="pi pi-plus" style="font-size: 1.5rem"></i>
        <p class="ml-2" style="font-size: 16px">Добавить новую тему</p>
      </li>
    
    </ul>
    <Dialog @hide="TopicName = ''" :visible.sync="displayCreate" header="Новая тема" modal :style="{ minWidth: '50vw' }">
      <div class="flex flex-column align-content-center justify-content-between md:flex-row p-1">
        <InputText placeholder="Заголовок" v-model="TopicName" />
        <Button @click="addNewTopic" class="mt-2 md:mt-0 md:ml-2">Добавить</Button>
      </div>
    </Dialog>


  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button/Button';

export default {
  components: {
    Dialog, InputText,
    Button
  },
  props: {
    value: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
      topics: [],
      getedCard: {},
      cardForChange: {},
      displayCreate: false,
      displayChange: false,
      TopicName: '',
    }
  },
  async mounted() {
    await this.getTopics(this.$route.params.roomId)

    this.topics = this.value 
  },
  methods: {
    ...mapActions({
      getTopics: 'roomTopics/getTopics',
      createTopic: 'roomTopics/createTopic',
      updateTopic: 'roomTopics/updateTopic',
      deletRoomTopic: 'roomTopics/deletRoomTopic',
    }),
    upElement(topic) {
      const requestBody = {
        order: topic.order - 1
      }
      this.updateTopic({ body: requestBody, topicId: topic.id, roomId: topic.room_id })
    },
    async downElement(topic) {
      const requestBody = {
        order: topic.order + 1
      }
      await this.updateTopic({ body: requestBody, topicId: topic.id, roomId: topic.room_id })
      setTimeout( () =>{
        this.$refs[topic.id][0].classList.remove('opacity1')
      }, 600)
      
    },
    removeTopic(topic) {
      this.deletRoomTopic(topic)
    },
    changeTopic(topic) {
      const requestBody = {
        title: this.TopicName,
      }
      this.updateTopic({ topicId: topic.id, body: requestBody, roomId: topic.room_id })
      this.displayChange = false
    },
    addNewTopic() {
      if (this.TopicName.length > 0) {
        console.log(this.TopicName)
        const requestBody = {
          title: this.TopicName,
          room_id: this.$route.params.roomId
        }
        this.createTopic(requestBody)
        this.displayCreate = false
      }
      else {

      }
    },


    deleteCard(card) {
      this.topics = this.topics.filter((value) => { return value.id != card.id })
    },
    dragStartHendler(card) {
      this.getedCard = card
    },
    dragOverHendler(card, e) {
      if (card.id != this.getedCard.id) {
        this.topics = this.topics.map(c => {
          if (c.id == card.id) {
            return { ...c, order: this.getedCard.order }
          }
          if (c.id == this.getedCard.id) {
            return { ...c, order: card.order }
          }
          return c
        })
        this.topics.sort((a, b) => {
          if (a.order > b.order) return -1
          if (a.order < b.order) return 1
        })
        this.$emit('input', this.topics)
      }
      this.getedCard = { ...this.getedCard, order: card.order }
    },
  },

  watch: {
    value(newVal,) {
      this.topics = newVal
    }
  }
}
</script>

<style lang="scss">
.card {
  // cursor: move;
  user-select: none;
  min-height: 80px;
  padding: 0 10px;
  border-bottom: 1px solid #e5e7eb;
  transition: all 1s;
}


.cards-container {
  ul {
    margin: 0;
    list-style-type: none;
    padding: 0;
    // border: 1px solid #e5e7eb;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
    }

    li:hover {
      background: #f4f4f5;
      color: #18181B;
    }

    li:focus {
      outline: 0 none;
      outline-offset: 0;
      box-shadow: inset 0 0 0 0.15rem;
    }

    .card-adder {
      min-height: 80px;
      cursor: pointer;
    }
  }
}

.topics-header {
  background: #fafafa;
  color: #3f3f46;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  font-weight: 700;
  // border-bottom: 0 none;
  border-top-right-radius: 0.375rem;
  border-top-left-radius: 0.375rem;
}

.p-dialog-header-icons {
  margin-bottom: 20px;
}


.topic-list-move {
  transition: transform 1s;
}
.topic-list-active, .topic-list-leave-active {
  transition: all 1s;
}
.topic-list-enter, .topic-list-leave-to{
  opacity: 0;
  transform: translateX(30px);
}
</style>