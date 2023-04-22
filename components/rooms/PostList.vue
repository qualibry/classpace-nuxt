<template>
  <div class="attachments-block">
    <div v-for="item in items" class="bg-white border-solid border-1 p-3 border-round-lg border-300 mb-4 block"
      :key="item.id">
      <div @click="redirectDetail(item)" class="block-nav">
        <div class="flex align-items-center">
          <i class="pi pi-file" style="font-size: 1.8rem; margin-right: 1.3rem"></i>
          <div>
            <div class="flex align-items-center">
              <h4 class="mt-0 mb-2 mr-auto">{{ item.title }}</h4>
            </div>
            <span>{{ item.description }}</span>
          </div>
        </div>
        <Divider />
        <div class="flex align-items-center text-sm">
          <span class="time text-gray-500">{{
            new Date(item.created_at) | dateFormat("YYYY.MM.DD")
          }}</span>
          <span class="files ml-auto">{{ item.attachments_count }} {{ getWordEnding(item.attachments_count) }}</span>
        </div>
      </div>
      <template v-if="currentParticipation.can_manage_posts">
        <Divider />
        <Button class="p-button-sm px-2 py-1" @click="redirectToUpdate(item)">
          <i class="pi pi-pencil mr-2" style="font-size: 0.9rem"></i>
          {{ $t("posts.editButton") }}
        </Button>
        <Button @click.prevent="deletePostHelper(item)" class="p-button-sm p-button-danger px-2 py-1 mr-2">
          <i class="pi pi-times mr-2" style="font-size: 0.9rem"></i>
          {{ $t("posts.deleteButton") }}
        </Button>
      </template>
    </div>

    <div ref="infinitescrolltrigger" />
    <transition name="fade">
      <div v-if="showloader" class="h-5rem flex justify-content-center">
        <ProgressSpinner class="loader" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Button from "primevue/button";
import Divider from "primevue/divider";
import ConfirmDialog from "primevue/confirmdialog";
import Skeleton from "primevue/skeleton";
import ProgressSpinner from "primevue/progressspinner";

export default {
  props: {
    type: String,
    items: Array,
    isFetch: Boolean,
    fetchItems: Function,
    limit: Number,
    offset: Number,
  },

  components: {
    Button,
    Divider,
    ConfirmDialog,
    Skeleton,
    ProgressSpinner,
  },

  data: () => {
    return {
      showloader: false,
    };
  },

  mounted() {
    this.scrollTrigger();
  },

  computed: {
    ...mapGetters({
      canModerate: "rooms/canModerate",
      currentParticipation: "participants/current",
    }),
  },

  methods: {
    ...mapActions({
      deletePost: "roomposts/delete",
    }),

    getWordEnding(count) {
      if (count === 1) {
        return this.$t("posts.fileAttached")
      }
      if ([2, 3, 4].includes(count)) {
        return this.$t("posts.filesAttached2")
      }
      return this.$t("posts.filesAttached")
    },

    async deletePostHelper(post) {
      this.$confirm.require({
        header: `${this.$t('rooms.confirmAction')}`,
        message: `${this.$t('rooms.confirmDeletePost')}?`,
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.deletePost(post);
        },
        reject: () => { },
      });
    },
    async redirectToUpdate(item) {
      console.log(item);
      this.$router.push({
        name: "rooms.post.update",
        params: {
          postId: item.id,
          roomId: item.room_id,
        },
      });
    },
    async redirectDetail(item) {
      this.$router.push({
        name: "rooms.post.detail",
        params: {
          postId: item.id,
          roomId: item.room_id,
        },
      });
    },
    fetchMore() {
      this.$store.commit("roomposts/SET_IS_INFINITE_SCROLL", true);

      if (this.type === "material") {
        this.$store.commit("roomposts/SET_OFFSET_MATERIALS", this.offset + 5);
      }

      if (this.type === "homework") {
        this.$store.commit("roomposts/SET_OFFSET_HOMEWORKS", this.offset + 5);
      }

      this.fetchItems(this.offset + 5, this.limit);
      this.showloader = false;
    },
    scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.isFetch) {
          this.showloader = true;
          this.fetchMore();
        }
      });
      observer.observe(this.$refs.infinitescrolltrigger);
    },
  },
};
</script>

<style scoped>
.attachments-block {
  height: 320px;
  overflow: scroll;
  padding-right: 10px;
}

.block-nav {
  cursor: pointer;
}

.loader {
  width: 50px;
  height: 50px;
}
</style>
