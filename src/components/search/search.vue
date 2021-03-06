<template>
    <div class="search" ref="search" @touchstart="touchStart"
         @touchmove="touchMove"
         @touchend="touchEnd">
        <div class="search-box-wrapper">
            <search-box @query="onQueryChange" ref="searchBox"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <Scroll :refreshDelay="refreshDelay" class="shortcut" :data="shortcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                                {{item.k}}
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
                        </h1>
                        <search-list :searches="searchHistory" @select="addQuery"
                                     @delete="deleteSearchHistory"></search-list>
                    </div>
                </div>
            </Scroll>
        </div>
        <div class="search-result" v-show="query" ref="result">
            <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
        </div>
        <Confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHiatory"></Confirm>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from 'components/suggest/suggest'
    import {mapActions} from 'vuex'
    import {playlistMixin, searchMixin, routerMixin} from 'common/js/mixin'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import Scroll from 'base/scroll/scroll'

    export default {
        mixins: [playlistMixin, searchMixin, routerMixin],
        name: 'search',
        components: {
            Confirm,
            SearchList,
            Suggest,
            SearchBox,
            Scroll
        },
        data() {
            return {
                hotKey: []
            }
        },
        created() {
            this._getHotKey()
        },
        watch: {
            query(newVal) {
                if (!newVal) {
                    setTimeout(() => {
                        this.$refs.shortcut.refresh()
                    }, 20)
                }
            }
        },
        computed: {
            shortcut() {
                return this.hotKey.concat(this.searchHistory)
            }
            // ...mapGetters([
            //   'searchHistory'
            // ])
        },
        methods: {
            handlePlaylist(playlist) {
                const bottom = playlist.length > 0 ? '60px' : '0'
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.result.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        // console.log(res.data.hotkey)
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            ...mapActions([
                'clearSearchHiatory'
            ])
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .search
        position fixed
        top 88px
        bottom 0
        left 0
        overflow hidden
        width 100%
        .search-box-wrapper
            margin: 0px 0
        .shortcut-wrapper
            position: absolute
            top: 40px
            bottom: 0
            width: 100%
            margin-top 15px
            .shortcut
                height: 100%
                overflow: hidden
                .hot-key
                    margin: 0 20px 20px 20px
                    .title
                        margin-bottom: 20px
                        font-size: $font-size-medium
                        color: $color-text-l
                    .item
                        display: inline-block
                        padding: 5px 10px
                        margin: 0 20px 10px 0
                        border-radius: 6px
                        background: $color-highlight-background
                        font-size: $font-size-medium
                        color: $color-text-d
                .search-history
                    position: relative
                    margin: 0 20px
                    .title
                        display: flex
                        align-items: center
                        height: 40px
                        font-size: $font-size-medium
                        color: $color-text-l
                        .text
                            flex: 1
                        .clear
                            extend-click()
                            .icon-clear
                                font-size: $font-size-medium
                                color: $color-text-d
        .search-result
            position: absolute
            width: 100%
            top: 60px
            bottom: 0
</style>
