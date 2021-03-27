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
