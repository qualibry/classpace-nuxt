<template>
    <div class="language-change ml-4">
        <Dropdown v-model="locale" :options="locales" class="styled-dropdown" placeholder="Set a language">
            <template #value="slotProps">
                <div class="flex align-items-center" :key="slotProps.value.code">
                    <img v-if="slotProps.value.code" :src="'https://flagcdn.com/w20/' + slotProps.value.flag + '.png'" width="18" class="flag hidden lg:inline" />
                    <div class="ml-0 lg:ml-3">{{ slotProps.value.name }}</div>
                </div>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center" @click.prevent="changeLocale(slotProps.option.code)">
                    <img :src="'https://flagcdn.com/w20/' + slotProps.option.flag + '.png'" width="18" class="flag" />
                    <div class="ml-3">{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import { mapGetters } from 'vuex'
import { loadLocale } from '~/plugins/i18n'

export default {
    components: {
        Dropdown
    },

    data () {
        return {
            locale: null,
            locales: [
                { name: "Русский", code: 'ru', flag: 'ru' },
                { name: "English", code: 'en', flag: 'gb' }
            ]
        }
    },

    computed: mapGetters({
        currentLocale: 'locale/locale',
        store_locales: 'locale/locales'
    }),

    methods: {
        async changeLocale(locale) {
            if (this.$i18n.locale !== locale) {
                loadLocale(locale)
                await this.$store.dispatch('locale/setLocale', { locale })
            }
        }
    },

    created () {
        for(var i = 0; i < this.locales.length; i++) {
            if(this.locales[i]['code'] == this.currentLocale) {
                this.locale = this.locales[i]
            }
        }
    }
}
</script>

<style>
    .p-dropdown-label {
        padding:0.5rem 1rem!important;
    }
    .flag {
        box-shadow: 0px 1px 7px 0px #b7b7b7;
    }
    .p-dropdown-item {
        padding-top:0.5rem!important;
        padding-bottom:0.5rem!important;
    }
</style>