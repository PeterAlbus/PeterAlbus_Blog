<template>
  <div class="module">
    <h2 class="title">
      <el-icon style="vertical-align: -10%">
        <comment />
      </el-icon>
      评论
    </h2>
    <div class="content paragraph">
      <div class="comment-composer">
        <el-input
          v-model="newComment.commentContent"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请友善交流，文明用语"
        />
        <div class="comment-actions">
          <el-checkbox v-model="hideMyself" label="1" size="small">匿名</el-checkbox>
          <el-button
            class="comment-submit" size="small" @click="addComment"
            type="primary" color="#63a35c">发布
          </el-button>
        </div>
      </div>
      <el-scrollbar max-height="20vh" ref="scrollbarRef">
        <div v-for="item in currentPageComments" :key="item.commentId" class="main-comment">
          <div class="comment-user">
            <el-avatar :src="item.userAvatar" :size="30"></el-avatar>
            <span style="padding: 0 10px 0 10px;display: flex;align-items: center">{{ item.userUsername }}</span>
            <el-tag :type="identityType(item.userIdentity)" effect="dark" size="small">
              {{ userIdentity(item.userIdentity) }}
            </el-tag>
          </div>
          <div style="padding: 10px 10px 10px 40px" class="comment-box">
            <div style="width: 100%">{{ item.commentContent }}</div>
          </div>
          <div class="comment-buttons">
            <div class="comment-button">{{ item.gmtCreate }}</div>
            <div class="comment-button">{{ item.index + 1 }}楼</div>
            <div class="comment-button" @click="openComment(item,item)">
              <el-icon style="vertical-align: -15%">
                <chat-line-square />
              </el-icon>
              回复
            </div>
            <div class="comment-button" @click="deleteComment(item)"
                 v-if="userStore.userIdentity<=1||userStore.userId===item.commentUserId">
              <el-icon style="vertical-align: -15%">
                <delete />
              </el-icon>
              删除
            </div>
          </div>
          <el-scrollbar max-height="130px">
            <div class="side-comment" v-if="item.hasComment">
              <div v-for="i in item.comments" :key="i.commentId" class="comment-box">
                <div style="width: 100%"><span style="font-weight: bold;color: #56AD93">{{ i.userUsername }}</span>
                  {{ i.commentContent }}
                </div>
                <div class="comment-buttons">
                  <div class="comment-button" @click="openComment(i,item)">
                    <el-icon style="vertical-align: -15%">
                      <chat-line-square />
                    </el-icon>
                    回复
                  </div>
                  <div class="comment-button" @click="deleteComment(i)"
                       v-if="userStore.userIdentity<=1||userStore.userId===i.commentUserId">
                    <el-icon style="vertical-align: -15%">
                      <delete />
                    </el-icon>
                    删除
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <el-divider></el-divider>
        </div>
        <div style="display: flex;justify-content: center">
          <el-pagination layout="prev, pager, next"
                         small hide-on-single-page
                         v-model:current-page="currentPage"
                         :page-size="3"
                         @current-change="toTop"
                         :total="comments.length">
          </el-pagination>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div class="float-comment" :class="{'hide-float-comment':!showFloatComment}">
    <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
      <span>回复:{{ commentUsername }}</span>
      <el-icon style="vertical-align: -10%" class="comment-button" @click="showFloatComment=false">
        <close />
      </el-icon>
    </div>
    <el-input
      v-model="newCommentToComment.commentContent"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="请友善交流，文明用语"
    />
    <div class="comment-actions">
      <el-checkbox v-model="hideMyself" label="1" size="small">匿名</el-checkbox>
      <el-button
        class="comment-secondary" size="small" @click="showFloatComment=false"
        plain color="#63a35c">关闭
      </el-button>
      <el-button
        class="comment-submit" size="small" @click="addCommentToComment"
        type="primary" color="#63a35c">发布
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { Comment, ChatLineSquare, Close, Delete } from "@element-plus/icons-vue";
import qs from "qs";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElScrollbar } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {
  deleteExistComment,
  fetchChildCommentByCommentId,
  fetchCommentByBlogId,
  postComment
} from "@/services/commentApi";
import { fetchUserById } from "@/services/userApi";

const router = useRouter();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

const toTop = () => {
  scrollbarRef.value?.setScrollTop(0);
};

const userStore = useUserStore();
const route = useRoute();
const showFloatComment = ref(false);
const hideMyself = ref(false);
const commentUsername = ref("");
const currentPage = ref(1);

const props = defineProps({
  blogId: {
    type: String,
    default: ""
  }
});

const comments = ref([
  {
    index: 0,
    commentId: "1",
    commentTarget: 1,
    commentTargetId: "1505910717547618306",
    commentUserId: "-1",
    userUsername: "匿名",
    userAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    userIdentity: -1,
    commentContent: "数据加载中",
    gmtCreate: "",
    gmtModified: "",
    hasComment: false,
    comments: [{
      commentUserId: "-1",
      commentId: "2",
      commentContent: "",
      userUsername: "匿名",
      userAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userIdentity: -1,
      gmtCreate: ""
    }]
  }
]);

interface CommentObject {
  commentTarget: number;
  commentTargetId: any;
  commentUserId: string;
  commentContent: string;
}

const newComment = reactive<CommentObject>({
  commentTarget: 1,
  commentTargetId: route.query.id,
  commentUserId: "-1",
  commentContent: ""
});

const newCommentToComment = reactive({
  commentTarget: 2,
  commentTargetId: "",
  commentUserId: "-1",
  commentContent: ""
});

const openComment = (comment: any, bigComment: any) => {
  commentUsername.value = comment.userUsername;
  newCommentToComment.commentTargetId = bigComment.commentId;
  showFloatComment.value = true;
};

const getComments = () => {
  if (!props.blogId) return;
  fetchCommentByBlogId(props.blogId)
    .then((res) => {
      comments.value = res.data;
      let count = 0;
      for (const comment of comments.value) {
        comment.index = count;
        count++;
        if (comment.commentUserId !== "-1") {
          fetchUserById(comment.commentUserId).then((result) => {
            comment.userUsername = result.data.userUsername;
            comment.userAvatar = result.data.userAvatar;
            comment.userIdentity = result.data.userIdentity;
          });
        } else {
          comment.userUsername = "匿名";
          comment.userAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
        }
        fetchChildCommentByCommentId(comment.commentId).then((result) => {
          comment.comments = result.data;
          comment.hasComment = comment.comments.length !== 0;
          for (const item of comment.comments) {
            if (item.commentUserId !== "-1") {
              fetchUserById(item.commentUserId).then((result) => {
                item.userUsername = result.data.userUsername;
                item.userAvatar = result.data.userAvatar;
                item.userIdentity = result.data.userIdentity;
              });
            } else {
              item.userUsername = "匿名";
              item.userAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
            }
          }
        });
      }
      comments.value.reverse();
    });
};

const addComment = () => {
  newComment.commentTarget = 1;
  newComment.commentTargetId = props.blogId;
  newComment.commentUserId = userStore.userId;
  if (hideMyself.value) {
    newComment.commentUserId = "-1";
  }
  postComment(newComment).then(() => {
    ElMessage.success("发布成功!");
    newComment.commentContent = "";
    getComments();
  }).catch((err) => {
    if (err == "没有此操作的权限（未登录）") {
      ElMessageBox.confirm(
        "没有登录账号无法进行评论",
        "信息",
        {
          confirmButtonText: "前往注册/登录",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(() => {
        router.push("/login");
      });
    }
  });
};

const addCommentToComment = () => {
  newCommentToComment.commentTarget = 2;
  newCommentToComment.commentUserId = userStore.userId;
  newCommentToComment.commentContent = "回复 @" + commentUsername.value + ": " + newCommentToComment.commentContent;
  if (hideMyself.value) {
    newCommentToComment.commentUserId = "-1";
  }
  postComment(newCommentToComment).then(() => {
    ElMessage.success("发布成功!");
    newCommentToComment.commentContent = "";
    getComments();
  }).catch((err) => {
    if (err == "没有此操作的权限（未登录）") {
      ElMessageBox.confirm(
        "没有登录账号无法进行评论",
        "信息",
        {
          confirmButtonText: "前往注册/登录",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(() => {
        router.push("/login");
      });
    }
  });
};

const deleteComment = (comment: any) => {
  ElMessageBox.confirm(
    "确认要删除本条评论吗？删除后无法恢复！",
    "警告",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      deleteExistComment(comment).then(()=>{
        ElMessage.success("删除成功");
        getComments();
      });
    });
};

const identityType = (userIdentity: any) => {
  if (userIdentity == 0) {
    return "warning";
  } else if (userIdentity == 1) {
    return "success";
  } else if (userIdentity == 5) {
    return "";
  } else {
    return "info";
  }
};

const userIdentity = (userIdentity: any) => {
  if (userIdentity == 0) {
    return "站长";
  } else if (userIdentity == 1) {
    return "管理员";
  } else if (userIdentity == 5) {
    return "普通用户";
  } else {
    return "游客";
  }
};

const currentPageComments = computed(
  function() {
    return comments.value.slice((currentPage.value - 1) * 3, currentPage.value * 3);
  }
);

watch(() => props.blogId,
  () => {
    getComments();
  });

onMounted(() => {
  getComments();
});
</script>

<style scoped>
.comment-composer {
  display: flex;
  padding: 3px;
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
}

.comment-actions {
  display: flex;
  width: 100%;
  min-height: 32px;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
}

.comment-actions :deep(.el-button) {
  min-width: 62px;
  min-height: 32px;
  height: 32px;
  margin: 0;
  padding: 0 15px;
  border-radius: 9px;
  font-size: 13px;
  line-height: 1;
}

.comment-actions :deep(.el-checkbox) {
  height: 32px;
  margin-right: 1px;
}

.comment-submit {
  box-shadow: 0 4px 12px rgba(71, 125, 75, 0.18) !important;
}

.main-comment {
  background: #ffffff;
  margin: 8px 2px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: left;
}

.side-comment {
  background: var(--color-primary-50);
  margin: 8px 4px 6px 34px;
  padding: 12px;
  text-align: left;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.comment-user {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 2px;
}

.comment-box {
  display: flex;
  justify-content: center;
  align-items: end;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex-direction: column;
}

.comment-buttons {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 5px 2px 0;
  flex-wrap: wrap;
}

.comment-button {
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 6px;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.comment-button:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.float-comment {
  background: rgba(255, 255, 255, 0.97);
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: end;
  flex-direction: column;
  position: fixed;
  right: 10px;
  top: 40vh;
  z-index: 101;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(16px);
  width: min(340px, calc(100vw - 24px));
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.hide-float-comment {
  transform: translateX(calc(100% + 24px));
  opacity: 0;
  pointer-events: none;
}

:deep(.el-divider--horizontal) {
  margin: 12px 0 4px;
  border-color: var(--color-border);
}

:deep(.el-scrollbar__bar) {
  opacity: 0.5;
}

@media (max-width: 767px) {
  .main-comment {
    padding: 8px;
  }

  .side-comment {
    margin-left: 18px;
  }

  .float-comment {
    right: 12px;
    top: auto;
    bottom: 78px;
  }
}
</style>
