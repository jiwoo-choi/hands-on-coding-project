function solution(name, argument, commands) {

    const answer = [];
    const typeMeta = getTypeMeta(name, argument);
    for (const command of commands) {
        answer.push(testCommand(typeMeta, command));
    }
    return answer;
}

function getTypeMeta(name, argument) {
    const typeMeta = {};
    typeMeta.name = name;
    typeMeta.$alias = [];

    const splitedArgument = argument[0].split(" ");
    for (let i = 0; i < splitedArgument.length; i = i + 2) {
        const type = splitedArgument[i];
        const target = splitedArgument[i+1];
        if (target === "alias") {
            typeMeta.$alias.push(
                {
                    originalKey : type,
                    aliasValue : splitedArgument[i+2],
                    used: false,
                }
            );
            i++;
        } else {
            typeMeta[type] = getTypeCheckerFn(target);
        }
    }


    for (const alias of typeMeta.$alias) {
        const originalKey = alias.originalKey;
        const aliasValue = alias.aliasValue;
        typeMeta[aliasValue] = typeMeta[originalKey];
    }
    
    return typeMeta;
}



// wrapping함수.
function getTypeCheckerFn(str) {
    //global executor
    if (str === "NUMBER") {
        return [false, isNumber];
    } else if (str === "STRING"){ 
        return [false, isString];
    } else if (str === "NULL") {
        return [false, (testString) => { return testString === undefined }];
    } else if (str == "STRINGS") {
        return [true, (testNumbers) => { return testNumbers.filter( v => isString(v)).length == testNumbers.length }];
    } else if (str == "NUMBERS") {
        return [true, (testNumbers) => { return testNumbers.filter( v => isNumber(v)).length == testNumbers.length }];
    } else {
        return [false, (testString) => { return false }];
    }
}


function testCommand(typeMeta, command) {
    const commands = command.split(" ");
    if (typeMeta.name !== commands[0]) return false;
    const parsed = getParsedCommandList(commands.slice(1, command.length));
    if (!validateParsedList(typeMeta, parsed)) return false;
    if (!executeParsedList(typeMeta,parsed)) return false;
    return true;
} 

/**
 * 1차적으로 타입이 맞는지 체크를 하는 부분.
 */
function validateParsedList(typeMeta, parsedList) {

    const parsed = parsedList;
    for (let i = 0 ; i < parsed.length; i++) {
        if (!validateType(typeMeta, parsed[i][0], parsed[i])) return false;
        if (!validateAlias(typeMeta, parsed[i][0])) return false;
    }
    return true;
}


function validateType(typeMeta, key, total) {

    if (typeMeta[key] === undefined) return false;
    const [isArray] = typeMeta[key];
    if (isArray == false) {
        if (total.length > 2 ) return false;
    }       
    return true;
}

function validateAlias(typeMeta ,parseKey) {

    const val = typeMeta.$alias.filter( (value) => value.originalKey == parseKey || value.aliasValue == parseKey);

    if (val.length > 0 ) {
        if (val[0].isUsed == true) {
            return false;
        } else {
            val[0].isUsed = true;
        }
    }
    
    return true;
}
/** 
 * 실제로 테스트 커맨드를 실행하는 부분.
 */
function executeParsedList(typeMeta, parsedList){
    let ans = true;
    for (let i = 0 ; i < parsedList.length; i++) {
        const [isArray, checker] = typeMeta[parsedList[i][0]];

        ans = ans && execute(checker, isArray, parsedList[i].slice(1, parsedList[i].length));
        if (!ans) {
            break;
        }
    }
    return ans;
}

/**
 * 파싱 리스트를 얻는 부분.
 */
function getParsedCommandList(splitedCommandLine) {

    let tempList = [];

    for (let i = 0 ; i < splitedCommandLine.length ; ){
        if (splitedCommandLine[i][0] === '-') {
            tempList.push([splitedCommandLine[i]]);
            i++;
        } else {
            tempList[tempList.length-1].push(splitedCommandLine[i]);
            i++;    
        }
    }

    return tempList.map( v => {
        if (v.length == 1) v.push(undefined);
        return v;
    });
}


function execute(executor, isArray, arg2) {
    if (isArray === true) {
        return executor(arg2);
    } else {
        return executor(arg2[0]);
    }
}


function isNumber(testString) {

    if (testString === undefined) return false;

    for (let i = 0 ; i < testString.length; i++) {
        const val = testString[i] - '0';
        if (!val || (val < 0 && val > 9)) {
            return false;
        }
    }

    return true;
}


function isString(testString) {
    
    if (testString === undefined) return false;

    let answer = true;

    for (let i = 0 ; i < testString.length; i++) {
        answer = answer && !isNumber(testString[i]);
        if (!answer) {
            break;
        }
    }
    return answer;
}


module.exports = solution;