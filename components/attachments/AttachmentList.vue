<template>
<div class="attachments-list">
    <Listbox
        :options="attachments"
        listStyle="max-height:250px"
        @change="changeItem"
    >   
        <template
            #option="attachment"
        >
            <div>
                <i v-if="!editable" class="pi pi-file" style="font-size:1.8rem;margin-right:1.3rem"></i>
                <i
                    v-else
                    class="pi pi-times"
                    style="font-size:1.8rem;margin-right:1.3rem"
                ></i>
                <span class="flex align-items-center justify-content-start"> 
                    {{attachment.option.filename || attachment.option.name }} 
                    <ProgressSpinner v-if="!attachment.option.id" class="ml-1" style="width: 20px; height: 20px;" /> 
                </span>
            </div>
        </template> 
    </Listbox>
    <Button v-if="editable" @click="clickInvisibleInput" class=" ml-2 mt-2" v-tooltip.top="$t('rooms.addFiles')"> <i class="pi pi-plus mr-2"></i>{{$t('rooms.addFilesButton')}}</Button>
    <input
            @change="updateFiles()" 
            ref="invisible_input"
            v-show="false"
            type="file"
            multiple="multiple">
</div>
</template>

<script>
import Button from 'primevue/button'
import { mapGetters, mapActions } from 'vuex'
import Listbox from 'primevue/listbox'
import { downloadFromBlob } from '@/utils/utils.js'
import ProgressSpinner from 'primevue/progressspinner';

export default {
    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        attachmentsField: {
            type: String,
            default: '',
        },
    },
    components: {
        Listbox,Button,ProgressSpinner
    },
    computed: {
        ...mapGetters({
            'attachments': 'attachments/items', 
        }),
    },
    methods: {
        ...mapActions({
            getAttachment: 'attachments/get',
            delete: 'attachments/delete',
        }),
        async clickInvisibleInput(){
            this.$refs.invisible_input.click()
        },
        updateFiles(){
            this.files = this.$refs.invisible_input.files
            this.files = Array.from(this.files)
            this.$store.commit('attachments/ADD_ITEMS', this.files)

            this.$emit('update_files', this.files);
        },
        async changeItem(option) {
            if(this.editable) {
                await this.deleteAttachment(option)
            } else {
                await this.download(option)
            }
        },
        async download(option) {
            const attachment = option.value

            if(!attachment.id) {
                this.$toast.add({
                    severity: 'error',
                    summary: this.$t('posts.attachmentDownloadError'),
                    detail: this.$t('homeworks.attachmentNotUploadedError'),
                    life: 3000
                })
                return
            }

            await this.getAttachment(attachment.id)
            return downloadFromBlob(this.$store.getters['attachments/item'], attachment.filename)
        },
        async deleteAttachment(option) {
            const attachment = option.value

            if(attachment.id) {
                await this.delete(attachment.id)
            }
            this.$store.commit('attachments/SET_ITEMS', this.attachments.filter(e => e !== attachment))
            console.log(attachment, this.attachments)
        }
    },
}
</script>