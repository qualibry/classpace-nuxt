<template>
  <div>
    <div v-for="member in participants.items" class="member flex align-items-center mb-3" :key="member.id">
        <Avatar :image="member.user.profile_picture_path" class="mr-3" size="large" shape="circle" />
        <div>
          <h4 class="mt-0 mb-1">{{ member.user.first_name }} {{ member.user.last_name }}</h4>
        </div>
        <Button
          @click="goToChat(member)"
          icon="pi pi-pencil"
          class="p-button-sm p-button-text"
          v-show="member.user.id !== currentUser.id"
        />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Avatar from 'primevue/avatar';
  import Button from 'primevue/button';

  export default {
    components: {
      Avatar, Button
    },
    methods: {
      ...mapActions({
        createChat: 'chat/createChat'
      }),
      async goToChat(member) {
        await this.createChat({
          participants_ids: [member.user.id]
        })
        this.$toast.add({
          severity: 'success',
          summary: `You start chat with ${member.user.first_name} ${member.user.last_name}`,
          detail: "Success",
          life: 3000
        })
        this.$router.push({ name: 'dialog', params: { dialogId: this.$store.getters['chat/dialog'].id } })
      }
    },

    computed: {
      ...mapGetters({
        participants: 'participants/items',
        currentUser: 'users/currentUser'
      })
    },
  }
</script>