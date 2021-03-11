"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function imports() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  document.onload = function () {
    var constructed = [];
    args.forEach(function (obj) {
      var obj$ = obj;

      if (!obj$) {
        console.error("❌ 함수를 찾을 수 없습니다. import를 실패했습니다.");
        return;
      }

      if (typeof obj == 'function') {
        obj$ = new obj();
      } else {
        console.error("❌ 객체를 생성할 수 없는 타입입니다. 함수를 넣어주세요");
        return;
      }

      if (!obj$.init) {
        console.warn("⚠️ " + obj.name + " 에셔 init()을 찾을 수 없슴니다");
      } else {
        obj$.init();
      }
      /** 외부로 노출된 state와 별도의 내부용 state를 만듬. */


      obj$.$orig$state = _objectSpread({}, obj$.state);

      if (obj$.state == null || obj$.state == undefined) {
        console.warn("⚠️ " + obj.name + " 에셔 정의한 initial state를 찾을 수 없습니다. 이런 컨트롤러에서는 상태를 변경할 수 없으므로 render를 할 수 없습니다.");
      }

      if (obj$.component == null || obj$.component == undefined) {
        console.warn("⚠️ " + obj.name + " 에셔 정의한 html component를 찾을 수 없습니다. 이런 내부 컨트롤러에서는 외부 html뷰를 조작할 수 있는 참조값이 없습니다.");
      }

      if (!obj$.bind) {
        console.warn("⚠️ " + obj.name + " 에셔 bind()를 찾을 수 없습니다");
      } else {
        obj$.bind(obj$.component); // if (!obj$.component) {
        //     console.warn("❌ "+ obj.name + " 에셔 bind에서 리턴된 컴포넌트 객체가 없습니다");
        //     // return;
        // } else {
        //     // if (obj$.$component)
        // }
      }

      var render = obj$.render;

      if (render === undefined) {
        console.error("❌ " + obj.name + " render(state, component)함수가 추가되어 있지 않습니다. render(state, component) 함수를 객체에 추가해주세요");
        return;
      }

      obj$.setState = function (newState) {
        for (var key in newState) {
          if (obj$.$orig$state[key] != undefined) {
            if (newState[key] !== obj$.$orig$state[key]) {
              obj$.$orig$state[key] = newState[key];
            }
          } else {
            console.error("❌ " + "\"" + key + "\"" + "의 상태를 찾을 수 없습니다. 처음에 정의한 state만 사용할 수 있습니다.");
            return;
          }
        }
        /** 외부용 state와 내부용 state 모두 업데이트해줌.*/


        var ns = _objectSpread({}, obj$.$orig$state);

        obj$.state = ns;
        obj$.$orig$state = ns;
        obj$.render(ns, obj$.component);
      };
      /** 컴포넌트가 종속성이 모두 해결되었을 때, 불릴 함수. */


      if (obj$.controllerDidLoad) {
        obj$.controllerDidLoad();
      } else {
        obj$.controllerDidLoad = function () {};
      }
      /** 새롭게 컴포넌트를 주입시키고 싶은 경우. 라이프사이클을 bind부터 다시 시작함. */


      obj$.setComponent = function (newComponent) {
        obj$.component = newComponent;
        obj$.bind(newComponent);
        obj$.controllerDidLoad();
        obj$.render(_objectSpread({}, obj$.$orig$state), newComponent);
      };

      constructed.push(obj$);
    });
    return constructed;
  };
}
