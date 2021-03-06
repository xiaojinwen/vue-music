<template>
    <div class="player" v-show="playList.length">
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                    <div class="fix-bug" @click="fixBug">不能播放点击?</div>
                </div>
                <div class="middle" @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend.prevent="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" v-for="(line,index) in currentLyric.lines" class="text"
                                   :class="{'current': currentLineNum===index}" :key="index">{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{current}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
                        </div>
                        <span class="time time-r">{{duration}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="micon-more" @click="showM">&#xe627;</i>
                        </div>

                        <!--<div class="icon i-right">-->
                        <!--<i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdCls" width="48" height="48" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <transition name="up">
            <div class="more-wrapper" v-if="showMore" @click="hideM">
                <div class="more">
                    <div class="progress-wrapper">
          <span class="volume">
            <i class="micon-volume">&#xe87a;</i>
          </span>
                        <div class="progress-bar-wrapper">
                            <progress-bar v-if="playList.length" @percentChange="onVolumeChange"
                                          :percent="volume"></progress-bar>
                        </div>
                    </div>
                    <div class="operators">
                        <a class="icon" :href="currentSong.url" target="_blank" @click.stop="download"
                           :download="currentSong.name+'-'+currentSong.singer+'.m4a'">
                            <i class="micon-download">&#xe794;</i>
                            <div class="text">标准-{{currentSong.name+'-'+currentSong.singer}}</div>
                        </a>
                        <a class="icon" :href="currentSong.url2" target="_blank" @click.stop="download"
                           :download="currentSong.name+'-'+currentSong.singer+'.m4a'">
                            <i class="micon-download">&#xe794;</i>
                            <div class="text">高品-{{currentSong.name+'-'+currentSong.singer}}</div>
                        </a>
                        <div class="icon" @click.stop="toggleFavorite(currentSong)">
                            <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
                            <div class="text">收藏</div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime"
               @ended="end">您的浏览器不支持
        </audio>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import animations from 'create-keyframe-animation'
    import { prefixStyle } from 'common/js/dom'
    import ProgressBar from 'base/progress-bar/progress-bar'
    import ProgressCircle from 'base/progress-circle/progress-circle'
    import { playMode } from 'common/js/config'
    // import {shuffle} from 'common/js/util'
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'
    import Playlist from 'components/playlist/playlist'
    import { playerMixin } from 'common/js/mixin'
    import { ERR_OK } from 'api/config'
    import { getMusic } from 'api/song'
    import Song from 'common/js/song'
    // import {updateUrl} from 'common/js/song'

    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')
    export default {
        mixins: [playerMixin],
        components: {
            Scroll,
            ProgressCircle,
            ProgressBar,
            Playlist
        },
        name: 'player',
        data() {
            return {
                songReady: false,
                currentTime: 0,
                radius: 32,
                currentLyric: null,
                currentLineNum: 0,
                currentShow: 'cd',
                playingLyric: '',
                showMore: false,
                volumeNum: 0.3
            }
        },
        // beforeCreate() {
        //   // hack for global nextTick
        //   function noop() { }
        //   window.MessageChannel = noop
        //   window.setImmediate = noop
        // },
        created() {
            this.touch = {}
        },
        mounted() {
            this.$refs.audio.volume = 0.3
        },
        computed: {
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            miniIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            disableCls() {
                return this.songReady ? '' : 'disable'
            },
            current() {
                return this.format(this.currentTime)
            },
            duration() {
                return this.format(this.currentSong.duration)
            },
            percent() {
                return this.currentTime / this.currentSong.duration
            },
            volume() {
                return this.volumeNum
            },
            ...mapGetters([
                'fullScreen',
                'playList',
                'playing',
                'currentIndex',
                'musicQuality'
            ])
        },
        methods: {
            back() {
                this.setFullScreen(false)
            },
            open() {
                this.setFullScreen(true)
            },
            enter(el, done) {
                const { x, y, scale } = this._getPosAndScale()
                const animation = {
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: 'translate3d(0,0,0) scale(1.1})'
                    },
                    100: {
                        transform: 'translate3d(0,0,0) scale(1})'
                    }
                }
                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                })
                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter() {
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = ''
            },
            leave(el, done) {
                this.$refs.cdWrapper.style.transition = 'all 0.4s'
                const { x, y, scale } = this._getPosAndScale()
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend', done)
            },
            afterLeave() {
                this.$refs.cdWrapper.style.transition = ''
                this.$refs.cdWrapper.style[transform] = ''
            },
            togglePlaying() {
                this.fixBug()
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing)
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
                // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //
                // } else if (/(Android)/i.test(navigator.userAgent) || navigator.userAgent === '') {
                //   console.info('播放按钮')
                //   this.playInit()
                // } else {
                //
                // }
            },
            end() {
                if (this.mode === playMode.loop) {
                    this.loop()
                } else {
                    this.next()
                }
            },
            loop() {
                this.currentTime = 0
                this.$refs.audio.currentTime = 0
                this.loopPlay()
                this.$refs.audio.play()
                if (this.currentLyric) {
                    this.currentLyric.seek(0)
                }
            },
            prev() {
                this.changeS('prev')
            },
            next() {
                this.changeS('next')
            },
            changeS(type) {
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this.loop()
                    return
                }
                if (this.mode === playMode.loop) {
                    this.loop()
                } else {
                    let index = 0
                    if (type === 'prev') {
                        index = this.currentIndex - 1
                        if (index === -1) {
                            index = this.playList.length - 1
                        }
                    } else if (type === 'next') {
                        index = this.currentIndex + 1
                        if (index === this.playList.length) {
                            index = 0
                        }
                    }
                    this.setCurrentIndex(index)
                    if (this.currentLyric) {
                        this.currentLyric.seek(0)
                    }
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                    this.songReady = false
                }
            },
            ready() {
                this.songReady = true
                // console.info('歌曲 ready')
                this.setPlayHistory(this.currentSong)
            },
            error() {
                this.songReady = true
                // console.info('歌曲 errer')
            },
            updateTime(e) {
                this.currentTime = e.target.currentTime
            },
            format(interval) {
                // 等同于Math.floor(interval)
                interval = interval | 0
                const minute = this._pad(interval / 60 | 0)
                const second = this._pad(interval % 60)
                return `${minute}:${second}`
            },
            onProgressBarChange(percent, type) {
                const currentTime = this.currentSong.duration * percent
                if (type === 'end') {
                    this.$refs.audio.currentTime = currentTime
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000)
                }
            },
            onVolumeChange(percent, type) {
                // if (type === 'end') {
                const p = Math.ceil(percent * 10) / 10
                this.$refs.audio.volume = p
                this.volumeNum = percent
                // console.log(percent)
                // }
            },
            getLyric() {
                new Song(this.currentSong).getLyric().then((lyric) => {
                    // if (this.currentSong.lyric !== lyric) {
                    //   return
                    // }
                    this.currentLyric = new Lyric(lyric, this.handleLyric)
                    if (this.playing && this.songReady) {
                        this.currentLyric.play()
                    }
                    // console.log(this.currentLyric)
                }).catch(() => {
                    this.currentLyric = null
                    this.playingLyric = ''
                    this.currentLineNum = 0
                })
            },
            handleLyric({ lineNum, txt }) {
                // console.log(lineNum)
                this.currentLineNum = lineNum
                const lineEl = this.$refs.lyricLine[lineNum - 5]
                if (lineNum > 5) {
                    this.$refs.lyricList.scrollToElement(lineEl, 1000)
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000)
                }
                this.playingLyric = txt
            },
            showPlaylist() {
                this.$refs.playlist.show()
            },
            fixBug() {
                if (!this.one) {
                    // console.info(navigator.platform)
                    // 平台、设备和操作系统
                    var system = {
                        win: false,
                        mac: false,
                        xll: false
                    }
                    // 检测平台
                    var p = navigator.platform
                    system.win = p.indexOf('Win') === 0
                    system.mac = p.indexOf('Mac') === 0
                    system.x11 = (p === 'X11') || (p.indexOf('Linux') === 0)
                    // 跳转语句
                    if (system.win || system.mac || system.xll) {
                        // console.info('pc')
                    } else {
                        // console.info('移动')
                        if (this.currentLyric) {
                            this.currentLyric.stop()
                        }
                        this.$refs.audio.play()
                        this.setPlayingState(!this.playing)
                    }
                    this.one = true
                }
            },
            showM() {
                this.showMore = true
            },
            hideM() {
                this.showMore = false
            },
            download() {
                // console.log('点击a')
                // download(this.currentSong.url, 'vue-router.m4a')
                // window.open(this.currentSong.url)
            },
            playInit() {
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    this.getLyric()
                    this.$refs.audio.play()
                }, 200)
            },
            middleTouchStart(e) {
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
                // console.log('middleTouchStart')
            },
            middleTouchMove(e) {
                if (!this.touch.initiated) {
                    return
                }
                this.touch.moved = true
                // console.log('middleTouchMove')
                const touch = e.touches[0]
                const deltaX = touch.pageX - this.touch.startX
                const deltaY = touch.pageY - this.touch.startY
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    return
                }
                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
                const offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
                this.touch.percent = Math.abs(offsetwidth / window.innerWidth)
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = '0ms'
                this.$refs.middleL.style.opacity = 1 - this.touch.percent
                this.$refs.middleL.style[transitionDuration] = '0ms'
            },
            middleTouchEnd(e) {
                if (!this.touch.moved) {
                    return
                }
                this.touch.moved = false
                // console.log('middleTouchEnd')
                let offsetwidth
                let opacity
                if (this.currentShow === 'cd') {
                    if (this.touch.percent > 0.1) {
                        offsetwidth = -window.innerWidth
                        opacity = 0
                        this.currentShow = 'lyric'
                    } else {
                        offsetwidth = 0
                        opacity = 1
                    }
                } else {
                    if (this.touch.percent < 0.9) {
                        offsetwidth = 0
                        opacity = 1
                        this.currentShow = 'cd'
                    } else {
                        offsetwidth = -window.innerWidth
                        opacity = 0
                    }
                }
                const time = 400
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
                this.$refs.middleL.style.opacity = opacity
                this.$refs.middleL.style[transitionDuration] = `${time}ms`
                this.touch = {}
            },
            _pad(num, n = 2) {
                // console.log(num.toString().length)
                let len = num.toString().length
                while (len < n) {
                    num = '0' + num
                    len++
                }
                return num
            },
            _getPosAndScale() {
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
                return {
                    x, y, scale
                }
            },
            async getUrl(mid) {
                const res = await getMusic(mid, 0)
                // let res2 = await getMusic(mid, 1)
                let url, url2
                if (res.code === ERR_OK) {
                    // console.log(res.data.items[0])
                    // updateUrl(this.currentSong, res.data.items[0])
                    // console.log(res)
                    const musicDetail = res.data.items[0]
                    url = `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=5150825362&uin=0&fromtag=1`
                    // this.$refs.audio.src = url
                }
                // if (res2.code === ERR_OK) {
                //     let musicDetail = res2.data.items[0]
                //     url2 = `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=5150825362&uin=0&fromtag=1`
                // }
                this.updateUrl({
                    url: url,
                    url2: url2
                })
                this.playInit()
            },
            ...mapActions([
                'loopPlay',
                'updateUrl',
                'setPlayHistory'
            ]),
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN'
                // setPlayingState: 'SET_PLAYING_STATE',
                // setCurrentIndex: 'SET_CURRENT_INDEX',
                // setPlayMode: 'SET_PLAY_MODE',
                // setPlayList: 'SET_PLAYLIST'
            })
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id) {
                    return
                }
                if (newSong.id === oldSong.id) {
                    return
                }
                if (!this.playing) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
                // localStorage.setItem('__musicQuality__', 2)
                if (!newSong.url) {
                    this.getUrl(newSong.mid)
                } else {
                    this.playInit()
                }
            },
            playing(newPlaying) {
                const audio = this.$refs.audio
                // this.$nextTick(() => {
                //   newPlaying ? audio.play() : audio.pause()
                // })
                if (this.timer1) {
                    clearTimeout(this.timer1)
                }
                this.timer1 = setTimeout(() => {
                    newPlaying ? audio.play() : audio.pause()
                }, 200)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
                .fix-bug
                    font-size 12px
                    position absolute
                    top: 10px
                    right: 6px
                    z-index: 50
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%
                            &.play
                                animation: rotate 20s linear infinite
                            &.pause
                                animation-play-state: paused
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center
                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text
                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
            .bottom
                position: absolute
                bottom: 30px
                width: 100%
                .dot-wrapper
                    text-align: center
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-l
                            /*text-align: left*/
                            margin-right 10px
                        &.time-r
                            /*text-align: right*/
                            margin-left 10px
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        color: $color-theme
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity: 0
            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px
                img
                    border-radius: 50%
                    &.play
                        animation: rotate 10s linear infinite
                    &.pause
                        animation-play-state: paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d
                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0
        .more-wrapper
            position fixed
            left 0
            right 0
            top 0
            bottom 0
            z-index 200
            background-color $color-background-d
            .more
                position: absolute
                left: 0
                bottom: 0
                width: 100%
                background-color: $color-highlight-background
                max-height: 240px
                min-height: 80px
                overflow: hidden
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 5px 0
                    .volume
                        color: $color-theme
                        flex: 0 0 20px
                        line-height: 40px
                        width: 20px
                        margin-right 10px
                        i
                            font-size: 20px
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display flex
                    align-items: center
                    padding-bottom 15px
                    .icon
                        flex: 1
                        text-align: center
                        color: $color-theme
                        padding: 10px
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 25px
                    .text
                        font-size: $font-size-small
                        margin-top 5px
                    .icon-favorite
                        color: $color-sub-theme

            &.up-enter-active, &.up-leave-active
                transition opacity 0.3s
                .more
                    transition all 0.3s
            &.up-enter, &.up-leave-to
                opacity: 0
                .more
                    transform: translate3d(0, 100%, 0)

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>
