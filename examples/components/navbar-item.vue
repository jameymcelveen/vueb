<template>
  <li :class="getClass">
    <a :href="href"><slot></slot></a>
  </li>
</template>

<script>
  export default {
    props: ['active', 'href'],
    computed: {
      getClass: function() {
        return this.active ? "active" : "";
      }
    }
  }
</script>
