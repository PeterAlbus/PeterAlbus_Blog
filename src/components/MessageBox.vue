<template>
  <div
    class="message-box"
    v-if="props.modelValue"
    v-dialogDrag="{
                      dragEle: '.header',//点击拖动的那个dom的选择器
                      drag: true, //是否开启拖动
                  }"
  >
    <div class="header">
      消息中心
      <span @click="close"><el-icon><Close /></el-icon></span>
    </div>
    <div class="dialog-content">
      <div class="button-group">
        <el-button-group>
          <el-button
            type="primary" :icon="MessageBox"
            :disabled="showInbox" @click="showInbox = true">
            收件箱</el-button>
          <el-button
            type="primary" :icon="Message"
            :disabled="!showInbox" @click="showInbox = false">
            发件箱</el-button>
        </el-button-group>
      </div>
      <div class="message-list">
        <el-empty description="消息为空" v-if="messageList.length == 0" />
        <div class="message" v-for="item in messageList" :key="item">
          <div class="message-title">
            <span>
              {{item.messageTitle}}
              <el-tag v-if="item.isRead" type="success">已读</el-tag>
              <el-tag v-else type="danger">未读</el-tag>
            </span>
            <span>
              <span class="text-link" @click="readMessage(item.messageId)" v-if="!item.isRead">设为已读</span>
            </span>
          </div>
          <div class="message-content" v-html="item.messageContent"></div>
          <div class="message-footer">{{item.gmtCreate}}</div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :total="messageCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[4, 6, 10, 20]"
          background layout="prev, pager, next, sizes"  />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { fetchInBoxMessage, fetchOutBoxMessage, readMessageById } from "@/services/messageApi";
import { MessageBox, Message } from "@element-plus/icons-vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const showInbox = ref(true);

const inbox: any = ref([{
  messageId: "1704037736972881921",
  senderId: "-1",
  targetId: "1508326478803185700",
  messageContent: "<span>暂无消息</span>",
  messageTitle: "数据请求中",
  senderName: "系统",
  isRead: true,
  gmtCreate: "2023-09-19 15:40:31"
}]);

const outbox: any = ref([{
  messageId: "1704037736972881921",
  senderId: "-1",
  targetId: "1508326478803185700",
  messageContent: "<span>暂无消息</span>",
  messageTitle: "数据请求中",
  senderName: "系统",
  isRead: true,
  gmtCreate: "2023-09-19 15:40:31"
}]);

const getMessageList = () => {
  fetchInBoxMessage().then((res) => {
    inbox.value = res.data;
  });
  fetchOutBoxMessage().then((res) => {
    outbox.value = res.data;
  });
};

const readMessage = (messageId: string) => {
  readMessageById(messageId).then(() => {
    getMessageList();
  })
};

const close = () => {
  emit("update:modelValue", false);
};

const currentPage = ref(1);
const pageSize = ref(6);

const messageList = computed(() => {
  return (showInbox.value ? inbox.value : outbox.value).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const messageCount = computed(() => {
  return showInbox.value ? inbox.value.length : outbox.value.length;
});

watch(() => props.modelValue, (val) => {
  if (val) {
    getMessageList();
  }
});
</script>

<style lang="less" scoped>
.message-box {
  position: fixed;
  left: 10%;
  top: 15%;
  width: 80%;
  height: 70%;
  background-color: #fff;
  border-radius: 10px;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  .header {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #f5f5f5;
    border-radius: 10px 10px 0 0;

    span {
      float: right;
      cursor: pointer;
    }
  }

  .dialog-content {
    height: calc(100% - 40px);
    .button-group {
      height: 60px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .message-list {
      height: calc(100% - 140px);
      overflow-y: auto;
      padding: 10px;

      .message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        .message-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .text-link {
            font-size: small;
            color: gainsboro;
          }
          .text-link:hover {
            color: #42b983;
            cursor: pointer;
          }
        }
        .message-footer {
          text-align: right;
          font-size: 12px;
          color: #999;
        }
      }
    }
    .pagination {
      height: 80px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
