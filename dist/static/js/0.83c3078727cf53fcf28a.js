webpackJsonp([0],{"Ps/x":function(t,s){},kvay:function(t,s,e){"use strict";var i=e("4YfN"),a=e.n(i),l=e("qwAB"),n=e("ZV4u"),r=e("3Q4o"),o=e("y/jF"),c=e("9rMa"),g=e("F4+m"),h=Object(r.c)("transform"),p=Object(r.c)("backdrop"),d={mixins:[g.b],components:{Loading:o.a,SongList:n.a,Scroll:l.a},name:"music-list",data:function(){return{scrollY:0,pullup:!0}},props:{bgImage:{type:String,default:""},songs:{type:Array,default:function(){return[]}},title:{type:String,default:""},rank:{type:Boolean,default:!1},loadingMore:{type:Boolean,default:!1}},computed:{bgStyle:function(){return"background-image:url("+this.bgImage+")"}},created:function(){this.probeType=3,this.listenScroll=!0},methods:a()({handlePlaylist:function(t){var s=t.length>0?"60px":"";this.$refs.list.$el.style.bottom=s,this.$refs.list.refresh()},scroll:function(t){this.scrollY=t.y},getSingerMore:function(){this.$emit("getSingerMore")},back:function(){this.$router.back()},selectItem:function(t,s){this.selectPlay({list:this.songs,index:s})},random:function(){this.randomPlay({list:this.songs})}},Object(c.b)(["selectPlay","randomPlay"])),watch:{scrollY:function(t){var s=Math.max(this.minTranslateY,t),e=0,i=1,a=0;this.$refs.layer.style[h]="translate3d(0,"+s+"px,0)";var l=Math.abs(t/this.imageHeight);t>0?(i=1+l,e=10):a=Math.min(20*l,20),this.$refs.filter.style[p]="blur("+a+")",t<this.minTranslateY?(e=10,this.$refs.bgImage.style.paddingTop=0,this.$refs.bgImage.style.height="40PX",this.$refs.playBtn.style.display="none"):(this.$refs.bgImage.style.paddingTop="70%",this.$refs.bgImage.style.height=0,this.$refs.playBtn.style.display=""),this.$refs.bgImage.style.zIndex=e,this.$refs.bgImage.style[h]="scale("+i+")"}},mounted:function(){this.imageHeight=this.$refs.bgImage.clientHeight,this.minTranslateY=40-this.imageHeight,this.$refs.list.$el.style.top=this.$refs.bgImage.clientHeight+"px"}},f={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"music-list"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("h1",{staticClass:"title",domProps:{innerHTML:t._s(t.title)}}),t._v(" "),e("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[e("div",{staticClass:"play-wrapper"},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length>0,expression:"songs.length>0"}],ref:"playBtn",staticClass:"play",on:{click:t.random}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text"},[t._v("随机播放全部")])])]),t._v(" "),e("div",{ref:"filter",staticClass:"filter"})]),t._v(" "),e("div",{ref:"layer",staticClass:"bg-layer"}),t._v(" "),e("scroll",{ref:"list",staticClass:"list",attrs:{pullup:t.pullup,"listen-scroll":t.listenScroll,"probe-type":t.probeType,data:t.songs},on:{scrollToEnd:t.getSingerMore,scroll:t.scroll}},[e("div",{staticClass:"song-list-wrapper"},[e("song-list",{attrs:{loadingMore:t.loadingMore,rank:t.rank,songs:t.songs},on:{select:t.selectItem}})],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.songs.length,expression:"!songs.length"}],staticClass:"loading-container"},[e("loading")],1)])],1)},staticRenderFns:[]};var m=e("Z0/y")(d,f,!1,function(t){e("Ps/x")},null,null);s.a=m.exports}});
//# sourceMappingURL=0.83c3078727cf53fcf28a.js.map