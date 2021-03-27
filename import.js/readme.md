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
- 최대한 html코드와 js코드를 나누고, (로직 부분에 있어서는 js에서 모든 처리 가능)
- 최대한 뷰에 대한 html 코드(html selector) 없이 일정한 방법으로 작업할 수 있으며. (state,bind,action함수 등 Controller가 제공하는 훅 함수 사용)
- 작업단위가 동일해야한다. (Controller 라는 단위)
- 테스트 하기가 쉬워진다.


## Snippets
추가적으로, 여러가지 훅 함수들을 사용하기 여러 코드들을 직접 장성해야하는데..
그 피로를 줄이기 위해 vs-code의 snippet도 작성해두었다.

![img](https://github.com/jiwoo-choi/hands-on-coding-project/blob/main/Framework/import.js/snippet.gif)


## Usage

### LifeCycle

```
init() -> bind() -> controllerDidLoad()
```

* `this.init()` : constructor와 비슷한 역할을 합니다. 이곳에서 this.state와 this.component의 초기 상태를 설정할 수 있습니다. 이 함수가 시작될 땐, 다른 함수들이 주입되지 않았으므로, 멤버 변수를 초기화 하는 행위 외에는 뷰나 상태등을 변경하지 않는걸 권장합니다.
* `this.bind(component)` : component (html view component) 등을 업데이트 합니다. 함수 인자값으로 들어오는 component는 현재 연결된 component 입니다. 후에 setComponent 함수로 동적으로 component가 주입될 수 있기 때문에, 인자로 들어온 component로 바인딩 하는걸 권장합니다.
* `this.controllerDidLoad()` : 앞 두 라이프사이클을 통해서 모든 종속성이 해결되면 컨트롤러 작업이 완료되었으므로 불립니다.

### Setter
* `setState(newState)`: 저장되어있는 state를 변경하고 render()를 트리거합니다.
* `setComponent(newComponent)` : 저장되어있는 컴포넌트를 변경하고 `bind()`부터 라이프사이클을 다시 시작합니다. 로드가 완료되면 현재 상태에서 `render()`를 다시부릅니다.

### Render
* `render(state,component)` : 

### Member variables
* `this.state` : 해당 state는 변경해도 실제 render에 영향을 미치지 못합니다. state는 오직 `this.setState(newState)`에 의해서만 변경됩니다.
* `this.component`: 컨트롤러와 연관되어 있는 html dom 객체입니다. 


### Example - import하기
html코드에 아래와 같이 등록한다.
```
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="./import.js"></script>
    <script>
        imports(TestController);
    </script>
```

### Babel support
ES6 문법을 사용하고 있기 때문에, 바벨을 포함하였습니다.
```
npm install 
```
```
npm run-script build
```
