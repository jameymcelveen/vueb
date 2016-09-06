<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <container>
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">{{title}}</a>
      </div>
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <slot></slot>
        </ul>
      </div>
    </container>
  </nav>
</template>

<script>
  export default {
    props: ['title']
  }
  // import Container from './container.vue';
</script>
