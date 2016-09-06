/**
 * Created by Jamey McElveen on 9/1/16.
 */

import Http from './Http';
import TemplateParser from './TemplateParser';
import Utils from './Utils';

export default class ComponentFactory {

  static build(src, callback) {

    // if(components[src]) {
    //   callback(components[src]);
    //   return;
    // }

    Http.GET(src, (data, err) => {
      if(err) {
        console.error(err);
        callback(null);
      } else {
        let template = TemplateParser.parse(data);
        let componentName = src.substring(src.lastIndexOf('/')+1).split('.')[0];
        let objectName = snakeToCamel(componentName);
        let script = mutateScript(src, componentName, objectName, template);
        if(template.style) {
          Utils.injectStyle(template.style.join('\n'));
        }

        //console.log(script);

        let func = createModuleFunctionFromScript(script);

        callback(func);
      }
    });
  }

}

function createModuleFunctionFromScript(script) {
  /* jshint -W054 */
  /* Executing functions as eval is fundamental to vueb.
   *
   * vueb.js should only be used for development or prototyping never for release or
   * production you can build using vueb-cli or your favorite build method.
   * ```
   * # **vueb-cli usage:**
   * # vueb <input html file> -o <output directory>
   * # ex: $ vueb ./index.html -o ./dist
   * ```
   */

  let func = new Function('module', 'require', script);

  /*jshint +W054 */

  return func;
}

function mutateScript(url, componentName, objectName, template) {

  var
    rx = /(^\s*)(?:export\s+default|module\.exports\s*=)\s*{(.*)/g,
    layout = '',
    replacement = '$1var ' + objectName + ' = {$2',
    script =  template.script.join('\n') || '  export default {}';
    //t = template.template.replace(/"/g, "\\\"");

  layout += '[\n';
  template.template.forEach(line => {
    layout += `    ["${line.replace(/"/g, "\\\"")}"],\n`;
  });
  layout += "  ].join('\\n')";


  script = [
    script.replace(rx, replacement),
    `  ${objectName}.template = ${layout};`,
    `  ${objectName}.name = "${componentName}";`,
    `  ${objectName} = Vue.extend(${objectName});`,
    `  Vue.component("${componentName}", ${objectName});`,
    `  module.exports = ${objectName};`,
  ].join('\n');


  console.log(script);
    //'Vue.component("'+componentName+'", '+objectName+');\n'+
    //'return '+objectName+';';
  return script;
}

function snakeToCamel(s){
  return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
}
