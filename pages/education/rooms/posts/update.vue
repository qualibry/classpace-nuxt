<template>
    <div class="rooms-show">
        <template v-if="loading">
            <div class="flex justify-content-center">
                <ProgressSpinner />
            </div>
        </template>
        <template v-else>
            <PostCreate />
        </template>
    </div>
</template>

<script>
    import PostCreate from '@/components/posts/PostCreate.vue'
    import ProgressSpinner from 'primevue/progressspinner';

    export default {
        components: {
            PostCreate, ProgressSpinner
        },

        data () {
            return {
                loading: true
            }
        },

        async created () {
            const roomId = this.$route.params.roomId
            const postId = this.$route.params.postId

            await this.$store.dispatch('roomposts/get', postId)
            await this.$store.dispatch('participants/current', roomId)
            await this.$store.dispatch('users/getCurrentUser')

            const post = this.$store.getters['roomposts/item']

            await this.$store.commit('attachments/SET_ITEMS', post.attachments)

            setTimeout(() => {
                this.loading = false
            }, 100)
        }
    }
</script>