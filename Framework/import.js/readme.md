## Motivation

[caluclator.js](https://github.com/jiwoo-choi/mini-coding-project/tree/main/TDD/calculator)를 통해, html과 js의 로직을 최대한 분리하면, 테스트 케이스를 생각하고, 테스트 코드를 작성하는데 매우 유리하다는것을 깨닫았다.
이를 통해, 로직을 뷰에서 효과적으로 분리할 수 있는 js 코드를 많이 생각해보았다.

가장 간단하게 이 문제를 해결하는 방법은 단순하게 파일을 여러개로 쪼개는것이다.

하지만 이런 방법도 팀별로 작업하거나 프로젝트가 복잡해져 파일이 많아질 때, 문제가 생길것이라고 생각했다.

- 의미가 퇴색된 js파일들을 만들 확률이 큼. (global.js, index.js)
- js를 단순하게 만들다 보면 윈도우 객체에 함수나 변수들이 등록될 가능성이 높음.
- 각 쪼개진 파일마다 서로 다른 방식의 뷰 업데이트 및 로직을 수행하니, 코드 읽는데 피로감이 쌓임.

이런 문제를 해결하기위해 React의 방식을 참고하였다.
- 컴포넌트처럼 Controller라는 일정 단위를 만들었음.
- state를 두고, 그 state를 업데이트할때만 render가 불리도록 했음.

리액트처럼 훌륭한 뷰와 js의 바인딩 방식을 제공하는것은 아니지만,
- 최대한 html코드와 js코드를 나누고, (js에서 모든 처리 가능)
- 최대한 뷰에 대한 html 코드(html selector) 없이 일정한 방법으로 작업할 수 있으며. (state,bind,action함수 등 Controller가 제공하는 훅 함수 사용)
- 작업단위가 동일해야한다. (Controller 라는 단위)

## Snippets
추가적으로, 여러가지 훅 함수들을 사용하기 위해서는 여러 코드들을 직접 작성해야하는 피로를 줄이기 위해
vs-code의 snippet도 작성해두었다.

![img](https://github.com/jiwoo-choi/mini-coding-project/blob/main/Framework/import.js/snippet.gif)


## Usage
### Controller 정의

1. snippets를 활용하여 컨트롤러 보일러플레이트 코드를 생성한다.
`controllers.js`
```
function TestController(){ 
    this.state = { }
    this.bind = () => {
        return { } 
    }
    this.action = (component) => { 
    }
    this.render = (state, component) => {
    }
}
```

* this.state : 가장 최초 state를 정의한다. 이 state는 변경되지 않는다. 
* this.setState : 기본으로 상속되는 코드이다. 모든 상태는 이 메소드 하나만을 가지고 변경가능하다. render()를 trigger하는 메소드이다.
* this.bind : 외부 html을 내부 객체에서 통일해서 사용할 수 있도록 객체를 리턴한다. 여기서 리턴된 객체들이 뒤 component부분에 들어간다.
* this.action : 외부 html의 action 부분을 정의하기 위해 만든 메소드다. 특별한 역할은 없고, 코드를 나누기 위해서 추가하였다.
* this.render : render는 상태가 변경되었을 때 사용된다.

```
function TestController(){ 
    this.state = {
        str : ""
     }

    this.bind = () => {
        return { 
            input : $('input')
            container : $('.container')
        } 
    }

    this.action = (component) => { 
        component.container.on('click', (e) => {
            this.setState({str: e.target.value});
        })
    }
    this.render = (state, component) => {
        component.input.val(state.str);
    }
}
```


### LifeCycle

1. intial state 등록.
2. bind를 통해 객체 내부에서 사용할 html 엘리먼트 등록.
3. action을 통해 bind된 html 엘리먼트의 액션 등록.
4. 모든 것이 resolved 되면, init() 이 불린다.

## unresolved 문제
- 렌더링 시, 성능 문제
- 내부 state diff 체크의 시간 복잡도와, 정확성.
- bind() 함수의 필요성. bind가 꼭 필요한가? bind를 어떻게 활용해줄 수 있을까?
- this.state() intial state 랜더 여부.
- 라이프사이클 -> init -> bind? bind -> init?

