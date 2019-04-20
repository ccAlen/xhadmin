<template>
    <CoursesDetail :is-edit="false"></CoursesDetail>
</template>

<script>
    import CoursesDetail from './components/CoursesDetail'
    export default {
      name: 'createCourses',
      components: { CoursesDetail }
    }
</script>

<style scoped>

</style>
