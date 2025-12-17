<template>
  <!-- 外层容器和按钮 -->
  <div class="ai-assistant-container">
    <button class="ai-assistant-button" ref="toggleButtonRef" @click="togglePanel">
      <svg class="ai-assistant-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </button>

    <!-- 聊天面板 -->
    <div class="ai-assistant-panel" :class="{ active: isPanelOpen }" ref="panelRef">
      <div class="ai-assistant-decoration"></div>
      <div class="ai-assistant-content">
        <!-- 聊天内容区域 -->
        <div class="chat-container">
          <div class="chat-header">
            <h1>qwen-plus AI智能助手</h1>
            <p>支持Markdown格式的AI智能助手</p>
            <div class="ai-indicator">
              <span class="status-dot"></span>
              AI在线
            </div>
          </div>

          <div ref="chatMessages" class="chat-messages">
            <!-- 消息列表 -->
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="['message', msg.type === 'user' ? 'user-message' : 'ai-message']"
            >
              <div v-if="msg.type !== 'user'" class="ai-identity">
                <i class="fas fa-robot ai-icon"></i>
                <span>智能助手</span>
              </div>
              <div
                  class="message-content"
                  v-html="msg.content"
              />
            </div>

            <!-- AI正在输入指示器 -->
            <div v-if="isAiTyping" class="ai-typing">
              <div class="ai-identity">
                <i class="fas fa-robot ai-icon"></i>
                <span>正在输入...</span>
              </div>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div class="system-info">
            <i class="fas fa-info-circle"></i> 谨慎辨别Ai回答内容！
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-container">
            <div class="input-group">
              <textarea
                  id="message-input"
                  :disabled="!userInfo"
                  ref="messageInput"
                  v-model="inputText"
                  :placeholder="userInfo ? '输入您的问题... (支持多行输入，Shift+Enter换行)'  : '请先登录！'"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.shift.enter="handleShiftEnter"
              ></textarea>
              <button :disabled="!userInfo" id="send-button" @click="sendMessage">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="x-ai-chat">
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ref, reactive, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';

// 响应式状态
const isPanelOpen = ref(false);
const messages = ref([]);
const inputText = ref('');
const isAiTyping = ref(false);
const chatMessages = ref(null);
const messageInput = ref(null);
const toggleButtonRef = ref(null);
const panelRef = ref(null);

const userInfo = ref({})

// 处理外部点击
const handleClickOutside = (event) => {
  const isButton = toggleButtonRef.value?.contains(event.target);
  const isPanel = panelRef.value?.contains(event.target);

  if (!isButton && !isPanel && isPanelOpen.value) {
    isPanelOpen.value = false;
  }
};

// 设置全局点击监听
const setGlobalClickListener = () => {
  document.addEventListener('click', handleClickOutside);
};

// 移除全局点击监听
const removeGlobalClickListener = () => {
  document.removeEventListener('click', handleClickOutside);
};

// 打开/关闭面板
const togglePanel = () => {
  userInfo.value = Cache.getUser()
  isPanelOpen.value = !isPanelOpen.value;

  if (isPanelOpen.value && messages.value.length === 0) {
    fetchChatMessages();
  }
};

// 获取历史消息
const fetchChatMessages = async () => {
  try {
    const respData = await Http.post("/messages");
    console.log(respData)
    let history = respData.data;
    if (history.length === 0) {
      messages.value.push({
        type: 'assistant',
        content: '你好，我是AI小助手呀，请随时提问！'
      });
      return;
    }

    history.forEach(msg => {
      if(msg && msg.msg && msg.type){
        const type = msg.type === 'user' ? 'user' : 'assistant';
        const content = type === 'assistant'
            ? DOMPurify.sanitize(marked.parse(msg.msg))
            : DOMPurify.sanitize(msg.msg);
        messages.value.push({ type, content });
      }
    });
    scrollToBottom()
  } catch (error) {
    console.error('获取历史消息失败:', error);
    messages.value.push({
      type: 'assistant',
      content: '你好，我是AI小助手呀，请随时提问！'
    });
  }
};

// 发送消息
const sendMessage = async () => {
  const message = inputText.value.trim();
  if (!message) return;

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: DOMPurify.sanitize(message)
  });

  // 清空输入框并滚动到底部
  inputText.value = '';
  scrollToBottom();

  // 请求AI响应
  isAiTyping.value = true;
  try {
    const token = Cache.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token', `${token}`);
    const response = await fetch(`/api/chat?message=${encodeURIComponent(message)}`,{method:"POST",headers});
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // 添加AI消息容器
    const aiMessage = reactive({
      type: 'assistant',
      content: ''
    });
    messages.value.push(aiMessage);
    isAiTyping.value = false;

    // 处理流式响应
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 更新AI消息内容
      const chunk = decoder.decode(value, { stream: true });
      console.log(chunk)
      aiMessage.content += chunk;
      // 滚动到底部
      await nextTick();
      scrollToBottom();
    }
    aiMessage.content = DOMPurify.sanitize(marked.parse(aiMessage.content));
    scrollToBottom();
  } catch (error) {
    console.error('请求出错:', error);
    messages.value.push({
      type: 'assistant',
      content: '<p style="color: red">抱歉，处理您的请求时出错了</p>'
    });
  } finally {
    isAiTyping.value = false;
    scrollToBottom();
  }
};

// 辅助功能
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

const handleShiftEnter = (event) => {
  inputText.value += '';
};

// 初始加载字体图标
onMounted(() => {
  // 确保使用CDN加载Font Awesome
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }

  // 自动聚焦输入框
  watch(isPanelOpen, (open) => {
    if (open && messageInput.value) {
      messageInput.value.focus();
      setGlobalClickListener();
    } else {
      removeGlobalClickListener();
    }
  });
});

// 组件销毁时移除监听
onBeforeUnmount(() => {
  removeGlobalClickListener();
});
</script>

<style scoped>
/* 外层按钮和面板样式 */
.ai-assistant-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ai-assistant-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ai-assistant-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
}

.ai-assistant-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ai-assistant-button:active::before {
  width: 300px;
  height: 300px;
}

.ai-assistant-icon {
  width: 30px;
  height: 30px;
  fill: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.ai-assistant-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: min(90vw, 800px);
  height: min(85vh, 900px);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  overflow: hidden;
}

.ai-assistant-panel.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.ai-assistant-content {
  height: 100%;
  position: relative;
}

.ai-assistant-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.ai-assistant-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}

.ai-assistant-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 科技感装饰元素 */
.ai-assistant-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.ai-assistant-decoration::before,
.ai-assistant-decoration::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.ai-assistant-decoration::before {
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.ai-assistant-decoration::after {
  bottom: -100px;
  right: -100px;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* 聊天界面样式 */
.chat-container {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
}

.chat-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.chat-header p {
  opacity: 0.8;
  font-size: 0.9rem;
}

.ai-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.ai-indicator .status-dot {
  width: 8px;
  height: 8px;
  background-color: #4ade80;
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 1.5s infinite;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  max-width: 80%;
  padding: 14px 18px 14px 30px;
  border-radius: 18px;
  line-height: 1.5;
  position: relative;
  animation: fadeIn 0.3s ease-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.user-message {
  background: #4e54c8;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 5px;
}

.ai-message {
  background: white;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 5px;
  border: 1px solid #eaeaea;
}

.ai-typing {
  align-self: flex-start;
  background: white;
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeaea;
}

.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #a777e3;
  border-radius: 50%;
  margin: 0 2px;
  display: inline-block;
}

.typing-indicator span:nth-child(1) {
  animation: bounce 1.3s infinite 0.1s;
}

.typing-indicator span:nth-child(2) {
  animation: bounce 1.3s infinite 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation: bounce 1.3s infinite 0.3s;
}

.chat-input-container {
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
}

.input-group {
  display: flex;
  gap: 10px;
}

#message-input {
  flex: 1;
  padding: 5px 20px;
  border: none;
  background: #f5f7fb;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  resize: none;
  height: 80px;
  line-height: 1.5;
}

#message-input:focus {
  background: #e6ebf5;
  box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.3);
}

#send-button {
  background: #4e54c8;
  color: white;
  border: none;
  width: 56px;
  height: 80px;
  border-radius: 12px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

#send-button:hover {
  background: #3d43b7;
  transform: translateY(-2px);
}

#send-button:active {
  transform: translateY(0);
}

.ai-identity {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.ai-identity .ai-icon {
  margin-right: 8px;
  color: #8f94fb;
}

.system-info {
  text-align: center;
  font-size: 0.85rem;
  color: #a0aec0;
  margin: 10px 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 600px) {
  .chat-container {
    height: 95vh;
    border-radius: 15px;
  }

  .chat-header {
    padding: 15px;
  }

  .message {
    max-width: 90%;
  }

  #send-button {
    width: 50px;
    height: 50px;
  }
}
</style>