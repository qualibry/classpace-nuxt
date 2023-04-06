<template>
  <div>
    <div class="flex align-items-center mb-3">
      <Button
        icon="pi pi-arrow-left"
        class="p-button-rounded p-button-text p-button-plain mr-2"
        @click="goBack"
      />
      <h2 class="my-0">
        {{ $t("homeworks.assignedHomeworksCount") }} ({{ assignments.total }})
      </h2>
    </div>
    <Dialog
      :visible="displayAssignment"
      :style="{ width: '100%', padding: '0 10%', boxShadow: 'none' }"
      :modal="true"
      @update:visible="changeAssignmentVisibility"
    >
      <template #header>
        <h3>
          {{ `Homework: ` + currentAssignment.post.title }}
          <p class="header-footer">
            {{ `Room: ` + currentAssignment.post.room.name }}
          </p>
          <p class="header-footer">
            {{
              $t("homeworks.studentColumn") +
              ": " +
              currentAssignment.author.full_name
            }}
          </p>
          <p class="header-footer">
            {{ $t("homeworks.status") }}:
            <Badge :value="currentAssignment.status" />
          </p>
        </h3>
      </template>
      <SelectButton v-model="accept" :options="options" class="mb-3 mt-1" />
      <AcceptWork :currentAssignment="currentAssignment" v-if="isAccept" />
      <RejectWorck :currentAssignment="currentAssignment" v-if="!isAccept" />
    </Dialog>
    <div class="grid">
      <div class="col-12 xl:col-5" v-if="assignments.total">
        <DataTable dataKey="id" :value="assignments.items" class="p-datatable">
          <Column
            field="author.full_name"
            :header="$t('homeworks.studentColumn')"
            :sortable="true"
          >
            <template #body="assignment">
              <div class="flex align-items-center gap-1 w-15rem">
                <Avatar
                  :image="assignment.data.author.profile_picture_path"
                  class="mr-3"
                  size="large"
                  shape="circle"
                />

                <span>{{ assignment.data.author.full_name }}</span>
              </div>
            </template>
          </Column>
          <Column
            field="created_at"
            :header="$t('homeworks.createdDate')"
            :sortable="true"
          >
            <template #body="assignment">
              <div class="w-10rem">
                {{
                  new Date(assignment.data.created_at)
                    | dateFormat("DD.MM.YYYY")
                }}
              </div>
            </template>
          </Column>
          <Column
            field="status"
            :header="$t('homeworks.status')"
            :sortable="true"
          >
            <template class="cocv" #body="assignment">
              <Badge
                :value="assignment.data.status"
                :severity="statusState(assignment.data)"
              >
              </Badge>
            </template>
          </Column>
          <Column
            field="comment"
            :header="$t('homeworks.comment')"
            :sortable="true"
          >
            <template #body="assignment">
              {{ assignment.data.comment }}
            </template>
          </Column>
          <Column
            field="rate"
            :header="$t('homeworks.rate')"
            :sortable="true"
          ></Column>
          <Column :header="$t('homeworks.action')">
            <template class="btn-open-column" #body="assignment">
              <Button
                @click="fetchCurrentAssignment(assignment.data)"
                value="Open"
                severity="info"
                class="text-sm w-10rem"
              >
                {{ $t("homeworks.showAssignment") }}
              </Button>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="col-12 xl:col-5" v-else>
        {{ $t("homeworks.noAssignments") }}
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row
import { mapGetters } from "vuex";
import Button from "primevue/button";
import Divider from "primevue/divider";
import AssignmentCreate from "@/components/assignments/AssignmentCreate.vue";
import AcceptWork from "@/components/assignments/AcceptWork.vue";
import Dialog from "primevue/dialog";
import RejectWorck from "@/components/assignments/RejectWorck.vue";
import SelectButton from "primevue/selectbutton";

export default {
  components: {
    Button,
    Divider,
    Avatar,
    DataTable,
    Column,
    Badge,
    Message,
    ColumnGroup,
    Row,
    AssignmentCreate,
    Dialog,
    AcceptWork,
    RejectWorck,
    SelectButton,
  },
  computed: {
    ...mapGetters({
      assignments: "assignments/items",
      currentAssignment: "assignments/item",
      post: "roomposts/item",
      room: "rooms/item",
    }),
    isAccept() {
      if (this.accept === "accept") {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      displayAssignment: false,
      accept: "accept",
      options: ["accept", "reject"],
    };
  },
  methods: {
    async goBack() {
      this.$router.go(-1);
    },
    statusState(assignment) {
      if (Object.keys(assignment).length === 0) return "danger";
      else if (assignment.status_assigned) return "info";
      else if (assignment.status_request_changes) return "danger";
      else if (assignment.status_done) return "success";
    },
    async fetchCurrentAssignment(assignment) {
      await this.$store.dispatch("assignments/get", assignment.id);
      this.displayAssignment = !this.displayAssignment;
    },
    changeAssignmentVisibility() {
      this.displayAssignment = !this.displayAssignment;
    },
  },
};
</script>
