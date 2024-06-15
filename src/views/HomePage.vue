<template>
  <div class="scroll-page">
    <div class="content">
      <h1 class="title">welcome to handscape!</h1>
      <div class="title">
        <img src="../assets/wave-hello.gif" />
      </div>
      <div class="animated-texts">
        <img src="../assets/slogan.png" alt="slogan text" class="slogan"/>
      </div>
    </div>

    <div class="animated-img">
      <img src="../assets/gestures.png" alt="gesture boom" class="gestures"/>
    </div>
    <p class="emoji" style="font-size: 8rem;">🤯</p>

    <div class="spacer" style="height: 100px;"></div>

    <div class="container">
      <div class="container-item">
        <a href="/learn" class="container-link">
          Explore Gesture Magic
          <img src="../assets/learn_icon.png" alt="Learn Icon" class="image"/>
        </a>
      </div>
      <div class="container-item">
        <a href="/exam" class="container-link">
          Gesture Adventure
          <img src="../assets/exam_icon.png" alt="Exam Icon" class="image"/>
        </a>
      </div>
      <div class="container-item">
        <a href="/create" class="container-link">
          Create & Share Your Gestures
          <img src="../assets/create_icon.png" alt="Create Icon" class="image"/>
        </a>
      </div>
    </div>
    <div class="end-container">
      <img src="../assets/fingers.png" alt="Fingers">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollPage',
  mounted() {
    const slogan = this.$el.querySelector(".slogan");
    const gestures = this.$el.querySelector(".gestures");
    const emoji = this.$el.querySelector(".emoji");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, {
      threshold: 0.2 // 20% of the image is visible
    });

    observer.observe(slogan);

    // Listen for the end of the slogan animation
    slogan.addEventListener('transitionend', () => {
      // Observe the emoji element
      const emojiObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start animation for gestures image
            gestures.style.transform = "scale(0)";
            gestures.style.transition = "transform 2s ease-out";

            // Force reflow to restart animation
            void gestures.offsetWidth; // Trigger reflow
            
            // Start animation
            setTimeout(() => {
              gestures.style.transform = "scale(1)";
            }, 10); // Small delay to ensure reflow
          }
        });
      }, {
        threshold: 0.2 // 20% of the emoji is visible
      });

      emojiObserver.observe(emoji);
    }, { once: true });
  }
};
</script>

<style scoped>
.title {
  font-size: 7rem; /* 调整字体大小 */
  text-align: center; /* 居中显示 */
  margin-bottom: 20px;
}

.scroll-page {
  display: flex;
  flex-direction: column;
  min-height: 150vh; /* 增加页面长度 */
  background: linear-gradient(to bottom, rgb(15,178,193), rgb(163,101,182)); /* 从天蓝色渐变到淡紫色 */
  overflow-y: auto;
}

.content {
  flex: 1;
  padding: 20px;
}

.animated-texts {
  position: relative;
  text-align: center; /* 确保居中对齐 */
}

.animated-img {
  position: relative;
  text-align: center; /* 确保居中对齐 */
}

.slogan {
  width: 50vw; /* 使用视口宽度 */
  height: auto; 
  margin: 10px 0;
  opacity: 0;
  transition: opacity 3s, transform 3s;
  transform: translateY(20px);
}

.slogan.visible {
  opacity: 1;
  transform: translateY(0);
}

p.emoji {
  text-align: center;
}

/* Animation keyframes */
@keyframes flyOut {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.gestures {
  transform: scale(0) ;
  width: 50vw; /* 使用视口宽度 */
  height: auto; 
  margin: 0;
  transition: transform 2s ease-out;
}

.container {
  display: flex; /* 使.container变为Flex容器 */
  flex-direction: row; /* 默认值，使子项水平排列 */
  justify-content: space-between; /* 如果您希望 container-item 之间有均匀的间隔 */
  /* 或者使用 'space-around' 根据需要调整间距 */
}

.container-item {
  display: flex; /* 将.container-item也变成Flex容器，以便控制内部元素的对齐 */
  flex-direction: column; /* 使子项（文字和图片）垂直排列 */
  align-items: center; /* 垂直居中对齐子项 */
  text-align: center; /* 确保文字居中 */
}

.container-link {
  display: flex; /* 允许链接内的图文垂直居中 */
  flex-direction: column;
  align-items: center;
  text-decoration: none; /* 移除默认的下划线 */
  color: inherit; /* 使链接颜色继承自父元素 */
  /* 添加其他样式以匹配设计需求 */
}

.image {
  /* 可能需要调整图片的尺寸或添加间距 */
  max-width: 100%; /* 限制图片宽度不超过其容器 */
  height: auto; /* 保持图片宽高比 */
  margin: 10px 0; /* 上下外边距，可根据需要调整 */
}

.container a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  margin-top: 5px;
  font-size: 30px; 
  position: relative; 
  z-index: 2; 
}

.container a:hover {
  text-decoration: underline;
}

.image:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5); 
}

.end-container {
  /* 限定的高度，根据需要调整 */
  height: 100px;
  /* 或者使用其他单位，比如 vh, % 等 */
  width: 100%; /* 让容器适应父元素宽度 */
  /* 保持元素居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 防止图片拉伸 */
  overflow: hidden;
}

.end-container img {
  /* 等比缩放 */
  max-width: 100%;
  max-height: 100%;
  /* 居中 */
  margin: auto;
  /* 防止图片底部不对齐，确保等比缩放 */
  object-fit: cover;
}
</style>
 
