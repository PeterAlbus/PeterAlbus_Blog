<template>
  <div class="module comment-module">
    <h2 class="title comment-title">
      <el-icon><comment /></el-icon>
      评论
      <span>{{ totalCommentCount }} 条讨论</span>
    </h2>

    <div :class="['content', 'comment-content', { 'composer-expanded': isMainComposerExpanded }]">
      <section
        v-click-outside="collapseMainComposer"
        :class="['comment-composer', { 'is-expanded': isMainComposerExpanded }]"
        aria-label="发布评论"
      >
        <el-avatar
          class="composer-avatar"
          :size="36"
          :src="userStore.userAvatar"
        />
        <div class="composer-body">
          <el-input
            ref="mainInputRef"
            v-model="mainDraft"
            class="comment-textarea"
            :autosize="{ minRows: isMainComposerExpanded ? 3 : 1, maxRows: 7 }"
            type="textarea"
            placeholder="写下你的想法，友善交流……"
            @focus="expandMainComposer"
            @click="expandMainComposer"
            @keydown.meta.enter.prevent="publishMainComment"
            @keydown.ctrl.enter.prevent="publishMainComment"
          />
          <transition name="composer-actions">
            <div v-if="isMainComposerExpanded" class="composer-footer">
              <el-checkbox v-model="mainAnonymous">匿名发布</el-checkbox>
              <el-button
                class="primary-action"
                color="#477d4b"
                :loading="isPublishingMain"
                @click="publishMainComment"
              >
                发布评论
              </el-button>
            </div>
          </transition>
        </div>
      </section>

      <div class="comment-list" aria-live="polite">
        <div v-if="isLoading" class="comment-loading">
          <div v-for="index in 2" :key="index" class="loading-row">
            <span class="loading-avatar" />
            <span class="loading-lines" />
          </div>
        </div>

        <div v-else-if="comments.length === 0" class="comment-empty">
          <el-icon><chat-line-square /></el-icon>
          <strong>还没有评论</strong>
          <span>来留下第一条友善的讨论吧</span>
        </div>

        <template v-else>
          <article
            v-for="item in currentPageComments"
            :key="item.commentId"
            class="comment-thread"
          >
            <div class="comment-layout">
              <el-avatar :size="36" :src="item.userAvatar" />

              <div class="comment-main">
                <header class="comment-author">
                  <strong>{{ item.userUsername }}</strong>
                  <span :class="['identity-badge', identityClass(item.userIdentity)]">
                    {{ identityLabel(item.userIdentity) }}
                  </span>
                </header>

                <p class="comment-message">{{ item.commentContent }}</p>

                <div class="comment-meta">
                  <time>{{ formatCommentTime(item.gmtCreate) }}</time>
                  <span>{{ item.floor }} 楼</span>
                  <button
                    type="button"
                    class="text-action"
                    @click="openReply(item, item)"
                  >
                    <el-icon><chat-line-square /></el-icon>
                    回复
                  </button>
                  <button
                    v-if="canDelete(item)"
                    type="button"
                    class="text-action danger-action"
                    @click="deleteComment(item)"
                  >
                    <el-icon><delete /></el-icon>
                    删除
                  </button>
                </div>

                <div
                  v-if="item.comments.length > 0 || activeReply?.rootId === item.commentId"
                  class="reply-thread"
                >
                  <article
                    v-for="reply in item.comments"
                    :key="reply.commentId"
                    class="reply-item"
                  >
                    <el-avatar :size="28" :src="reply.userAvatar" />
                    <div class="reply-main">
                      <header class="reply-author">
                        <strong>{{ reply.userUsername }}</strong>
                        <span :class="['identity-badge', identityClass(reply.userIdentity)]">
                          {{ identityLabel(reply.userIdentity) }}
                        </span>
                      </header>
                      <p class="reply-message">{{ reply.commentContent }}</p>
                      <div class="comment-meta reply-meta">
                        <time>{{ formatCommentTime(reply.gmtCreate) }}</time>
                        <button
                          type="button"
                          class="text-action"
                          @click="openReply(reply, item)"
                        >
                          <el-icon><chat-line-square /></el-icon>
                          回复
                        </button>
                        <button
                          v-if="canDelete(reply)"
                          type="button"
                          class="text-action danger-action"
                          @click="deleteComment(reply)"
                        >
                          <el-icon><delete /></el-icon>
                          删除
                        </button>
                      </div>
                    </div>
                  </article>

                  <transition name="inline-editor">
                    <div
                      v-if="activeReply?.rootId === item.commentId"
                      v-click-outside="closeReply"
                      ref="replyEditorRef"
                      class="inline-reply"
                    >
                      <div class="inline-reply-heading">
                        回复 <strong>@{{ activeReply.username }}</strong>
                      </div>
                      <el-input
                        ref="replyInputRef"
                        v-model="replyDraft"
                        class="comment-textarea reply-textarea"
                        :autosize="{ minRows: 2, maxRows: 6 }"
                        type="textarea"
                        :placeholder="`回复 @${activeReply.username}`"
                        @keydown.esc="closeReply"
                        @keydown.meta.enter.prevent="publishReply"
                        @keydown.ctrl.enter.prevent="publishReply"
                      />
                      <div class="inline-reply-footer">
                        <el-checkbox v-model="replyAnonymous">匿名回复</el-checkbox>
                        <el-button
                          class="primary-action reply-submit"
                          color="#477d4b"
                          :loading="isPublishingReply"
                          @click="publishReply"
                        >
                          发送回复
                        </el-button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </article>

          <el-pagination
            v-if="comments.length > PAGE_SIZE"
            v-model:current-page="currentPage"
            class="comment-pagination"
            layout="prev, pager, next"
            :page-size="PAGE_SIZE"
            :total="comments.length"
            small
            @current-change="handlePageChange"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ChatLineSquare, Comment, Delete } from "@element-plus/icons-vue";
import { ClickOutside as vClickOutside, ElMessage, ElMessageBox } from "element-plus";
import type { InputInstance } from "element-plus";
import { useRouter } from "vue-router";
import {
  deleteExistComment,
  fetchChildCommentByCommentId,
  fetchCommentByBlogId,
  postComment
} from "@/services/commentApi";
import { fetchUserById } from "@/services/userApi";
import { useUserStore } from "@/stores/user";

interface CommentRecord {
  commentId: string;
  commentTarget: number;
  commentTargetId: string;
  commentUserId: string;
  commentContent: string;
  gmtCreate: string;
  gmtModified: string;
}

interface CommentView extends CommentRecord {
  userUsername: string;
  userAvatar: string;
  userIdentity: number;
  floor: number;
  comments: CommentView[];
}

interface CommentAuthor {
  userUsername: string;
  userAvatar: string;
  userIdentity: number;
}

interface ReplyTarget {
  rootId: string;
  username: string;
}

const ANONYMOUS_AVATAR = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
const PAGE_SIZE = 4;

const props = defineProps<{
  blogId: string;
}>();

const router = useRouter();
const userStore = useUserStore();
const mainInputRef = ref<InputInstance>();
const replyInputRef = ref<InputInstance[]>([]);
const replyEditorRef = ref<HTMLElement[]>([]);

const comments = ref<CommentView[]>([]);
const currentPage = ref(1);
const isLoading = ref(false);
const isPublishingMain = ref(false);
const isPublishingReply = ref(false);
const isMainComposerExpanded = ref(false);
const mainDraft = ref("");
const replyDraft = ref("");
const mainAnonymous = ref(false);
const replyAnonymous = ref(false);
const activeReply = ref<ReplyTarget | null>(null);

let latestLoadId = 0;

const totalCommentCount = computed(() => comments.value.reduce(
  (total, comment) => total + 1 + comment.comments.length,
  0
));

const currentPageComments = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return comments.value.slice(start, start + PAGE_SIZE);
});

const anonymousAuthor = (): CommentAuthor => ({
  userUsername: "匿名",
  userAvatar: ANONYMOUS_AVATAR,
  userIdentity: -1
});

const loadComments = async () => {
  if (!props.blogId) {
    comments.value = [];
    return;
  }

  const loadId = ++latestLoadId;
  const authorRequests = new Map<string, Promise<CommentAuthor>>();
  isLoading.value = true;

  const resolveAuthor = (comment: CommentRecord): Promise<CommentAuthor> => {
    if (comment.commentUserId === "-1") {
      return Promise.resolve(anonymousAuthor());
    }

    const cachedRequest = authorRequests.get(comment.commentUserId);
    if (cachedRequest) return cachedRequest;

    const request = fetchUserById(comment.commentUserId).then((response) => ({
      userUsername: response.data.userUsername,
      userAvatar: response.data.userAvatar,
      userIdentity: response.data.userIdentity
    }));
    authorRequests.set(comment.commentUserId, request);
    return request;
  };

  try {
    const response = await fetchCommentByBlogId(props.blogId);
    const rootRecords = ([...(response.data ?? [])] as CommentRecord[]).reverse();

    const hydratedComments = await Promise.all(rootRecords.map(async (record, index) => {
      const [author, replyResponse] = await Promise.all([
        resolveAuthor(record),
        fetchChildCommentByCommentId(record.commentId)
      ]);
      const replyRecords = (replyResponse.data ?? []) as CommentRecord[];
      const replies = await Promise.all(replyRecords.map(async (reply) => ({
        ...reply,
        ...await resolveAuthor(reply),
        floor: 0,
        comments: []
      })));

      return {
        ...record,
        ...author,
        floor: rootRecords.length - index,
        comments: replies
      };
    }));

    if (loadId !== latestLoadId) return;

    comments.value = hydratedComments;
    const lastPage = Math.max(1, Math.ceil(comments.value.length / PAGE_SIZE));
    currentPage.value = Math.min(currentPage.value, lastPage);
  } finally {
    if (loadId === latestLoadId) isLoading.value = false;
  }
};

const showLoginPrompt = (error: unknown) => {
  if (error !== "没有此操作的权限（未登录）") return;

  ElMessageBox.confirm(
    "登录后才可以参与评论，是否现在前往登录？",
    "需要登录",
    {
      confirmButtonText: "前往登录",
      cancelButtonText: "暂不登录",
      type: "info"
    }
  ).then(() => router.push("/login")).catch(() => undefined);
};

const expandMainComposer = () => {
  isMainComposerExpanded.value = true;
};

const collapseMainComposer = () => {
  if (isPublishingMain.value) return;
  isMainComposerExpanded.value = false;
  mainInputRef.value?.blur();
};

const publishMainComment = async () => {
  const content = mainDraft.value.trim();
  if (!content) {
    ElMessage.warning("请先输入评论内容");
    return;
  }
  if (isPublishingMain.value) return;

  isPublishingMain.value = true;
  try {
    await postComment({
      commentTarget: 1,
      commentTargetId: props.blogId,
      commentUserId: mainAnonymous.value ? "-1" : userStore.userId,
      commentContent: content
    });
    mainDraft.value = "";
    isMainComposerExpanded.value = false;
    currentPage.value = 1;
    await loadComments();
    ElMessage.success("评论发布成功");
  } catch (error) {
    showLoginPrompt(error);
  } finally {
    isPublishingMain.value = false;
  }
};

const openReply = (comment: CommentView, rootComment: CommentView) => {
  activeReply.value = {
    rootId: rootComment.commentId,
    username: comment.userUsername
  };
  nextTick(() => {
    replyInputRef.value[0]?.focus();
    replyEditorRef.value[0]?.scrollIntoView({ block: "nearest" });
  });
};

const closeReply = () => {
  if (isPublishingReply.value) return;
  activeReply.value = null;
  replyDraft.value = "";
  replyAnonymous.value = false;
};

const publishReply = async () => {
  const content = replyDraft.value.trim();
  if (!content) {
    ElMessage.warning("请先输入回复内容");
    return;
  }
  if (!activeReply.value || isPublishingReply.value) return;

  isPublishingReply.value = true;
  try {
    await postComment({
      commentTarget: 2,
      commentTargetId: activeReply.value.rootId,
      commentUserId: replyAnonymous.value ? "-1" : userStore.userId,
      commentContent: `回复 @${activeReply.value.username}: ${content}`
    });
    closeReply();
    await loadComments();
    ElMessage.success("回复发布成功");
  } catch (error) {
    showLoginPrompt(error);
  } finally {
    isPublishingReply.value = false;
  }
};

const canDelete = (comment: CommentView) => (
  userStore.userIdentity === 0
  || userStore.userIdentity === 1
  || (Boolean(userStore.userId) && userStore.userId === comment.commentUserId)
);

const deleteComment = async (comment: CommentView) => {
  try {
    await ElMessageBox.confirm(
      "删除后无法恢复，确认删除这条评论吗？",
      "删除评论",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await deleteExistComment(comment);
    if (activeReply.value?.rootId === comment.commentId) closeReply();
    await loadComments();
    ElMessage.success("评论已删除");
  } catch (error) {
    if (error === "cancel" || error === "close") return;
  }
};

const identityLabel = (identity: number) => {
  if (identity === 0) return "站长";
  if (identity === 1) return "管理员";
  if (identity === 5) return "用户";
  return "游客";
};

const identityClass = (identity: number) => {
  if (identity === 0) return "identity-owner";
  if (identity === 1) return "identity-admin";
  if (identity === 5) return "identity-user";
  return "identity-guest";
};

const formatCommentTime = (value: string) => {
  if (!value) return "刚刚";
  return value.slice(0, 16).replace("T", " ");
};

const handlePageChange = () => {
  activeReply.value = null;
  replyDraft.value = "";
};

watch(() => props.blogId, loadComments, { immediate: true });
</script>

<style scoped>
.comment-content {
  padding: 0;
  text-align: left;
}

.comment-title span {
  color: var(--color-text-secondary);
}

.comment-composer {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 11px;
  padding: 13px 16px;
  align-items: start;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--color-border);
  transition: padding var(--transition-normal), background-color var(--transition-normal);
}

.comment-composer.is-expanded {
  padding-top: 17px;
  padding-bottom: 16px;
  background: linear-gradient(145deg, rgba(243, 247, 241, 0.9), rgba(255, 255, 255, 0.96));
}

.composer-avatar {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9), 0 4px 12px rgba(30, 54, 36, 0.1);
}

.composer-body,
.comment-main,
.reply-main {
  min-width: 0;
}

.comment-textarea :deep(.el-textarea__inner) {
  padding: 10px 12px;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.92);
  border: 0;
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
  font-size: 13px;
  line-height: 1.65;
  resize: none;
  transition: height var(--transition-normal), min-height var(--transition-normal), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.comment-composer:not(.is-expanded) .comment-textarea :deep(.el-textarea__inner) {
  min-height: 38px !important;
  padding: 8px 11px;
  overflow: hidden;
}

.comment-composer.is-expanded .comment-textarea :deep(.el-textarea__inner) {
  min-height: 82px !important;
}

.comment-textarea :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--color-border-strong) inset;
}

.comment-textarea :deep(.el-textarea__inner:focus) {
  background: #fff;
  box-shadow: 0 0 0 1px var(--color-primary-500) inset, 0 0 0 3px rgba(99, 163, 92, 0.1);
}

.composer-footer,
.inline-reply-footer {
  display: flex;
  min-height: 32px;
  margin-top: 9px;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
}

.composer-actions-enter-active,
.composer-actions-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.composer-actions-enter-from,
.composer-actions-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.composer-footer :deep(.el-checkbox),
.inline-reply-footer :deep(.el-checkbox) {
  height: 32px;
  margin-right: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.primary-action {
  min-width: 84px;
  height: 32px;
  margin: 0 !important;
  padding: 0 14px;
  border-radius: 9px;
  box-shadow: 0 5px 14px rgba(71, 125, 75, 0.18);
  font-size: 12px;
}

.comment-list {
  max-height: 32vh;
  padding: 0 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: rgba(71, 125, 75, 0.28) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  transition: max-height var(--transition-normal);
}

.comment-content.composer-expanded .comment-list {
  max-height: 22vh;
}

.comment-list::-webkit-scrollbar {
  width: 5px;
}

.comment-list::-webkit-scrollbar-thumb {
  background: rgba(71, 125, 75, 0.25);
  border-radius: 99px;
}

.comment-thread {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
}

.comment-thread:last-of-type {
  border-bottom: 0;
}

.comment-layout {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 11px;
}

.comment-author,
.reply-author {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
  line-height: 1.4;
}

.comment-author strong,
.reply-author strong {
  overflow: hidden;
  color: var(--color-heading);
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identity-badge {
  display: inline-flex;
  height: 18px;
  padding: 0 6px;
  flex: 0 0 auto;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 99px;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
}

.identity-owner {
  color: #85601f;
  background: #fff7df;
  border-color: rgba(188, 137, 45, 0.2);
}

.identity-admin {
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border-color: var(--color-border);
}

.identity-user {
  color: #596b62;
  background: #f4f6f4;
  border-color: rgba(62, 76, 68, 0.1);
}

.identity-guest {
  color: #777f7b;
  background: #f1f2f1;
  border-color: rgba(62, 76, 68, 0.08);
}

.comment-message,
.reply-message {
  margin: 7px 0 8px;
  color: var(--color-text);
  font-size: 13px;
  line-height: 1.75;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.comment-meta {
  display: flex;
  min-height: 24px;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 9px;
  color: var(--color-text-muted);
  font-size: 10px;
  line-height: 1.4;
}

.comment-meta time {
  margin-right: auto;
}

.text-action {
  display: inline-flex;
  padding: 3px 4px;
  align-items: center;
  gap: 3px;
  color: var(--color-text-secondary);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.text-action:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.danger-action:hover {
  color: #b4574f;
  background: #fff3f2;
}

.reply-thread {
  margin-top: 12px;
  padding: 3px 10px 3px 12px;
  background: rgba(243, 247, 241, 0.72);
  border-left: 2px solid rgba(99, 163, 92, 0.32);
  border-radius: 0 11px 11px 0;
}

.reply-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 9px;
  padding: 10px 0;
}

.reply-item + .reply-item {
  border-top: 1px solid rgba(50, 97, 57, 0.09);
}

.reply-author strong {
  font-size: 12px;
}

.reply-message {
  margin: 4px 0 5px;
  font-size: 12px;
  line-height: 1.7;
}

.reply-meta {
  min-height: 20px;
}

.inline-reply {
  margin: 7px 0 8px;
  padding: 11px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 7px 20px rgba(30, 54, 36, 0.06);
}

.inline-reply-heading {
  margin-bottom: 7px;
  color: var(--color-text-secondary);
  font-size: 11px;
}

.inline-reply-heading strong {
  color: var(--color-primary-600);
}

.inline-editor-enter-active,
.inline-editor-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.inline-editor-enter-from,
.inline-editor-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.reply-submit {
  min-width: 76px;
}

.comment-empty {
  display: flex;
  min-height: 176px;
  padding: 28px 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--color-text-muted);
}

.comment-empty .el-icon {
  margin-bottom: 9px;
  color: var(--color-primary-400);
  font-size: 28px;
}

.comment-empty strong {
  margin-bottom: 2px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.comment-empty span {
  font-size: 11px;
}

.comment-loading {
  padding: 5px 0;
}

.loading-row {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 11px;
  padding: 18px 0;
}

.loading-row + .loading-row {
  border-top: 1px solid var(--color-border);
}

.loading-avatar,
.loading-lines {
  border-radius: 99px;
  background: linear-gradient(90deg, #f0f3ef 25%, #f8faf7 50%, #f0f3ef 75%);
  background-size: 200% 100%;
  animation: comment-loading 1.4s ease infinite;
}

.loading-avatar {
  width: 36px;
  height: 36px;
}

.loading-lines {
  width: 100%;
  height: 54px;
  border-radius: 8px;
}

.comment-pagination {
  justify-content: center;
  padding: 13px 0 16px;
  border-top: 1px solid var(--color-border);
}

.comment-pagination :deep(.el-pager li.is-active) {
  color: #fff;
  background: var(--color-primary-600);
}

@keyframes comment-loading {
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
}

@media (max-width: 767px) {
  .comment-list {
    max-height: 56vh;
  }

  .comment-content.composer-expanded .comment-list {
    max-height: 44vh;
  }

  .comment-composer,
  .comment-list {
    padding-right: 13px;
    padding-left: 13px;
  }

  .comment-composer,
  .comment-layout {
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 9px;
  }

  .composer-avatar,
  .comment-layout > .el-avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .composer-footer,
  .inline-reply-footer {
    gap: 7px;
  }

  .primary-action {
    min-width: 76px;
    padding: 0 11px;
  }

  .reply-thread {
    margin-left: -4px;
    padding-right: 8px;
    padding-left: 9px;
  }
}
</style>
