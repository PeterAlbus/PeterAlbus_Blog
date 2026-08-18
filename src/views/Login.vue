<template>
  <Banner title="登录"></Banner>
  <div class="main-container flex-box">
    <div class="form-box">
      <el-row class="auth-form-row" justify="space-between">
        <el-col :sm="12" :xs="0" class="auth-image-column">
          <el-image class="auth-image"
                    src="https://file.peteralbus.com/assets/blog/imgs/photo/DJI_0422.webp" fit="cover" />
        </el-col>
        <el-col :sm="12" :xs="24" class="flex-box" style="padding: 20px">
          <div style="margin: 0 30px 30px 30px">
            <h2 v-if="!loginByPhone">邮箱登录</h2>
            <h2 v-if="loginByPhone">手机登录</h2>
            <div class="switch">
              <span v-if="!loginByPhone" @click="loginByPhone=true">使用手机登录</span>
              <span v-if="loginByPhone" @click="loginByPhone=false">使用邮箱登录</span>
            </div>
          </div>
          <el-form
            ref="ruleFormRef"
            :model="loginForm"
            :rules="rules"
            label-width="60px"
            class="demo-ruleForm"
            size="default"
            style="width: 100%;max-width: 300px"
          >
            <el-form-item label="邮箱" prop="userMail" v-if="!loginByPhone">
              <el-input v-model="loginForm.userMail" />
            </el-form-item>
            <el-form-item label="手机" prop="userPhone" v-if="loginByPhone">
              <el-input v-model="loginForm.userPhone" />
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="loginForm.userPassword" type="password" />
            </el-form-item>
            <div>
              <el-button type="primary" style="color: white"
                         @click="submitForm(ruleFormRef)" color="#63a35c">登录</el-button>&emsp;
              <router-link to="/register">
                <el-button plain color="#63a35c">注册</el-button>
              </router-link>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from "@/components/Banner.vue";
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { mailLogin, phoneLogin } from "@/services/userApi";

const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const loginForm = reactive({
  userPhone: "",
  userMail: "",
  userPassword: ""
});

const loginByPhone = ref(true);

const validateEmail = (rule: any, value: any, callback: any) => {
  if (loginByPhone.value) {
    callback();
  } else if (!value) {
    callback(new Error("请输入邮箱"));
  } else if (value.indexOf("@") == -1) {
    callback(new Error("请输入正确格式的邮箱"));
  } else {
    callback();
  }
};

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!loginByPhone.value) {
    callback();
  } else if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!Number(value)) {
    callback(new Error("请输入数字"));
  } else if (value.length != 11) {
    callback(new Error("请输入正确格式的11位手机号"));
  } else {
    callback();
  }
};

const rules = reactive({
  userMail: [
    { validator: validateEmail, trigger: "blur" }
  ],
  userPhone: [
    { validator: validatePhone, trigger: "blur" }
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "change" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (loginByPhone.value) {
        phoneLogin(loginForm).then(res => {
          localStorage.setItem("token", res.data.tokenValue);
          ElMessage.success("登录成功");
          router.push("/");
        });
      } else {
        mailLogin(loginForm).then(res => {
          localStorage.setItem("token", res.data.tokenValue);
          ElMessage.success("登录成功");
          router.push("/");
        });
      }
    }
  });
};
</script>

<style scoped>
.flex-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-box {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.97);
  width: min(980px, calc(100vw - 48px));
  height: 520px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-xl);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}

.form-box:hover {
  box-shadow: var(--shadow-lg);
}

.switch {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  border-radius: 999px;
  font-size: 12px;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.switch:hover {
  color: var(--color-primary-800);
  background: var(--color-primary-100);
}

.form-box h2 {
  margin-bottom: 4px;
  font-size: 26px;
}

.form-box :deep(.el-image) {
  filter: saturate(0.92) contrast(0.96);
}

.form-box :deep(.el-form-item__label) {
  justify-content: flex-start;
}

@media (max-width: 767px) {
  .form-box {
    width: calc(100vw - 28px);
    height: auto;
    min-height: 450px;
    border-radius: var(--radius-lg);
  }

  .form-box :deep(.el-col) {
    min-height: 450px;
  }
}
</style>
