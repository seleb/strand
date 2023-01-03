import { getLexer } from 'lil-lexer';

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function parse(tokens) {
  var res = [];
  var stack = [res];
  var _iterator = _createForOfIteratorHelper(tokens),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var token = _step.value;
      switch (token.name) {
        case "if":
          {
            var condition = {
              name: "condition",
              value: [{
                condition: token.value,
                branch: []
              }]
            };
            stack[stack.length - 1].push(condition);
            stack.push(condition.value); // enter condition
            stack.push(condition.value[0].branch); // enter condition's branch
            break;
          }
        case "elseif":
          {
            var branch = {
              condition: token.value,
              branch: []
            };
            stack.pop(); // exit condition's branch
            stack[stack.length - 1].push(branch); // last entry in stack is now active condition, so add to its branches
            stack.push(branch.branch); // enter condition's branch
            break;
          }
        case "endif":
          if (stack.length < 3) {
            throw new Error("Tried to close if block, but one wasn't open");
          }
          stack.pop(); // exit condition's branch
          stack.pop(); // exit condition
          break;
        case "action":
        case "do":
        case "print":
          stack[stack.length - 1].push(token);
          break;
        case "fill":
          {
            // fill nodes are just plain text
            var n = _objectSpread2(_objectSpread2({}, token), {}, {
              name: "text"
            });
            stack[stack.length - 1].push(n);
            break;
          }
        case "comment":
          break;
        default:
          throw new Error("Unrecognized token name: ".concat(token.name));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (stack.length !== 1) {
    throw new Error("Unclosed stack: ".concat(stack));
  }
  return res;
}

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;
var lexicon = [{
  name: "comment",
  regex: String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["//(.*)\n?"], ["\\/\\/(.*)\\n?"]))),
  getValue: function getValue(match, comment) {
    return comment.trim();
  }
}, {
  name: "action",
  regex: String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["[[([^]+?)]]"], ["\\[\\[([^]+?)\\]\\]"]))),
  getValue: function getValue(match, content) {
    var _content$split = content.split("|"),
      _content$split2 = _slicedToArray(_content$split, 2),
      text = _content$split2[0],
      action = _content$split2[1];
    if (!action) {
      var _text$split = text.split('>');
      var _text$split2 = _slicedToArray(_text$split, 2);
      text = _text$split2[0];
      action = _text$split2[1];
      if (action) {
        action = "this.goto(\"".concat(action.replace(/"/g, '\\"'), "\")");
      }
    }
    return {
      text: text,
      action: action || "this.goto(\"".concat(text.replace(/"/g, '\\"'), "\")")
    };
  }
}, {
  name: "if",
  regex: String.raw(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<<s*?ifs*?([^]+?)s*?>>"], ["<<\\s*?if\\s*?([^]+?)\\s*?>>"]))),
  getValue: function getValue(match, condition) {
    return condition.trim();
  }
}, {
  name: "elseif",
  regex: String.raw(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<<s*?els?e?s*?ifs*?([^]+?)s*?>>"], ["<<\\s*?els?e?\\s*?if\\s*?([^]+?)\\s*?>>"]))),
  getValue: function getValue(match, condition) {
    return condition.trim();
  }
}, {
  // else -> elseif true
  name: "elseif",
  regex: String.raw(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<<s*?else?s*?>>"], ["<<\\s*?else?\\s*?>>"]))),
  getValue: function getValue() {
    return "true";
  }
}, {
  name: "endif",
  regex: String.raw(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<<s*?endifs*?>>"], ["<<\\s*?endif\\s*?>>"]))),
  getValue: function getValue() {}
}, {
  name: "do",
  regex: String.raw(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["<<s*?dos*?([^]+?)s*?>>"], ["<<\\s*?do\\s*?([^]+?)\\s*?>>"]))),
  getValue: function getValue(match, statement) {
    return statement.trim();
  }
}, {
  // set a=b -> do this.a=b
  name: "do",
  regex: String.raw(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["<<s*?sets*?([^]+?)s*?=([^]+?)s*?>>"], ["<<\\s*?set\\s*?([^]+?)\\s*?=([^]+?)\\s*?>>"]))),
  getValue: function getValue(match, identifier, value) {
    return "this.".concat(identifier.trim(), "=").concat(value.trim());
  }
}, {
  name: "print",
  regex: String.raw(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["<<s*?prints*?([^]+?)s*?>>"], ["<<\\s*?print\\s*?([^]+?)\\s*?>>"]))),
  getValue: function getValue(match, statement) {
    return statement.trim();
  }
}];

var lex = getLexer(lexicon);
function compile(source) {
  return parse(lex(source));
}

/**
 * Converts source text into a map of title->passage pairs
 * @param {string} source Source text to parse
 * @returns {object} Map of passage titles to passage objects {title: {title,body}}
 */
function parsePassages(source) {
  // sanitize: remove unneeded \r characters and any leading/trailing space
  source = source.replace(/[\r]/g, '').trim();

  // auto link sugar: `>`, `>text`, and `>a|b|c`
  var autolink = 0;
  source = source.replace(/^>(.*)/gm, /* eslint-disable indent */
  function (_, link) {
    return link === '>' ? ">".concat(link) : link.split('|').map(function (l) {
      return "[[".concat(l, "|this.goto('auto-").concat(autolink + 1, "')]]");
    }).concat("\n::auto-".concat(++autolink)).join('\n');
  }
  /* eslint-enable indent */)
  // auto link escape
  .replace(/^\\>/gm, '>');

  // split passages
  // input:
  //     ::title
  //     body
  // output:
  //     [body,title,body,title...]
  var segments = source.split(/^:{2}(.+)\n/gm);

  // remove the first element, which is a body segment without a title
  if (segments.shift().length > 0) {
    console.warn('Found text above first passage title; this text will be ignored');
  }
  if (segments.length === 0) {
    throw new Error('No passages found');
  }

  // map passage bodies to titles
  var passages = {};
  for (var i = 0; i < segments.length; i += 2) {
    var title = segments[i];
    var body = segments[i + 1].trim();
    if (body.length === 0) {
      throw new Error("Passage titled \"".concat(title, "\" is empty\""));
    }
    if (passages[title]) {
      throw new Error("Multiple passages titled \"".concat(title, "\" found"));
    }
    passages[title] = {
      title: title,
      body: body
    };
  }
  return passages;
}
function compilePassage(passage) {
  if (!passage) {
    throw new Error("No passage provided");
  }
  var title = passage.title,
    body = passage.body;
  if (!title) {
    throw new Error("Passage must have a title");
  }
  if (!body) {
    throw new Error("Passage must have a body");
  }
  return _objectSpread2(_objectSpread2({}, passage), {}, {
    program: compile(passage.body)
  });
}

var defaultTitle = "DEFAULT";
var defaultPassage = {
  title: defaultTitle,
  body: "This shows up when a passage failed to parse, or doesn't even exist. Try checking the link for spelling errors or the logs for more detail on the error.\n[[back|this.back();]]"
};
var _default = /*#__PURE__*/function () {
  /**
   * @param {Object} args
   * @param {Object} args.renderer Renderer to be controlled by this Runner. The only requirement for a renderer is that it defines `displayPassage`, which accepts a parsed passage and returns a Promise
   * @param {string?} args.source `this.setSource` is called with `source` as a parameter
   * @param {Object?} args.logger optional replacement for console logger
   */
  function _default(_ref) {
    var renderer = _ref.renderer,
      source = _ref.source,
      _ref$logger = _ref.logger,
      logger = _ref$logger === void 0 ? console : _ref$logger;
    _classCallCheck(this, _default);
    if (typeof renderer.displayPassage !== "function") {
      throw new Error("renderer must have a `displayPassage` function which accepts a parsed passage and returns a Promise");
    }
    this.history = [];
    this.currentPassage = null;
    this._evalInScope = function (script) {
      return eval(script);
    }.bind(this);
    this.busy = false;
    this.renderer = renderer;
    this.logger = logger;
    this.setSource(source);
  }
  /**
   * Evaluates a provided script,
   * using the runner as execution scope.
   *
   * @param {string} script Script to evaluate
   * @returns {any} Evaluation of script
   */
  _createClass(_default, [{
    key: "eval",
    value: function _eval() {
      var script = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      this.logger.log("Running script:", script);
      return this._evalInScope(script);
    }

    /**
     * Parses `source` and assigns the result to `this.passages`.
     * If no `source` is provided, assigns an empty object instead.
     *
     * If no passage with the title `DEFAULT` is provided,
     * the runner's default is used.
     *
     * @param {string?} source Source text to parse, or nothing
     */
  }, {
    key: "setSource",
    value: function setSource(source) {
      if (source) {
        this.passages = parsePassages(source);
      } else {
        this.passages = {};
      }
      this.passages[defaultTitle] = this.passages[defaultTitle] || defaultPassage;
    }

    /**
     * Parses and returns the passage with the provided title
     * If the passage can't be found/parsed, tries to use default instead.
     *
     * @param {string} title Title of passage to retrieve
     * @returns {Object} parsed passage
     */
  }, {
    key: "getPassageWithTitle",
    value: function getPassageWithTitle(title) {
      try {
        if (!this.passages[title]) {
          throw new Error("Passage titled \"".concat(title, "\" not found\""));
        }
        return compilePassage(this.passages[title]);
      } catch (err) {
        this.logger.error("Failed to parse passage titled \"".concat(title, "\", going to \"").concat(defaultTitle, "\" instead. Original error:"), err);
        return compilePassage(this.passages[defaultTitle]);
      }
    }

    /**
     * Retrieves the passage with provided title, then displays it.
     *
     * @param {string} title Title of passage to go to
     * @returns {Promise} resolves when transition in to new passage has completed.
     */
  }, {
    key: "goto",
    value: function goto(title) {
      var _this = this;
      this.logger.log("Going to passage:", title);
      return Promise.resolve().then(function () {
        return _this.getPassageWithTitle(title);
      }).then(function (passage) {
        return _this.displayPassage(passage);
      });
    }
    /**
     * Goes to the last passage.
     *
     * @returns {Promise} resolves with title of new currentPassage when goto is complete. If no history is available, rejects with an error
     */
  }, {
    key: "back",
    value: function back() {
      var _this2 = this;
      this.logger.log("back");
      if (this.history.length === 0) {
        return Promise.reject(new Error("Cannot go back because there is no history available."));
      }
      // go to the last entry in history,
      // then remove the last entry in history
      // (i.e. don't get stuck in a loop)
      var lastPassageTitle = this.history.pop();
      return this["goto"](lastPassageTitle).then(function () {
        _this2.history.pop();
        return lastPassageTitle;
      });
    }

    /**
     * Pushes the current passage (if there is one) to history,
     * then tells the renderer to display the passed-in passage
     *
     * The renderer can execute the program by calling `runner.execute(passage.program)`,
     * which will evaluate it and return the resulting list of nodes.
     *
     * Runner will be flagged as `busy` until renderer has finished.
     * Calling `displayPassage` while busy will throw an error.
     *
     * @param {Object} passage Passage to display
     * @returns {Promise} resolves when renderer has displayed passage
     */
  }, {
    key: "displayPassage",
    value: function displayPassage(passage) {
      var _this3 = this;
      if (this.busy) {
        throw new Error("Busy waiting for previous passage to display; cannot display another");
      }
      this.logger.log("Displaying passage:", passage);
      // push current state to history
      if (this.currentPassage) {
        this.history.push(this.currentPassage.title);
      } else {
        this.logger.warn("No history pushed because there is no current passage");
      }
      this.currentPassage = passage;
      this.busy = true;
      return this.renderer.displayPassage(passage).then(function () {
        _this3.busy = false;
      });
    }

    /**
     * Executes a program tree, and returns the flattened result.
     *
     * @param {Object[]} program Program tree to execute
     * @returns {Object[]} Flattened program tree
     */
  }, {
    key: "execute",
    value: function execute(program) {
      var _this4 = this;
      return program.reduce(function (nodes, node) {
        switch (node.name) {
          case "condition":
            var _iterator = _createForOfIteratorHelper(node.value),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var branch = _step.value;
                var result = void 0;
                try {
                  result = _this4.eval(branch.condition);
                } catch (err) {
                  _this4.logger.error("Failed to evaluate condition", branch, err);
                  nodes.push({
                    name: "text",
                    value: "Failed to evaluate condition:\n".concat(branch.condition, "\n").concat(err.message)
                  });
                  continue;
                }
                if (result) {
                  nodes = nodes.concat(_this4.execute(branch.branch));
                  break;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            break;
          case "do":
            try {
              _this4.eval(node.value);
            } catch (err) {
              _this4.logger.error("Failed to evaluate node", node, err);
              nodes.push({
                name: "text",
                value: "Failed to evaluate node:\n".concat(node.value, "\n").concat(err.message)
              });
            }
            break;
          case "print":
            nodes.push({
              name: "text",
              value: _this4.eval(node.value)
            });
            break;
          default:
            nodes.push(node);
        }
        return nodes;
      }, []);
    }
  }]);
  return _default;
}();

export { _default as default };
