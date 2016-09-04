<template>
  <div class="row">
    <div class="col-xs-6 col-lg-4">
      <h2>{{title}}</h2>
      <p>
        <slot></slot>
      </p>
      <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title']
  }
</script>