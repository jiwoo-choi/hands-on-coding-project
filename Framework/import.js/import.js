function imports(...args) {

    $(document).ready( () => {

        args.forEach( obj => {
            
            let obj$ = obj;

            if (!obj$) {
                console.error("❌ 함수를 찾을 수 없습니다. import를 실패했습니다.")
                return;
            }

            if (typeof obj == 'function') {
                obj$ = new obj();
            } else {
                console.error("❌ 객체를 생성할 수 없는 타입입니다. 함수를 넣어주세요");
                return;
            }

            obj$.$orig$state = $.extend({},obj$.state);

            if (obj$.state == null || obj$.state == undefined) {
                console.warn("⚠️ "+ obj.name + " 에셔 정의한 state를 찾을 수 없습니다. 이런 컨트롤러에서는 상태를 변경할 수 없으므로 render를 할 수 없습니다.");
            } 
            if (!obj$.bind) {
                console.warn("⚠️ "+ obj.name + " 에셔 bind()를 찾을 수 없슴니다");
            } else {
                obj$.$component = obj$.bind();
                if (!obj$.$component) {
                    console.error("❌ "+ obj.name + " 에셔 bind에서 리턴된 컴포넌트가 없습니다");
                    return;
                } else {
                    // if (obj$.$component)
                }
            }

            let render = obj$.render;
            if (render === undefined) {
                console.error("❌ " + obj.name + " render(state, component)함수가 추가되어 있지 않습니다. render(state, component) 함수를 객체에 추가해주세요");
                return;
            }
            obj.prototype.setState = (newState) => {
                for (let key in newState) {
                    if (obj$.$orig$state[key] != undefined){
                        if (newState[key] !== obj$.$orig$state[key]) {
                            obj$.$orig$state[key] = newState[key];
                        }
                    } else {
                        console.error("❌ " + "\""+ key + "\"" + "의 상태를 찾을 수 없습니다. 처음에 정의한 state만 사용할 수 있습니다.");
                        return;
                    }
                } 
                obj$.render($.extend({},obj$.$orig$state), obj$.$component);
            }

            let action = obj$.action;
            if (action === undefined) {
                console.warn("⚠️ "+ obj.name + "  action()이 등록되어 있지 않습니다.");
            } else {
                obj$.action(obj$.$component);
            }

            // 모든 종속성 및 필수 등록 이후 해결..
            if (!obj$.init) {
                console.warn("⚠️ "+ obj.name + " 에셔 init()을 찾을 수 없슴니다");
            } else {
                obj$.init();
            }
   
        })

    })
}
