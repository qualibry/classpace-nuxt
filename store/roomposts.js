import { apiClient } from "@/utils/api.js"
import Cookies from 'js-cookie'

export const namespaced = true;

export const state = () => ({
    item: {},
    items: [],
    errors: {},
})

export const getters = {
    item(state) {
        return state.item;
    },
    items(state) {
        return state.items
    },
    errors(state) {
        return state.errors
    }
}

export const mutations = {
    SET_ITEMS(state, items) {
        state.items = items;
    },
    SET_ITEM(state, item) {
        state.item = item
    },
    SET_ERRORS(state, items) {
        state.errors = items
    }
}

export const actions = {
    async create({ commit }, requestBody) {
        const client = await apiClient
        const accessToken = this.$cookies.get('token')
        
        try {
            const response = await client.apis.roomPost.createRoomPost({}, {
                requestInterceptor: (request) => {
                    request.headers.Authorization = `Bearer ${accessToken}`
                },
                requestBody: requestBody,
            })
            commit('SET_ITEM', response.body)
            commit('SET_ERRORS', {})
        } catch (e) {
            console.error(e.response)
            commit('SET_ERRORS', e.response.body.detail)
        }
    },
    async fetch({ commit }, {roomId, search, ordering, limit, offset}) {
        const client = await apiClient
        const accessToken = this.$cookies.get('token')
        
        try {
            const response = await client.apis.roomPost.getRoomPosts(
                {
                    room_id: roomId,
                    search: search,
                    ordering: ordering,
                    limit: limit,
                    offset: offset,
                },
                {
                    requestInterceptor: (request) => {
                        request.headers.Authorization = `Bearer ${accessToken}`
                },
            })
            commit('SET_ITEMS', response.body.items)
        } catch (e) {
            await console.error(e.response)
            throw e.response
        }
    },
    async delete({ getters, commit }, roomPost) {
        const client = await apiClient
        const accessToken = this.$cookies.get('token')
        
        try {
            await client.apis.roomPost.deleteRoomPost({
                post_id: roomPost.id
            }, {
                requestInterceptor: (request) => {
                    request.headers.Authorization = `Bearer ${accessToken}`
                },
            })
            console.log(getters.items)
            commit('SET_ITEMS', getters.items.filter(item => item.id != roomPost.id))
        } catch (e) {
            console.error(e)
        }
    },
    async get({ commit }, roomPostId) {
        const client = await apiClient
        const accessToken = this.$cookies.get('token')

        try {
            const response = await client.apis.roomPost.getRoomPost({post_id: roomPostId},
                {
                    requestInterceptor: (request) => {
                        request.headers.Authorization = `Bearer ${accessToken}`
                    },
                }
            )
            commit('SET_ITEM', response.body)
        }
        catch (e) {
            console.error(e)
        }
    },
    async update({ commit }, { postId, requestBody }) {
        const client = await apiClient
        const accessToken = this.$cookies.get('token')
        
        try {
            const response = await client.apis.roomPost.updateRoomPost({
                post_id: postId
            }, {
                requestInterceptor: (request) => {
                    request.headers.Authorization = `Bearer ${accessToken}`
                },
                requestBody: requestBody,
            })
            commit('SET_ITEM', response.body)
            commit('SET_ERRORS', {})
        } catch (e) {
            console.error(e.response.body)
            commit('SET_ERRORS', e.response.body.detail)
        }
    }
}