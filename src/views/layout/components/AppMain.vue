<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!--<keep-alive :include="cachedViews">-->
     <!-- <keep-alive>-->
       <router-view :key="key"></router-view>
      <!--<router-view></router-view>-->
      <!--</keep-alive>-->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {

    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
