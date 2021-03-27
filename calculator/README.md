![enter image description here](https://github.com/jiwoo-choi/Clean-Code-Study/blob/main/TDD/calculator/screenshot.png)

# 로직설명

calculator.js의 Calculator 클래스 (생성자 함수)는 계산을 할 수 있는 뷰와 독립된 로직을 가질 수 있는 뷰모델입니다.

Calculator 클래스는 아래와 같은 로직 기능을 구현하였습니다.

- add : 연산자나 숫자 추가.
- delete : 현재 저장된 수식에서 한 글자를 뺄 것.
- deleteLast : 현재 저장된 수식에서 한 숫자 뭉탱이를 뺄것. 현재 `100-500` 이 있다면 결과로 `100-` 가 되어야합니다.
- deleteAll : 현재 저장된 모든 수식을 초기화합니다.
- eval : 현재 나와있는 수식을 기반으로 우선순위를 고려하여 계산합니다.

추가적으로 내부적으로 구현한 util function 들은 아래와 같습니다.

- mapToStack : 수식을 인자로 받습니다. 수식을 기준으로, 연산자 기준으로 나눠서 중위 수식 배열을 만듭니다.
- convertToPostFix : 중위 수식 배열을 인자로 받습니다. 중위 수식을 후위 수식으로 변경합니다.
- isNumber : string을 인자로 가지며, number타입인지 체크합니다.

테스트를 도와줄 수 있는 유틸 function도 추가해보았습니다.
```javascript

function assert(displayname, expect, actual) {
    
    if (Array.isArray(expect) || Array.isArray(actual)) {
        let max = Math.max(expect.length , actual.length);
        
        if (expect.length !== actual.length) {
            throw new Error("❌ " + displayname + " FAIL. \n expected : " + "["+ expect.join(",") + "]" + "\n actual : " + "["+ actual.join(",") + "]" );
        }

        for (let i = 0 ; i < max; i++) {
            if (expect[i] != actual[i]) {
                throw new Error("❌ " + displayname + " FAIL. \n expected : " + "["+ expect.join(",") + "]" + "\n actual : " + "["+ actual.join(",") + "]" );
            }
        }
        console.log("✅ " + displayname ,"PASS");
    } else if (expect === actual)  {
        console.log("✅ " + displayname ,"PASS");
    } else {
        throw new Error("❌ " + displayname + " FAIL. \n expected : " + expect + "\n actual : " + actual);
    }
}
```

## 로직 흐름
1. html 이벤트(view)에서 calculate의 메소드를 불러서 calculate의 상태에 변화를 일으킵니다.
2. calculate(view model)에서는 내부 str이라는 변수의 string을 기반으로 로직을 처리합니다.
3. calculate(view model)은 변한 결과를 view와 싱크할 수 있도록 합니다.

### 태그
TDD,MVVM,이벤트 버블링

### 느낀점
1. 뷰와 뷰 모델의 로직을 명확히 나누니까 확실히 "무엇을 테스트해야할지"가 명확해졌고, 그래서 테스트 코드를 구성하는것도 비교적 쉬웠습니다.
2. 자연스럽게 로직을 테스트 하기 쉽도록 기능들을 각 기능을 전담할 수 있도록 나눠서 짜기 시작했습니다.
3. 확실한 목표를 가지고 (테스트 조건과 테스트 통과) 구현해서 그런지, 테스트를 먼저 짜고 => 로직 + 리팩토링을 거친 경우에 구현시에 마음이 더 편했습니다(?).
4. 구현이 아니라, 테스트 조건을 먼저 생각하는 경우, 엣지 케이스를 생각하는게 더 수월했던것같습니다.
5. 로직에 문제가 있을 때, 비교적 그 문제의 원인을 파악하는게 쉬웠습니다.
6. 코드에 변화가 생겼을 때, 코드가 안전함을 보장받을 수 있었습니다.
7. 매 메소드마다 바인딩을 해주는 `rerender()`를 수동으로 불러야 했으므로, 바인딩로직이 매우 거추장스러웠습니다. 프록시객체등을 활용하여 View와 View Model의 바인딩이 간편한 로직을 개발해보는것도 좋을것같습니다.
