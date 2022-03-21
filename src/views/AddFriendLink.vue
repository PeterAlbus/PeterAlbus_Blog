<template xmlns="http://www.w3.org/1999/html">
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>添加友情链接</h1>
      </div>
    </div>
  </div>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div style="width: 90%">
          <el-form>
            <el-form-item label="友情链接名称">
              <el-input v-model="friendLink.linkName"></el-input>
            </el-form-item>
            <el-form-item label="友情链接地址">
              <el-input v-model="friendLink.linkSrc"></el-input>
            </el-form-item>
            <el-button v-on:click="submitLink" type="success" round>添加</el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <div class="module">
          <div class="content">
            <el-avatar :size="50" src="/assets/2.png"></el-avatar>
            <h4>PeterAlbus</h4>
            <p>若有侵权，深表歉意。可联系删除</p>
            <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
              <a href="mailto:wuhongdb@163.com">
                <i class="fa fa-fw fa-envelope" style="font-size:20px"></i>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="github" placement="top">
              <a href="https://github.com/PeterAlbus" target="_blank">
                <i class="fa fa-fw fa-github" style="font-size:20px"></i>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
              <a href="https://space.bilibili.com/2003822" target="_blank">
                <i class="iconfont icon-bilibili-line" style="font-size:20px"></i>
              </a>
            </el-tooltip>
          </div>
        </div>
        <div class="module">
          <h2 class="title">友情链接</h2>
          <div class="content">
            <p v-for="item in friendLinkList"><a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a></p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "addFriendLink",
  data(){
    return {
        friendLink:{
        linkName:'',
        linkUrl:'#'
      },
      friendLinkList:[
        {
          linkId:1,
          linkName:'loading',
          linkUrl:'#'
        }
      ]
    }
  },
  created() {
    this.getFriendLinkList()
  },
  methods:{
    getFriendLinkList: function (){
      let that=this
      that.$axios.get('friendLink/getFriendLinkList')
          .then(res=>{
            that.friendLinkList=res.data;
          })
    },
    submitLink: function (){
      let that=this
      that.$axios.post('friendLink/addFriendLink',that.$qs.stringify(this.friendLink))
          .then(res=>{
            if(res.data!=='fail')
            {
              that.getFriendLinkList()
              that.$message.success('添加成功')
            }
          })
          .catch(err=>{
            that.$message.error('添加失败')
          })
    }
  },
  computed:{
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
  background: url("../assets/background.jpg") fixed center center;
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

.title {
  position: relative;
  margin: 0;
  padding: 6px 20px;
  height: 20px;
  border-bottom: 1px solid #eaeaea;
  border-radius: 5px 5px 0 0;
  background-color: #f7f7f7;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: left;

}

.content {
  position: relative;
  margin-bottom: 1px;
  padding: 6px 20px;
  background-color: #fff;
  border-radius: 0 0 5px 5px;
}
.module{
  position: relative;
  margin: 0 auto;
  width: 90%;
  padding: 8px;
}

.photo
{
  padding: 5px;
  background-color: white;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
