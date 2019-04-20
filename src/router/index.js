import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'news',
    meta: { title: 'news', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'newsList',
        component: () => import('@/views/news/list'),
        meta: { title: 'newsList', icon: 'list' }
      },
      {
        path: 'create',
        name: 'newsCreate',
        hidden: true,
        component: () => import('@/views/news/create'),
        meta: { title: 'newsCreate', icon: 'news', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'newsEdit',
        hidden: true,
        component: () => import('@/views/news/edit'),
        meta: { title: 'newsEdit', noCache: true }
      },
      {
        path: 'cat',
        name: 'newsCat',
        component: () => import('@/views/news/category/list'),
        meta: { title: 'newsCat', icon: 'list' }
      }
    ]
  },
  {
    path: '/ad',
    component: Layout,
    redirect: '/ad/list',
    name: 'ad',
    meta: { title: 'ad', icon: 'list' },
    children: [
      {
        path: 'list',
        name: 'adList',
        component: () => import('@/views/ad/list'),
        meta: { title: 'adList', icon: 'list' }
      },
      {
        path: 'position',
        name: 'addPosition',
        component: () => import('@/views/ad/position'),
        meta: { title: 'addPosition', icon: 'list' }
      }
    ]
  },
  {
    path: '/courses',
    component: Layout,
    redirect: '/courses/list',
    name: 'courses',
    meta: { title: 'courses', icon: 'list' },
    children: [
      {
        path: 'list',
        name: 'coursesList',
        component: () => import('@/views/courses/list'),
        meta: { title: 'coursesList', icon: 'list' }
      },
      {
        path: 'create',
        name: 'coursesCreate',
        hidden: true,
        component: () => import('@/views/courses/create'),
        meta: { title: 'coursesCreate', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'coursesEdit',
        hidden: true,
        component: () => import('@/views/courses/edit'),
        noCache: true,
        meta: { title: 'coursesEdit', noCache: true }
      },
      {
        path: 'classes/:course_id(\\d+)',
        name: 'courseClasses',
        hidden: true,
        component: () => import('@/views/courses/classes/index'),
        meta: { title: 'courseClasses' }
      },
      {
        path: 'cat',
        name: 'coursesCat',
        component: () => import('@/views/courses/category/list'),
        meta: { title: 'coursesCat', icon: 'list' }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    redirect: '/ai/list',
    name: 'ai',
    meta: { title: 'ai', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'aiList',
        component: () => import('@/views/ai/list'),
        meta: { title: 'aiList', icon: 'list', noCache: true }
      },
      {
        path: 'questions',
        name: 'questionsList',
        component: () => import('@/views/ai/questions/list'),
        meta: { title: 'questionsList', icon: 'list' }
      },
      {
        path: 'questions/type',
        name: 'questionsType',
        component: () => import('@/views/ai/questions/type'),
        meta: { title: 'questionsType', icon: 'list' }
      },
      {
        path: 'interview',
        name: 'intervieList',
        component: () => import('@/views/ai/interview'),
        meta: { title: 'intervieList', icon: 'list', noCache: true }
      }
    ]
  },
  {
    path: '/major',
    component: Layout,
    redirect: '/major/list',
    name: 'major',
    meta: { title: 'major', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'majorList',
        component: () => import('@/views/major/list'),
        meta: { title: 'majorList', icon: 'list' }
      },
      {
        path: 'category',
        name: 'majorCategory',
        component: () => import('@/views/major/category'),
        meta: { title: 'majorCategory', icon: 'list' }
      }
    ]
  },
  {
    path: '/prof',
    component: Layout,
    redirect: '/prof/list',
    name: 'prof',
    meta: { title: 'prof', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'profList',
        component: () => import('@/views/prof/list'),
        meta: { title: 'profList', icon: 'list' }
      },
      {
        path: 'category',
        name: 'profCategory',
        component: () => import('@/views/prof/category'),
        meta: { title: 'profCategory', icon: 'list' }
      }
    ]
  },
  {
    path: '/cert',
    component: Layout,
    redirect: '/cert/list',
    name: 'cert',
    meta: { title: 'cert', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'certList',
        component: () => import('@/views/cert/list'),
        meta: { title: 'certList', icon: 'list' }
      },
      {
        path: 'category',
        name: 'certCategory',
        component: () => import('@/views/cert/category'),
        meta: { title: 'certCategory', icon: 'list' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/share',
    name: 'activity',
    meta: { title: 'activity', icon: 'list', noCache: true },
    children: [
      {
        path: 'share',
        name: 'share',
        component: () => import('@/views/activity/share'),
        meta: { title: 'share', icon: 'list' }
      }
    ]
  },
  {
    path: '/assistant',
    component: Layout,
    redirect: '/assistant/majorbindcert',
    name: 'assistant',
    meta: { title: 'assistant', icon: 'list', noCache: true },
    children: [
      {
        path: 'majorbindcert',
        name: 'majorBindCert',
        component: () => import('@/views/assistant/majorbindcert'),
        meta: { title: 'majorBindCert', icon: 'list' }
      },
      {
        path: 'profbindcert',
        name: 'profBindCert',
        component: () => import('@/views/assistant/profbindcert'),
        meta: { title: 'profBindCert', icon: 'list' }
      }
    ]
  },
  {
    path: '/promotion',
    component: Layout,
    redirect: '/promotion/list',
    name: 'promotion',
    meta: { title: 'promotion', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'promotionList',
        component: () => import('@/views/promotion/list'),
        meta: { title: 'promotion', icon: 'list' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/list',
    name: 'message',
    meta: { title: 'message', icon: 'list', noCache: true },
    children: [
      {
        path: 'list',
        name: 'messageList',
        component: () => import('@/views/message/list'),
        meta: { title: 'message', icon: 'list' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/course',
    name: 'order',
    meta: { title: 'order', icon: 'list', noCache: true },
    children: [
      {
        path: 'course',
        name: 'orderCourse',
        component: () => import('@/views/order/course'),
        meta: { title: 'orderCourse', icon: 'list' }
      }
    ]
  },
  {
    path: '/coupon',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/coupon/list'),
        name: 'coupon',
        meta: { title: 'coupon', icon: 'list' }
      }
    ]
  },
  {
    path: '/lecturer',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/lecturer/list'),
        name: 'lecturer',
        meta: { title: 'lecturer', icon: 'list' }
      }
    ]
  },
  {
    path: '/distribute',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/distribute/list'),
        name: 'distribute',
        meta: { title: 'distribute', icon: 'list' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

