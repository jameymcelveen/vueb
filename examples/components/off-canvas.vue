<template>
  <div class="container">

    <div class="row row-offcanvas row-offcanvas-right">

      <div class="col-xs-12 col-sm-9">

        <p class="pull-right visible-xs">
          <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
        </p>

        <jumbo-tron title="Hello, world!">
          This is an example to show the potential of an offcanvas layout pattern in Bootstrap. Try some responsive-range viewport sizes to see it in action.
        </jumbo-tron>

        <slot></slot>

      </div>

      <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar">
        <div class="list-group">
          <a href="#" class="list-group-item active">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
          <a href="#" class="list-group-item">Link</a>
        </div>
      </div>

    </div>

  </div>
</template>