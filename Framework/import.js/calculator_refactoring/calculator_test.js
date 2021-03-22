

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

let calc = imports(CalculatorController)[0];

calc.add("1", false);
assert("add : 숫자를 한글자 추가했을 때, 숫자를 추가해야한다", "1", calc.state.str);
calc.add("+", true);
assert("add : 연산자를 추가했을 때, 연산자를 추가해야한다.", "1+", calc.state.str);
calc.add("+", true);
assert("add : 연산자를 연속해서 추가했을 때, 같다면 무시되어야한다.", "1+", calc.state.str);
calc.add("-", true);
assert("add : 연산자를 연속해서 추가했을 때, 다르다면 교체되어야한다. ", "1-", calc.state.str);
calc.delete();
assert("delete : 연산자를 제대로 삭제해야 한다 ", "1", calc.state.str);
calc.delete();
assert("delete : 숫자를 제대로 삭제해야한다.", "" , calc.state.str);
calc.delete();
assert("delete : 아무것도  없는 상태에서 삭제하려면, 무시하거나, 에러가 안나야 한다. ", "", calc.state.str);
calc.add("1+2+3+4+5");
calc.deleteAll();
assert("delete all : 모든 값이 정상적으로 삭제되어야한다.", "" , calc.state.str);
calc.deleteAll();
assert("delete all : 아무것도 없은 상태에서 삭제되면, 무시하거나 에러가 안나야 한다", "" , calc.state.str);
assert("map to stack : + 연산자와 숫자를 분리할 수 있어야 한다", ["1" , "+", "2"],calc.mapToStack("1+2"));
assert("map to stack : +, - , % , / , * 를 연산자와 숫자를 분리할 수 있어야 한다", ["1" , "+", "2" , "-" , "3" , "%" , "4" , "/" , "5"],calc.mapToStack("1+2-3%4/5"));
calc.add("1+2-3%4/5");
calc.mapToStack("1+2");
assert("map to stack : map to stack은 실제 객체의 상태에 영향을 끼치지 않는다." , "1+2-3%4/5", calc.state.str);
assert("isnumber : string값이 number 타입인지 인지 체크한다. (일의자리)", true, calc.isNumber("1"));
assert("isnumber : string값이 number 타입인지 인지 체크한다. (한자리 연산자)", false, calc.isNumber("+"));
assert("isnumber : string값이 number 타입인지 인지 체크한다. (백의자리)", true, calc.isNumber("500"));
assert("isnumber : string값이 number 타입인지 인지 체크한다 (섞인경우).", false, calc.isNumber("-50+0"));
calc.deleteAll();
calc.add("1+2-3%4/5");
calc.deleteLast()
assert("deleteLast : 마지막값이 제대로 제거되어야한다 ", "1+2-3%4/", calc.state.str);
calc.deleteAll();
calc.add("1+2-3%4/");
calc.deleteLast()
assert("deleteLast : 마지막값이 연산자인경우 무시해야한다. ", "1+2-3%4/", calc.state.str);
calc.deleteAll();
calc.add("1+2-3%4/5555");
calc.deleteLast()
assert("deleteLast : 마지막 숫자가 여러자리여도 정상적으로 삭제되어야한다. ", "1+2-3%4/", calc.state.str);
assert("convertToPostFix : 중위연산자를 우선순위에 맞게 잘 처리해야한다.",["2" , "7", "5" , "*", "+"] , calc.convertToPostFix(["2" , "+" , "7", "*" , "5"]));
assert("convertToPostFix : 중위연산자를 우선순위에 맞게 잘 처리해야한다.",["2" , "7", "*", "5" , "+"] , calc.convertToPostFix(["2" , "*" , "7", "+" , "5"]));
calc.deleteAll();
calc.add("1");
calc.eval();
assert("eval : 한 숫자가 들어와도 연산을 잘 해내야한다", "1" , calc.state.str);
calc.deleteAll();
calc.add("1+2");
calc.eval();
assert("eval : 덧셈을 잘 해내야한다", "3" , calc.state.str);
calc.deleteAll();
calc.add("1-2");
calc.eval();
assert("eval : 뺄셈을 잘 해내야 한다", "-1" , calc.state.str);
calc.deleteAll();
calc.add("1*2");
calc.eval();
assert("eval : 곱셈을 잘 해내야 한다", "2" , calc.state.str);
calc.deleteAll();
calc.add("1/2");
calc.eval();
assert("eval : 나눗셈을 잘 해내야 한다", "0.5" , calc.state.str);
calc.deleteAll();
calc.add("1%2");
calc.eval();
assert("eval : 나머지연산을 잘 해내야 한다", "1" , calc.state.str);
calc.deleteAll();
calc.add("2+7*5");
calc.eval();
assert("eval : 우선순위를 고려해야한다 + > *", "37" , calc.state.str);
calc.deleteAll();
calc.add("2*7+5");
calc.eval();
assert("eval : 우선순위를 고려해야한다 * > +", "19" , calc.state.str);
calc.deleteAll();
calc.add("2*7+5/");
assert("올바르지 않을 때는 계산하지 않는다." , false, calc.eval());
assert("올바르지 않을 때는 계산하지 않는다 - 상태체크" , "2*7+5/", calc.state.str);

