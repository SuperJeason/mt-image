<template>
  <div id="app">
    <router-view /> <!-- 在这里渲染路由对应的组件 -->
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      console.log('Reload method is called.');
      location.reload();
      console.log("加载完成")
    }
  }
};
</script>

<style>
.el-message-box__btns {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 10px;
}
</style>
