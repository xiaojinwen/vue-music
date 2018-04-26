<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    name: 'App',
    data() {
      return {
        transitionName: 'slide-left'
      }
    },
    components: {
      Player,
      MHeader,
      Tab
    },
    watch: {
      '$route'(to, from) {
        //    console.log('现在路由:',to.path.split('/')[1],'来自路由:',from.path.split('/')[1],'现在的动画:',this.transitionName)
        const toDepth = to.name
        const fromDepth = from.name
        // console.log(to.name)
        // console.log(from.name)
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .child-view
    transition: all .5s cubic-bezier(.55, 0, .1, 1)

  .slide-left-enter, .slide-right-leave-active
    opacity: 0
    transform: translate(50px, 0)

  .slide-left-leave-active, .slide-right-enter
    opacity: 0
    transform: translate(-50px, 0)

</style>
