import { apiClient } from "@/utils/api.js";
import Cookies from "js-cookie";

export const namespaced = true;

export const state = () => ({
  item: {},
  materialItems: [],
  homeworkItems: [],
  isFetchMaterials: false,
  isFetchHomeworks: false,
  isInfiniteScroll: true,
  limitMaterials: 5,
  offsetMaterials: 0,
  limitHomeworks: 5,
  offsetHomeworks: 0,
  errors: {},
});

export const getters = {
  item(state) {
    return state.item;
  },
  materialItems(state) {
    return state.materialItems;
  },
  homeworkItems(state) {
    return state.homeworkItems;
  },
  isFetchMaterials(state) {
    return state.isFetchMaterials;
  },
  isFetchHomeworks(state) {
    return state.isFetchHomeworks;
  },
  isInfiniteScroll(state) {
    return state.isInfiniteScroll;
  },
  limitMaterials(state) {
    return state.limitMaterials;
  },
  offsetMaterials(state) {
    return state.offsetMaterials;
  },
  limitHomeworks(state) {
    return state.limitHomeworks;
  },
  offsetHomeworks(state) {
    return state.offsetHomeworks;
  },
  errors(state) {
    return state.errors;
  },
};

export const mutations = {
  SET_MATERIAL_ITEMS(state, items) {
    state.materialItems = items;
  },
  SET_HOMEWORK_ITEMS(state, items) {
    state.homeworkItems = items;
  },
  SET_IS_FETCH_MATERIALS(state, item) {
    state.isFetchMaterials = item;
  },
  SET_IS_FETCH_HOMEWORKS(state, item) {
    state.isFetchHomeworks = item;
  },
  SET_IS_INFINITE_SCROLL(state, item) {
    state.isInfiniteScroll = item;
  },
  SET_OFFSET_MATERIALS(state, item) {
    state.offsetMaterials = item;
  },
  SET_LIMIT_MATERIALS(state, item) {
    state.limitMaterials = item;
  },
  SET_OFFSET_HOMEWORKS(state, item) {
    state.offsetHomeworks = item;
  },
  SET_LIMIT_HOMEWORKS(state, item) {
    state.limitHomeworks = item;
  },
  SET_ITEM(state, item) {
    state.item = item;
  },
  SET_ERRORS(state, items) {
    state.errors = items;
  },
};

export const actions = {
  async create({ commit }, requestBody) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");
    let response = undefined;
    try {
      response = await client.apis.roomPost.createRoomPost(
        {},
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
          requestBody: requestBody,
        }
      );
      commit("SET_ITEM", response.body);
      commit("SET_ERRORS", {});
    } catch (e) {
      commit("SET_ERRORS", e.response.body.detail);
      response = e.response;
    }
    console.log(response);
    return response;
  },
  async fetchMaterials(
    { commit, state },
    { roomId, search, ordering, limit, offset }
  ) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");

    try {
      const response = await client.apis.roomPost.getRoomPosts(
        {
          room_id: roomId,
          search: search,
          ordering: ordering,
          limit: limit,
          offset: offset,
          type: "material",
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
        }
      );

      commit(
        "SET_MATERIAL_ITEMS",
        state.isInfiniteScroll
          ? [...state.materialItems, ...response.body.items]
          : response.body.items
      );

      if (state.isInfiniteScroll) {
        if (response.body.items.length < 5) {
          commit("SET_IS_FETCH_MATERIALS", false);
        } else {
          commit("SET_IS_FETCH_MATERIALS", true);
        }
      }
    } catch (e) {
      await console.error(e.response);
      throw e.response;
    }
  },
  async fetchHomeworks(
    { commit, state },
    { roomId, search, ordering, limit, offset }
  ) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");

    try {
      const response = await client.apis.roomPost.getRoomPosts(
        {
          room_id: roomId,
          search: search,
          ordering: ordering,
          limit: limit,
          offset: offset,
          type: "homework",
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
        }
      );

      commit(
        "SET_HOMEWORK_ITEMS",
        state.isInfiniteScroll
          ? [...state.homeworkItems, ...response.body.items]
          : response.body.items
      );

      if (state.isInfiniteScroll) {
        if (response.body.items.length < 5) {
          commit("SET_IS_FETCH_HOMEWORKS", false);
        } else {
          commit("SET_IS_FETCH_HOMEWORKS", true);
        }
      }
    } catch (e) {
      await console.error(e.response);
      throw e.response;
    }
  },
  async delete({ getters, commit }, roomPost) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");

    try {
      await client.apis.roomPost.deleteRoomPost(
        {
          post_id: roomPost.id,
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
        }
      );
      commit(
        "SET_MATERIAL_ITEMS",
        getters.materialItems.filter((item) => item.id != roomPost.id)
      );
      commit(
        "SET_HOMEWORK_ITEMS",
        getters.homeworkItems.filter((item) => item.id != roomPost.id)
      );
    } catch (e) {
      console.error(e);
    }
  },
  async get({ commit }, roomPostId) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");

    try {
      const response = await client.apis.roomPost.getRoomPost(
        { post_id: roomPostId },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
        }
      );
      commit("SET_ITEM", response.body);
    } catch (e) {
      console.error(e);
    }
  },
  async update({ commit }, { postId, requestBody }) {
    const client = await apiClient;
    const accessToken = this.$cookies.get("token");

    try {
      const response = await client.apis.roomPost.updateRoomPost(
        {
          post_id: postId,
        },
        {
          requestInterceptor: (request) => {
            request.headers.Authorization = `Bearer ${accessToken}`;
          },
          requestBody: requestBody,
        }
      );
      commit("SET_ITEM", response.body);
      commit("SET_ERRORS", {});
    } catch (e) {
      console.error(e.response.body);
      commit("SET_ERRORS", e.response.body.detail);
    }
  },
};
