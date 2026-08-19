<template>
  <Banner title="用户中心" />
  <div class="main-container flex-box">
    <div class="user-box">
      <el-upload
        class="avatar-uploader"
        :action="BASE_URL + userUrl.uploadAvatar"
        ref="uploadRef"
        :headers="headerObj"
        :data="upData"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-avatar :size="178" :src="userStore.userAvatar" v-if="userStore.userAvatar"></el-avatar>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>

      <div v-if="!changingName" class="profile-name-row">
        <h2 class="profile-name">{{ userStore.userUsername }}</h2>
        <el-button
          class="profile-name-action"
          aria-label="修改用户 ID"
          plain
          color="#63a35c"
          :icon="Edit"
          @click="editName"
        />
      </div>
      <div
        v-else
        v-click-outside="cancelEditName"
        class="profile-name-editor"
        @keydown.esc.stop="cancelEditName"
      >
        <el-input
          ref="usernameInputRef"
          v-model="username"
          maxlength="30"
          aria-label="用户 ID"
          @keyup.enter="changeName"
        />
        <el-button
          class="profile-name-confirm"
          aria-label="确认修改用户 ID"
          plain
          color="#63a35c"
          :icon="Check"
          :loading="nameSaving"
          @click="changeName"
        />
      </div>

      <p class="avatar-hint">点击头像可更换</p>
      <p class="identity-row">
        <el-tag
          :type="identityType"
          effect="dark"
        >
          {{ userIdentity }}
        </el-tag>
      </p>

      <div class="profile-details">
        <div class="user-center-info">
          <div class="profile-info-copy">
            <span class="profile-info-label">绑定手机</span>
            <span class="profile-info-value">{{ userStore.userPhone || "尚未绑定" }}</span>
          </div>
          <el-button class="profile-info-action" plain color="#63a35c" :icon="Edit" @click="phoneFormVisible = true">
            {{ userStore.userPhone ? "修改" : "绑定" }}
          </el-button>
        </div>
        <div class="user-center-info">
          <div class="profile-info-copy">
            <span class="profile-info-label">绑定邮箱</span>
            <span class="profile-info-value">{{ userStore.userMail || "尚未绑定" }}</span>
          </div>
          <el-button class="profile-info-action" plain color="#63a35c" :icon="Edit" @click="mailFormVisible = true">
            {{ userStore.userMail ? "修改" : "绑定" }}
          </el-button>
        </div>
        <div class="user-center-info profile-info-static">
          <div class="profile-info-copy">
            <span class="profile-info-label">注册时间</span>
            <span class="profile-info-value">{{ userStore.gmtCreate }}</span>
          </div>
        </div>
      </div>

      <div class="profile-page-actions">
        <el-button color="#63a35c" type="primary" class="primary-action" @click="changePasswordFormVisible = true">
          更改密码
        </el-button>
        <el-button color="#63a35c" plain @click="logout">登出</el-button>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="changePasswordFormVisible"
    modal-class="profile-dialog-overlay"
    width="520px"
    destroy-on-close
    @closed="resetPasswordForm"
  >
    <template #header>
      <div class="profile-dialog-heading">
        <h3>修改密码</h3>
        <p>验证当前密码后设置新的登录密码</p>
      </div>
    </template>
    <el-form
      ref="changePasswordFormRef"
      class="profile-dialog-form"
      :model="changePasswordForm"
      :rules="psswordRules"
      label-position="top"
      status-icon
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="changePasswordForm.oldPassword"
          type="password"
          show-password
          autocomplete="current-password"
          placeholder="请输入当前密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="changePasswordForm.newPassword"
          type="password"
          show-password
          autocomplete="new-password"
          placeholder="请输入 6–60 位新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="userConfirmPassword">
        <el-input
          v-model="changePasswordForm.userConfirmPassword"
          type="password"
          show-password
          autocomplete="new-password"
          placeholder="请再次输入新密码"
          @keyup.enter="changePassword(changePasswordFormRef)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="profile-dialog-footer">
        <el-button plain color="#63a35c" @click="changePasswordFormVisible = false">取消</el-button>
        <el-button class="dialog-confirm-action" type="primary" color="#63a35c" @click="changePassword(changePasswordFormRef)">确认修改</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="phoneFormVisible"
    modal-class="profile-dialog-overlay"
    width="520px"
    destroy-on-close
    @closed="resetPhoneForm"
  >
    <template #header>
      <div class="profile-dialog-heading">
        <h3>{{ userStore.userPhone ? "修改绑定手机" : "绑定手机" }}</h3>
        <p>验证码将发送到下方填写的手机号码</p>
      </div>
    </template>
    <el-form
      ref="phoneFormRef"
      class="profile-dialog-form"
      :model="phoneForm"
      :rules="phoneRules"
      label-position="top"
      status-icon
    >
      <el-form-item label="手机号码" prop="userPhone">
        <el-input v-model="phoneForm.userPhone" maxlength="11" inputmode="numeric" placeholder="请输入 11 位手机号码" />
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <div class="verify-code-row">
          <el-input v-model="phoneForm.verifyCode" maxlength="12" placeholder="请输入验证码" @keyup.enter="setPhone(phoneFormRef)" />
          <el-button type="primary" :disabled="!canGetPhoneVerifyCode" @click="getPhoneVerifyCode">
          {{ phoneVerifyText }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="profile-dialog-footer">
        <el-button plain color="#63a35c" @click="phoneFormVisible = false">取消</el-button>
        <el-button class="dialog-confirm-action" type="primary" color="#63a35c" @click="setPhone(phoneFormRef)">确认绑定</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="mailFormVisible"
    modal-class="profile-dialog-overlay"
    width="520px"
    destroy-on-close
    @closed="resetMailForm"
  >
    <template #header>
      <div class="profile-dialog-heading">
        <h3>{{ userStore.userMail ? "修改绑定邮箱" : "绑定邮箱" }}</h3>
        <p>验证码将发送到下方填写的邮箱地址</p>
      </div>
    </template>
    <el-form
      ref="mailFormRef"
      class="profile-dialog-form"
      :model="mailForm"
      :rules="mailRules"
      label-position="top"
      status-icon
    >
      <el-form-item label="邮箱地址" prop="userMail">
        <el-input v-model="mailForm.userMail" type="email" inputmode="email" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <div class="verify-code-row">
          <el-input v-model="mailForm.verifyCode" maxlength="12" placeholder="请输入验证码" @keyup.enter="setMail(mailFormRef)" />
          <el-button type="primary" :disabled="!canGetMailVerifyCode" @click="getMailVerifyCode">
          {{ mailVerifyText }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="profile-dialog-footer">
        <el-button plain color="#63a35c" @click="mailFormVisible = false">取消</el-button>
        <el-button class="dialog-confirm-action" type="primary" color="#63a35c" @click="setMail(mailFormRef)">确认绑定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Banner from "@/components/Banner.vue";
import { Edit, Plus, Check } from "@element-plus/icons-vue";
import {
  ClickOutside as vClickOutside,
  ElMessage,
  ElMessageBox,
  ElUpload
} from "element-plus";
import type { FormInstance, InputInstance, UploadRawFile } from "element-plus";
import { useUserStore } from "@/stores/user";
import { computed, nextTick, reactive, ref } from "vue";
import {
  changeMail,
  changePasswordByOld,
  changePhone,
  changeUsername, fetchMailVerifyCode,
  fetchPhoneVerifyCode,
  logoutUser
} from "@/services/userApi";
import { useRouter } from "vue-router";
import { BASE_URL, userUrl } from "@/services/urlConfig";

const router = useRouter();
const userStore = useUserStore();

const token = localStorage.getItem("token");
const headerObj = {
  satoken_peteralbus_blog: token
};

const changingName = ref(false);
const username = ref("");
const usernameInputRef = ref<InputInstance>();
const nameSaving = ref(false);

const editName = async () => {
  username.value = userStore.userUsername;
  changingName.value = true;
  await nextTick();
  usernameInputRef.value?.focus();
};

const cancelEditName = () => {
  if (nameSaving.value) return;
  username.value = userStore.userUsername;
  changingName.value = false;
};

const changeName = async () => {
  const nextUsername = username.value.trim();
  if (!nextUsername) {
    ElMessage.warning("用户 ID 不能为空");
    usernameInputRef.value?.focus();
    return;
  }
  if (nextUsername === userStore.userUsername) {
    cancelEditName();
    return;
  }

  nameSaving.value = true;
  try {
    await changeUsername(userStore.userId, nextUsername);
    ElMessage.success("修改用户名成功!");
    userStore.userUsername = nextUsername;
    changingName.value = false;
  } finally {
    nameSaving.value = false;
  }
};

const changePasswordFormRef = ref<FormInstance>();
const phoneFormRef = ref<FormInstance>();
const mailFormRef = ref<FormInstance>();
const changePasswordFormVisible = ref(false);
const phoneFormVisible = ref(false);
const mailFormVisible = ref(false);
const changePasswordForm = reactive({
  userId: "",
  oldPassword: "",
  newPassword: "",
  userConfirmPassword: ""
});
const phoneForm = reactive({
  userId: "",
  userPhone: "",
  verifyCode: ""
});
const mailForm = reactive({
  userId: "",
  userMail: "",
  verifyCode: ""
});

const resetPasswordForm = () => {
  changePasswordForm.userId = "";
  changePasswordForm.oldPassword = "";
  changePasswordForm.newPassword = "";
  changePasswordForm.userConfirmPassword = "";
  changePasswordFormRef.value?.clearValidate();
};

const resetPhoneForm = () => {
  phoneForm.userId = "";
  phoneForm.userPhone = "";
  phoneForm.verifyCode = "";
  phoneFormRef.value?.clearValidate();
};

const resetMailForm = () => {
  mailForm.userId = "";
  mailForm.userMail = "";
  mailForm.verifyCode = "";
  mailFormRef.value?.clearValidate();
};

const phoneVerifyText = ref("获取");
const mailVerifyText = ref("获取");
let phoneTime = 0;
let mailTime = 0;

const canGetMailVerifyCode = ref(true);
const canGetPhoneVerifyCode = ref(true);

const logout = () => {
  ElMessageBox.confirm(
    "确定要退出登录吗?",
    "警告",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      logoutUser().then(() => {
        ElMessage.success("登出成功");
        localStorage.removeItem("token");
        router.push("/login");
      });
    })
};

const validateOldPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (changePasswordForm.userConfirmPassword !== "") {
      if (!changePasswordFormRef.value) return;
      changePasswordFormRef.value.validateField("userConfirmPassword", () => null);
    }
    callback();
  }
};

const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== changePasswordForm.newPassword) {
    callback(new Error("输入的两次密码不一致!"));
  } else {
    callback();
  }
};

const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("请输入邮箱"));
  } else if (value.indexOf("@") == -1) {
    callback(new Error("请输入正确格式的邮箱"));
  } else {
    callback();
  }
};

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!Number(value)) {
    callback(new Error("请输入数字"));
  } else if (value.length != 11) {
    callback(new Error("请输入正确格式的11位手机号"));
  } else {
    callback();
  }
};

const phoneRules = reactive({
  userPhone: [
    { validator: validatePhone, trigger: "blur" }
  ],
  verifyCode: [
    { required: true, message: "请输入验证码", trigger: "change" }
  ]
});

const mailRules = reactive({
  userMail: [
    { validator: validateEmail, trigger: "blur" }
  ],
  verifyCode: [
    { required: true, message: "请输入验证码", trigger: "change" }
  ]
});


const psswordRules = reactive({
  oldPassword: [
    { validator: validateOldPass, trigger: "blur" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ],
  newPassword: [
    { validator: validatePass, trigger: "blur" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ],
  userConfirmPassword: [
    { validator: validateConfirmPass, trigger: "blur" },
    { min: 6, max: 60, message: "密码长度必须在6到60位之间", trigger: "blur" }
  ]
});

const changePassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      changePasswordForm.userId = userStore.userId;
      changePasswordByOld(changePasswordForm).then(() => {
        ElMessage.success("密码修改成功，请重新登陆！");
        logoutUser().then(() => {
          ElMessage.success("登出成功");
          localStorage.removeItem("token");
          router.push("/login");
        });
      });
    }
  });
};

const setPhone = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      phoneForm.userId = userStore.userId;
      changePhone(phoneForm).then(() => {
        ElMessage.success("手机绑定成功！");
        userStore.userPhone = phoneForm.userPhone;
        phoneFormVisible.value = false;
      });
    }
  });
};

const setMail = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      mailForm.userId = userStore.userId;
      changeMail(mailForm).then(() => {
        ElMessage.success("邮箱绑定成功！");
        userStore.userMail = mailForm.userMail;
        mailFormVisible.value = false;
      });
    }
  });
};

const getPhoneVerifyCode = () => {
  if (phoneForm.userPhone.length != 11) {
    ElMessageBox.alert("请输入正确的手机号", "格式错误", { confirmButtonText: "确认" });
    return;
  }
  fetchPhoneVerifyCode(phoneForm.userPhone).then(()=>{
    ElMessage.success("验证码已发送!");
    phoneTime = 60 * 10;
    phoneTimer();
  })
};

const getMailVerifyCode = () => {
  if (mailForm.userMail.indexOf("@") == -1) {
    ElMessageBox.alert("请输入正确的邮箱", "格式错误", { confirmButtonText: "确认" });
    return;
  } else {
    fetchMailVerifyCode(mailForm.userMail).then(()=>{
      ElMessage.success("验证码已发送!");
      mailTime = 60 * 10;
      mailTimer();
    })
  }
};

const phoneTimer = () => {
  if (phoneTime > 0) {
    phoneVerifyText.value = phoneTime + "s";
    phoneTime--;
    canGetPhoneVerifyCode.value = false;
    setTimeout(phoneTimer, 1000);
  } else {
    canGetPhoneVerifyCode.value = true;
    phoneVerifyText.value = "获取";
  }
};

const mailTimer = () => {
  if (mailTime > 0) {
    mailVerifyText.value = mailTime + "s";
    mailTime--;
    canGetMailVerifyCode.value = false;
    setTimeout(mailTimer, 1000);
  } else {
    canGetMailVerifyCode.value = true;
    mailVerifyText.value = "获取";
  }
};

const uploadRef = ref<InstanceType<typeof ElUpload>>();

// const submitUpload = () => {
//   uploadRef.value!.submit();
// };

const handleAvatarSuccess = (res: any) => {
  ElMessage.success("更换头像成功成功");
  userStore.userAvatar = res.data + "";
};

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isIMG) {
    ElMessage.error("选择的文件不是jpg/png格式！");
  }
  if (!isLt10M) {
    ElMessage.error("图片大小不能超过10M！");
  }
  return isIMG && isLt10M;
};

const upData = computed(() => {
  return { userId: userStore.userId };
});

const identityType = computed(() => {
  if (userStore.userIdentity == 0) {
    return "warning";
  } else if (userStore.userIdentity == 1) {
    return "success";
  } else if (userStore.userIdentity == 5) {
    return "";
  } else {
    return "info";
  }
});

const userIdentity = computed(() => {
  if (userStore.userIdentity == 0) {
    return "站长";
  } else if (userStore.userIdentity == 1) {
    return "管理员";
  } else if (userStore.userIdentity == 5) {
    return "普通用户";
  } else {
    return "游客";
  }
});
</script>

<style scoped>
.user-box {
  width: min(820px, calc(100vw - 48px));
  max-width: 800px;
  padding: 42px 48px 46px;
  text-align: center;
  background:
    linear-gradient(180deg, rgba(232, 240, 229, 0.58), rgba(255, 255, 255, 0.98) 180px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-normal);
}

.user-box:hover {
  box-shadow: var(--shadow-lg);
}

.flex-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.profile-name-row {
  display: flex;
  min-height: 44px;
  margin: 24px auto 0;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.profile-name {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--color-text);
  line-height: 1.2;
}

.profile-name-action,
.profile-name-confirm {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  margin: 0;
  border-radius: 13px;
}

.profile-name-editor {
  display: flex;
  width: min(420px, 100%);
  min-height: 44px;
  margin: 24px auto 0;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.profile-name-editor :deep(.el-input__wrapper) {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 13px;
}

.profile-name-editor :deep(.el-input__inner) {
  font-size: 17px;
  font-weight: 600;
}

.avatar-hint {
  margin: 16px 0 10px;
  color: var(--color-primary-500);
  font-size: 13px;
}

.identity-row {
  margin: 0;
  padding: 4px;
}

.profile-details {
  max-width: 460px;
  margin: 28px auto 0;
  text-align: left;
}

.user-center-info {
  display: flex;
  min-height: 62px;
  margin: 12px 0;
  padding: 9px 10px 9px 18px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.user-center-info:not(.profile-info-static):hover {
  border-color: rgba(85, 139, 91, 0.28);
  box-shadow: 0 8px 22px rgba(28, 54, 34, 0.07);
}

.profile-info-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.profile-info-label {
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.4;
}

.profile-info-value {
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-info-action {
  min-width: 88px;
  min-height: 38px;
  flex: 0 0 auto;
  margin: 0;
  border-radius: 12px;
}

.profile-info-static {
  padding-right: 18px;
}

.profile-page-actions {
  display: flex;
  margin: 30px auto 0;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.profile-page-actions :deep(.el-button) {
  min-width: 108px;
  min-height: 42px;
  margin: 0;
  border-radius: 13px;
}

.primary-action {
  color: white;
}

.user-box :deep(.avatar-uploader .el-upload) {
  border-radius: 50%;
  box-shadow: 0 12px 30px rgba(30, 54, 36, 0.16);
}

.user-box :deep(.el-avatar) {
  display: block;
  border-width: 4px;
}

:global(.profile-dialog-overlay) {
  background: rgba(15, 25, 18, 0.48) !important;
  backdrop-filter: blur(5px);
}

:global(.profile-dialog-overlay .el-overlay-dialog) {
  display: grid;
  overflow-y: auto;
  padding: 24px;
  place-items: center;
}

:global(.profile-dialog-overlay .el-dialog) {
  width: min(520px, 100%) !important;
  margin: 0 !important;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--color-border);
  border-radius: 22px;
  box-shadow: 0 26px 70px rgba(17, 34, 22, 0.24);
}

:global(.profile-dialog-overlay .el-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 26px 30px 20px;
  border-bottom: 1px solid var(--color-border);
}

:global(.profile-dialog-overlay .el-dialog .el-dialog__headerbtn) {
  top: 19px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  transition: background-color var(--transition-fast);
}

:global(.profile-dialog-overlay .el-dialog .el-dialog__headerbtn:hover) {
  background: var(--color-primary-50);
}

:global(.profile-dialog-overlay .el-dialog .el-dialog__body) {
  padding: 24px 30px 8px;
}

:global(.profile-dialog-overlay .el-dialog .el-dialog__footer) {
  padding: 18px 30px 24px;
  border-top: 1px solid var(--color-border);
}

.profile-dialog-heading {
  padding-right: 42px;
  text-align: left;
}

.profile-dialog-heading h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
  line-height: 1.4;
}

.profile-dialog-heading p {
  margin: 5px 0 0;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.5;
}

.profile-dialog-form {
  width: 100%;
}

.profile-dialog-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.profile-dialog-form :deep(.el-form-item__label) {
  height: auto;
  margin-bottom: 8px;
  padding: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.profile-dialog-form :deep(.el-input__wrapper) {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
}

.verify-code-row {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) 126px;
  gap: 12px;
}

.verify-code-row :deep(.el-button) {
  width: 100%;
  min-height: 44px;
  margin: 0;
  border-radius: 12px;
}

.profile-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.profile-dialog-footer :deep(.el-button) {
  min-width: 108px;
  min-height: 42px;
  margin: 0;
  border-radius: 12px;
}

.profile-dialog-footer :deep(.dialog-confirm-action) {
  color: #fff !important;
}

@media (max-width: 767px) {
  .user-box {
    width: calc(100vw - 28px);
    padding: 28px 18px 32px;
    border-radius: var(--radius-lg);
  }

  .profile-name-row,
  .profile-name-editor {
    margin-top: 20px;
  }

  .profile-name-row {
    gap: 12px;
  }

  .profile-name {
    font-size: 26px;
  }

  .profile-details {
    margin-top: 22px;
  }

  .user-center-info {
    height: auto;
    min-height: 60px;
    padding-left: 14px;
    text-align: left;
  }

  .profile-info-action {
    min-width: 76px;
  }

  .profile-page-actions {
    margin-top: 26px;
  }

  :global(.profile-dialog-overlay .el-overlay-dialog) {
    padding: 12px;
  }

  :global(.profile-dialog-overlay .el-dialog .el-dialog__header) {
    padding: 22px 20px 17px;
  }

  :global(.profile-dialog-overlay .el-dialog .el-dialog__headerbtn) {
    top: 15px;
    right: 14px;
  }

  :global(.profile-dialog-overlay .el-dialog .el-dialog__body) {
    padding: 20px 20px 4px;
  }

  :global(.profile-dialog-overlay .el-dialog .el-dialog__footer) {
    padding: 16px 20px 20px;
  }

  .profile-dialog-heading {
    padding-right: 38px;
  }

  .verify-code-row {
    grid-template-columns: minmax(0, 1fr) 108px;
    gap: 10px;
  }

  .profile-dialog-footer :deep(.el-button) {
    min-width: 92px;
  }
}
</style>
