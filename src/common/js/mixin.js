import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  method: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  data() {
    return {
      abc: '555'
    }
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      // console.log(index)
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query.trim())
    },
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

export const routerMixin = {
  created() {
    this.touch = {}
  },
  methods: {
    changeRouter(num) {
      switch (this.$route.name + num) {
        case 1:
          this.$router.push({
            path: '/recommend'
          })
          break
        case 2:
          this.$router.push({
            path: '/singer'
          })
          break
        case 3:
          this.$router.push({
            path: '/rank'
          })
          break
        case 4:
          this.$router.push({
            path: '/search'
          })
          break
      }
    },
    touchStart(e) {
      this.touch = {}
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      // console.log('touchStart')
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      this.touch.moved = true
      // console.log('touchMove')
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      this.touch.deltaX = deltaX
      const deltaY = touch.pageY - this.touch.startY
      // console.log(deltaX)
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // console.log(deltaX)
      const left = deltaX < 0 ? 0 : -window.innerWidth
      const offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetwidth / window.innerWidth)
      // console.log(this.touch.percent)
    },
    touchEnd(e) {
      if (!this.touch.moved) {
        return
      }
      this.touch.moved = false
      // console.log(this.touch.percent)
      if (this.touch.deltaX < 0) {
        if (this.touch.percent > 0.2) {
          // console.log(this.$route.name + 1)
          this.changeRouter(1)
        }
      } else {
        if (this.touch.percent < 0.8) {
          // console.log(this.$route.name - 1)
          this.changeRouter(-1)
        }
      }
      this.touch = {}
    }
  }
}
