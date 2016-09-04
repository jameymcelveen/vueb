/**
 * Created by Jamey McElveen on 9/4/16.
 */


Vue.component('navbar', {
  components: {
    heading: {/* heading template + props goes here */},
    content: {/* content template + props goes here */}
  },
  template: "<div class='accordion'><slot></slot></accordion>"
});


var template =
  '<nav class="navbar navbar-inverse navbar-fixed-top">' +
  ' <container>' +
  '  <div class="navbar-header">' +
  '   <button type="button" class="navbar-toggle collapsed data-toggle="collapse"' +
  '    data-target="#navbar" aria-expanded="false" aria-controls="navbar">' +
  '    <span class="sr-only">Toggle navigation</span>' +
  '    <span class="icon-bar"></span>' +
  '    <span class="icon-bar"></span>' +
  '    <span class="icon-bar"></span>' +
  '   </button>' +
  '   <a class="navbar-brand" href="#">Project name</a>' +
  '  </div>' +
  '  <div id="navbar" class="collapse navbar-collapse">' +
  '   <ul class="nav navbar-nav">' +
  '    <li class="active"><a href="#">Home</a></li>' +
  '    <li><a href="#about">About</a></li>' +
  '    <li><a href="#contact">Contact</a></li></ul>' +
  '  </div>' +
  ' </container>' +
  '</nav>';
