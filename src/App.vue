<template>
  <div id="app">
    <nav v-if="showNavBar">
      <router-link to="/">Home</router-link>
      <router-link to="/learn">Learn</router-link>
      <router-link to="/exam">Exam</router-link>
      <router-link to="/create">Create</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
    showNavBar: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
nav {
  display: flex;
  gap: 10px;
}
</style>
