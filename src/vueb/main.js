/**
 * Created by Jamey McElveen on 9/1/16.
 */

import Factory from './ComponentFactory';

let VueComponent = (() => {

  let srcs = [];
  let srcs2 = [];
  window.onload=function() {
    var i;
    var scripts = document.getElementsByTagName("script");
    for (i=0;i<scripts.length;i++) {
      if (scripts[i].getAttribute( "type" ) === "vue/component") {
        srcs.push(scripts[i].getAttribute( "src" ));
        srcs2.push(scripts[i].getAttribute( "src" ));
      }
    }

    for (i=0;i<srcs.length;i++) {
      loadScript(srcs[i]);
    }

  };

  function loadScript(src) {
    console.log( src );
    Factory.build(src, (data, err) => {
      if(err) {
        console.error(err);
        return;
      }
      console.log(data.toString());
    data(Vue);
    var index = srcs2.indexOf(src);
    srcs2.splice(index, 1);
    if(srcs2.length === 0){
      new Vue({el:'html'});
    }
  });
  }

  return {};

})();

export default VueComponent;
