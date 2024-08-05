(()=>{"use strict";var e={100:(e,t,n)=>{n.d(t,{A:()=>d});var o=n(601),r=n.n(o),a=n(314),i=n.n(a)()(r());i.push([e.id,'body{background-color:#000;color:#32cd32;font-family:"Courier New";display:flex;align-items:center;justify-content:center}body textarea{background-color:#000;color:#32cd32;width:100%;border:1px dotted orange;padding:10px}body h1{color:#fff;font-size:30px;margin-top:35px;margin-bottom:10px}@media screen and (max-width: 600px){body h1{font-size:20px}}body .myButton{border-radius:20px;color:#fff;font-family:"Courier New";font-size:16px;font-weight:100;padding:12px;background-color:#32cd32;text-decoration:none;display:inline-block;cursor:pointer;text-align:center;border-width:0;width:max-content}body .myButton:hover{background:green;border-width:0}body .main-container{margin-top:10px;width:800px;display:flex;flex-direction:column}body .main-container .sub-container{padding-right:30px;padding-left:10px}body #logo{display:flex;justify-content:center;padding:10px}body #logo img{width:100%;height:auto;max-width:358px}body .key-bottom-element{align-self:center}body #key-bottom-elements{display:flex}body .margin-top{margin-top:10px}body #caret-position{margin-left:15px}body #message-decrypted,body #message-decrypted-title{display:none;width:100%;border:1px dotted orange;padding:10px}body #message-decrypted.visible,body #message-decrypted-title.visible{display:block}',""]);const d=i},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",o=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),o&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),o&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,o,r,a){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(o)for(var d=0;d<this.length;d++){var c=this[d][0];null!=c&&(i[c]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);o&&i[l[0]]||(void 0!==a&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=a),n&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=n):l[2]=n),r&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=r):l[4]="".concat(r)),t.push(l))}},t}},601:e=>{e.exports=function(e){return e[1]}},353:(e,t,n)=>{n.r(t),n.d(t,{default:()=>v});var o=n(72),r=n.n(o),a=n(825),i=n.n(a),d=n(659),c=n.n(d),s=n(56),l=n.n(s),u=n(540),p=n.n(u),f=n(113),y=n.n(f),m=n(100),g={};g.styleTagTransform=y(),g.setAttributes=l(),g.insert=c().bind(null,"head"),g.domAPI=i(),g.insertStyleElement=p();r()(m.A,g);const v=m.A&&m.A.locals?m.A.locals:void 0},72:e=>{var t=[];function n(e){for(var n=-1,o=0;o<t.length;o++)if(t[o].identifier===e){n=o;break}return n}function o(e,o){for(var a={},i=[],d=0;d<e.length;d++){var c=e[d],s=o.base?c[0]+o.base:c[0],l=a[s]||0,u="".concat(s," ").concat(l);a[s]=l+1;var p=n(u),f={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==p)t[p].references++,t[p].updater(f);else{var y=r(f,o);o.byIndex=d,t.splice(d,0,{identifier:u,updater:y,references:1})}i.push(u)}return i}function r(e,t){var n=t.domAPI(t);n.update(e);return function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,r){var a=o(e=e||[],r=r||{});return function(e){e=e||[];for(var i=0;i<a.length;i++){var d=n(a[i]);t[d].references--}for(var c=o(e,r),s=0;s<a.length;s++){var l=n(a[s]);0===t[l].references&&(t[l].updater(),t.splice(l,1))}a=c}}},659:e=>{var t={};e.exports=function(e,n){var o=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}},540:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},56:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},825:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var o="";n.supports&&(o+="@supports (".concat(n.supports,") {")),n.media&&(o+="@media ".concat(n.media," {"));var r=void 0!==n.layer;r&&(o+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),o+=n.css,r&&(o+="}"),n.media&&(o+="}"),n.supports&&(o+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(o,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},113:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={id:o,exports:{}};return e[o](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.nc=void 0;(()=>{n(353),String.prototype.shuffle=function(){for(var e=this.split(""),t=e.length-1;t>0;t--){var n=Math.floor(Math.random()*(t+1)),o=e[t];e[t]=e[n],e[n]=o}return e.join("")};window.addEventListener("load",(function(){var e=document.getElementById("key");e.addEventListener("click",(function(){document.getElementById("caret-position").innerHTML="Caret position: "+this.selectionStart})),e.addEventListener("keyup",(function(){document.getElementById("caret-position").innerHTML="Caret position: "+this.selectionStart}))})),window.shuffleKeyChars=function(){var e=document.getElementById("key");e.value=e.value.shuffle()},window.encryptMessage=function(){var e=document.getElementById("message").value.split(""),t=document.getElementById("key").value.split(""),n=Array.from(new Set(e)),o=Array.from(new Set(t));n.forEach((function(e){o.includes(e)||console.log('There is no "'.concat(e,'" in key!'))}));var r=[];e.forEach((function(e,n){var o=!1;t.forEach((function(t,n){t!==e||r.includes(n)||o||(r.push(n),o=!0)}))})),document.getElementById("message-encrypted").value=r.join(",")},window.decryptMessage=function(){var e=document.getElementById("message-encrypted").value.split(","),t=document.getElementById("key").value,n=(t.split(""),"");e.forEach((function(e,o){n+=t[parseInt(e)]})),document.getElementById("message-decrypted").innerText=n,document.getElementById("message-decrypted-title").style.display="flex",document.getElementById("message-decrypted").style.display="flex"},console.log("Script loaded successfully, and functions attached to window: ",window.encryptMessage,window.decryptMessage)})()})();