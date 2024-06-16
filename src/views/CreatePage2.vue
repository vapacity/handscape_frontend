<template>
  <div id="app">
    <img src="../assets/back.png" class="back-button" @click="goBack" />
    <div class="create-container">
      <h1>Create & Share Your Gestures</h1>
      <div class="buttons">
        <button @click="createGesture">create your gestures</button>
        <button style="background-color:white; color: black;" @click="tryGesture">try your gestures</button>
      </div>
      <div class="content">
        <div class="form-group">
          <div class="image-upload">
            <!-- 摄像头 -->
            <div class="video-container">
              <video ref="video" autoplay class="video" style="display:none"></video>
              <canvas ref="canvas" class="video-canvas" style="display:none"></canvas>
              <img v-if="processedImage" :src="'data:image/png;base64,' + processedImage" class="processed-video-frame"> <!-- 显示处理后的图像 -->
            </div>
          </div>
        </div>
        <div class="cards">
          <div class="card" v-if="gesture">
            <div class="emoji">
              <img :src="gesture.emojiImage" class="emoji-image" alt="Emoji Image" />
            </div>
            <div class="result-content">
              <div class="scroll-button" @click="previousImage(gesture.id)">
                <img src="../assets/left.png" alt="former">
              </div>
              <img :src="gesture.images[gesture.currentIndex]" class="poster" />
              <div class="scroll-button" @click="nextImage(gesture.id)">
                <img src="../assets/right.png" alt="latter">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cube">
        <img src="../assets/ending.gif" />
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: "CreatePage2",
  data() {
    return {
      //questions: questions,
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
      gestureLabel: -1,
      //videoStream: null,
      //processedImage: null,
      //socket: null,
      frameInterval: null,
      //randomOnce: false,
      gesture: null,
      gestures: [], // 确保gestures已定义
      
    };
  },
  mounted() {
    this.startVideo();
  },
  beforeUnmount() {
    this.stopSendingFrames();
    this.stopVideo();
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'HomePage' });
    },
    previousImage(id) {
      const gesture = this.gestures.find(g => g.id === id);
      if (gesture) {
        gesture.currentIndex =
          (gesture.currentIndex - 1 + gesture.images.length) % gesture.images.length;
      }
    },
    nextImage(id) {
      const gesture = this.gestures.find(g => g.id === id);
      if (gesture) {
        gesture.currentIndex = (gesture.currentIndex + 1) % gesture.images.length;
      }
    },
    createGesture() {
      this.$router.push({ name: 'CreatePage1' });
    },
    tryGesture() {
      this.$router.push({ name: 'CreatePage2' });
    },
    async startVideo() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.videoStream;
        this.startSendingFrames();
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    },
    stopVideo() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
    },
    startSendingFrames() {
      this.socket = io('http://127.0.0.1:8000'); // 替换为你的后端地址
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
          this.processedImage = parsedData.image;
          //this.gesture = parsedData.gesture;
        } catch (error) {
          console.error('Error processing response data:', error);
        }
      });

      this.frameInterval = setInterval(() => {
        this.captureFrame();
      }, 80); // 每80ms捕获一次帧
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
          this.socket.emit('try', { image: dataUrl });
          console.log('Frame data sent');
        } catch (error) {
          console.error('Error sending frame data:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.create-container {
  text-align: center;
  background: linear-gradient(to bottom, rgb(15, 178, 193), rgb(163, 101, 182));
  color: black;
  font-family: Arial, sans-serif;
  height: 100%;
  width: 100%;
  padding: 20px;
}

h1 {
  font-family: 'Arial', sans-serif;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.buttons {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.buttons button {
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  font-size: 1.5em;
}

.buttons button:hover {
  background-color: black;
  color: white;
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
  text-align: center;
  font-family: 'Arial', sans-serif;
  font-size: 1em;
}

.content p {
  line-height: 1.5em;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  color: white;
}

input[type="text"]::placeholder {
  color: white;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-image: url('../assets/tv.png');
  background-size: 70% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2vh 2vw;
  border-radius: 8px;
  min-height: 80vh;
}

input[type="file"] {
  margin-bottom: 10px;
}

.video-container {
  position: absolute;
  top: 3%;
  left: 16%;
  width: 68%;
  height: 80%;
  background: rgba(0, 0, 0);
  border: 2px solid #000;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 0;
}
.processed-video-frame {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 确保等比例缩放并填满容器 */
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
}

.container {
  display: flex;
  height: 30vh;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: white;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}

.left {
  flex: 1;
  padding: 20px;
  font-size: 1.2em;
}

.right {
  height: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-group label {
  margin-right: 10px;
}

.input-group input {
  padding: 5px;
  margin-right: 10px;
  margin-bottom: 0;
  border: none;
  border-radius: 4px;
}

.input-group button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: white;
  color: #6a11cb;
  cursor: pointer;
}

.input-group button:hover {
  background-color: #f0f0f0;
}

.country-list {
  width: 50%;
  height: 70%;
  border: 1px solid white;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
}

.country-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.country-list li {
  padding: 5px 0;
}

button:hover {
  background-color: transparent;
  color: white;
}

.cards {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  background: url('../assets/card.png') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 800px;
  height: 500px;
}

.emoji {
  flex: 1;
  text-align: center;
}

.emoji-image {
  max-width: 100%;
  height: auto;
}

.poster {
  max-width: 80%;
  max-height: 100%;
  margin-left: 20px;
  margin-right: 20px;
}

.scroll-button {
  position: relative;
  cursor: pointer;
  margin: 0 10px;
}

.scroll-button:hover {
  filter: brightness(90%);
}

.scroll-button img {
  width: 300%;
  height: auto;
}

.result-content {
  flex: 3;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.cube img {
  width: 50%;
  max-width: 100px;
  height: auto;
  display: block;
  margin: 20vh auto;
}
</style>
