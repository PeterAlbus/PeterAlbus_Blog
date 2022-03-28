<template>
  <div class="module">
    <h2 class="title"><el-icon style="vertical-align: -10%"><comment /></el-icon> 评论</h2>
    <div class="content paragraph">
      <div style="padding: 3px;display: flex;justify-content: center;align-items: end;flex-direction: column">
        <el-input
            v-model="newComment.commentContent"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请友善交流，文明用语"
        />
        <div>
          <el-checkbox v-model="hideMyself" label="1" size="small">匿名</el-checkbox>
          <el-button
              size="small" @click="addComment"
              style="position: relative;float: right;margin: 3px"
              type="primary" color="#63a35c">发布</el-button>
        </div>
      </div>
      <el-scrollbar max-height="20vh">
        <div v-for="item in comments" class="main-comment">
          <div class="comment-user">
            <el-avatar :src="item.userAvatar" :size="30"></el-avatar>
            <span style="padding: 0 10px 0 10px;display: flex;align-items: center">{{item.userUsername}}<el-tag :type="identityType(item.userIdentity)" effect="dark" size="small">{{ userIdentity(item.userIdentity) }}</el-tag></span>
          </div>
          <div style="padding: 10px 10px 10px 40px" class="comment-box">
            <div style="width: 100%">{{item.commentContent}}</div>
          </div>
          <div class="comment-buttons">
            <el-icon class="comment-button" @click="openComment(item,item)"><chat-line-square /></el-icon>
          </div>
          <div class="side-comment" v-if="item.hasComment">
            <div v-for="i in item.comments" class="comment-box">
              <div style="width: 100%"><span style="font-weight: bold;color: #56AD93">{{ i.userUsername }}</span> {{i.commentContent}}</div>
              <div class="comment-buttons">
                <el-icon class="comment-button" @click="openComment(i,item)"><chat-line-square /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div class="float-comment" :class="{'hide-float-comment':!showFloatComment}">
    <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
      <span>回复:{{commentUsername}}</span>
      <el-icon style="vertical-align: -10%" class="comment-button" @click="showFloatComment=false"><close /></el-icon>
    </div>
    <el-input
        v-model="newCommentToComment.commentContent"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="请友善交流，文明用语"
    />
    <div>
      <el-checkbox v-model="hideMyself" label="1" size="small">匿名</el-checkbox>
      <el-button
          size="small" @click="showFloatComment=false"
          style="position: relative;float: right;margin: 3px"
          plain color="#63a35c">关闭</el-button>
      <el-button
          size="small" @click="addCommentToComment"
          style="position: relative;float: right;margin: 3px"
          type="primary" color="#63a35c">发布</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import axios from "axios";
import {Comment,ChatLineSquare,Close} from "@element-plus/icons-vue"
import qs from "qs";
import {useUserStore} from "@/store/user";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const showFloatComment = ref(false)
const hideMyself = ref(false)
const commentUsername= ref('')

const props = defineProps({
  blogId: {
    default() {
      return ''
    },
  }
});

let comments=ref([
  {
    commentId:"1",
    commentTarget:1,
    commentTargetId:"1505910717547618306",
    commentUserId:"-1",
    userUsername:"匿名",
    userAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    userIdentity:-1,
    commentContent:"数据加载中",
    gmtCreate:null,
    gmtModified:null,
    hasComment:false,
    comments:[{
      commentUserId:"-1",
      commentContent:"",
      userUsername:"匿名",
      userAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userIdentity:-1
    }]
  }
])

const newComment=reactive({
  commentTarget:1,
  commentTargetId:"",
  commentUserId:"-1",
  commentContent:"",
})

const newCommentToComment=reactive({
  commentTarget:2,
  commentTargetId:"",
  commentUserId:"-1",
  commentContent:"",
})

const openComment=(comment:any,bigComment:any)=>{
  commentUsername.value=comment.userUsername
  newCommentToComment.commentTargetId=bigComment.commentId
  showFloatComment.value=true
}

const getComments=()=>{
  axios.get("/comment/getCommentByBlogId?blogId="+props.blogId)
  .then((res)=>{
    comments.value=res.data
    for(let comment of comments.value)
    {
      if(comment.commentUserId!=='-1')
      {
        axios.get("/user/getUserById?userId="+comment.commentUserId)
            .then((result)=>{
              comment.userUsername=result.data.userUsername
              comment.userAvatar=result.data.userAvatar
              comment.userIdentity=result.data.userIdentity
            })
      }
      else
      {
        comment.userUsername="匿名";
        comment.userAvatar="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      }
      axios.get("/comment/getCommentByCommentId?commentId="+comment.commentId)
          .then((result)=>{
            comment.comments=result.data
            comment.hasComment = comment.comments.length !== 0
            for(let item of comment.comments)
            {
              if(item.commentUserId!=='-1')
              {
                axios.get("/user/getUserById?userId="+comment.commentUserId)
                    .then((result)=>{
                      item.userUsername=result.data.userUsername
                      item.userAvatar=result.data.userAvatar
                      item.userIdentity=result.data.userIdentity
                    })
              }
              else
              {
                item.userUsername="匿名";
                item.userAvatar="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
              }

            }
          })
    }
  })
}

const addComment=()=>{
  newComment.commentTarget=1
  newComment.commentTargetId=props.blogId
  newComment.commentUserId=userStore.userId
  if(hideMyself.value)
  {
    newComment.commentUserId='-1'
  }
  axios.post("/comment/addComment",qs.stringify(newComment))
  .then((res)=>{
    if(res.data=="notLogin")
    {
      ElMessage.error("没有登录不可评论！")
    }
    else if(res.data=="fail")
    {
      ElMessage.error("评论发布失败")
    }
    else
    {
      ElMessage.success("发布成功!")
      newComment.commentContent=""
      getComments()
    }
  })
}

const addCommentToComment=()=>{
  newCommentToComment.commentTarget=2
  newCommentToComment.commentUserId=userStore.userId
  newCommentToComment.commentContent='回复 @'+commentUsername.value+": "+newCommentToComment.commentContent
  if(hideMyself.value)
  {
    newCommentToComment.commentUserId='-1'
  }
  axios.post("/comment/addComment",qs.stringify(newCommentToComment))
      .then((res)=>{
        if(res.data=="notLogin")
        {
          ElMessage.error("没有登录不可评论！")
        }
        else if(res.data=="fail")
        {
          ElMessage.error("评论发布失败")
        }
        else
        {
          ElMessage.success("发布成功!")
          newCommentToComment.commentContent=""
          showFloatComment.value=false
          getComments()
        }
      })
}

const identityType = (userIdentity:any)=>{
  if(userIdentity==0)
  {
    return "warning"
  }
  else if(userIdentity==1)
  {
    return "success"
  }
  else if(userIdentity==5)
  {
    return ""
  }
  else
  {
    return "info"
  }
}

const userIdentity = (userIdentity:any)=>{
  if(userIdentity==0)
  {
    return "站长"
  }
  else if(userIdentity==1)
  {
    return "管理员"
  }
  else if(userIdentity==5)
  {
    return "普通用户"
  }
  else
  {
    return "游客"
  }
}

watch(() => props.blogId,
    () => {
      getComments()
    })

onMounted(()=>{
  getComments()
})
</script>

<style scoped>
.main-comment{
  background-color: #F7F7F7;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  text-align: left;
}

.side-comment{
  background-color: #E3E3E3;
  margin: 5px 5px 5px 40px ;
  padding: 5px;
  text-align: left;
}

.comment-user{
  display: flex;
  justify-content: left;
  align-items: center;
}

.comment-box{
  display: flex;
  justify-content: center;
  align-items: end;
  word-wrap:break-word;
  white-space:pre-wrap;
  flex-direction: column;
}

.comment-buttons{
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 5px;
}

.comment-button{
  color: black;
  cursor: pointer;
}

.comment-button:hover{
  color: #63a35c;
}

.float-comment{
  background-color: white;
  padding: 0 10px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: end;
  flex-direction: column;
  position: fixed;
  right: 10px;
  top: 40vh;
  z-index: 101;
  border-radius: 5px;
  box-shadow: 0 3px 8px 6px rgba(7,17,27,0.05);
  width: 300px;
  transition-property:opacity,transform;
  transition-duration:0.3s;
  transition-timing-function:ease;
}

.hide-float-comment{
  transform: translateX(300px);
  opacity: 0;
}
</style>
