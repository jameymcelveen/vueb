/**
 * Created by Jamey McElveen on 9/1/16.
 */

import Factory from './ComponentFactory';

let VueComponent = (() => {
  let srcs = [];
  let srcs2 = [];
  let _modules = {
    'vue': Vue
  };

  if(window) {
    window.require = requireModule;
  }

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

  function requireModule(name) {
    return _modules[name];
  }

  function loadScript(src) {
    console.log( src );
    Factory.build(src, (func, err) => {

      if(err) {
        console.error(err);
        return;
      }

      // execute the function
      defineModule(src, func);
      var index = srcs2.indexOf(src);
      srcs2.splice(index, 1);
      if(srcs2.length === 0) {
        new Vue({el:'html'});
        modulesLoaded();
      }
    });
  }

  function modulesLoaded() {
    for (var k in _modules){
      if (_modules.hasOwnProperty(k)) {
        console.log(k + ':\n');
        console.log(_modules[k].toString() +'\n');
        console.log('\n');
      }
    }
  }

  function defineModule(src, func) {
    let
      module = {},
      require = requireModule;
    console.log(func.toString());
    func(module, require);
    _modules[src] = module;
  }

  return {};

})();

export default VueComponent;
