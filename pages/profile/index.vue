<template>
    <div class="user-profile">
        <Toast />
        <template v-if="!loading">
            <h2 class="mt-0">{{$t('profile.info')}}</h2>
            <div class="grid">
                <div class="col-12 xl:col-8">
                    <div class="flex align-items-center mb-6">
                        <div class="mr-3 avatar_container">
                            <div @click="activateInput" class="img_container">
                                <Avatar :image="currentUser.profile_picture_path" class="avatar-img" size="large" shape="circle" />
                                <i class="pi pi-cloud-upload avatar-upload-img"></i>
                                <input @change="sendAvatarToServer" ref="fileAvatar" class="choose-new-avatar" type="file" name="img" id="chooser_avatar" accept="image/*">
                            </div> 
                        </div>
                        <div>
                            <h3 class="mt-0 mb-1">{{ currentUser.first_name }} {{ currentUser.middle_name }} {{ currentUser.last_name }}</h3>
                            <span>{{ currentUser.email }}</span>
                        </div>
                        <div class="ml-8">
                            <span class="text-sm block mb-1">{{ $t('profile.registrationDate') }}: {{ currentUser.created_at }}</span>
                            <span class="text-sm block">{{ $t('profile.updateDate') }}: {{ currentUser.updated_at }}</span>
                        </div>
                    </div>
                    <h4>Обновить профиль:</h4>
                    <Divider align="left" type="dashed">
                        Основные данные
                    </Divider>
                    <label for="first_name" class="mb-1 block">Имя</label>
                    <InputText id="first_name" v-model="form.first_name" class="block w-full mb-4" />
                    <label for="first_name" class="mb-1 block">Отчество (второе имя)</label>
                    <InputText id="first_name" v-model="form.middle_name" class="block w-full mb-4" />
                    <label for="first_name" class="mb-1 block">Фамилия</label>
                    <InputText id="first_name" v-model="form.last_name" class="block w-full mb-5" />
                    
                    <Divider align="left" type="dashed">
                        Данные для входа
                    </Divider>
                    <label for="first_name" class="mb-1 block">Новый пароль</label>
                    <InputText id="first_name" v-model="form.password" class="block w-full mb-4" />
                    <label for="first_name" class="mb-1 block">Повторите новый пароль</label>
                    <InputText id="first_name" v-model="form.repeat_password" class="block w-full mb-5" />
                    <label for="first_name" class="mb-1 block">Подтвердить пароль</label>
                    <InputText id="first_name" v-model="form.confirm_password" class="block w-full mb-5" />
                    <Button @click.prevent="updateUser">Обновить</Button>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex justify-content-center">
                <ProgressSpinner />
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { getAuth, signInAnonymously } from 'firebase/auth'
import Toast from 'primevue/toast';


export default {
    components: {
        Avatar, InputText, Divider,
        ProgressSpinner, Button, Toast,
    },
    data () {
        return {
            form: {
                first_name: '',
                last_name: '',
                middleName: '',
                confirm_password: '',
                email: '',
                password: '',
                repeat_password: '',
            },
            loading: true,
            uploadAvatar: {},
            isMousOnAvatar: false,
            allowPushNotifications: false,
            isNotificationsEnbaled: false,
        }
    },
    methods: {
        ...mapActions({
            getCurrentUser: 'users/getCurrentUser',
            updateUser: 'users/updateUser',
            updateUserAvatar: 'users/updateAvatar',
            
        }),
        async updateUser() {
            const response = await this.$store.dispatch('users/updateUser', this.form)
            console.log(response)
            
            if(response.ok) {
                this.$toast.add({
                    severity: 'success',
                    summary: 'Профиль успешно обновлён!',
                    life: 5000
                })
            }
            else {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Не удалось обновить профиль',
                    life: 3000
                })
            }
        },
        activateInput() {
            document.getElementById('chooser_avatar').click()
        },
        async sendAvatarToServer() {
            this.uploadAvatar = this.$refs.fileAvatar.files[0];
            this.updateUserAvatar({profile_picture: this.uploadAvatar})
        },
        async requestPushNotifications() {
            await signInAnonymously(getAuth())
            this.activatePushNotifications()
        },
        async activatePushNotifications() {
           alert('coming soon!')
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'users/currentUser',
            updateErrors: 'users/registrationErrors',
        }),
    },

    async created () {     
        setTimeout(() => {
                this.loading = false
        }, 100)

        this.form = Object.assign(this.form, this.currentUser)
    }
}
</script>

<style scoped>
.choose-new-avatar {
    width: 0;
    height: 0;
}

.img_container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 50%;
    z-index: 100;
}

.avatar_container {
    position: relative;
    user-select: none;
    z-index: 0;
}

.avatar-img {
    cursor: pointer;
    width: 150px;
    height: 150px;
    box-shadow: 0 2px 10px rgb(57 54 77 / 30%);
}

.avatar-img:hover{
    opacity: 0.6;
}

.avatar-upload-img {
    width: 25%;
    height: 25%;
    font-size: 2.5rem;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    display: none;
    pointer-events: none;
}

.img_container:hover .avatar-upload-img {
    display: block;
    opacity: 0.8;
}
</style>