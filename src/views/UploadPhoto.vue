<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>分类查看</h1>
      </div>
    </div>
  </div>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-form>
        <el-form-item label="图片名称">
          <el-input v-model="imgName"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
              class="avatar-uploader"
              action="https://www.peteralbus.com:8089/photo/upload/"
              ref="upload"
              list-type="picture-card"
              :data="upData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-button v-on:click="submitUpload">上传</el-button>
      </el-form>
    </el-col>
  </el-row>

</template>

<script>
export default {
  name: "UploadPhoto",
  data() {
    return {
      imgName:'',
      imageUrl: ''
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return true;
    }
  },
  computed:{
    upData:function () {
      let data={imgName:this.imgName}
      return data
    }
  }
}
</script>

<style scoped>
.banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: url("../assets/background.jpg") no-repeat fixed center center;
  text-align: center;
  color: #fff !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  margin-top: 13vh;
  line-height: 1.5;
  color: #eee;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>