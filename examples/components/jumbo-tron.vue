<template>
  <div class="jumbotron">
    <h1>{{title}}</h1>
    <p><slot></slot></p>
  </div>
</template>

<script>
  export default { props: ['title'] }
</script>