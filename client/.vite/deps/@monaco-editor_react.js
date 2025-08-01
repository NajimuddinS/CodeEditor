import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e2 = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e2 = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e2;
    }
  }
  return _arr;
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

// node_modules/state-local/lib/es/state-local.js
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread22(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys2(Object(source), true).forEach(function(key) {
        _defineProperty2(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys2(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
}
function curry(fn) {
  return function curried() {
    var _this = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
function isObject(value) {
  return {}.toString.call(value).includes("Object");
}
function isEmpty(obj) {
  return !Object.keys(obj).length;
}
function isFunction(value) {
  return typeof value === "function";
}
function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}
function validateChanges(initial, changes) {
  if (!isObject(changes)) errorHandler("changeType");
  if (Object.keys(changes).some(function(field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler("changeField");
  return changes;
}
function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler("selectorType");
}
function validateHandler(handler) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler("handlerType");
  if (isObject(handler) && Object.values(handler).some(function(_handler) {
    return !isFunction(_handler);
  })) errorHandler("handlersType");
}
function validateInitial(initial) {
  if (!initial) errorHandler("initialIsRequired");
  if (!isObject(initial)) errorHandler("initialType");
  if (isEmpty(initial)) errorHandler("initialContent");
}
function throwError(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
}
var errorMessages = {
  initialIsRequired: "initial state is required",
  initialType: "initial state should be an object",
  initialContent: "initial state shouldn't be an empty object",
  handlerType: "handler should be an object or a function",
  handlersType: "all handlers should be a functions",
  selectorType: "selector should be a function",
  changeType: "provided value of changes should be an object",
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": "an unknown error accured in `state-local` package"
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};
function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  validators.initial(initial);
  validators.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry(didStateUpdate)(state, handler);
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);
  function getState2() {
    var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
      return state2;
    };
    validators.selector(selector);
    return selector(state.current);
  }
  function setState2(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }
  return [getState2, setState2];
}
function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}
function updateState(state, changes) {
  state.current = _objectSpread22(_objectSpread22({}, state.current), changes);
  return changes;
}
function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
    var _handler$field;
    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}
var index = {
  create
};
var state_local_default = index;

// node_modules/@monaco-editor/loader/lib/es/config/index.js
var config = {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
  }
};
var config_default = config;

// node_modules/@monaco-editor/loader/lib/es/utils/curry.js
function curry2(fn) {
  return function curried() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
var curry_default = curry2;

// node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
function isObject2(value) {
  return {}.toString.call(value).includes("Object");
}
var isObject_default = isObject2;

// node_modules/@monaco-editor/loader/lib/es/validators/index.js
function validateConfig(config3) {
  if (!config3) errorHandler2("configIsRequired");
  if (!isObject_default(config3)) errorHandler2("configType");
  if (config3.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config3.urls.monacoBase
      }
    };
  }
  return config3;
}
function informAboutDeprecation() {
  console.warn(errorMessages2.deprecation);
}
function throwError2(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
}
var errorMessages2 = {
  configIsRequired: "the configuration object is required",
  configType: "the configuration object should be an object",
  "default": "an unknown error accured in `@monaco-editor/loader` package",
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler2 = curry_default(throwError2)(errorMessages2);
var validators2 = {
  config: validateConfig
};
var validators_default = validators2;

// node_modules/@monaco-editor/loader/lib/es/utils/compose.js
var compose2 = function compose3() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
};
var compose_default = compose2;

// node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js
function merge(target, source) {
  Object.keys(source).forEach(function(key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _objectSpread2(_objectSpread2({}, target), source);
}
var deepMerge_default = merge;

// node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
var CANCELATION_MESSAGE = {
  type: "cancelation",
  msg: "operation is manually canceled"
};
function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function(resolve, reject) {
    promise.then(function(val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function() {
    return hasCanceled_ = true;
  }, wrappedPromise;
}
var makeCancelable_default = makeCancelable;

// node_modules/@monaco-editor/loader/lib/es/loader/index.js
var _state$create = state_local_default.create({
  config: config_default,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
});
var _state$create2 = _slicedToArray(_state$create, 2);
var getState = _state$create2[0];
var setState = _state$create2[1];
function config2(globalConfig) {
  var _validators$config = validators_default.config(globalConfig), monaco = _validators$config.monaco, config3 = _objectWithoutProperties(_validators$config, ["monaco"]);
  setState(function(state) {
    return {
      config: deepMerge_default(state.config, config3),
      monaco
    };
  });
}
function init() {
  var state = getState(function(_ref) {
    var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
    return {
      monaco,
      isInitialized,
      resolve
    };
  });
  if (!state.isInitialized) {
    setState({
      isInitialized: true
    });
    if (state.monaco) {
      state.resolve(state.monaco);
      return makeCancelable_default(wrapperPromise);
    }
    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return makeCancelable_default(wrapperPromise);
    }
    compose_default(injectScripts, getMonacoLoaderScript)(configureLoader);
  }
  return makeCancelable_default(wrapperPromise);
}
function injectScripts(script) {
  return document.body.appendChild(script);
}
function createScript(src) {
  var script = document.createElement("script");
  return src && (script.src = src), script;
}
function getMonacoLoaderScript(configureLoader2) {
  var state = getState(function(_ref2) {
    var config3 = _ref2.config, reject = _ref2.reject;
    return {
      config: config3,
      reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
  loaderScript.onload = function() {
    return configureLoader2();
  };
  loaderScript.onerror = state.reject;
  return loaderScript;
}
function configureLoader() {
  var state = getState(function(_ref3) {
    var config3 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
    return {
      config: config3,
      resolve,
      reject
    };
  });
  var require2 = window.require;
  require2.config(state.config);
  require2(["vs/editor/editor.main"], function(monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function(error) {
    state.reject(error);
  });
}
function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco
    });
  }
}
function __getMonacoInstance() {
  return getState(function(_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}
var wrapperPromise = new Promise(function(resolve, reject) {
  return setState({
    resolve,
    reject
  });
});
var loader = {
  config: config2,
  init,
  __getMonacoInstance
};
var loader_default = loader;

// node_modules/@monaco-editor/react/dist/index.mjs
var import_react = __toESM(require_react(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_react4 = __toESM(require_react(), 1);
var import_react5 = __toESM(require_react(), 1);
var import_react6 = __toESM(require_react(), 1);
var import_react7 = __toESM(require_react(), 1);
var import_react8 = __toESM(require_react(), 1);
var import_react9 = __toESM(require_react(), 1);
var import_react10 = __toESM(require_react(), 1);
var import_react11 = __toESM(require_react(), 1);
var le = { wrapper: { display: "flex", position: "relative", textAlign: "initial" }, fullWidth: { width: "100%" }, hide: { display: "none" } };
var v = le;
var ae = { container: { display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" } };
var Y = ae;
function Me({ children: e }) {
  return import_react5.default.createElement("div", { style: Y.container }, e);
}
var Z = Me;
var $ = Z;
function Ee({ width: e, height: r, isEditorReady: n, loading: t, _ref: a, className: m, wrapperProps: E }) {
  return import_react4.default.createElement("section", { style: { ...v.wrapper, width: e, height: r }, ...E }, !n && import_react4.default.createElement($, null, t), import_react4.default.createElement("div", { ref: a, style: { ...v.fullWidth, ...!n && v.hide }, className: m }));
}
var ee = Ee;
var H = (0, import_react3.memo)(ee);
function Ce(e) {
  (0, import_react6.useEffect)(e, []);
}
var k = Ce;
function he(e, r, n = true) {
  let t = (0, import_react7.useRef)(true);
  (0, import_react7.useEffect)(t.current || !n ? () => {
    t.current = false;
  } : e, r);
}
var l = he;
function D() {
}
function h(e, r, n, t) {
  return De(e, t) || be(e, r, n, t);
}
function De(e, r) {
  return e.editor.getModel(te(e, r));
}
function be(e, r, n, t) {
  return e.editor.createModel(r, n, t ? te(e, t) : void 0);
}
function te(e, r) {
  return e.Uri.parse(r);
}
function Oe({ original: e, modified: r, language: n, originalLanguage: t, modifiedLanguage: a, originalModelPath: m, modifiedModelPath: E, keepCurrentOriginalModel: g = false, keepCurrentModifiedModel: N = false, theme: x = "light", loading: P = "Loading...", options: y = {}, height: V = "100%", width: z = "100%", className: F, wrapperProps: j = {}, beforeMount: A = D, onMount: q = D }) {
  let [M, O] = (0, import_react2.useState)(false), [T, s] = (0, import_react2.useState)(true), u = (0, import_react2.useRef)(null), c = (0, import_react2.useRef)(null), w = (0, import_react2.useRef)(null), d = (0, import_react2.useRef)(q), o = (0, import_react2.useRef)(A), b = (0, import_react2.useRef)(false);
  k(() => {
    let i = loader_default.init();
    return i.then((f) => (c.current = f) && s(false)).catch((f) => (f == null ? void 0 : f.type) !== "cancelation" && console.error("Monaco initialization: error:", f)), () => u.current ? I() : i.cancel();
  }), l(() => {
    if (u.current && c.current) {
      let i = u.current.getOriginalEditor(), f = h(c.current, e || "", t || n || "text", m || "");
      f !== i.getModel() && i.setModel(f);
    }
  }, [m], M), l(() => {
    if (u.current && c.current) {
      let i = u.current.getModifiedEditor(), f = h(c.current, r || "", a || n || "text", E || "");
      f !== i.getModel() && i.setModel(f);
    }
  }, [E], M), l(() => {
    let i = u.current.getModifiedEditor();
    i.getOption(c.current.editor.EditorOption.readOnly) ? i.setValue(r || "") : r !== i.getValue() && (i.executeEdits("", [{ range: i.getModel().getFullModelRange(), text: r || "", forceMoveMarkers: true }]), i.pushUndoStop());
  }, [r], M), l(() => {
    var _a, _b;
    (_b = (_a = u.current) == null ? void 0 : _a.getModel()) == null ? void 0 : _b.original.setValue(e || "");
  }, [e], M), l(() => {
    let { original: i, modified: f } = u.current.getModel();
    c.current.editor.setModelLanguage(i, t || n || "text"), c.current.editor.setModelLanguage(f, a || n || "text");
  }, [n, t, a], M), l(() => {
    var _a;
    (_a = c.current) == null ? void 0 : _a.editor.setTheme(x);
  }, [x], M), l(() => {
    var _a;
    (_a = u.current) == null ? void 0 : _a.updateOptions(y);
  }, [y], M);
  let L = (0, import_react2.useCallback)(() => {
    var _a;
    if (!c.current) return;
    o.current(c.current);
    let i = h(c.current, e || "", t || n || "text", m || ""), f = h(c.current, r || "", a || n || "text", E || "");
    (_a = u.current) == null ? void 0 : _a.setModel({ original: i, modified: f });
  }, [n, r, a, e, t, m, E]), U = (0, import_react2.useCallback)(() => {
    var _a;
    !b.current && w.current && (u.current = c.current.editor.createDiffEditor(w.current, { automaticLayout: true, ...y }), L(), (_a = c.current) == null ? void 0 : _a.editor.setTheme(x), O(true), b.current = true);
  }, [y, x, L]);
  (0, import_react2.useEffect)(() => {
    M && d.current(u.current, c.current);
  }, [M]), (0, import_react2.useEffect)(() => {
    !T && !M && U();
  }, [T, M, U]);
  function I() {
    var _a, _b, _c, _d;
    let i = (_a = u.current) == null ? void 0 : _a.getModel();
    g || ((_b = i == null ? void 0 : i.original) == null ? void 0 : _b.dispose()), N || ((_c = i == null ? void 0 : i.modified) == null ? void 0 : _c.dispose()), (_d = u.current) == null ? void 0 : _d.dispose();
  }
  return import_react2.default.createElement(H, { width: z, height: V, isEditorReady: M, loading: P, _ref: w, className: F, wrapperProps: j });
}
var ie = Oe;
var we = (0, import_react.memo)(ie);
function Pe() {
  let [e, r] = (0, import_react8.useState)(loader_default.__getMonacoInstance());
  return k(() => {
    let n;
    return e || (n = loader_default.init(), n.then((t) => {
      r(t);
    })), () => n == null ? void 0 : n.cancel();
  }), e;
}
var Le = Pe;
function He(e) {
  let r = (0, import_react11.useRef)();
  return (0, import_react11.useEffect)(() => {
    r.current = e;
  }, [e]), r.current;
}
var se = He;
var _ = /* @__PURE__ */ new Map();
function Ve({ defaultValue: e, defaultLanguage: r, defaultPath: n, value: t, language: a, path: m, theme: E = "light", line: g, loading: N = "Loading...", options: x = {}, overrideServices: P = {}, saveViewState: y = true, keepCurrentModel: V = false, width: z = "100%", height: F = "100%", className: j, wrapperProps: A = {}, beforeMount: q = D, onMount: M = D, onChange: O, onValidate: T = D }) {
  let [s, u] = (0, import_react10.useState)(false), [c, w] = (0, import_react10.useState)(true), d = (0, import_react10.useRef)(null), o = (0, import_react10.useRef)(null), b = (0, import_react10.useRef)(null), L = (0, import_react10.useRef)(M), U = (0, import_react10.useRef)(q), I = (0, import_react10.useRef)(), i = (0, import_react10.useRef)(t), f = se(m), Q = (0, import_react10.useRef)(false), B = (0, import_react10.useRef)(false);
  k(() => {
    let p = loader_default.init();
    return p.then((R) => (d.current = R) && w(false)).catch((R) => (R == null ? void 0 : R.type) !== "cancelation" && console.error("Monaco initialization: error:", R)), () => o.current ? pe() : p.cancel();
  }), l(() => {
    var _a, _b, _c, _d;
    let p = h(d.current, e || t || "", r || a || "", m || n || "");
    p !== ((_a = o.current) == null ? void 0 : _a.getModel()) && (y && _.set(f, (_b = o.current) == null ? void 0 : _b.saveViewState()), (_c = o.current) == null ? void 0 : _c.setModel(p), y && ((_d = o.current) == null ? void 0 : _d.restoreViewState(_.get(m))));
  }, [m], s), l(() => {
    var _a;
    (_a = o.current) == null ? void 0 : _a.updateOptions(x);
  }, [x], s), l(() => {
    !o.current || t === void 0 || (o.current.getOption(d.current.editor.EditorOption.readOnly) ? o.current.setValue(t) : t !== o.current.getValue() && (B.current = true, o.current.executeEdits("", [{ range: o.current.getModel().getFullModelRange(), text: t, forceMoveMarkers: true }]), o.current.pushUndoStop(), B.current = false));
  }, [t], s), l(() => {
    var _a, _b;
    let p = (_a = o.current) == null ? void 0 : _a.getModel();
    p && a && ((_b = d.current) == null ? void 0 : _b.editor.setModelLanguage(p, a));
  }, [a], s), l(() => {
    var _a;
    g !== void 0 && ((_a = o.current) == null ? void 0 : _a.revealLine(g));
  }, [g], s), l(() => {
    var _a;
    (_a = d.current) == null ? void 0 : _a.editor.setTheme(E);
  }, [E], s);
  let X = (0, import_react10.useCallback)(() => {
    var _a;
    if (!(!b.current || !d.current) && !Q.current) {
      U.current(d.current);
      let p = m || n, R = h(d.current, t || e || "", r || a || "", p || "");
      o.current = (_a = d.current) == null ? void 0 : _a.editor.create(b.current, { model: R, automaticLayout: true, ...x }, P), y && o.current.restoreViewState(_.get(p)), d.current.editor.setTheme(E), g !== void 0 && o.current.revealLine(g), u(true), Q.current = true;
    }
  }, [e, r, n, t, a, m, x, P, y, E, g]);
  (0, import_react10.useEffect)(() => {
    s && L.current(o.current, d.current);
  }, [s]), (0, import_react10.useEffect)(() => {
    !c && !s && X();
  }, [c, s, X]), i.current = t, (0, import_react10.useEffect)(() => {
    var _a, _b;
    s && O && ((_a = I.current) == null ? void 0 : _a.dispose(), I.current = (_b = o.current) == null ? void 0 : _b.onDidChangeModelContent((p) => {
      B.current || O(o.current.getValue(), p);
    }));
  }, [s, O]), (0, import_react10.useEffect)(() => {
    if (s) {
      let p = d.current.editor.onDidChangeMarkers((R) => {
        var _a;
        let G = (_a = o.current.getModel()) == null ? void 0 : _a.uri;
        if (G && R.find((J) => J.path === G.path)) {
          let J = d.current.editor.getModelMarkers({ resource: G });
          T == null ? void 0 : T(J);
        }
      });
      return () => {
        p == null ? void 0 : p.dispose();
      };
    }
    return () => {
    };
  }, [s, T]);
  function pe() {
    var _a, _b;
    (_a = I.current) == null ? void 0 : _a.dispose(), V ? y && _.set(m, o.current.saveViewState()) : (_b = o.current.getModel()) == null ? void 0 : _b.dispose(), o.current.dispose();
  }
  return import_react10.default.createElement(H, { width: z, height: F, isEditorReady: s, loading: N, _ref: b, className: j, wrapperProps: A });
}
var fe = Ve;
var de = (0, import_react9.memo)(fe);
var Ft = de;
export {
  we as DiffEditor,
  de as Editor,
  Ft as default,
  loader_default as loader,
  Le as useMonaco
};
//# sourceMappingURL=@monaco-editor_react.js.map
