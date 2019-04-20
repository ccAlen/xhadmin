<template>
  <news-detail :is-edit='true'></news-detail>
</template>

<script>
  import newsDetail from './components/NewsDetail'

  export default {
    name: 'editNews',
    components: { newsDetail }
  }
</script>

