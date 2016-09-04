/**
 * Created by Jamey McElveen on 9/1/16.
 */

let query = (selector, ctx) => {
  return (ctx || document).querySelectorAll(selector);
};

let injectStyle = (css) => {
  let
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};

export default {
  query,
  injectStyle
};