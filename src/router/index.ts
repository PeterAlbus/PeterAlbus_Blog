import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const Home=()=>import('../views/Home.vue')
const Blog=()=>import('../views/Blog.vue')
const Photo=()=>import('../views/Photo.vue')
const Types=()=>import('../views/Types.vue')
const About=()=>import('../views/About.vue')
const Document=()=>import('../views/Document.vue')
const EditBlog=()=>import('../views/EditBlog.vue')
const UploadPhoto=()=>import('../views/UploadPhoto.vue')
const AddFriendLink=()=>import('../views/AddFriendLink.vue')

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta:{
            title:'主页——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue,个人博客',
                description:'PeterAlbus的博客主页'
            }
        }
    },
    {
        path: '/blog',
        name: 'Blog',
        component: Blog,
        meta:{
            title:'博文——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的博客博文页'
            }
        }
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta:{
            title:'关于我——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的个人介绍'
            }
        }
    },
    {
        path: '/document',
        name: 'Document',
        component: Document,
        meta:{
            title:'归档——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的博客归档页'
            }
        }
    },
    {
        path: '/photo',
        name: 'Photo',
        component: Photo,
        meta:{
            title:'照片墙——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的照片墙'
            }
        }
    },
    {
        path: '/types',
        name: 'Types',
        component: Types,
        meta:{
            title:'分类查看——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的博客列表'
            }
        }
    },
    {
        path: '/editBlog',
        name: 'EditBlog',
        component: EditBlog,
        meta:{
            title:'编辑/创建博客——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的博客编辑页'
            }
        }
    },
    {
        path: '/uploadPhoto',
        name: 'UploadPhoto',
        component: UploadPhoto,
        meta:{
            title:'上传照片——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue',
                description:'PeterAlbus的博客'
            }
        }
    },
    {
        path: '/addFriendLink',
        name: 'AddFriendLink',
        component: AddFriendLink,
        meta:{
            title:'添加友情链接——PeterAlbus的博客',
            content:{
                keywords:'PeterAlbus,Vue,个人博客',
                description:'PeterAlbus的博客'
            }
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next)=>{
    if(to.meta.content) {
        // @ts-ignore
        document.querySelector('meta[name="keywords"]').setAttribute('content',to.meta.content.keywords)
        // @ts-ignore
        document.querySelector('meta[name="description"]').setAttribute('content',to.meta.content.description)
    }
    if(to.meta.title) {
        // @ts-ignore
        document.title = to.meta.title
    }
    next()
})

export default router
