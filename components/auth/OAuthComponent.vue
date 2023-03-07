<template>
    <div class="grid">
        <div class="col-8">
            <div class="grid">
                <div class="col">

                    <a :href="vk_redirect_link">
                        <Button type="button" class="p-button-outlined p-button-primary p-button-sm">
                            <img alt="logo" src="https://cdn-icons-png.flaticon.com/512/733/733583.png" style="width: 1.5rem" />
                            <span class="ml-2 font-bold">Войти через вк</span>
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Button from 'primevue/button';
import { VK_CLIENT_ID, VK_REDIRECT_URI } from '@/utils/config'

export default {
    components: {
        Button
    },
    computed: {
        vk_client_id() {
            return VK_CLIENT_ID
        },
        vk_redirect_link() {
            return `https://oauth.vk.com/authorize?client_id=${VK_CLIENT_ID}&redirect_uri=${VK_REDIRECT_URI}&display=popup&scope=email,notify,offline`
        }
    }
}
</script>

<style>
.vk_auth {
    width: 30px;
    height: 30px;
}
</style>