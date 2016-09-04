<template>
  <div class="col-xs-6 col-md-4">
    <a :href="href" class="thumbnail">
      <img alt="{{title}} example" :src="image"> </a>
    <h3>{{title}}</h3>
    <p><slot></slot></p>
  </div>
</template>

<script>
  export default {
    props: ['title', 'href', 'image']
  }
</script>
