<template>
  <Banner title="重置密码"></Banner>
  <div class="main-container flex-box">
    <div class="form-box">
      <el-row style="height: 100%" justify="space-between">
        <el-col :sm="12" :xs="0">
          <el-image style="width: 100%;height: 100%;border-radius: 5px 0 0 5px;"
                    src="https://file.peteralbus.com/assets/blog/imgs/photo/DJI_0422.JPG" fit="cover" />
        </el-col>
        <el-col :sm="12" :xs="24" class="flex-box" style="padding: 20px">
          <div style="margin: 0 30px 30px 30px">
            <h2 v-if="!resetByPhone">通过邮箱重置密码</h2>
            <h2 v-if="resetByPhone">通过手机重置密码</h2>
            <div class="switch">
              <span v-if="!resetByPhone" @click="resetByPhone=true;resetForm.userPhone=resetForm.userMail">使用手机找回</span>
              <span v-if="resetByPhone" @click="resetByPhone=false;resetForm.userMail=resetForm.userPhone">使用邮箱找回</span>
            </div>
          </div>
          <el-form
            ref="ruleFormRef"
            :model="resetForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
            size="default"
            style="width: 100%;max-width: 400px"
          >
            <el-form-item label="邮箱" prop="userMail" v-if="!resetByPhone">
              <el-input v-model="resetForm.userMail" />
            </el-form-item>
            <el-form-item label="手机" prop="userPhone" v-if="resetByPhone">
              <el-input v-model="resetForm.userPhone" />
            </el-form-item>
            <el-form-item label="新密码" prop="userPassword">
              <el-input v-model="resetForm.userPassword" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="userConfirmPassword">
              <el-input v-model="resetForm.userConfirmPassword" type="password" />
            </el-form-item>
            <el-form-item label="验证码" prop="userVerifyCode" style="justify-content: space-between!important;">
              <el-input v-model="resetForm.userVerifyCode" style="width: 70%" />
              <el-button type="primary" class="get_verify_button" :disabled="!canGetVerifyCode"
                         @click="applyVerifyCode">
                {{ verifyText }}
              </el-button>
            </el-form-item>
            <div>
              <el-button type="primary" style="color: white"
                         @click="submitForm(ruleFormRef)" color="#63a35c">重置密码
              </el-button>&emsp;
            </div>
            <div class="go_login">
              <router-link to="/login">前往登录</router-link>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from "@/components/Banner.vue";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { fetchResetPasswordVerifyCode, resetPassword } from "@/services/userApi";

const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const resetForm = reactive({
  userPhone: "",
  userMail: "",
  userPassword: "",
  userConfirmPassword: "",
  userVerifyCode: ""
});

const resetByPhone = ref(true);

const verifyText = ref("获取");
let time = 0;

const canGetVerifyCode = ref(true);

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

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (resetForm.userConfirmPassword !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("userConfirmPassword", () => null);
    }
    callback();
  }
};

const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== resetForm.userPassword) {
    callback(new Error("输入的两次密码不一致!"));
  } else {
    callback();
  }
};

const validateEmail = (rule: any, value: any, callback: any) => {
  if (resetByPhone.value) {
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
  if (!resetByPhone.value) {
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
      const account = resetByPhone.value ? resetForm.userPhone : resetForm.userMail;
      resetPassword({
        account,
        newPassword: resetForm.userPassword,
        verifyCode: resetForm.userVerifyCode
      }).then(() => {
        ElMessage.success("重置密码成功，请登录！");
        router.push("/login")
      });
    }
  });
};

const applyVerifyCode = () => {
  const type = resetByPhone.value ? "phone" : "mail";
  const account = resetByPhone.value ? resetForm.userPhone : resetForm.userMail;
  fetchResetPasswordVerifyCode(account, type).then(() => {
    ElMessage.success("验证码已发送");
    time = 60 * 10;
    timer();
  }).catch((err) => {
    if (err == "验证码已发送，请10分钟后重试") {
      ElMessageBox.alert("请求验证码过于频繁，请检查收件箱", "验证码已发送", { confirmButtonText: "确认" });
    } else if (err == "该账号尚未注册") {
      ElMessageBox.alert("该账号尚未注册，请检查", "未注册", { confirmButtonText: "确认" });
    } else {
      ElMessageBox.alert("发送失败，请联系管理员或确认账号可用性", "验证码发送失败", { confirmButtonText: "确认" });
    }
  });
};
</script>

<style scoped>
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

.flex-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.go_login {
  margin-top: 10px;
  text-align: center;
  font-size: 0.8em;
  color: #4B6186;
}

.get_verify_button {
  border-width: 0;
  width: 30%;
}
</style>
