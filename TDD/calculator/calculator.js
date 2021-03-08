function Calculator(textAreaElement) {

    this.str = "";
    this.operatorPushable = true;
    this.element = $(textAreaElement);
    let priority = {
        "%" : 2,
        "/" : 2,
        "*" : 2,
        "+" : 1,
        "-" : 1,
    }

    this.bind = () => {
        this.element.on('keydown', (event) => {
            var key = event.keyCode || event.charCode;
            // delete키 제외하고 모두 막음.
            if( key === 8 || key === 46 ){
                this.delete();
            } else return false;
        });
    }

    this.add = (value, isOperator) => {

        if (isOperator == true) {
            if (this.operatorPushable) {
                this.str += value;
                this.operatorPushable = false;
            } else {
                this.delete();
                this.str += value;
                this.operatorPushable = false;
            }
        } else {
            this.str += value;
            this.operatorPushable = true;
        }
        this.rerender();
    }

    this.deleteLast = () => {
        if (this.str.length <= 0) return;

        let arr = this.mapToStack(this.str);
        if (arr.length > 0) {
            let lastCharacter = arr.pop();
            if (!this.isNumber(lastCharacter)) return;
        }  
        this.str = arr.join("");
        this.rerender();
    }

    this.delete = () => {
        if (this.str.length <= 0) return;
        this.str = this.str.slice(0, this.str.length-1);
        this.rerender();
    }

    this.deleteAll = () => {
        if (this.str.length <= 0) return;
        this.str = "";
        this.rerender();
    }

    this.rerender = () => {
        if (this.element) {
            this.element.val(this.str);
        }
    }

    this.eval = () => {
        let infixArray = this.mapToStack(this.str);

        if (infixArray.length <= 0 || !this.isNumber(infixArray[infixArray.length-1])) {
            return false;
        }
        let postFix = this.convertToPostFix(infixArray);
        let stack = [];

        for(let element of postFix) {
            if (this.isNumber(element)) {
                stack.push(parseInt(element));
            } else {
                let val2 = stack.pop();
                let val1 = stack.pop();
                let intermediate = 0;
                if (element === '-') {
                    intermediate += val1 - val2;
                } else if (element === '%') {
                    intermediate += val1 % val2;
                } else if (element === '/') {
                    intermediate += val1 / val2;
                } else if (element === '*') {
                    intermediate += val1 * val2;
                } else if (element === '+') {
                    intermediate += val1 + val2;
                }
                stack.push(intermediate)
            }
        }

        this.str = `${stack.pop()}`;
        this.rerender();
        return true;
    }

    /** 사이드 이팩트가 없는 순수한 함수여야할것. */
    this.mapToStack = (currentstr) => {
        currentstr = currentstr.replace(/\+/gi, ",+,");
        currentstr = currentstr.replace(/\%/gi, ",%,");
        currentstr = currentstr.replace(/\-/gi, ",-,");
        currentstr = currentstr.replace(/\*/gi, ",*,");
        currentstr = currentstr.replace(/\//gi, ",/,");
        return currentstr.split(",");
    }
    
    /** 사이드 이펙트가 없는 순수한 함수여야할것. */
    this.convertToPostFix = (infixArray) => {
        let infixResult = [];
        let oppStack = [];
    
        for (let element of infixArray) {
            if (this.isNumber(element)) {
                infixResult.push(element);
            } else {
                if (oppStack.length === 0) {
                    oppStack.push(element);
                } else {
                    let last = oppStack[oppStack.length-1];
                    if (priority[last] < priority[element]) {
                        oppStack.push(element);
                    } else {
                        while(oppStack.length !== 0 && priority[last] >= priority[element]) {
                            infixResult.push(oppStack.pop());
                            if (oppStack.length > 0) last = oppStack[oppStack.length-1];
                        }
                        oppStack.push(element);
                    }
                }
            }
        }
        while (oppStack.length !== 0) {
            infixResult.push(oppStack.pop());
        }
        return infixResult;
    }


    /** 사이드 이펙트가 없는 순수한 함수여야 할것 */
    this.isNumber = (value) => {
        return /^\d+$/.test(value);
    }

    this.bind();
}


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

/** 테스트코드 */
/**
let calc = new Calculator();

calc.add("1", false);
assert("add : 숫자를 한글자 추가했을 때, 숫자를 추가해야한다", "1", calc.str);
calc.add("+", true);
assert("add : 연산자를 추가했을 때, 연산자를 추가해야한다.", "1+", calc.str);
calc.add("+", true);
assert("add : 연산자를 연속해서 추가했을 때, 같다면 무시되어야한다.", "1+", calc.str);
calc.add("-", true);
assert("add : 연산자를 연속해서 추가했을 때, 다르다면 교체되어야한다. ", "1-", calc.str);

calc.delete();
assert("delete : 연산자를 제대로 삭제해야 한다 ", "1", calc.str);
calc.delete();
assert("delete : 숫자를 제대로 삭제해야한다.", "" , calc.str);
calc.delete();
assert("delete : 아무것도 없는 상태에서 삭제하려면, 무시하거나, 에러가 안나야 한다. ", "", calc.str);

calc.add("1+2+3+4+5");
calc.deleteAll();
assert("delete all : 모든 값이 정상적으로 삭제되어야한다.", "" , calc.str);
calc.deleteAll();
assert("delete all : 아무것도 없은 상태에서 삭제되면, 무시하거나 에러가 안나야 한다", "" , calc.str);


assert("map to stack : + 연산자와 숫자를 분리할 수 있어야 한다", ["1" , "+", "2"],calc.mapToStack("1+2"));
assert("map to stack : +, - , % , / , * 를 연산자와 숫자를 분리할 수 있어야 한다", ["1" , "+", "2" , "-" , "3" , "%" , "4" , "/" , "5"],calc.mapToStack("1+2-3%4/5"));
calc.add("1+2-3%4/5");
calc.mapToStack("1+2");
assert("map to stack : map to stack은 실제 객체의 상태에 영향을 끼치지 않는다." , "1+2-3%4/5", calc.str);

assert("isnumber : string값이 number 타입인지 인지 체크한다. (일의자리)", true, calc.isNumber("1"));
assert("isnumber : string값이 number 타입인지 인지 체크한다. (한자리 연산자)", false, calc.isNumber("+"));
assert("isnumber : string값이 number 타입인지 인지 체크한다. (백의자리)", true, calc.isNumber("500"));
assert("isnumber : string값이 number 타입인지 인지 체크한다 (섞인경우).", false, calc.isNumber("-50+0"));


calc.deleteAll();
calc.add("1+2-3%4/5");
calc.deleteLast()
assert("deleteLast : 마지막값이 제대로 제거되어야한다 ", "1+2-3%4/", calc.str);

calc.deleteAll();
calc.add("1+2-3%4/");
calc.deleteLast()
assert("deleteLast : 마지막값이 연산자인경우 무시해야한다. ", "1+2-3%4/", calc.str);

calc.deleteAll();
calc.add("1+2-3%4/5555");
calc.deleteLast()
assert("deleteLast : 마지막 숫자가 여러자리여도 정상적으로 삭제되어야한다. ", "1+2-3%4/", calc.str);


assert("convertToPostFix : 중위연산자를 우선순위에 맞게 잘 처리해야한다.",["2" , "7", "5" , "*", "+"] , calc.convertToPostFix(["2" , "+" , "7", "*" , "5"]));
assert("convertToPostFix : 중위연산자를 우선순위에 맞게 잘 처리해야한다.",["2" , "7", "*", "5" , "+"] , calc.convertToPostFix(["2" , "*" , "7", "+" , "5"]));

calc.deleteAll();
calc.add("1");
calc.eval();
assert("eval : 한 숫자가 들어와도 연산을 잘 해내야한다", "1" , calc.str);

calc.deleteAll();
calc.add("1+2");
calc.eval();
assert("eval : 덧셈을 잘 해내야한다", "3" , calc.str);

calc.deleteAll();
calc.add("1-2");
calc.eval();
assert("eval : 뺄셈을 잘 해내야 한다", "-1" , calc.str);

calc.deleteAll();
calc.add("1*2");
calc.eval();
assert("eval : 곱셈을 잘 해내야 한다", "2" , calc.str);

calc.deleteAll();
calc.add("1/2");
calc.eval();
assert("eval : 나눗셈을 잘 해내야 한다", "0.5" , calc.str);

calc.deleteAll();
calc.add("1%2");
calc.eval();
assert("eval : 나머지연산을 잘 해내야 한다", "1" , calc.str);

calc.deleteAll();
calc.add("2+7*5");
calc.eval();
assert("eval : 우선순위를 고려해야한다 + > *", "37" , calc.str);

calc.deleteAll();
calc.add("2*7+5");
calc.eval();
assert("eval : 우선순위를 고려해야한다 * > +", "19" , calc.str);

calc.deleteAll();
calc.add("2*7+5/");
assert("올바르지 않을 때는 계산하지 않는다." , false, calc.eval());
assert("올바르지 않을 때는 계산하지 않는다 - 상태체크" , "2*7+5/", calc.str);

*/
