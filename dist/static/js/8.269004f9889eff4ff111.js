webpackJsonp([8],{"/fzA":function(t,s){},"qP2/":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("4YfN"),n=e.n(i),r=e("AyDw"),a=e("SJI6"),c=e("qwAB"),l=e("ZV4u"),o=e("PvFA"),u=e("F4+m"),f=e("tRvw"),h={name:"user-center",mixins:[u.b],components:{NoResult:f.a,SongList:l.a,Scroll:c.a,Switches:r.a},data:function(){return{currentIndex:0,switches:[{name:"我喜欢的"},{name:"最近播放"}]}},computed:n()({noResult:function(){return 0===this.currentIndex?!this.favoriteList.length:!this.playHistory.length},noResultDesc:function(){return 0===this.currentIndex?"暂无收藏歌曲":"您还没收过歌曲"}},Object(a.mapGetters)(["favoriteList","playHistory"])),methods:n()({handlePlaylist:function(t){var s=t.length>0?"60px":"";this.$refs.listWrapper.style.bottom=s,this.$refs.favoriteList&&this.$refs.favoriteList.refresh(),this.$refs.playList&&this.$refs.playList.refresh()},switchItem:function(t){this.currentIndex=t},selectSong:function(t){this.insertSong(new o.b(t))},back:function(){this.$router.back()},random:function(){var t=0===this.currentIndex?this.favoriteList:this.playHistory;0!==t.length&&(t=t.map(function(t){return new o.b(t)}),this.randomPlay({list:t}))}},Object(a.mapActions)(["insertSong","randomPlay"]))},d={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("transition",{attrs:{name:"slide"}},[e("div",{staticClass:"user-center"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("div",{staticClass:"switches-wrapper"},[e("switches",{attrs:{switches:t.switches,currentIndex:t.currentIndex},on:{switch:t.switchItem}})],1),t._v(" "),e("div",{ref:"playBtn",staticClass:"play-btn",on:{click:t.random}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text"},[t._v("随机播放")])]),t._v(" "),e("div",{ref:"listWrapper",staticClass:"list-wrapper"},[0===t.currentIndex?e("scroll",{ref:"favoriteList",staticClass:"list-scroll",attrs:{data:t.favoriteList}},[e("div",{staticClass:"list-inner"},[e("song-list",{attrs:{songs:t.favoriteList},on:{select:t.selectSong}})],1)]):t._e(),t._v(" "),1===t.currentIndex?e("scroll",{ref:"playList",staticClass:"list-scroll",attrs:{data:t.playHistory}},[e("div",{staticClass:"list-inner"},[e("song-list",{attrs:{songs:t.playHistory},on:{select:t.selectSong}})],1)]):t._e()],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.noResult,expression:"noResult"}],staticClass:"no-result-wrapper"},[e("no-result",{attrs:{title:t.noResultDesc}})],1)])])},staticRenderFns:[]};var v=e("Z0/y")(h,d,!1,function(t){e("/fzA")},null,null);s.default=v.exports}});
//# sourceMappingURL=8.269004f9889eff4ff111.js.map