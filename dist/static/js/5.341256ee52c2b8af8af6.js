webpackJsonp([5],{BRgg:function(t,e,s){"use strict";e.b=function(){var t=o()({},r.b,{platform:"h5",needNewCode:1,_:1523180836473,format:"json"});return l.a.get("/api/getTopList",{params:t}).then(function(t){return i.a.resolve(t.data)}).catch(function(t){return i.a.reject(t.code)})},e.a=function(t){var e=o()({},r.b,{platform:"h5",needNewCode:1,tpl:3,page:"detail",type:"top",topid:t,_:1523276915604});return Object(p.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",e,r.c)};var n=s("rVsN"),i=s.n(n),a=s("aA9S"),o=s.n(a),r=s("T452"),c=s("aozt"),l=s.n(c),p=s("Gak4")},Kjo5:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s("4YfN"),i=s.n(n),a=s("BRgg"),o=s("T452"),r=s("qwAB"),c=s("y/jF"),l=s("F4+m"),p=s("9rMa"),u={mixins:[l.b],components:{Loading:c.a,Scroll:r.a},name:"rank",data:function(){return{topList:[]}},created:function(){this._getTopList()},methods:i()({selectItem:function(t){this.$router.push({path:"/rank/"+t.id}),this.setTopList(t)},handlePlaylist:function(t){var e=t.length?"60px":"";this.$refs.rank.style.bottom=e,this.$refs.topList.refresh()},_getTopList:function(){var t=this;Object(a.b)().then(function(e){e.code===o.a&&(t.topList=e.data.topList)})}},Object(p.d)({setTopList:"SET_TOPLIST"}))},f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"rank",staticClass:"rank"},[s("scroll",{ref:"topList",staticClass:"toplist",attrs:{data:t.topList}},[s("ul",t._l(t.topList,function(e,n){return s("li",{key:n,staticClass:"item",on:{click:function(s){t.selectItem(e)}}},[s("div",{staticClass:"icon"},[s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}],attrs:{width:"100",height:"100"}})]),t._v(" "),s("ul",{staticClass:"songlist"},[s("h2",{staticClass:"title"},[t._v(t._s(e.topTitle))]),t._v(" "),t._l(e.songList,function(e,n){return s("li",{key:n,staticClass:"song"},[s("span",[t._v(t._s(n+1))]),t._v(" "),s("span",[t._v(t._s(e.songname)+"-"+t._s(e.singername))])])})],2)])})),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.topList.length,expression:"!topList.length"}],staticClass:"loading-container"},[s("loading")],1)]),t._v(" "),s("router-view")],1)},staticRenderFns:[]};var d=s("Z0/y")(u,f,!1,function(t){s("ms2a")},null,null);e.default=d.exports},ms2a:function(t,e){}});
//# sourceMappingURL=5.341256ee52c2b8af8af6.js.map