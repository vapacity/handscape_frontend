<template>
  <div id="app">
    <div class="create-container">
      <img src="../assets/back.png" class="back-button" @click="goBack" />
      <h1>Create & Share Your Gestures</h1>
      <div class="buttons">
        <button style="background-color:white; color: black;" @click="createGesture">create your gestures</button>
        <button @click="tryGesture">try your gestures</button>
      </div>
      <div class="content">
        <p v-if="currentStep === 0" style="margin-top: 40px;font-size: 1.5em;">we are happy to see you can upload your <br>
          gestures on this website!<br>
          it's amazing that more people will understand <br>the meaning in your country.
        </p>
        <div v-if="currentStep === 0" class="button-image" @click="nextStep">
          <img src="../assets/button.png" alt="Start Button">
          <span class="button-text">Start</span>
        </div>

        <div v-if="currentStep === 1" class="form-group">
          <div>
            <label for="input" style="margin-top: 50px; font-size: 1.5em;">how can we call it?</label>
            <input type="text" id="input" v-model="gestureName" placeholder="Please enter..."
              style="width: 40%; background-color: transparent;" />
          </div>
          <div class="button-image" @click="nextStep">
            <img src="../assets/button.png" alt="Next Button">
            <span class="button-text">Next</span>
          </div>
        </div>

        <div v-if="currentStep === 2" class="form-group">
          <label style="font-size: 1.5em;">what does it look like?</label>
          <div class="button-image-capture" @click="toggleVideo">
            <img src="../assets/capture.png" alt="Capture Button">
            <span class="button-text" style="color: aliceblue;">{{ isCapturing ? '🔚': '🔛' }}</span><!--'⏹': '⏺' -->
          </div>
          
          <div class="image-upload">
            <!-- 摄像头 -->
            <div class="video-container" v-if="isCapturing">
              <video ref="video" autoplay class="video"></video>
            </div>
          </div>
          <div class="button-image" @click="nextStep">
            <img src="../assets/button.png" alt="Next Button">
            <span class="button-text">Next</span>
          </div>
        </div>

        <div v-if="currentStep === 3" class="form-group">
          <div class="container">
            <div class="left">
              <p style="font-size: 1.5em;">Good!<br>now add some meanings for it.<br>or just the one you know.</p>
            </div>
            <div class="right">
              <div class="firstrow">
                <input type="text" v-model="countryName" placeholder="Enter country..." class="small-input">
                <button @click="addGesture" class="add-button">
                  <img src="../assets/add.png" alt="Add Button" class="add-icon">
                </button>
              </div>
              <input type="text" id="description" v-model="gestureDes" placeholder="Please enter..." class="large-input">        
            </div>
          </div>
          <div class="button-image" @click="finishCreation">
            <img src="../assets/button.png" alt="Finish Button">
            <span class="button-text">Finish!</span>
          </div>
        </div>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CreatePage1",
  data() {
    return {
      currentStep: 0, // 初始步骤
      gestureName: '',
      countryName: '', // 国家名称
      gestureDes: '', // 手势描述
      gestures: [], // 保存所有手势
      videoStream: null,
      isCapturing: false, // 用于控制摄像头状态
      successMessage: '' // 成功消息
    };
  },
  watch: {
    currentStep(newStep) {
      if (newStep === 2) {
        this.stopVideo(); // 默认不启动摄像头
      } else if (this.videoStream) {
        this.stopVideo();
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'HomePage' });
    },
    createGesture() {
      this.$router.push({ name: 'CreatePage1' });
    },
    tryGesture() {
      this.$router.push({ name: 'CreatePage2' });
    },
    nextStep() {
      this.currentStep += 1;
    },
    async startVideo() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$nextTick(() => {
          this.$refs.video.srcObject = this.videoStream;
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },
    stopVideo() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
    },
    toggleVideo() {
      this.isCapturing = !this.isCapturing;
      if (this.isCapturing) {
        this.startVideo();
      } else {
        this.stopVideo();
      }
    },
    addGesture() {
      // 将国家名称和描述添加到手势信息
      this.gestures.push({
        countryName: this.countryName,
        gestureDes: this.gestureDes
      });
      // 清空输入框
      this.countryName = '';
      this.gestureDes = '';
    },
    finishCreation() {
      const data = this.gestureDes;
      this.sendDataToBackend(data);
      this.successMessage = 'Successful! Now you can try your gestures.';
    },
    sendDataToBackend(data) {
      // 使用Axios库发送POST请求将数据传递给后端API
      axios.post('#', data) // 需要替换为实际后端地址
        .then(response => {
          console.log('Response from backend:', response.data);
        })
        .catch(error => {
          console.error('Error sending data to backend:', error);
        });
    }
  },
  beforeUnmount() {
    this.stopVideo();
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#create-container {
  height: 100%;
}

.create-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(to bottom, rgb(15,178,193), rgb(163,101,182));
  color: black;
  font-family: Arial, sans-serif;
  min-height: 100vh; /* 固定的最小高度 */
  height: auto;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
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

.button-image {
  position: relative;
  cursor: pointer;
  margin: 0 10px;
}

.button-image:hover {
  filter: brightness(90%);
}

.button-image img {
  width: 20%;
  height: auto;
}

.button-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 1.5em;
  font-family: Arial, sans-serif;
  text-align: center;
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
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-image: url('../assets/intro.png');
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

.button-image-capture {
  position: relative;
  cursor: pointer;
  margin: 0 10px;
}

.button-image-capture img {
  width: 6%;
  height: auto;
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

.container {
  display: flex;
  height: 30vh;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: black;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}

.left {
  flex: 1;
  padding: 20px;
  font-size: 1em;
}

.right {
  height: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 140px;
}

.firstrow {
  width: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.small-input {
  width: 60%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  color: white;
  background-color: transparent;
}

.large-input {
  width: 70%;
  height: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 0px 250px 0;
  background-color: transparent;
  font-size: large;
}

.add-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.add-icon {
  width: 50px;
  height: 100%;
}


.success-message {
  margin-top: 20px;
  font-size: 1.5em;
  color: rgb(255, 255, 255);
}
</style>
