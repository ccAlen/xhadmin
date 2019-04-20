<template>
  <news-detail :is-edit='false'></news-detail>
</template>

<script>
  import newsDetail from './components/NewsDetail'

  export default {
    name: 'createNews',
    components: { newsDetail }
  }
</script>
