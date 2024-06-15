<template>
  <div class="quiz-page">
    <div class="content">
      <img src="../assets/back.png" class="back-button" @click="goBack" />
      <h1 class="title">Gesture Adventure</h1>
      <div v-if="currentQuestion">
        <!-- Multiple Choice Question -->
        <div v-if="currentQuestion.type === 'multiple-choice'" class="multiple-choice-container">
          <div class="spacer" style="height: 10vh;"></div>
          <div class="question-container-1">
            <div class="question-content">
              <img v-if="currentQuestion.image" :src="currentQuestion.image" class="question-image" alt="Gesture Image">
              <p class="question">{{ currentQuestion.question }}</p>
            </div>
          </div>
          <div class="spacer" style="height: 10vh;"></div>
          <div class="options-container-1">
            <button v-for="(option, index) in currentQuestion.options" :key="index"
                    :disabled="feedback === 'Correct!'" @click="checkAnswer(option)" class="option-button-1">
              {{ option }}
            </button>
          </div>
        </div>
        <!-- Gesture Question -->
        <div v-else-if="currentQuestion.type === 'gesture'" class="gesture-container">
          <div class="question-container-2">
            <p class="question">{{ currentQuestion.question }}</p>
          </div>
          <div class="options-container-2">
            <button v-for="(option, index) in currentQuestion.options" :key="index"
                    :disabled="feedback === 'Correct!'" @click="checkAnswer(option)" class="option-button-2">
              {{ option }}
            </button>
          </div>
          <!-- Video Container -->
          <div v-if="currentQuestion && currentQuestion.type === 'gesture'" class="video-container">
            <video ref="video" autoplay class="video" style="display:none;"></video>
            <canvas ref="canvas" class="video-canvas" style="display: none;"></canvas>
            <img v-if="processedImage" :src="'data:image/png;base64,' + processedImage" class="processed-video-frame"> <!-- 显示处理后的图像 -->
          </div>
        </div>
      </div>
      <div v-if="feedback" :class="['feedback', feedback === 'Correct!' ? 'correct' : 'wrong']">{{ feedback }}</div>
    </div>
  </div>
</template>

<script>
import { questions } from '../questions';
import io from 'socket.io-client';
export default {
  data() {
    return {
      questions: questions,
      currentQuestion: null,
      userAnswer: '',
      feedback: '',
      videoStream: null,
      processedImage: null,
      socket: null,
      sendInterval: null,
      randomOnce: false,
      feedbackTimer: null, // 新增反馈计时器
      gestureMap: {
        0: '🤘',
        1: '👍',
        2: '✌',
        3: '👌',
        4: '🤙',
        5: '🤌'
      },
      gestureLabel: -1
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'HomePage' });
    },
    getRandomQuestion() {
      try {
        // 确保在获取新问题之前停止视频流和帧发送
        this.stopVideo();
        this.stopSendingFrames();

        // 随机选择一个问题
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[randomIndex];
        this.randomOnce = false; // 重置 randomOnce 变量

        // 根据问题类型决定是否打开视频流
        if (this.currentQuestion.type === 'gesture') {
          this.startVideo();
          this.startSendingFrames();
        }
      } catch (error) {
        console.error('Error selecting random question:', error);
        this.currentQuestion = null;
      }
    },
    checkAnswer(answer) {
      if (!this.currentQuestion || this.randomOnce) return;

      if (answer === this.currentQuestion.answer || answer === this.currentQuestion.gesture) {
        this.setFeedback('Correct!');
        this.randomOnce = true;
        setTimeout(() => {
          this.userAnswer = '';
          this.getRandomQuestion();
        }, 2000); // 反馈2秒后切换问题
      } else {
        this.setFeedback('Wrong, try again.');
      }
    },
    setFeedback(message) {
      if (this.feedbackTimer) {
        clearTimeout(this.feedbackTimer);
      }

      this.feedback = message;
      this.feedbackTimer = setTimeout(() => {
        if (this.feedback === message) {
          this.feedback = '';
        }
      }, 1000); // 反馈显示1秒
    },
    
    async startVideo() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    },
    stopVideo() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
      }
    },
    startSendingFrames() {
      this.socket = io('http://localhost:5000'); // 替换为你的后端地址
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
      this.socket.on('response_back', (data) => {
        try {
          const parsedData = JSON.parse(data);
          this.gesture = parsedData.gesture;
          this.processedImage = parsedData.image;
          if (this.gesture !== -1) {
            this.gesture = this.gestureMap[this.gesture];
            if (!this.randomOnce) {
              this.checkAnswer(this.gesture);
            }
          }
          console.log('手势标签:', this.gesture);
        } catch (error) {
          console.error('Error processing response data:', error);
        }
      });

      this.frameInterval = setInterval(() => {
        this.captureFrame();
      }, 80); // 每100ms捕获一次帧
    },
    stopSendingFrames() {
      clearInterval(this.frameInterval);
      if (this.socket) {
        this.socket.disconnect();
      }
    },
    captureFrame() {
      if (this.$refs.video && this.$refs.canvas) {
        const video = this.$refs.video;
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');

        // 设置画布大小为视频大小
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 清空画布
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制视频帧到画布
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 将画布内容转换为图像数据
        const dataUrl = canvas.toDataURL('image/png');

        try {
          this.socket.emit('image', { image: dataUrl });
          console.log('Frame data sent');
        } catch (error) {
          console.error('Error sending frame data:', error);
        }
      }
    }
  },
  mounted() {
    this.getRandomQuestion();
  },
  beforeUnmount() {
    this.stopVideo();
  }
};
</script>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, rgb(15,178,193), rgb(163,101,182));
  height: 100%;
  width: 100%;
  position: relative;
}

.back-button {
  width: 50px;
  height: 50px;
  text-align: left;
  cursor: pointer;
  position: absolute;
  top: 40px;
  left: 30px;
}

.content {
  flex: 1;
  padding: 2vh 2vw;
}

.title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2vh;
}

.multiple-choice-container {
  position: relative;
  background-image: url('../assets/card1.png');
  background-size: 75% 160%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2vh 2vw;
  border-radius: 8px;
  min-height: 80vh;
}

.gesture-container {
  position: relative;
  background-image: url('../assets/card2.png');
  background-size: 70% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2vh 2vw;
  border-radius: 8px;
  min-height: 80vh;
}

.question-container-1 {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 20vh;
  top: 20vh;
  left: 17%;
  padding: 1vh;
  border-radius: 8px;
  margin-bottom: 20vh;
}

.question-container-2 {
  position: absolute;
  width: 60vw;
  height: 10vh;
  top: 40vh;
  left: 17%;
  padding: 1vh;
  border-radius: 8px;
  margin-bottom: 20vh;
}

.question-content {
  display: flex;
  align-items: center;
}

.question-image {
  width: 10vw;
  height: auto;
  margin-right: 2vw;
}

.question {
  margin: 0;
  font-size: 1.5rem;
}

.options-container-1 {
  position: absolute;
  top: 50%;
  left: -10%;
  width: 50vw;
  height: 0%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 8vh 8vw;
  border-radius: 30px;
}

.options-container-2 {
  position: absolute;
  top: 50%;
  left: -5%;
  width: 50vw;
  height: 0%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 8vh 8vw;
  border-radius: 30px;
}

.option-button-1 {
  padding: 4vh 5vw;
  margin: 0vh 10vw;
  width: 100%;
  font-size: 2rem;
  color: #333;
  font-family: Arial, sans-serif;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-image: url('../assets/button1.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.option-button-2 {
  padding: 4vh 5vw;
  margin: 0vh 10vw;
  width: 100%;
  font-size: 2rem;
  color: #333;
  font-family: Arial, sans-serif;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-image: url('../assets/button2.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.option-button-1:hover {
  filter: brightness(90%);
}

.option-button-2:hover {
  filter: brightness(85%);
}

.input-box {
  display: block;
  width: 100%;
  padding: 1vh 2vw;
  margin: 1vh 0;
  font-size: 1rem;
  border: 2px solid #ff7e5f;
  border-radius: 8px;
}

.video-container {
  position: absolute;
  top: 3%;
  left: 47%;
  width: 36%;
  height: 34%;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #000;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tv-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 0;
}
.video-canvas {
  display: none; /* 隐藏画布 */
}
.processed-video-frame {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 确保等比例缩放 */
  border-radius: 8px;
}
/* Feedback Styles */
.feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
}

.correct {
  background-color: green;
}

.wrong {
  background-color: red;
}
</style>

