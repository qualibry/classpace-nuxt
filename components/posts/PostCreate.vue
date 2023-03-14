<template>
    <div class="attachments-add">
        <div class="flex align-items-center mb-3">
            <Button @click.prevent="back()" icon="pi pi-arrow-left" class="p-button-rounded p-button-text p-button-plain mr-2" />
            <h2 class="my-0">{{ post.id ? post.title : $t('posts.addNewOne') }}</h2>
        </div>
        <div class="grid">
            <div class="col-12 xl:col-5">
                <label class="text-sm mb-3 block">
                    <Dropdown
                        v-model="form.type"
                        optionValue="value"
                        :options="postTypes"
                        optionLabel="name"
                        placeholder="Select a Post Type"
                    />
                </label>
                <div class="mb-3">
                    <InputText v-model="form.title" :placeholder="$t('posts.titlePlaceholderCreate')" class="block w-full" />
                    <span class="text-sm text-red-400" v-if="errors.title">{{ errors.title }}</span>
                </div>
                <InputText v-model="form.description" :placeholder="$t('posts.descriptionPlaceholderCreate')" class="block w-full mb-3" />
                <Textarea v-model="form.text" :placeholder="$t('posts.textPlaceholderCreate')" autoresize="true" class="block w-full mb-3" rows="6" />

                <Button @click.prevent="createPost()" class="mt-3">{{ post.id ?  $t('posts.updateText') : $t('posts.createText') }}</Button>
            </div>
            <div class="col-12 xl:col-4">
                <div class="bg-white border-solid border-1 p-3 border-round-lg border-300">
                    <h3 class="my-0">{{ $t('posts.attachedFiles') }}</h3>
                    <AttachmentList :editable="true" @update_files="updateFiles" />
                    <Divider />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button'
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { mapActions, mapGetters } from 'vuex'
import AttachmentList from '@/components/attachments/AttachmentList.vue'
import Dropdown from 'primevue/dropdown';


export default {
    components: {
        Button, InputText, Textarea,
        Divider, AttachmentList, Dropdown,
    },
    
    data () {
        const post = this.$store.getters['roomposts/item']

        return {
            form: {
                title: post.title || '',
                text: post.text || '',
                description: post.description || '',
                room_id: this.$route.params.id,
                type: this.$route.query.type || 'material'
            },
            postTypes: [
                {name: this.$t('posts.materialType'), value: 'material'},
                {name: this.$t('posts.homeworkType'), value: 'homework'},
            ],
            type: undefined,
            attachments: []
        }
    },

    computed: {
        ...mapGetters({
            errors: 'roomposts/errors',
            post: 'roomposts/item',
        }),
    },
    methods: {
        ...mapActions({
            create: 'roomposts/create',
            attachFiles: 'attachments/create'
        }),
        updateFiles(files){
            this.attachments = files
        },

        back() {
            this.$router.go(-1)
        },
        async createNewPost(postForm, attachments) {
            let response = await this.create(postForm)
            if (!response.ok) {
                this.$toast.add({
                    severity: 'error',
                    summary: this.$t('basics.errorPop'),
                    detail: this.$t('posts.createError'),
                    life: 3000
                })
                return
            }
            this.$toast.add({
                severity: 'success',
                summary: this.$t('basics.successPop'),
                detail: this.$t('posts.createSuccess'),
                life: 3000
            })

            this.attachFiles({
                postId: this.post.id,
                attachments: attachments,
            })
            this.$store.commit('attachments/SET_ITEMS', [])
            this.$store.commit('roomposts/SET_ITEM', {})
        },

        async updatePost({ postId, requestBody }) {
            await this.$store.dispatch('roomposts/update', {
                postId: postId,
                requestBody: requestBody
            })

            let filesToAttach = this.attachments.filter(e => !e.id)

            this.attachFiles({
                postId: this.post.id,
                attachments: filesToAttach,
            })

            this.$toast.add({
                severity:'info',
                summary:'Success',
                detail:'Post updated',
                life: 3000
            })
        },

        async createPost() {
            if(!this.post.id) {
                await this.createNewPost(
                    this.form,
                    this.$store.getters['attachments/items'],
                )
            } else {
                await this.updatePost(
                    { postId: this.post.id, requestBody: this.form }
                )
            }
        },
    }
}

</script>