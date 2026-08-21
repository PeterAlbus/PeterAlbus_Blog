<template>
  <Banner :title="pageTitle" :description="pageDescription"></Banner>
  <div class="main-container editor-page">
    <el-row justify="center">
      <el-col class="editor-column" :lg="16" :sm="22" :xs="22">
        <div class="blog-content">
          <header class="editor-intro">
            <span class="editor-kicker">ARTICLE EDITOR</span>
            <h2>{{ pageTitle }}</h2>
            <p>{{ isEditing ? "完善文章内容并保存本次修改。" : "整理标题、封面与正文，完成后即可发布。" }}</p>
          </header>

          <el-form ref="blogForm" class="editor-form" :model="blog" :rules="rules" label-position="top">
            <section class="form-section">
              <header class="section-heading">
                <span>01</span>
                <div>
                  <h3>基本信息</h3>
                  <p>用于文章列表和详情页的主要展示信息</p>
                </div>
              </header>
              <div class="basic-fields">
                <el-form-item class="title-field" label="文章标题" prop="blogTitle">
                  <el-input v-model="blog.blogTitle" placeholder="输入清晰、准确的文章标题" :prefix-icon="Document"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="blogAuthor">
                  <el-input v-model="blog.blogAuthor" placeholder="文章作者" :prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item label="文章摘要" prop="blogDescription">
                  <el-input
                    v-model="blog.blogDescription"
                    type="textarea"
                    :rows="2"
                    resize="none"
                    placeholder="用一两句话概括文章内容"
                  ></el-input>
                </el-form-item>
              </div>
            </section>

            <section class="form-section">
              <header class="section-heading">
                <span>02</span>
                <div>
                  <h3>文章封面</h3>
                  <p>封面会显示在首页和文章列表中</p>
                </div>
              </header>
              <el-form-item class="cover-field" label="选择封面图片">
                <div class="cover-row">
                  <el-upload
                    class="cover-uploader"
                    :action="BASE_URL+blogUrl.uploadCover"
                    accept="image/jpeg,image/png,image/gif"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <div class="cover-frame" :class="{ 'has-image': imageUrl }">
                      <el-image v-if="imageUrl" :src="imageUrl" class="cover-preview" fit="cover" alt="文章封面" />
                      <div v-else class="cover-placeholder">
                        <el-icon><Plus /></el-icon>
                        <strong>点击上传封面</strong>
                        <span>JPG、PNG 或 GIF</span>
                      </div>
                    </div>
                  </el-upload>
                  <div class="cover-notes">
                    <strong>{{ imageUrl ? "已选择封面" : "尚未选择封面" }}</strong>
                    <p>建议使用横向图片，文件大小不超过 2 MB。重新上传会替换当前封面。</p>
                    <el-button v-if="imageUrl" class="remove-cover-button" plain type="danger" @click="deleteBlogAvatarFile">
                      移除当前封面
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </section>

            <section class="form-section">
              <header class="section-heading">
                <span>03</span>
                <div>
                  <h3>发布设置</h3>
                  <p>选择文章分类以及是否在首页置顶</p>
                </div>
              </header>
              <div class="settings-grid">
                <el-form-item label="文章分类" prop="blogType">
                  <el-radio-group v-model="blog.blogType" class="category-options">
                    <el-radio
                      v-for="category in blogCategories"
                      :key="category.value"
                      :label="category.value"
                      border
                    >
                      {{ category.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="首页置顶" prop="isTop">
                  <el-radio-group v-model="blog.isTop" class="top-options">
                    <el-radio :label="0" border>不置顶</el-radio>
                    <el-radio :label="1" border>置顶</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </section>

            <section class="form-section content-section">
              <header class="section-heading">
                <span>04</span>
                <div>
                  <h3>正文内容</h3>
                  <p>支持 Markdown 编辑、图片上传和实时预览</p>
                </div>
              </header>
              <el-form-item prop="blogContent">
                <mavon-editor
                  ref="mdRef"
                  v-model="blog.blogContent"
                  class="blog-editor"
                  :shortCut="false"
                  codeStyle="xcode"
                  :toolbars="editorTools"
                  @imgAdd="uploadImage"
                  @ImgDel="deleteImage"
                />
              </el-form-item>
            </section>

            <div class="editor-actions">
              <el-button class="submit-button" type="success" @click="onSubmit(blogForm)">
                {{ isEditing ? "保存修改" : "发布文章" }}
              </el-button>
              <el-button v-if="isEditing" class="reset-button" @click="getBlog">恢复原内容</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Plus, Document, User } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  UploadRawFile,
  FormInstance
} from "element-plus";
import { ElMessage } from "element-plus";
import Banner from "@/components/Banner.vue";
import { addBlog, fetchBlogById, updateBlog } from "@/services/blogApi";
import { BASE_URL, blogUrl } from "@/services/urlConfig";
import { deletePhotoByUrl, uploadOriginPhoto } from "@/services/photoApi";
import VueMavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

const MavonEditor = VueMavonEditor.mavonEditor;

const blogForm = ref<FormInstance>();
const route = useRoute();
const router = useRouter();
const mdRef = ref<any>();

const imageUrl = ref("");

const blogCategories = [
  { value: 1, label: "学习笔记" },
  { value: 2, label: "生活" },
  { value: 3, label: "ACG" },
  { value: 4, label: "科技" },
  { value: 5, label: "随笔" }
];

const editorTools = {
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: true, // 上角标
  subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: true, // 全屏编辑
  readmodel: true, // 沉浸式阅读
  htmlcode: true, // 展示html源码
  help: true, // 帮助
  /* 1.3.5 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: true, // 清空
  /* 2.1.8 */
  alignleft: true, // 左对齐
  aligncenter: true, // 居中
  alignright: true, // 右对齐
  /* 2.2.1 */
  preview: true, // 预览
}

const blog = ref({
  blogId: route.query.id,
  blogTitle: "",
  blogImg: "",
  blogType: 1,
  blogDescription: "",
  blogAuthor: "PeterAlbus",
  blogContent: "",
  blogTime: "2021-07-22",
  blogLike: 0,
  blogViews: 0,
  isTop: 0
});

const isEditing = computed(() => typeof blog.value.blogId === "string");
const pageTitle = computed(() => isEditing.value ? "编辑文章" : "新建文章");
const pageDescription = computed(() => isEditing.value ? "调整内容，让表达更加准确。" : "记录此刻值得留下的内容。");

const rules = reactive({
  blogTitle: [
    { required: true, message: "标题不可为空", trigger: "change" }
  ],
  blogAuthor: [
    { required: true, message: "作者不可为空", trigger: "change" }
  ],
  blogDescription: [
    { required: true, message: "描述不可为空", trigger: "change" }
  ],
  blogType: [
    { required: true, message: "必须选择类型", trigger: "change" }
  ],
  blogContent: [
    { required: true, message: "内容不可为空", trigger: "change" }
  ]
});

const getBlog = function() {
  if (typeof blog.value.blogId == "string") {
    fetchBlogById(blog.value.blogId).then(res => {
      blog.value = res.data;
      imageUrl.value = blog.value.blogImg;
    });
  }
};

const handleAvatarSuccess = (res: any) => {
  if (res != "error") {
    blog.value.blogImg = res.data;
    imageUrl.value = blog.value.blogImg;
    ElMessage.success("上传成功");
  } else ElMessage.error("上传失败!");
};

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isIMG) {
    ElMessage.error("选择的文件不是图片！");
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2M！");
  }

  if(isIMG && isLt2M && imageUrl.value) {
    deleteBlogAvatarFile()
  }
  return isIMG && isLt2M;
};

const uploadImage = (pos:any, file:UploadRawFile) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path','blog/imgs/blogimg');
  console.log(formData.get('file'))
  uploadOriginPhoto(formData).then(res => {
    mdRef.value.$img2Url(pos, res.data);
  });
}

const deleteImage = (info:any) => {
  deletePhotoByUrl(info[0]).then(() => {
    ElMessage.success("远端删除图片成功")
  })
}

const deleteBlogAvatarFile = () => {
  deletePhotoByUrl(imageUrl.value)
  imageUrl.value = ""
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (typeof blog.value.blogId == "string") {
        updateBlog(blog.value).then(() => {
          router.push({ path: "/blog", query: { id: blog.value.blogId } });
          ElMessage.success("更新成功");
        });
      } else {
        addBlog(blog.value).then(() => {
          ElMessage.success("发布成功");
          router.push("/");
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  getBlog();
});
</script>

<style scoped>
.editor-page {
  padding-top: 36px;
}

.editor-column {
  max-width: 1060px;
}

.blog-content {
  padding: clamp(22px, 2.2vw, 32px);
  text-align: left;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.editor-intro {
  position: relative;
  margin-bottom: 18px;
  padding: 18px 21px;
  overflow: hidden;
  background:
    radial-gradient(circle at 94% 5%, rgba(112, 160, 91, 0.12), transparent 34%),
    linear-gradient(135deg, rgba(245, 249, 243, 0.98), rgba(251, 252, 250, 0.96));
  border: 1px solid rgba(99, 145, 82, 0.16);
  border-radius: 14px;
}

.editor-intro::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700));
  content: "";
}

.editor-kicker {
  color: var(--color-primary-600);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.16em;
}

.editor-intro h2 {
  margin: 7px 0 5px;
  color: var(--color-heading);
  font-size: clamp(20px, 2vw, 25px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.02em;
}

.editor-intro p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.form-section {
  margin-top: 14px;
  padding: clamp(17px, 1.8vw, 22px);
  background: rgba(250, 251, 249, 0.76);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.section-heading {
  display: flex;
  margin-bottom: 17px;
  align-items: center;
  gap: 10px;
}

.section-heading > span {
  display: grid;
  width: 33px;
  height: 33px;
  flex: 0 0 auto;
  place-items: center;
  color: var(--color-primary-600);
  background: rgba(83, 139, 79, 0.09);
  border: 1px solid rgba(83, 139, 79, 0.18);
  border-radius: 9px;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.05em;
}

.section-heading h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: 15px;
  font-weight: 680;
  line-height: 1.35;
}

.section-heading p {
  margin: 2px 0 0;
  color: var(--color-text-secondary);
  font-size: 11px;
  line-height: 1.45;
}

.basic-fields {
  display: grid;
  grid-template-columns: minmax(170px, 0.7fr) minmax(0, 1.5fr);
  gap: 0 16px;
}

.title-field {
  grid-column: 1 / -1;
}

.editor-form :deep(.el-form-item) {
  min-width: 0;
  margin-bottom: 16px;
}

.editor-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.editor-form :deep(.el-form-item__label) {
  height: auto;
  margin-bottom: 6px;
  padding: 0;
  color: var(--color-heading);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.4;
}

.editor-form :deep(.el-input__wrapper) {
  min-height: 40px;
  padding: 0 13px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 9px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.editor-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-border-strong) inset;
}

.editor-form :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 1px var(--color-primary-500) inset, 0 0 0 3px rgba(83, 139, 79, 0.09);
}

.editor-form :deep(.el-textarea__inner) {
  min-height: 70px !important;
  padding: 10px 13px;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.95);
  border: 0;
  border-radius: 9px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
  line-height: 1.65;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.editor-form :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--color-border-strong) inset;
}

.editor-form :deep(.el-textarea__inner:focus) {
  background: #fff;
  box-shadow: 0 0 0 1px var(--color-primary-500) inset, 0 0 0 3px rgba(83, 139, 79, 0.09);
}

.cover-field :deep(.el-form-item__content) {
  display: block;
}

.cover-row {
  display: flex;
  align-items: center;
  gap: clamp(18px, 2.2vw, 26px);
}

.cover-uploader {
  flex: 0 0 auto;
  line-height: 0;
}

.cover-frame {
  position: relative;
  display: grid;
  width: min(280px, 30vw);
  aspect-ratio: 16 / 9;
  overflow: hidden;
  place-items: center;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(240, 246, 238, 0.9), rgba(250, 251, 249, 0.96));
  border: 1px dashed rgba(83, 139, 79, 0.38);
  border-radius: 12px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.cover-frame:hover {
  border-color: var(--color-primary-500);
  box-shadow: 0 8px 20px rgba(61, 101, 60, 0.12);
  transform: translateY(-2px);
}

.cover-frame.has-image {
  border-style: solid;
  border-color: rgba(83, 139, 79, 0.24);
}

.cover-preview {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  color: var(--color-text-secondary);
  line-height: 1.35;
}

.cover-placeholder :deep(.el-icon) {
  margin-bottom: 2px;
  color: var(--color-primary-500);
  font-size: 23px;
}

.cover-placeholder strong {
  color: var(--color-heading);
  font-size: 12px;
  font-weight: 650;
}

.cover-placeholder span {
  font-size: 11px;
}

.cover-notes {
  max-width: 340px;
}

.cover-notes > strong {
  color: var(--color-heading);
  font-size: 13px;
  font-weight: 650;
}

.cover-notes p {
  margin: 6px 0 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.65;
}

.remove-cover-button {
  min-height: 32px;
  margin: 0;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 12px;
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 18px;
}

.category-options,
.top-options {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 7px;
}

.top-options {
  width: auto;
  flex-wrap: nowrap;
}

.category-options :deep(.el-radio),
.top-options :deep(.el-radio) {
  width: auto;
  min-width: 88px;
  height: 36px;
  margin: 0;
  padding: 0 11px;
  justify-content: center;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.92);
  border-color: var(--color-border);
  border-radius: 9px;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.category-options :deep(.el-radio:hover),
.top-options :deep(.el-radio:hover) {
  color: var(--color-primary-600);
  border-color: rgba(83, 139, 79, 0.38);
  transform: translateY(-1px);
}

.category-options :deep(.el-radio.is-bordered.is-checked),
.top-options :deep(.el-radio.is-bordered.is-checked) {
  color: var(--color-primary-700);
  background: rgba(235, 244, 231, 0.92);
  border-color: rgba(83, 139, 79, 0.48);
  box-shadow: 0 4px 11px rgba(61, 101, 60, 0.09);
}

.category-options :deep(.el-radio__input.is-checked .el-radio__inner),
.top-options :deep(.el-radio__input.is-checked .el-radio__inner) {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.category-options :deep(.el-radio__input.is-checked + .el-radio__label),
.top-options :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: var(--color-primary-700);
}

.category-options :deep(.el-radio__label),
.top-options :deep(.el-radio__label) {
  padding-left: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.content-section :deep(.el-form-item__content) {
  display: block;
  line-height: normal;
}

.blog-editor {
  width: 100%;
  min-height: 500px;
  overflow: hidden;
  border: 1px solid var(--color-border) !important;
  border-radius: 11px;
  box-shadow: none !important;
}

.editor-actions {
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.editor-actions :deep(.el-button) {
  min-width: 96px;
  min-height: 36px;
  margin: 0;
  padding: 0 15px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 650;
}

.submit-button {
  box-shadow: 0 6px 15px rgba(61, 101, 60, 0.14);
}

@media (max-width: 1100px) {
  .settings-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}

@media (max-width: 767px) {
  .editor-page {
    padding-top: 24px;
  }

  .blog-content {
    padding: 14px 12px;
    border-radius: 16px;
  }

  .editor-intro {
    margin-bottom: 13px;
    padding: 16px 15px;
    border-radius: 12px;
  }

  .form-section {
    margin-top: 12px;
    padding: 14px 12px;
    border-radius: 12px;
  }

  .section-heading {
    margin-bottom: 15px;
  }

  .section-heading > span {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }

  .section-heading h3 {
    font-size: 14px;
  }

  .section-heading p {
    font-size: 11px;
  }

  .basic-fields {
    grid-template-columns: minmax(0, 1fr);
  }

  .title-field {
    grid-column: auto;
  }

  .cover-row {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .cover-uploader,
  .cover-uploader :deep(.el-upload) {
    width: 100%;
  }

  .cover-frame {
    width: 100%;
  }

  .cover-notes {
    max-width: none;
  }

  .category-options :deep(.el-radio),
  .top-options :deep(.el-radio) {
    min-width: 82px;
    height: 34px;
    padding: 0 9px;
  }

  .blog-editor {
    min-height: 420px;
  }

  .editor-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 7px;
  }
}
</style>
