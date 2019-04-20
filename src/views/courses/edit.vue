<template>
    <CoursesDetail :is-edit="true"></CoursesDetail>
</template>

<script>
  import CoursesDetail from './components/CoursesDetail'
  export default {
    name: 'editCourses',
    components: { CoursesDetail }
  }
</script>

<style scoped>

</style>
