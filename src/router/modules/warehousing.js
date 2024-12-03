import Layout from '@/layout'
// 入库业务路由
const warehousingRouter = {
  path: '/bashboard',
  component: Layout,
  redirect: '/bashboard',
  name: 'Receipt',
  meta: { title: '出库操作', icon: '采购入库' },
  children: [
    {
      path: '/quality',
      name: 'Quality',
      component: () => import('@/views/inwarehouse/quality/index'),
      meta: { title: '人工拣货', icon: '质检单' }
    },
    {
      path: '/onselfstrategy',
      name: 'onselfStrategy',
      component: () => import('@/views/inwarehouse/onselfstrategy/index'),
      meta: { title: '人工上分拣机', icon: '波次管理' }
    }
  ]
}

export default warehousingRouter
