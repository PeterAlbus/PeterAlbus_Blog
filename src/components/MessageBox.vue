<template>
  <Teleport to="body">
    <div v-if="props.modelValue" class="message-center-layer">
      <section
        class="message-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-center-title"
        v-dialogDrag="{ dragEle: '.message-header', drag: true }"
      >
        <header class="message-header">
          <div class="message-heading-icon" aria-hidden="true">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="message-heading-copy">
            <h2 id="message-center-title">消息中心</h2>
            <p>{{ mailboxDescription }} · 共 {{ messageCount }} 条</p>
          </div>
          <button class="close-button" type="button" aria-label="关闭消息中心" @click="close">
            <el-icon><Close /></el-icon>
          </button>
        </header>

        <div class="mailbox-toolbar">
          <div class="mailbox-tabs" role="tablist" aria-label="消息箱">
            <button
              type="button"
              role="tab"
              :aria-selected="showInbox"
              :class="['mailbox-tab', { 'is-active': showInbox }]"
              @click="switchMailbox(true)"
            >
              <el-icon><InboxIcon /></el-icon>
              <span>收件箱</span>
              <span v-if="inboxUnreadCount" class="unread-count">{{ inboxUnreadCount }}</span>
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="!showInbox"
              :class="['mailbox-tab', { 'is-active': !showInbox }]"
              @click="switchMailbox(false)"
            >
              <el-icon><SentIcon /></el-icon>
              <span>发件箱</span>
            </button>
          </div>
        </div>

        <div v-loading="loading" class="message-list">
          <el-empty v-if="messageList.length === 0 && !loading" description="这里暂时没有消息" />
          <article
            v-for="item in messageList"
            :key="item.messageId"
            :class="['message-item', { 'is-unread': !item.isRead }]"
          >
            <div class="message-state" aria-hidden="true" />
            <div class="message-main">
              <div class="message-title-row">
                <h3>{{ item.messageTitle }}</h3>
                <span :class="['status-tag', { 'is-read': item.isRead }]">
                  {{ item.isRead ? '已读' : '未读' }}
                </span>
              </div>
              <div class="message-content" v-html="item.messageContent" />
              <footer class="message-meta">
                <span v-if="showInbox && item.senderName" class="message-sender">
                  <el-icon><User /></el-icon>
                  {{ item.senderName }}
                </span>
                <time>{{ item.gmtCreate }}</time>
              </footer>
            </div>
            <button
              v-if="!item.isRead"
              class="read-button"
              type="button"
              @click="readMessage(item.messageId)"
            >
              设为已读
            </button>
          </article>
        </div>

        <footer class="message-pagination">
          <span class="page-summary">
            第 {{ currentPage }} 页，共 {{ Math.max(1, Math.ceil(messageCount / pageSize)) }} 页
          </span>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="messageCount"
            :page-sizes="[4, 6, 10, 20]"
            background
            layout="prev, pager, next, sizes"
          />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Bell, Message as SentIcon, MessageBox as InboxIcon, User } from "@element-plus/icons-vue";
import { fetchInBoxMessage, fetchOutBoxMessage, readMessageById } from "@/services/messageApi";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const showInbox = ref(true);
const loading = ref(false);
const inbox = ref<any[]>([]);
const outbox = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(6);

const getMessageList = async () => {
  loading.value = true;
  try {
    const [inboxResponse, outboxResponse] = await Promise.all([
      fetchInBoxMessage(),
      fetchOutBoxMessage(),
    ]);
    inbox.value = inboxResponse.data;
    outbox.value = outboxResponse.data;
  } finally {
    loading.value = false;
  }
};

const readMessage = (messageId: string) => {
  readMessageById(messageId).then(() => {
    getMessageList();
  });
};

const close = () => {
  emit("update:modelValue", false);
};

const switchMailbox = (inboxMode: boolean) => {
  if (showInbox.value === inboxMode) return;
  showInbox.value = inboxMode;
  currentPage.value = 1;
};

const activeMailbox = computed(() => showInbox.value ? inbox.value : outbox.value);

const messageList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return activeMailbox.value.slice(start, start + pageSize.value);
});

const messageCount = computed(() => activeMailbox.value.length);
const inboxUnreadCount = computed(() => inbox.value.filter((item) => !item.isRead).length);
const mailboxDescription = computed(() => showInbox.value ? "查看收到的消息" : "查看发出的消息");

watch(() => props.modelValue, (visible) => {
  if (visible) {
    currentPage.value = 1;
    getMessageList();
  }
});
</script>

<style lang="less" scoped>
.message-center-layer {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(12, 25, 16, 0.3);
  backdrop-filter: blur(5px);
  animation: layer-in 180ms ease-out;
}

.message-box {
  position: fixed;
  top: max(82px, calc((100vh - 700px) / 2));
  left: max(20px, calc((100vw - 920px) / 2));
  display: grid;
  width: min(920px, calc(100vw - 40px));
  height: calc(100vh - 112px);
  max-height: 700px;
  min-height: 460px;
  overflow: hidden;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  color: var(--color-text);
  background: rgba(250, 251, 249, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: var(--radius-xl);
  box-shadow: 0 28px 80px rgba(13, 32, 19, 0.24), 0 4px 14px rgba(13, 32, 19, 0.12);
  animation: panel-in var(--transition-normal);
}

.message-header {
  display: flex;
  min-height: 84px;
  padding: 18px 22px;
  align-items: center;
  gap: 13px;
  background:
    radial-gradient(circle at 12% -30%, rgba(130, 169, 109, 0.2), transparent 52%),
    rgba(255, 255, 255, 0.76);
  border-bottom: 1px solid var(--color-border);
  user-select: none;
}

.message-heading-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  color: #fff;
  background: linear-gradient(145deg, var(--color-primary-500), var(--color-primary-700));
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(50, 97, 57, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.24);
  place-items: center;
  font-size: 21px;
}

.message-heading-copy {
  min-width: 0;
  flex: 1;
}

.message-heading-copy h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.03em;
}

.message-heading-copy p {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.close-button,
.mailbox-tab,
.read-button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.close-button {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  color: var(--color-text-secondary);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  place-items: center;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.close-button:hover {
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border-color: var(--color-border-strong);
  transform: rotate(4deg);
}

.mailbox-toolbar {
  padding: 14px 22px 4px;
}

.mailbox-tabs {
  display: inline-grid;
  padding: 4px;
  grid-template-columns: repeat(2, minmax(126px, 1fr));
  gap: 4px;
  background: var(--color-primary-50);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.mailbox-tab {
  position: relative;
  display: flex;
  min-height: 40px;
  padding: 0 17px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-secondary);
  background: transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-normal), transform var(--transition-fast);
}

.mailbox-tab:hover:not(.is-active) {
  color: var(--color-primary-700);
  background: rgba(255, 255, 255, 0.58);
}

.mailbox-tab.is-active {
  color: var(--color-primary-700);
  background: #fff;
  box-shadow: 0 4px 12px rgba(31, 64, 39, 0.09), inset 0 0 0 1px rgba(50, 97, 57, 0.08);
}

.mailbox-tab:active {
  transform: scale(0.985);
}

.unread-count {
  display: inline-grid;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  color: #fff;
  background: #d7685d;
  border-radius: 999px;
  place-items: center;
  font-size: 10px;
  line-height: 1;
}

.message-list {
  min-height: 0;
  padding: 14px 22px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.message-list :deep(.el-loading-mask) {
  background: rgba(250, 251, 249, 0.72);
  backdrop-filter: blur(3px);
}

.message-list :deep(.el-empty) {
  height: 100%;
  min-height: 260px;
  justify-content: center;
}

.message-item {
  position: relative;
  display: grid;
  min-width: 0;
  padding: 17px 18px 15px 20px;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 3px 12px rgba(30, 54, 36, 0.045);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal), transform var(--transition-normal);
}

.message-item + .message-item {
  margin-top: 11px;
}

.message-item:hover {
  border-color: var(--color-border-strong);
  box-shadow: 0 10px 26px rgba(30, 54, 36, 0.08);
  transform: translateY(-1px);
}

.message-item.is-unread {
  background: linear-gradient(100deg, rgba(243, 247, 241, 0.96), rgba(255, 255, 255, 0.96) 42%);
  border-color: rgba(71, 125, 75, 0.24);
}

.message-state {
  position: absolute;
  top: 18px;
  left: 8px;
  width: 4px;
  height: 24px;
  background: transparent;
  border-radius: 999px;
}

.message-item.is-unread .message-state {
  background: linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700));
  box-shadow: 0 2px 7px rgba(50, 97, 57, 0.26);
}

.message-main {
  min-width: 0;
}

.message-title-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
}

.message-title-row h3 {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  flex: 0 1 auto;
  color: var(--color-heading);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  display: inline-flex;
  height: 22px;
  padding: 0 8px;
  flex: 0 0 auto;
  align-items: center;
  color: var(--color-primary-700);
  background: var(--color-primary-100);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 650;
}

.status-tag.is-read {
  color: var(--color-text-muted);
  background: #f0f2ef;
}

.message-content {
  margin-top: 9px;
  overflow-wrap: anywhere;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.75;
}

.message-content :deep(p) {
  margin: 0;
}

.message-content :deep(a) {
  color: var(--color-primary-600);
  text-decoration: underline;
  text-decoration-color: rgba(71, 125, 75, 0.3);
  text-underline-offset: 3px;
}

.message-meta {
  display: flex;
  margin-top: 11px;
  align-items: center;
  gap: 14px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.message-sender {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
}

.read-button {
  height: 32px;
  padding: 0 12px;
  align-self: start;
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.read-button:hover {
  color: #fff;
  background: var(--color-primary-600);
  box-shadow: 0 6px 15px rgba(50, 97, 57, 0.18);
  transform: translateY(-1px);
}

.message-pagination {
  display: flex;
  min-height: 66px;
  padding: 11px 22px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: rgba(255, 255, 255, 0.8);
  border-top: 1px solid var(--color-border);
}

.page-summary {
  color: var(--color-text-muted);
  font-size: 11px;
  white-space: nowrap;
}

.message-pagination :deep(.el-pagination) {
  --el-pagination-button-bg-color: var(--color-primary-50);
  --el-pagination-hover-color: var(--color-primary-600);
  --el-pagination-button-color: var(--color-text-secondary);
  justify-content: flex-end;
}

.message-pagination :deep(.el-pager li),
.message-pagination :deep(.btn-prev),
.message-pagination :deep(.btn-next) {
  border-radius: 8px !important;
}

.message-pagination :deep(.el-pager li.is-active) {
  background: var(--color-primary-600) !important;
}

@keyframes layer-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 767px) {
  .message-center-layer {
    background: rgba(12, 25, 16, 0.22);
    backdrop-filter: blur(3px);
  }

  .message-box {
    top: 12px;
    left: 12px;
    width: calc(100vw - 24px);
    height: calc(100dvh - 24px);
    min-height: 0;
    border-radius: 20px;
  }

  .message-header {
    min-height: 74px;
    padding: 14px 15px;
    cursor: default !important;
  }

  .message-heading-icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
    border-radius: 12px;
    font-size: 19px;
  }

  .message-heading-copy h2 {
    font-size: 17px;
  }

  .mailbox-toolbar {
    padding: 11px 12px 2px;
  }

  .mailbox-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mailbox-tab {
    min-width: 0;
    padding: 0 12px;
  }

  .message-list {
    padding: 11px 12px 15px;
    scrollbar-gutter: auto;
  }

  .message-item {
    padding: 15px 14px 14px 18px;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .message-state {
    left: 7px;
  }

  .message-title-row {
    align-items: flex-start;
  }

  .message-title-row h3 {
    white-space: normal;
  }

  .read-button {
    justify-self: start;
  }

  .message-pagination {
    min-height: 62px;
    padding: 9px 12px;
    justify-content: center;
  }

  .page-summary,
  .message-pagination :deep(.el-pagination__sizes) {
    display: none;
  }

  .message-pagination :deep(.el-pagination) {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .message-heading-copy p {
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .message-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .message-pagination :deep(.el-pager li:not(.is-active)) {
    display: none;
  }
}
</style>
