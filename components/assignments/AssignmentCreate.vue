<template>
  <div>
    <div class="grid">
        <div class="col-12 xl:col-8">
            <h3>{{ $t('homeworks.status') }}: <Badge
                :value="assignment.status || $t('homeworks.unassignedStatus')"
                :severity="statusState"
                >
                </Badge>
            </h3>
            <Button
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                @click="submitAssignment"
            />
        </div>
        <div class="col-12 xl:col-4">
            <div class="bg-white border-solid border-1 p-3 border-round-lg border-300">
                <h3 class="my-0">
                    {{ $t('posts.attachedFiles') }}
                    <b>: {{ attachFiles ? $t('homeworks.assignAttach') : $t('homeworks.assignDownload') }}</b>
                </h3>
                <InputSwitch v-model="attachFiles" />
                <AttachmentList :editable="attachFiles" @update_files="(files) => {attachments = files} " />
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AttachmentList from '@/components/attachments/AttachmentList.vue'
import InputSwitch from 'primevue/inputswitch';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import attachmentsCreate from '~/mixins/attachmentsCreate.js'


export default {
    components: {
        AttachmentList, Badge,
        Button, InputSwitch,
    },
    mixins: [attachmentsCreate],
    data() {
        return {
            attachments: [],
            attachFiles: false,
        }
    },
    computed: {
        ...mapGetters({
            'assignment': 'assignments/item',
        }),
        statusState() {
            const assignment = this.$store.getters['assignments/item']

            if(Object.keys(assignment).length === 0)
                return 'danger'
            else if(assignment.status_assigned)
                return 'info'
            else if(assignment.status_request_changes)
                return 'danger'
            else if(assignment.status_done)
                return 'success'
        }
    },
    methods: {
        async uploadAttachments() {
            const currentAttachments = this.$store.getters['attachments/items']
            let filesToAttach = currentAttachments.filter(e => !e.id)

            if(filesToAttach.length)
                await this.$store.dispatch('attachments/create', {
                    assignmentId: this.assignment.id,
                    attachments: filesToAttach,
                })
        },
        async createAssignment() {
            await this.$store.dispatch('assignments/create', {
                post_id: this.$store.getters['roomposts/item'].id,
            })

            if(this.assignment.id) {
                await this.uploadAttachments()

                this.$toast.add({
                    severity: 'success',
                    summary: this.$t('homeworks.assignedSuccess'),
                    detail: this.$t('homeworks.encourageMessage'),
                    life: 3000
                })
            }
        },
        async updateAssignment() {
            await this.$store.dispatch('assignments/reassign', this.assignment.id)
            await this.uploadAttachments()

            this.$toast.add({
                severity: 'success',
                summary: this.$t('homeworks.assignedSuccess'),
                detail: this.$t('homeworks.encourageMessage'),
                life: 3000
            })
        },
        async submitAssignment() {
            if(!this.assignment.id) {
                await this.createAssignment()
            } else {
                await this.updateAssignment()
            }
        }
    },
}
</script>

<style>

</style>