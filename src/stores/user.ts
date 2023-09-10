import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userId: '',
        userUsername: '未登录',
        userMail: '',
        userPhone: '',
        userIdentity: -1,
        userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        gmtCreate: ''
    }),
    actions: {
        updateUser(user:any){
            this.userId=user.userId
            this.userUsername=user.userUsername
            this.userMail=user.userMail
            this.userPhone=user.userPhone
            this.userIdentity=user.userIdentity
            this.userAvatar=user.userAvatar
            this.gmtCreate=user.gmtCreate
        },
        logout(){
            this.userId=''
            this.userUsername='未登录'
            this.userMail=''
            this.userPhone=''
            this.userIdentity=-1
            this.userAvatar='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            this.gmtCreate=''
        }
    }
})
