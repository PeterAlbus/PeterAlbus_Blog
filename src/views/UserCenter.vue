<template>
  <Banner title="用户中心"></Banner>
  <div class="main-container flex-box">
    <div class="user-box">
      <el-upload
          class="avatar-uploader"
          action="https://www.peteralbus.com:8089/user/uploadAvatar/"
          ref="uploadRef"
          :data="upData"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
      >
        <el-avatar :size="178" :src="userStore.userAvatar" v-if="userStore.userAvatar"></el-avatar>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <h2 style="display: flex;align-items: center;justify-content: center" v-if="!changingName">
        {{userStore.userUsername}}<el-button @click="editName" plain color="#63a35c" :icon="Edit" size="small"/>
      </h2>
      <h2 style="display: flex;align-items: center;justify-content: center" v-if="changingName">
        <el-input v-model="username" style="width: 300px"/><el-button @click="changeName" plain color="#63a35c" :icon="Check" size="small"/>
      </h2>
      <p style="font-size: 0.8em;color: #3eaf7c">点击头像可更换</p>
      <p style="padding: 4px">
        <el-tag
            :type="identityType"
            effect="dark"
        >
          {{ userIdentity }}
        </el-tag>
      </p>
      <div style="text-align: left;max-width: 400px;margin: 0 auto">
        <div class="user-center-info" v-if="userStore.userPhone!==null">绑定手机：{{userStore.userPhone}}<el-button @click="phoneFormVisible=true" plain color="#63a35c" :icon="Edit" circle style="float: right;" /></div>
        <div class="user-center-info" v-if="!userStore.userPhone">绑定手机：<el-button @click="phoneFormVisible=true" color="#63a35c" :icon="Edit" type="primary">前往绑定</el-button></div>
        <div class="user-center-info" v-if="userStore.userMail!==null">绑定邮箱：{{userStore.userMail}}<el-button @click="mailFormVisible=true" plain color="#63a35c" :icon="Edit" circle style="float: right;" /></div>
        <div class="user-center-info" v-if="!userStore.userMail">绑定邮箱：<el-button @click="mailFormVisible=true" color="#63a35c" :icon="Edit" type="primary">前往绑定</el-button></div>
        <div class="user-center-info">注册时间：{{userStore.gmtCreate}}</div>
      </div>
      <div style="display: flex;justify-content: space-around;margin: 0 auto;padding: 20px;max-width: 200px;">
        <el-button color="#63a35c" type="primary" @click="changePasswordFormVisible=true">更改密码</el-button>
        <el-button color="#63a35c" plain @click="logout">登出</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="changePasswordFormVisible" title="修改密码">
    <el-form :model="changePasswordForm"
             ref="changePasswordFormRef"
             :rules="psswordRules"
             style="margin: 0 auto;max-width: 400px">
      <el-form-item>
        原密码
      </el-form-item>
      <el-form-item prop="oldPassword">
        <el-input v-model="changePasswordForm.oldPassword" type="password"/>
      </el-form-item>
      <el-form-item>
        新密码
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input v-model="changePasswordForm.newPassword" type="password"/>
      </el-form-item>
      <el-form-item>
        确认密码
      </el-form-item>
      <el-form-item prop="userConfirmPassword">
        <el-input v-model="changePasswordForm.userConfirmPassword" type="password"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" color="#63a35c" @click="changePassword(changePasswordFormRef)">确认</el-button>
        <el-button plain color="#63a35c" @click="changePasswordFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="phoneFormVisible" title="绑定/修改手机">
    <el-form :model="phoneForm"
             ref="phoneFormRef"
             :rules="phoneRules"
             style="margin: 0 auto;max-width: 400px">
      <el-form-item>
        手机
      </el-form-item>
      <el-form-item prop="userPhone">
        <el-input v-model="phoneForm.userPhone" />
      </el-form-item>
      <el-form-item>
        验证码
      </el-form-item>
      <el-form-item prop="verifyCode" style="justify-content: space-between!important;">
        <el-input v-model="phoneForm.verifyCode" style="width: 60%"/>
        &emsp;
        <el-button type="primary" style="width: 30%" :disabled="!canGetPhoneVerifyCode" @click="getPhoneVerifyCode">{{ phoneVerifyText }}</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" color="#63a35c" @click="setPhone(phoneFormRef)">确认</el-button>
        <el-button plain color="#63a35c" @click="phoneFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="mailFormVisible" title="绑定/修改邮箱">
    <el-form :model="mailForm"
             ref="mailFormRef"
             :rules="mailRules"
             style="margin: 0 auto;max-width: 400px">
      <el-form-item>
        邮箱
      </el-form-item>
      <el-form-item prop="userMail">
        <el-input v-model="mailForm.userMail" />
      </el-form-item>
      <el-form-item>
        验证码
      </el-form-item>
      <el-form-item prop="verifyCode" style="justify-content: space-between!important;">
        <el-input v-model="mailForm.verifyCode" style="width: 60%"/>
        &emsp;
        <el-button type="primary" style="width: 30%" :disabled="!canGetMailVerifyCode" @click="getMailVerifyCode">{{ mailVerifyText }}</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" color="#63a35c" @click="setMail(mailFormRef)">确认</el-button>
        <el-button plain color="#63a35c" @click="mailFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import axios from "axios";
import {Edit,Plus,Check} from '@element-plus/icons-vue'
import {
  ElMessage,
  ElMessageBox,
  ElUpload
} from "element-plus";
import type  {FormInstance, UploadFile,  UploadProgressEvent,  UploadRawFile} from 'element-plus'
import router from "@/router";
import {useUserStore} from "@/store/user";
import {computed, reactive, ref} from "vue";
import qs from "qs";

const userStore=useUserStore()

const changingName=ref(false)
const username=ref('')

const editName= ()=>{
  username.value=userStore.userUsername
  changingName.value=true
}

const changeName= ()=>{
  axios.get('/user/changeUsername?userId='+userStore.userId+"&username="+username.value)
  .then((res)=>{
    if(res.data=='noPermission')
    {
      ElMessage.error('登录认证异常，请重新登陆重试')
    }
    else if(res.data=='wrongUserId')
    {
      ElMessage.error('本地用户id存储异常，请重新登陆重试')
    }
    else if(res.data=='fail')
    {
      ElMessage.error('修改失败，请联系管理员')
    }
    else
    {
      ElMessage.success('修改用户名成功!')
      userStore.userUsername=username.value
    }
  })
  changingName.value=false
}

const changePasswordFormRef = ref<FormInstance>()
const phoneFormRef = ref<FormInstance>()
const mailFormRef = ref<FormInstance>()
const changePasswordFormVisible = ref(false)
const phoneFormVisible = ref(false)
const mailFormVisible = ref(false)
const changePasswordForm = reactive({
  userId: '',
  oldPassword: '',
  newPassword: '',
  userConfirmPassword: ''
})
const phoneForm = reactive({
  userId: '',
  userPhone: '',
  verifyCode: ''
})
const mailForm = reactive({
  userId: '',
  userMail: '',
  verifyCode: ''
})

let phoneVerifyText=ref('获取')
let mailVerifyText=ref('获取')
let phoneTime=0
let mailTime=0

let canGetMailVerifyCode=ref(true)
let canGetPhoneVerifyCode=ref(true)

const logout = () => {
  ElMessageBox.confirm(
      '确定要退出登录吗?',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        axios.get('/user/logout')
            .then((res)=>{
              ElMessage.success('登出成功');
              localStorage.removeItem("token")
              router.push('/login')
            })
      })
      .catch(() => {})
}

const validateOldPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  }
  else {
    callback()
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  }
  else {
    if (changePasswordForm.userConfirmPassword !== '') {
      if (!changePasswordFormRef.value) return
      changePasswordFormRef.value.validateField('userConfirmPassword', () => null)
    }
    callback()
  }
}

const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== changePasswordForm.newPassword) {
    callback(new Error("输入的两次密码不一致!"))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("请输入邮箱"))
  }
  else if (value.indexOf('@')==-1)
  {
    callback(new Error("请输入正确格式的邮箱"))
  }
  else {
    callback()
  }
}

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("请输入手机号"))
  }
  else if (!Number(value))
  {
    callback(new Error("请输入数字"))
  }
  else if (value.length!=11)
  {
    callback(new Error("请输入正确格式的11位手机号"))
  }
  else {
    callback()
  }
}

const phoneRules = reactive({
  userPhone: [
    { validator: validatePhone, trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'change' },
  ]
})

const mailRules = reactive({
  userMail: [
    { validator: validateEmail, trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'change' },
  ]
})


const psswordRules = reactive({
  oldPassword: [
    { validator: validateOldPass, trigger: 'blur' },
    { min: 6, max: 60, message: '密码长度必须在6到60位之间', trigger: 'blur' },
  ],
  newPassword: [
    { validator: validatePass, trigger: 'blur' },
    { min: 6, max: 60, message: '密码长度必须在6到60位之间', trigger: 'blur' },
  ],
  userConfirmPassword: [
    { validator: validateConfirmPass, trigger: 'blur' },
    { min: 6, max: 60, message: '密码长度必须在6到60位之间', trigger: 'blur' },
  ],
})

const changePassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      changePasswordForm.userId=userStore.userId
      axios.post('/user/changePassword',qs.stringify(changePasswordForm))
          .then(res=>{
            if(res.data=="wrongPassword")
            {
              ElMessage.error('密码输入错误');
            }
            else if(res.data=="error")
            {
              ElMessage.error('修改发生错误')
            }
            else
            {
              ElMessage.success('密码修改成功，请重新登陆！')
              axios.get('/user/logout')
                  .then((res)=>{
                    ElMessage.success('登出成功');
                    localStorage.removeItem("token")
                    router.push('/login')
                  })
            }
          })
    }
  })
}

const setPhone = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      phoneForm.userId=userStore.userId
      axios.post('/user/setPhone',qs.stringify(phoneForm))
          .then(res=>{
            if(res.data=="wrongVerifyCode")
            {
              ElMessage.error('验证码输入错误');
            }
            else if(res.data=="needRequestVerifyCode")
            {
              ElMessage.error('还未申请验证码或验证码已经过期')
            }
            else
            {
              ElMessage.success('手机绑定成功！')
              userStore.userPhone=phoneForm.userPhone
              phoneFormVisible.value=false
            }
          })
    }
  })
}

const setMail = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      mailForm.userId=userStore.userId
      axios.post('/user/setMail',qs.stringify(mailForm))
          .then(res=>{
            if(res.data=="wrongVerifyCode")
            {
              ElMessage.error('验证码输入错误');
            }
            else if(res.data=="needRequestVerifyCode")
            {
              ElMessage.error('还未申请验证码或验证码已经过期')
            }
            else
            {
              ElMessage.success('邮箱绑定成功！')
              userStore.userMail=mailForm.userMail
              mailFormVisible.value=false
            }
          })
    }
  })
}

const getPhoneVerifyCode = () => {
  if(phoneForm.userPhone.length!=11)
  {
    ElMessageBox.alert('请输入正确的手机号','格式错误',{confirmButtonText:'确认'})
    return
  }
  axios.get('/user/applyPhoneVerifyCode?account='+phoneForm.userPhone)
      .then((res)=>{
        if(res.data=='haveVerifyCode')
        {
          ElMessageBox.alert('请求验证码过于频繁，请检查收件箱','验证码已发送',{confirmButtonText:'确认'})
        }
        else if(res.data=='haveAccount')
        {
          ElMessageBox.alert('该手机号已被注册','已注册',{confirmButtonText:'确认'})
        }
        else if(res.data=='sendSmsSuccess')
        {
          ElMessage.success('验证码已发送!')
          phoneTime=60*10
          phoneTimer()
        }
        else
        {
          ElMessageBox.alert('错误原因：'+res.data,'验证码发送失败',{confirmButtonText:'确认'})
        }
      })
}

const getMailVerifyCode = () => {
  if(mailForm.userMail.indexOf('@')==-1)
  {
    ElMessageBox.alert('请输入正确的邮箱','格式错误',{confirmButtonText:'确认'})
    return;
  }
  else
  {
    axios.get('/user/applyMailVerifyCode?account='+mailForm.userMail)
        .then((res)=>{
          if(res.data=='haveVerifyCode')
          {
            ElMessageBox.alert('请求验证码过于频繁，请检查收件箱','验证码已发送',{confirmButtonText:'确认'})
          }
          else if(res.data=='haveAccount')
          {
            ElMessageBox.alert('该邮箱已被注册','已注册',{confirmButtonText:'确认'})
          }
          else if(res.data=='sendMailSuccess')
          {
            ElMessage.success('验证码已发送!')
            mailTime=60*10
            mailTimer()
          }
          else
          {
            ElMessageBox.alert('请检查邮箱是否正确，若无问题，请联系PeterAlbus','验证码发送失败',{confirmButtonText:'确认'})
          }
        })
  }
}

const phoneTimer = () => {
  if(phoneTime>0)
  {
    phoneVerifyText.value=phoneTime+'s'
    phoneTime--
    canGetPhoneVerifyCode.value=false
    setTimeout(phoneTimer,1000)
  }
  else
  {
    canGetPhoneVerifyCode.value=true
    phoneVerifyText.value='获取'
  }
}

const mailTimer = () => {
  if(mailTime>0)
  {
    mailVerifyText.value=mailTime+'s'
    mailTime--
    canGetMailVerifyCode.value=false
    setTimeout(mailTimer,1000)
  }
  else
  {
    canGetMailVerifyCode.value=true
    mailVerifyText.value='获取'
  }
}

const uploadRef=ref<InstanceType<typeof ElUpload>>()

const submitUpload = ()=>{
  uploadRef.value!.submit();
}

const handleAvatarSuccess = (res: UploadProgressEvent, file: UploadFile) => {
  ElMessage.success("更换头像成功成功")
  userStore.userAvatar=res+''
}

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isIMG) {
    ElMessage.error('选择的文件不是jpg/png格式！')
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过10M！')
  }
  return isIMG && isLt10M
}

const upData=computed(()=>{
  return {userId: userStore.userId}
})

const identityType = computed(()=>{
  if(userStore.userIdentity==0)
  {
    return "warning"
  }
  else if(userStore.userIdentity==1)
  {
    return "success"
  }
  else if(userStore.userIdentity==5)
  {
    return ""
  }
  else
  {
    return "info"
  }
})

const userIdentity = computed(()=>{
  if(userStore.userIdentity==0)
  {
    return "站长"
  }
  else if(userStore.userIdentity==1)
  {
    return "管理员"
  }
  else if(userStore.userIdentity==5)
  {
    return "普通用户"
  }
  else
  {
    return "游客"
  }
})
</script>

<style scoped>
.user-box{
  width: 80vw;
  max-width: 800px;
  background-color: white;
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 3px 8px 6px rgba(7,17,27,0.05);
}

.user-box:hover
{
  box-shadow: 0 5px 12px 8px rgba(7,17,27,0.1);
}

.flex-box{
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-center-info{
  margin: 20px;
  line-height: 32px;
  height: 32px;
}
</style>
