<template>
    <div class="container">
        <div class="grid justify-content-center align-items-center h-screen">
            <div class="col-12 md:col-8 lg:col-5">
                <div class="registration-page">
                    <NuxtLink to="/">
                        <Button class="p-button-sm py-1 px-2 mb-2 p-button-text">{{ $t('back-to-home') }}</Button>
                    </NuxtLink>
                    <Card>
                        <template #title>
                            {{ $t('login.title') }}
                        </template>
                        <template #content>
                            <div>
                                <span class="p-input-icon-left d-block w-full mb-0">
                                    <i class="pi pi-inbox" />
                                    <InputText type="email" v-model="form.email" :placeholder="$t('login.placeholders.email')" class="w-full" />
                                    <span v-if="errors.email" class="error text-red-400">{{ errors.email }}</span>
                                </span>
                            </div>
                            <Divider align="center" type="dashed" class="text-sm">
                                <b>{{ $t('login.dividers.password') }}</b>
                            </Divider>
                            <span class="p-input-icon-left d-block w-full mb-0">
                                <i class="pi pi-lock" />
                                <InputText type="password" v-model="form.password" :placeholder="$t('login.placeholders.password')" class="w-full" />
                            </span>
                            <div class="field-checkbox my-4">
                                <Checkbox id="remember" v-model="form.remember" :binary="true" />
                                <label for="remember">{{ $t('login.remember') }}</label>
                            </div>
                            <OAuthComponent />
                            <Button
                                @click.prevent="loginUser()"
                                :loading="loading"
                                class="w-full text-center block"
                                :disabled="!allowLogin"
                            >
                                {{ $t('login.button') }}
                            </Button>
                        </template>
                    </Card>
                    <NuxtLink to="/recovery">
                        <Button class="p-button-text text-sm block w-full py-2 mt-3">Забыли пароль?</Button>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from 'primevue/card';
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import Divider from 'primevue/divider';
    import Checkbox from 'primevue/checkbox';
    import { mapActions, mapGetters } from 'vuex';
    import OAuthComponent from '~/components/auth/OAuthComponent.vue'

    export default {
        components: {
            Card, InputText, Button, Divider, Checkbox,
            OAuthComponent,
        },

        layout: 'authentication',

        middleware: 'guest',

        data () {
            return {
                form: {
                    email: '',
                    password: '',
                    remember: false
                },
                loading: false
            }
        },

        computed: {
            ...mapGetters({
                error: 'users/loginError',
                errors: 'users/registrationErrors',
                authenticationToken: 'users/authenticationToken'
            }),
            allowLogin() {
                return this.form.email && (this.form.password)
            }
        },

        async created() {
            await this.$store.commit('users/SET_LOGIN_ERROR', undefined)
        },

        methods: {
            ...mapActions(
                { authenticateUser: 'users/authenticateUser' }
            ),
            async loginUser() {
                this.loading = true

                await this.authenticateUser({
                    username: this.form.email,
                    password: this.form.password,
                })

                if(!this.error) {
                    this.$router.push({ 'name': 'profile' })
                } else {
                    this.$toast.add({
                        severity:'error',
                        summary:'Error',
                        detail:this.error,
                        life: 15000,
                    })
                }

                this.loading = false
            }
        }
    }
</script>