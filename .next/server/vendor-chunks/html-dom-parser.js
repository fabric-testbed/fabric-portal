/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/html-dom-parser";
exports.ids = ["vendor-chunks/html-dom-parser"];
exports.modules = {

/***/ "(ssr)/./node_modules/html-dom-parser/index.js":
/*!***********************************************!*\
  !*** ./node_modules/html-dom-parser/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/**\n * When running on Node.js, use the server parser.\n * When bundling for the browser, use the client parser.\n *\n * @see {@link https://github.com/substack/node-browserify#browser-field}\n */\nmodule.exports = __webpack_require__(/*! ./lib/server/html-to-dom */ \"(ssr)/./node_modules/html-dom-parser/lib/server/html-to-dom.js\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaHRtbC1kb20tcGFyc2VyL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0Esc0lBQW9EIiwic291cmNlcyI6WyIvVXNlcnMveWF4dWVndW8vRGVza3RvcC9mYWJyaWMtcG9ydGFsL25vZGVfbW9kdWxlcy9odG1sLWRvbS1wYXJzZXIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXaGVuIHJ1bm5pbmcgb24gTm9kZS5qcywgdXNlIHRoZSBzZXJ2ZXIgcGFyc2VyLlxuICogV2hlbiBidW5kbGluZyBmb3IgdGhlIGJyb3dzZXIsIHVzZSB0aGUgY2xpZW50IHBhcnNlci5cbiAqXG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svbm9kZS1icm93c2VyaWZ5I2Jyb3dzZXItZmllbGR9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvc2VydmVyL2h0bWwtdG8tZG9tJyk7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/html-dom-parser/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/html-dom-parser/lib/server/html-to-dom.js":
/*!****************************************************************!*\
  !*** ./node_modules/html-dom-parser/lib/server/html-to-dom.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Parser = (__webpack_require__(/*! htmlparser2/lib/Parser */ \"(ssr)/./node_modules/htmlparser2/lib/Parser.js\").Parser);\nvar DomHandler = (__webpack_require__(/*! domhandler */ \"(ssr)/./node_modules/domhandler/lib/index.js\").DomHandler);\n\nvar unsetRootParent = (__webpack_require__(/*! ./utilities */ \"(ssr)/./node_modules/html-dom-parser/lib/server/utilities.js\").unsetRootParent);\n\n/**\n * Parses HTML string to DOM nodes in Node.js.\n *\n * This is the same method as `require('htmlparser2').parseDOM`\n * https://github.com/fb55/htmlparser2/blob/v6.0.0/src/index.ts#L29-L41\n *\n * @param  {string}            html      - HTML markup.\n * @param  {DomHandlerOptions} [options] - Parser options (https://github.com/fb55/domhandler/tree/v4.0.0#readme).\n * @return {Array<Comment|Element|ProcessingInstruction|Text>} - DOM nodes.\n */\nfunction HTMLDOMParser(html, options) {\n  if (typeof html !== 'string') {\n    throw new TypeError('First argument must be a string.');\n  }\n\n  if (html === '') {\n    return [];\n  }\n\n  var handler = new DomHandler(undefined, options);\n  new Parser(handler, options).end(html);\n  return unsetRootParent(handler.dom);\n}\n\nmodule.exports = HTMLDOMParser;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaHRtbC1kb20tcGFyc2VyL2xpYi9zZXJ2ZXIvaHRtbC10by1kb20uanMiLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSw0R0FBd0M7QUFDckQsaUJBQWlCLGtHQUFnQzs7QUFFakQsc0JBQXNCLHdIQUFzQzs7QUFFNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtQkFBbUI7QUFDL0IsWUFBWSxtQkFBbUI7QUFDL0IsWUFBWSxtREFBbUQ7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIi9Vc2Vycy95YXh1ZWd1by9EZXNrdG9wL2ZhYnJpYy1wb3J0YWwvbm9kZV9tb2R1bGVzL2h0bWwtZG9tLXBhcnNlci9saWIvc2VydmVyL2h0bWwtdG8tZG9tLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBQYXJzZXIgPSByZXF1aXJlKCdodG1scGFyc2VyMi9saWIvUGFyc2VyJykuUGFyc2VyO1xudmFyIERvbUhhbmRsZXIgPSByZXF1aXJlKCdkb21oYW5kbGVyJykuRG9tSGFuZGxlcjtcblxudmFyIHVuc2V0Um9vdFBhcmVudCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJykudW5zZXRSb290UGFyZW50O1xuXG4vKipcbiAqIFBhcnNlcyBIVE1MIHN0cmluZyB0byBET00gbm9kZXMgaW4gTm9kZS5qcy5cbiAqXG4gKiBUaGlzIGlzIHRoZSBzYW1lIG1ldGhvZCBhcyBgcmVxdWlyZSgnaHRtbHBhcnNlcjInKS5wYXJzZURPTWBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2h0bWxwYXJzZXIyL2Jsb2IvdjYuMC4wL3NyYy9pbmRleC50cyNMMjktTDQxXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgIGh0bWwgICAgICAtIEhUTUwgbWFya3VwLlxuICogQHBhcmFtICB7RG9tSGFuZGxlck9wdGlvbnN9IFtvcHRpb25zXSAtIFBhcnNlciBvcHRpb25zIChodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL3RyZWUvdjQuMC4wI3JlYWRtZSkuXG4gKiBAcmV0dXJuIHtBcnJheTxDb21tZW50fEVsZW1lbnR8UHJvY2Vzc2luZ0luc3RydWN0aW9ufFRleHQ+fSAtIERPTSBub2Rlcy5cbiAqL1xuZnVuY3Rpb24gSFRNTERPTVBhcnNlcihodG1sLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgaHRtbCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICB9XG5cbiAgaWYgKGh0bWwgPT09ICcnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBuZXcgRG9tSGFuZGxlcih1bmRlZmluZWQsIG9wdGlvbnMpO1xuICBuZXcgUGFyc2VyKGhhbmRsZXIsIG9wdGlvbnMpLmVuZChodG1sKTtcbiAgcmV0dXJuIHVuc2V0Um9vdFBhcmVudChoYW5kbGVyLmRvbSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSFRNTERPTVBhcnNlcjtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/html-dom-parser/lib/server/html-to-dom.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/html-dom-parser/lib/server/utilities.js":
/*!**************************************************************!*\
  !*** ./node_modules/html-dom-parser/lib/server/utilities.js ***!
  \**************************************************************/
/***/ ((module) => {

eval("/**\n * Sets root parent to null.\n *\n * @param  {Array<Comment|Element|ProcessingInstruction|Text>} nodes\n * @return {Array<Comment|Element|ProcessingInstruction|Text>}\n */\nfunction unsetRootParent(nodes) {\n  for (var index = 0, len = nodes.length; index < len; index++) {\n    var node = nodes[index];\n    node.parent = null;\n  }\n  return nodes;\n}\n\nmodule.exports = {\n  unsetRootParent: unsetRootParent\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaHRtbC1kb20tcGFyc2VyL2xpYi9zZXJ2ZXIvdXRpbGl0aWVzLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBLFlBQVksbURBQW1EO0FBQy9ELFlBQVk7QUFDWjtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy95YXh1ZWd1by9EZXNrdG9wL2ZhYnJpYy1wb3J0YWwvbm9kZV9tb2R1bGVzL2h0bWwtZG9tLXBhcnNlci9saWIvc2VydmVyL3V0aWxpdGllcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNldHMgcm9vdCBwYXJlbnQgdG8gbnVsbC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheTxDb21tZW50fEVsZW1lbnR8UHJvY2Vzc2luZ0luc3RydWN0aW9ufFRleHQ+fSBub2Rlc1xuICogQHJldHVybiB7QXJyYXk8Q29tbWVudHxFbGVtZW50fFByb2Nlc3NpbmdJbnN0cnVjdGlvbnxUZXh0Pn1cbiAqL1xuZnVuY3Rpb24gdW5zZXRSb290UGFyZW50KG5vZGVzKSB7XG4gIGZvciAodmFyIGluZGV4ID0gMCwgbGVuID0gbm9kZXMubGVuZ3RoOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaW5kZXhdO1xuICAgIG5vZGUucGFyZW50ID0gbnVsbDtcbiAgfVxuICByZXR1cm4gbm9kZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1bnNldFJvb3RQYXJlbnQ6IHVuc2V0Um9vdFBhcmVudFxufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/html-dom-parser/lib/server/utilities.js\n");

/***/ })

};
;