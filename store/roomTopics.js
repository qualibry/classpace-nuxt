import { apiClient } from '@/utils/api.js'
import Cookies from 'js-cookie'

export const namespaced = true;

export const state = () => ({
  item: null,
  topics: [],
  //canModerate: false,
})

export const getters = {
  item(state) {
    return state.item;
  },
  topics(state) {
    return state.topics
  }
}

export const mutations = {
  SET_TOPICS(state, topics) {
    state.topics = topics;
  },
  SET_ITEM(state, item) {
    state.item = item
  },
  ADD_TOPIC(state, item) {
    state.topics.push(item)
  },
  DELETE_TOPIC(state, item) {
    const index = state.topics.findIndex(element => element.id === item.id);
    console.log(index)
    state.topics.splice(index, 1)
  },
  UPDATE_TOPIC(state, item) {
    state.topics = state.topics.map((value) => {
      if(item.id == value.id){
        return item 
      }
      else{
        return value
      }
    })
  },
}

export const actions = {

  async getTopics({ commit }, roomId) {
    const client = await apiClient
    const accessToken = this.$cookies.get('token')
    try {
      const response = await client.apis.topics.fetchRoomTopics(
      {
        room_id: roomId
      }, 
      {
        requestInterceptor: (request) => {
          request.headers.Authorization = `Bearer ${accessToken}`
        },
      })

      commit('SET_TOPICS', response.body)
    } catch (e) {
      console.log(e)
      // console.error(e.response.body)
    }
  },


  async createTopic({ commit }, requestBody) {
    const client = await apiClient
    const accessToken = this.$cookies.get('token')

    try {
      // const response = await client.apis.topics.createTopic(
      // {
      //   requestInterceptor: (request) => {
      //     request.headers.Authorization = `Bearer ${accessToken}`
      //   },
      //   requestBody: requestBody,
      // })
      const response = await this.$axios.post(
        'https://bezpart.ru/api/v1/classroom/topic',
        requestBody,
        {
          headers:{
            'authorization': `Bearer ${accessToken}`
          } 
        }
      )

      commit('ADD_TOPIC', response.data)
    } catch (e) {
      console.error(e)
    }
  },


  async updateTopic({ commit, dispatch }, requestData) {
    const client = await apiClient
    const accessToken = this.$cookies.get('token')

    try {
      const response = await client.apis.topics.updateTopic(
        {
          topic_id: requestData.topicId
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`
          },
          requestBody: requestData.body
        })
        dispatch('getTopics', requestData.roomId)
        // commit('UPDATE_TOPIC', response.obj)

    } catch (e) {
      console.error(e)
    }
  },

  
  async deletRoomTopic({ commit, dispatch }, topic) {
    const client = await apiClient
    const accessToken = this.$cookies.get('token')

    try {
      const response = await client.apis.topics.deletRoomTopic(
        {
          topic_id: topic.id
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`
          },
        })
        dispatch('getTopics', topic.room_id)
    } catch (e) {
      console.error(e)
    }
  },
}