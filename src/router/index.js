import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')

export default new VueRouter({
	mode: 'history',
	base: '/music',
	routes: [
		{
			path: '/',
			redirect: '/recommend'
		},
		{
			path: '/recommend',
			name: 1,
			component: Recommend,
			children: [{
				path: ':id',
				component: Disc
			}]
		},
		{
			path: '/singer',
			name: 2,
			component: Singer,
			children: [
				{
					path: ':id',
					component: SingerDetail
				}
			]
		},
		{
			path: '/rank',
			name: 3,
			component: Rank,
			children: [
				{
					path: ':id',
					component: TopList
				}
			]
		},
		{
			path: '/search',
			name: 4,
			component: Search,
			children: [
				{
					path: ':id',
					component: SingerDetail
				}
			]
		},
		{
			path: '/user',
			component: UserCenter
		}
	]
})
