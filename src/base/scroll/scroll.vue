<template>
  <div class="scroll" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    name: 'scroll',
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      _initScroll() {
        let self = this
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        // console.log('listenScroll ' + this.listenScroll)
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            self.$emit('scroll', pos)
            // console.log(pos.y)
            // console.log('listenScroll')
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
        // console.log('refresh()')
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
      // console.log('mounted()')
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
        // console.log('watch()')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
