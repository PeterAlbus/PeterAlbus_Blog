<template>
  <Banner title="账号注册"></Banner>
  <div class="main-container flex-box">
    <div class="form-box">
      <el-row style="height: 100%" justify="space-between">
        <el-col :sm="12" :xs="24" class="flex-box" style="padding: 20px">
          <div style="margin: 0 30px 30px 30px">
            <h2 v-if="registerByPhone">手机注册</h2>
            <h2 v-if="!registerByPhone">邮箱注册</h2>
            <div class="switch">
              <span @click="registerByPhone=false;canGetVerifyCode=true;time=0"
                    v-if="registerByPhone">使用邮箱注册</span>
              <span @click="registerByPhone=true;canGetVerifyCode=true;time=0"
                    v-if="!registerByPhone">使用手机注册</span>
            </div>
          </div>
          <el-form
            ref="ruleFormRef"
            :model="registerForm"
            :rules="rules"
            label-width="80px"
            style="width: 100%;max-width: 400px"
          >
            <el-form-item label="手机" prop="userPhone" v-if="registerByPhone">
              <el-input v-model="registerForm.userPhone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="userMail" v-if="!registerByPhone">
              <el-input v-model="registerForm.userMail" />
            </el-form-item>
            <el-form-item label="用户名" prop="userUsername">
              <el-input v-model="registerForm.userUsername" />
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="registerForm.userPassword" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="userConfirmPassword">
              <el-input v-model="registerForm.userConfirmPassword" type="password" />
            </el-form-item>
            <el-form-item label="验证码" prop="userVerifyCode" style="justify-content: space-between!important;">
              <el-input v-model="registerForm.userVerifyCode" style="width: 60%" />
              &emsp;
              <el-button type="primary" style="width: 30%" :disabled="!canGetVerifyCode" @click="getVerifyCode">
                {{ verifyText }}
              </el-button>
            </el-form-item>
            <div>
              <el-button type="primary" style="color: white" @click="submitForm(ruleFormRef)" color="#63a35c">注册
              </el-button>&emsp;
              <el-button plain color="#63a35c" @click="toLoginPage">登录</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :sm="12" :xs="0">
          <el-image style="width: 100%;height: 100%;border-radius: 0 5px 5px 0;"
                    src="https://file.peteralbus.com/assets/blog/imgs/photo/Photo_6553676_DJI_76_jpg_4191951_0_20215595138_photo_original.jpg"
                    fit="cover" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from "@/components/Banner.vue";
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { fetchMailVerifyCode, fetchPhoneVerifyCode, register } from "@/services/userApi";

const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const registerForm = reactive({
  userUsername: "",
  userMail: "",
  userPhone: "",
  userPassword: "",
  userConfirmPassword: "",
  userVerifyCode: ""
});

const registerByPhone = ref(true);

const verifyText = ref("获取");
let time = 0;

const canGetVerifyCode = ref(true);

const getVerifyCode = () => {
  if (registerByPhone.value) {
    if (registerForm.userPhone.length != 11) {
      ElMessageBox.alert("请输入正确的手机号", "格式错误", { confirmButtonText: "确认" });
      return;
    }
    fetchPhoneVerifyCode(registerForm.userPhone).then(() => {
      ElMessage.success("验证码已发送!");
      time = 60 * 10;
      timer();
    }).catch((err) => {
      if (err == "验证码已发送，请10分钟后重试") {
        ElMessageBox.alert("请求验证码过于频繁，请检查收件箱", "验证码已发送", { confirmButtonText: "确认" });
      } else if (err == "该手机号已注册") {
        ElMessageBox.alert("该手机号已被注册", "已注册", { confirmButtonText: "确认" });
      } else {
        ElMessageBox.alert("短信发送失败，请检查手机号或联系管理员", "验证码发送失败", { confirmButtonText: "确认" });
      }
    });
  } else {
    if (registerForm.userMail.indexOf("@") == -1) {
      ElMessageBox.alert("请输入正确的邮箱", "格式错误", { confirmButtonText: "确认" });
      return;
    } else {
      fetchMailVerifyCode(registerForm.userMail).then(() => {
        ElMessage.success("验证码已发送!");
        time = 60 * 10;
        timer();
      }).catch((err) => {
        if (err == "验证码已发送，请10分钟后重试") {
          ElMessageBox.alert("请求验证码过于频繁，请检查收件箱", "验证码已发送", { confirmButtonText: "确认" });
        } else if (err == "该邮箱已注册") {
          ElMessageBox.alert("该邮箱已注册", "已注册", { confirmButtonText: "确认" });
        } else {
          ElMessageBox.alert("邮件发送失败", "验证码发送失败", { confirmButtonText: "确认" });
        }
      });
    }
  }
};

const timer = () => {
  if (time > 0) {
    verifyText.value = time + "s";
    time--;
    canGetVerifyCode.value = false;
    setTimeout(timer, 1000);
  } else {
    canGetVerifyCode.value = true;
    verifyText.value = "发送验证码";
  }
};

const regData = computed(() => {
  if (registerByPhone.value) {
    return {
      userUsername: registerForm.userUsername,
      userPhone: registerForm.userPhone,
      userPassword: registerForm.userPassword,
      verifyCode: registerForm.userVerifyCode,
      userAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  } else {
    return {
      userUsername: registerForm.userUsername,
      userMail: registerForm.userMail,
      userPassword: registerForm.userPassword,
      verifyCode: registerForm.userVerifyCode,
      userAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  }
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (registerForm.userConfirmPassword !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("userConfirmPassword", () => null);
    }
    callback();
  }
};

const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.userPassword) {
    callback(new Error("输入的两次密码不一致!"));
  } else {
    callback();
  }
};

const validateEmail = (rule: any, value: any, callback: any) => {
  if (registerByPhone.value) {
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
  if (!registerByPhone.value) {
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
  userUsername: [
    { required: true, message: "请输入用户名", trigger: "change" }
  ],
  userVerifyCode: [
    { required: true, message: "请输入验证码", trigger: "change" }
  ],
  userPassword: [
    { validator: validatePass, trigger: "blur" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ],
  userConfirmPassword: [
    { validator: validateConfirmPass, trigger: "blur" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      register(regData.value).then(()=>{
        ElMessage.success("注册成功，请登录！");
        router.push("/login");
      });
    }
  });
};

const toLoginPage = () => {
  ElMessageBox.confirm(
    "确定要离开本页面前往登录页?你将丢失填写的所有信息",
    "警告",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      router.push("/login");
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
  background-color: white;
  width: 75vw;
  height: 500px;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  border-radius: 5px;
}

.form-box:hover {
  box-shadow: 0 5px 12px 8px rgba(7, 17, 27, 0.1);
}

.switch {
  margin: 5px;
  cursor: pointer;
  color: #4B6186;
  font-size: 0.8em;
}

.switch:hover {
  color: #63a35c;
}
</style>
