<template>
  <div>
    <ConfirmDialog />
    <div class="flex align-items-center mb-3">
      <NuxtLink to="/rooms">
        <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-plain mr-2" />
      </NuxtLink>
      <h2 class="my-0">{{ room.name }}</h2>
      <Button v-if="currentParticipation.is_moderator" type="button" :label="$t('rooms.roomManage')" class="ml-auto"
        @click="toggleManageRoom" aria-haspopup="true" aria-controls="overlay_menu" />
      <Menu v-if="currentParticipation.is_moderator" id="overlay_menu" ref="menu" :model="items" :popup="true" />
    </div>
    <div class="grid">
      <div class="col-12 xl:col-8">
        <div class="text-sm">
          {{ $t("rooms.roomCreator") }}: <b>{{ room.author.full_name }}</b>
        </div>
        <span class="text-sm mb-1 mt-3 block">{{ $t("rooms.roomDescription") }}:</span>
        <p class="text-lg mt-0">{{ room.description }}</p>
        <div>
          <span class="text-sm mb-2 block">{{ $t("rooms.linkToJoin") }}:</span>
          <div class="col-5 p-0 mb-4">
            <div class="p-inputgroup" v-if="currentParticipation.is_moderator">
              <InputText placeholder="Link to join" v-model="joinLink" disabled />
              <Button :label="$t('rooms.copyToClipboard')" @click.prevent="copyJoinLink()" />
            </div>
          </div>
        </div>
        <div class="flex">
          <Button v-if="currentParticipation.can_manage_assignments" class="p-button-outlined">{{
            $t("homeworks.assignedHomeworksCount") }}</Button>
        </div>
        <Divider />

        <div class="grid">
          <div class="col-12 xl:col-6">
            <div class="flex align-items-center">
              <h3>{{ $t("rooms.materials") }}</h3>
              <NuxtLink v-if="currentParticipation.can_manage_posts"
                :to="'/rooms/add-post/' + room.id + '?type=material'">
                <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-sm ml-2"
                  v-tooltip.top="$t('rooms.addMaterials')" />
              </NuxtLink>
            </div>
            <PostList :type="'material'" :items="materialItems" :isFetch="isFetchMaterials" :limit="limitMaterials"
              :offset="offsetMaterials" :fetchItems="fetchMaterials" />
          </div>
          <div class="col-12 xl:col-6">
            <div class="flex align-items-center">
              <h3>{{ $t("rooms.homeworks") }}</h3>
              <NuxtLink v-if="currentParticipation.can_manage_posts"
                :to="'/rooms/add-post/' + room.id + '?type=homework'">
                <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-sm ml-2"
                  v-tooltip.top="$t('rooms.addHomework')" />
              </NuxtLink>
            </div>
            <PostList :type="'homework'" :items="homeworkItems" :isFetch="isFetchHomeworks" :limit="limitHomeworks"
              :offset="offsetHomeworks" :fetchItems="fetchHomeworks" />
          </div>
        </div>
      </div>
      <div class="col-12 xl:col-4">
        <div class="bg-white border-solid border-1 p-3 border-round-lg border-300">
          <h3 class="my-0">{{ $t("rooms.membersInfo") }}</h3>
          <Divider />
          <Participants />
        </div>

        <div class="col-10">
          <h4>{{ $t("rooms.searchPost") }}</h4>
          <InputText class="p-inputtext-sm" :placeholder="$t('rooms.searchPlaceholder')" v-model="searchPost"
            @change="searchInPosts" />
        </div>
        <div class="col-10">
          <h4>{{ $t("rooms.orderPost") }}</h4>
          <SelectButton v-model="selectedOrdering" :options="ordering" optionLabel="name" optionValue="code" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Menu from "primevue/menu";
import Button from "primevue/button";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Participants from "./Participants.vue";
import ConfirmDialog from "primevue/confirmdialog";
import PostList from "./PostList.vue";
import SelectButton from "primevue/selectbutton";

export default {
  components: {
    Button,
    Divider,
    InputText,
    Participants,
    Menu,
    ConfirmDialog,
    PostList,
    SelectButton,
  },
  mounted() {
    this.$store.commit("roomposts/SET_IS_INFINITE_SCROLL", false);
  },
  computed: {
    ...mapGetters({
      limitMaterials: "roomposts/limitMaterials",
      offsetMaterials: "roomposts/offsetMaterials",
      limitHomeworks: "roomposts/limitHomeworks",
      offsetHomeworks: "roomposts/offsetHomeworks",
      materialItems: "roomposts/materialItems",
      homeworkItems: "roomposts/homeworkItems",
      isFetchMaterials: "roomposts/isFetchMaterials",
      isFetchHomeworks: "roomposts/isFetchHomeworks",
      room: "rooms/item",
      currentUser: "users/currentUser",
      currentParticipation: "participants/current",
      locale: "locale/locale",
    }),
    joinLink() {
      return window.location.host + "/rooms/join/" + this.room.join_slug;
    },
  },
  watch: {
    selectedOrdering() {
      this.$store.commit("roomposts/SET_IS_INFINITE_SCROLL", false);

      this.fetchMaterials(0, this.offsetMaterials + 5 || 5);
      this.fetchHomeworks(0, this.offsetHomeworks + 5 || 5);
    },
    locale(newV) {
      this.ordering = [
        { name: this.$t("ordering.creationDateAsc"), code: "-created_at" },
        { name: this.$t("ordering.title"), code: "title" }
      ]

      if (newV == "en") {
        this.items[0] = {
          label: "Room manage",
          items: [
            {
              label: "Edit",
              icon: "pi pi-pencil",
              command: () => {
                this.$router.push({
                  name: "rooms.edit",
                  params: { id: this.room.id },
                });
              },
            },
            {
              label: "Delete", //this.locale == 'en'?  'Delete' : 'Удалить',
              icon: "pi pi-times",
              command: () => {
                this.$confirm.require({
                  header: "Confirm the action",
                  message: "Do you really want to delete a room?",
                  icon: "pi pi-exclamation-triangle",
                  accept: () => {
                    this.deleteRoomHelper();
                  },
                  reject: () => { },
                });
              },
            },
          ],
        };
      } else {
        this.items[0] = {
          label: "Управление комнатой",
          items: [
            {
              label: "Редактировать",
              icon: "pi pi-pencil",
              command: () => {
                this.$router.push({
                  name: "rooms.edit",
                  params: { id: this.room.id },
                });
              },
            },
            {
              label: "Удалить", //this.locale == 'en'?  'Delete' : 'Удалить',
              icon: "pi pi-times",
              command: () => {
                this.$confirm.require({
                  header: "Вы уверены?",
                  message: "Вы действительно хотите удалить комнату?",
                  icon: "pi pi-exclamation-triangle",
                  accept: () => {
                    this.deleteRoomHelper();
                  },
                  reject: () => { },
                });
              },
            },
          ],
        };
      }
    },
  },
  beforeMount() {
    if (this.locale == "en") {
      this.items[0] = {
        label: "Room manage",
        items: [
          {
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => {
              this.$router.push({
                name: "rooms.edit",
                params: { id: this.room.id },
              });
            },
          },
          {
            label: "Delete", //this.locale == 'en'?  'Delete' : 'Удалить',
            icon: "pi pi-times",
            command: () => {
              this.$confirm.require({
                header: "Confirm the action",
                message: "Do you really want to delete a room?",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                  this.deleteRoomHelper();
                },
                reject: () => { },
              });
            },
          },
        ],
      };
    } else {
      this.items[0] = {
        label: "Управление комнатой",
        items: [
          {
            label: "Редактировать",
            icon: "pi pi-pencil",
            command: () => {
              this.$router.push({
                name: "rooms.edit",
                params: { id: this.room.id },
              });
            },
          },
          {
            label: "Удалить", //this.locale == 'en'?  'Delete' : 'Удалить',
            icon: "pi pi-times",
            command: () => {
              this.$confirm.require({
                header: "Вы уверены?",
                message: "Вы действительно хотите удалить комнату?",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                  this.deleteRoomHelper();
                },
                reject: () => { },
              });
            },
          },
        ],
      };
    }
  },
  data() {
    return {
      items: [],
      searchPost: "",
      ordering: [
        { name: this.$t("ordering.creationDateAsc"), code: "-created_at" },
        { name: this.$t("ordering.title"), code: "title" },
      ],
      selectedOrdering: "",
    };
  },

  methods: {
    ...mapActions({
      deleteRoom: "rooms/deleteRoom",
    }),
    toggleManageRoom(event) {
      this.$refs.menu.toggle(event);
    },
    async searchInPosts() {
      this.$store.commit("roomposts/SET_IS_INFINITE_SCROLL", false);
      this.fetchMaterials(0, this.offsetMaterials + 5 || 5);
      this.fetchHomeworks(0, this.offsetHomeworks + 5 || 5);
    },
    async deleteRoomHelper() {
      await this.deleteRoom(this.room.id);

      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "You deleted the room",
        life: 3000,
      });

      this.$router.push({ name: "rooms.list" });
    },
    async copyJoinLink() {
      try {
        await this.$copyText(this.joinLink);
        this.copied = true;

        this.$toast.add({
          severity: "success",
          summary: this.locale == "en" ? "Success" : "Успех",
          detail: this.locale == "en" ? "Link copied!" : "Ссылка скопирована",
          life: 3000,
        });
      } catch (e) {
        console.error(e);
      }
    },

    fetchMaterials(offset, limit) {
      this.$store.dispatch("roomposts/fetchMaterials", {
        ...this.$route.query,
        roomId: this.$route.params.id,
        ordering: this.selectedOrdering,
        search: this.searchPost,
        limit,
        offset,
      });
    },

    fetchHomeworks(offset, limit) {
      this.$store.dispatch("roomposts/fetchHomeworks", {
        ...this.$route.query,
        roomId: this.$route.params.id,
        ordering: this.selectedOrdering,
        search: this.searchPost,
        limit,
        offset,
      });
    },
  },
};
</script>
