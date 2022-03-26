<template>
  <el-form
      ref="ruleFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      style="margin: 100px"
  >
    <el-form-item label="邮箱" prop="userMail">
      <el-input v-model="loginForm.userMail" />
    </el-form-item>
    <el-form-item label="密码" prop="userPassword">
      <el-input v-model="loginForm.userPassword" type="password"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
      <el-button @click="resetForm(ruleFormRef)">注册</el-button>
      <el-button @click="logout">登出</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import axios from "axios";
import qs from "qs";
import {ElMessage} from "element-plus";
import router from "@/router";

const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
  userMail: '',
  userPassword: '',
})

const rules = reactive({
  userMail: [
    { required: true, message: '请输入邮箱', trigger: 'change' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 5, max: 60, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      axios.post('/user/mailLogin',qs.stringify(loginForm))
          .then(res=>{
            if(res.data)
            {
              localStorage.setItem("token",res.data.tokenValue)
              ElMessage.success('登录成功');
              router.push('/')
            }
            else
            {
              ElMessage.error('用户名或密码错误')
            }
          })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const logout = () => {
  axios.get('/user/logout')
  .then((res)=>{
    ElMessage.success('登出成功');
    localStorage.removeItem("token")
    router.push('/')
  })
}
</script>

<style scoped>

</style>
