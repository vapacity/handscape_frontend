<template>
  <div id="app">
    <div class="explore-gesture-magic">
      <header>
        <img src="../assets/back.png" class="back-button" @click="goBack" />
        <h1>Explore Gesture Magic</h1>
      </header>

      <div class="cards">
        <div class="card" v-for="gesture in gestures" :key="gesture.id">
          <div class="emoji">
            <img :src="gesture.emojiImage" class="emoji-image" alt="Emoji Image" />
          </div>
          <div class="content">
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

      <div class="cube">
        <img src="../assets/ending.gif" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LearnPage",
  data() {
    return {
      gestures: [
        {
          id: 1,
          emojiImage: require("../assets/rock.png"),
          images: [
            require("../assets/11.png"),
            require("../assets/12.png"),
          ],
          currentIndex: 0,
        },
        {
          id: 2,
          emojiImage: require("../assets/thumb.png"),
          images: [
            require("../assets/21.png"),
            require("../assets/22.png"),
            require("../assets/23.png"),
            require("../assets/24.png"),
            require("../assets/25.png"),
            require("../assets/26.png"),
          ],
          currentIndex: 0,
        },
        {
          id: 3,
          emojiImage: require("../assets/victory.png"),
          images: [
            require("../assets/31.png"),
            require("../assets/32.png"),
            require("../assets/33.png"),
          ],
          currentIndex: 0,
        },
        {
          id: 4,
          emojiImage: require("../assets/ok.png"),
          images: [
            require("../assets/41.png"),
            require("../assets/42.png"),
            require("../assets/43.png"),
          ],
          currentIndex: 0,
        },
        {
          id: 5,
          emojiImage: require("../assets/call me.png"),
          images: [
            require("../assets/51.png"),
            require("../assets/52.png"),
            require("../assets/53.png"),
          ],
          currentIndex: 0,
        },
        {
          id: 6,
          emojiImage: require("../assets/pinch.png"),
          images: [
            require("../assets/61.png"),
            require("../assets/62.png"),
            require("../assets/63.png"),
            require("../assets/64.png"),
          ],
          currentIndex: 0,
        }
      ]
    };
  },
  methods: {
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
    goBack() {
      this.$router.push({ name: 'HomePage' });
    }
  }
};
</script>

<style scoped>
.explore-gesture-magic {
  text-align: center;
  background: linear-gradient(to bottom,rgb(15,178,193), rgb(163,101,182));
  color: black;
  font-family: Arial, sans-serif;
  height: 100%;
  padding: 20px;
}

header {
  margin-bottom: 20px;
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

.content {
  flex: 3;
  display: flex;
  align-items: center;
  margin-top: 5px;
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

.cube img {
  width: 50%; /* 图片的宽度设置为父元素宽度的50% */
  max-width: 100px; /* 最大宽度 */
  height: auto; /* 保持高度自动，以保持宽高比 */
  display: block; /* 使图片为块级元素 */
  margin: 20vh auto; /* 居中对齐 */
}

button:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>
