function CalculatorController(){ 

    this.priority = {
        "%" : 2,
        "/" : 2,
        "*" : 2,
        "+" : 1,
        "-" : 1,
    } 

    this.init = () => {
        this.state = { 
            str : "",
            operatorPushable : true
        }

        this.component = {
            container : $('.container'),
            display : $('textarea'),
        }
        
    }

    this.bind = (component) => {
        component.container.on('click', (e) => {
            if (e.target.tagName == "BUTTON") {
                let val = e.target.innerText;
                if (val === 'CE') {
                    this.deleteAll();
                } else if ( val === 'AC') {
                    this.deleteAll();
                } else if ("0" <= val && "9" >= val) {
                    this.add(val, false);
                } else if (val === "=") {
                    this.eval();
                } else {
                    this.add(val, true);
                }
            } 
        })
    }

    this.render = (state, component) => {
        component.display.val(state.str);
    }

    this.add = (value, isOperator) => {
        let str = this.state.str;
        let operatorPushable = this.state.operatorPushable;
        if (isOperator == true) {
            if (operatorPushable) {
                str += value;
                operatorPushable = false;
            } else {
                this.delete();
                str = this.state.str;
                str += value;
                operatorPushable = false;
            }
        } else {
            str += value;
            operatorPushable = true;
        }
        this.setState({operatorPushable, str});
    }

    this.deleteLast = () => {
        if (this.state.str.length <= 0) return;
        let arr = this.mapToStack(this.state.str);
        if (arr.length > 0) {
            let lastCharacter = arr.pop();
            if (!this.isNumber(lastCharacter)) return;
        }  
        this.setState({str: arr.join("")});
    }

    this.delete = () => {
        let str = this.state.str;
        if (str.length <= 0) return;
        str = str.slice(0, str.length-1);
        this.setState({str});
    }

    this.deleteAll = () => {
        if (this.state.str.length <= 0) return;
        this.setState({str: ""});
    }


    this.eval = () => {
        let infixArray = this.mapToStack(this.state.str);

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
        this.setState({str:`${stack.pop()}`});
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
                    if (this.priority[last] < this.priority[element]) {
                        oppStack.push(element);
                    } else {
                        while(oppStack.length !== 0 && this.priority[last] >= this.priority[element]) {
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

    
}



