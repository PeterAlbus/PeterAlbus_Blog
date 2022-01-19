import { createRouter, createWebHashHistory } from 'vue-router'
const Home=()=>import('../views/Home')
const Blog=()=>import('../views/Blog')
const Photo=()=>import('../views/Photo')
const Types=()=>import('../views/Types')
const About=()=>import('../views/About')
const Document=()=>import('../views/Document')
const EditBlog=()=>import('../views/EditBlog')
const UploadPhoto=()=>import('../views/UploadPhoto')
const AddFriendLink=()=>import('../views/AddFriendLink')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/document',
    name: 'Document',
    component: Document
  },
  {
    path: '/photo',
    name: 'Photo',
    component: Photo
  },
  {
    path: '/types',
    name: 'Types',
    component: Types
  },
  {
    path: '/editBlog',
    name: 'EditBlog',
    component: EditBlog
  },
  {
    path: '/uploadPhoto',
    name: 'UploadPhoto',
    component: UploadPhoto
  },
  {
    path: '/addFriendLink',
    name: 'AddFriendLink',
    component: AddFriendLink
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
