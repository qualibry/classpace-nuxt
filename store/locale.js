import Cookies from 'js-cookie'
import { apiClient } from '@/utils/api.js'

export const namespaced = true

export const state = () => ({
    locale: 'ru',
    locales: {
        ru: 'Русский',
        en: 'English'
    }
})

export const getters = {
    locale: state => state.locale,
    locales: state => state.locales
}

export const mutations = {
    SET_LOCALE (state, { locale }) {
        state.locale = locale
    }
}

export const actions = {
    async setLocale({ commit }, { locale }) {
        const client = await apiClient

        try {
          await client.apis.localization.changeLocalization(
            {},
            {
                requestBody: {language_code: locale}
            },
          )
          commit('SET_LOCALE', { locale })
          Cookies.set('locale', locale, { expires: 365 })
        } catch (e) {
          console.error(e)
          commit('SET_ERRORS', e.response?.body?.detail)
        }
        Cookies.set('locale', locale, { expires: 365 })
    }
}