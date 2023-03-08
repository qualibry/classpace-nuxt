<template>
    <div class="container">
        <div class="grid justify-content-center align-items-center h-screen">
            <div class="col-12 md:col-8 lg:col-5">
                <div class="registration-page">
                    <NuxtLink to="/">
                        <Button class="p-button-sm py-1 px-2 mb-2 p-button-text">{{ $t('back-to-home') }}</Button>
                    </NuxtLink>
                    <Card class="card">
                        <template #title>
                            <div>
                                {{ $t('login.oauthLoading') }}
                            </div>
                        </template>
                        <template #content>
                            <div class="flex align-items-center">
                                <ProgressSpinner />
                            </div>
                        </template>
                    </Card>
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
import OAuthComponent from '~/components/auth/OAuthComponent.vue'
import ProgressSpinner from 'primevue/progressspinner'

export default {
    components: {
        Card, InputText, Button, Divider, Checkbox,
        OAuthComponent, ProgressSpinner,
    },
    layout: 'authentication',
    middleware: 'guest',
    async created() {
        const accessToken = this.$route.query.clientSecret

        if(accessToken) {
            await this.$store.dispatch('users/setAccessToken', {token: accessToken})
        }

        await this.$store.dispatch('users/getCurrentUser')

        const currentUser = this.$store.getters['users/currentUser']

        this.$toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: `Вы авторизованы как ${currentUser.first_name} ${currentUser.last_name}`,
            life: 5000,
        })
        this.$router.push({name: 'profile'})
    }
}
</script>