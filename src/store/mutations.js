import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },

    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_TOPLIST](state, topList) {
        state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state, searchHistory) {
        state.searchHistory = searchHistory
    },
    [types.SET_PLAY_HISTORY](state, playHistory) {
        state.playHistory = playHistory
    },
    [types.SET_FAVORITE_LIST](state, favoriteList) {
        state.favoriteList = favoriteList
    },
    [types.SET_MUSIC_QUALITY](state, musicQuality) {
        state.musicQuality = musicQuality
        localStorage.setItem('__musicQuality__', musicQuality)
    }
}
export default mutations
