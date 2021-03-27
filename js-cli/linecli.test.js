const sut = require('./linecli');

describe('1차 대응 - 고정값 명령어 id와, 고정된 type이 주어진 경우', () => {

    let flag_list = ["-s STRING"]
    let name = "line"

    test.each`
    command                              | expected           
    ${["line -s abc"]}                   | ${[true]}          
    ${["line -s 123"]}                   | ${[false]}         
    ${["line -a abc"]}                   | ${[false]}         
    ${["line -b abc"]}                   | ${[false]}         
    ${["line -s abc -b abc"]}            | ${[false]}         
    ${["line -s abc -s abc"]}            | ${[true]}          
    ${["line -s abc -s 123"]}            | ${[false]}         
    ${["line -s abc -s 123 -s bcd"]}     | ${[false]}         
    ${["line -s abc -e"]}                | ${[false]}         
    ${["line -e -s abc"]}                | ${[false]}         
    ${["line -e -s abc", "line -s abc"]} | ${[false, true]}   
    `(
        '1차적 대응 - 명령어와 type이 고정되어있고 "$command" 가 주어졌을 때 "$expected" 값을 제대로 출력할 수 있어야 한다',
        ({ command, expected }) => {
            expect(sut(name, flag_list, command)).toMatchObject(expected);
        }
    )
})

describe('1차 대응 2 - 고정값 명령어 id', () => {

    let name = "line"
    test.each`
    type                       | command                                         | expected           
    ${["-s STRING -n NUMBER"]} | ${["line -s abc"]}                              | ${[true]}          
    ${["-s STRING -n NUMBER"]} | ${["line -s abc -n 123"]}                       | ${[true]}          
    ${["-s STRING -e NULL"]}   | ${["line -s abc -n 123"]}                       | ${[false]}          
    ${["-s NULL -e NULL"]}     | ${["line -s abc -n 123"]}                       | ${[false]}         
    ${["-s NUMBER -n STRING"]} | ${["line -s 123 -n abc"]}                       | ${[true]}          
    ${["-s STRING -n NUMBER"]} | ${["line -s abc -n 123"]}                       | ${[true]}          
    ${["-s STRING -n STRING"]} | ${["line -s 123 -n 123"]}                       | ${[false]}         
    ${["-s STRING -n STRING"]} | ${["line -s 123 -n 123", "line -s abc -n abc"]} | ${[false, true]}   
    `(
        '1차적 대응 - 명령어가 고정되어있고 "$type" & "$command" 가 주어졌을 때 "$expected" 값을 제대로 출력할 수 있어야 한다',
        ({ type, command, expected }) => {
            expect(sut(name, type, command)).toMatchObject(expected);
        }
    )
})


describe('1차 대응 3 - 모든값이 가변일경우', () => {

    test.each`
    name | type                       | command                                       | expected           
    ${"line"} | ${["-s STRING -n NUMBER"]} | ${["line -s abc"]}                            | ${[true]}          
    ${"bsh"}  | ${["-s STRING -n NUMBER"]} | ${["line -s abc -n 123"]}                     | ${[false]}         
    ${"tt"}   | ${["-s STRING -n STRING"]} | ${["line -s 123 -n 123", "tt -s abc -n abc"]} | ${[false, true]}   
    `(
        '1차적 대응 - 명령어는 "$name"이며, "$type" & "$command" 가 주어졌을 때 "$expected" 값을 제대로 출력할 수 있어야 한다',
        ({ name, type, command, expected }) => {
            expect(sut(name, type, command)).toMatchObject(expected);
        }
    )
})




describe('2차대응 - Array값 받기', () => {

    test.each`
    name | type                                               | command                                                           | expected        
    ${"line"} | ${["-s STRING -ss STRINGS"]}                       | ${["line -s abc"]}                                                | ${[true]}       
    ${"line"} | ${["-s STRING -ns NUMBERS"]}                       | ${["line -s abc -n 123"]}                                         | ${[false]}      
    ${"line"} | ${["-n NUMBER -ns NUMBERS"]}                       | ${["line -n 123 -ns 123"]}                                        | ${[true]}      
    ${"bsh"}  | ${["-s STRING -ss STRINGS -n NUMBER -ns NUMBERS"]} | ${["bsh -s abc -n 123", "bsh -ss abc def -s def -n 1 -ns 1 2 3"]} | ${[true, true]} 
    `(
        '2차적 대응 - 명령어는 "$name"이며, "$type" & "$command" 가 주어졌을 때 "$expected" 값을 제대로 출력할 수 있어야 한다',
        ({ name, type, command, expected }) => {
            expect(sut(name, type, command)).toMatchObject(expected);
        }
    )

})

describe('3번문제 - alias 등장', () => {
    test.each`
    name      | type                                                               | commands                                      | expected  
    ${"line"} | ${["-str STRING -str alias -s"]}                                   | ${["line -s abc"]}                            | ${[true]}  
    ${"line"} | ${["-str STRING -str alias -s"]}                                   | ${["line -str abc"]}                          | ${[true]}  
    ${"line"} | ${["-str STRING -str alias -s"]}                                   | ${["line -s 123"]}                            | ${[false]} 
    ${"line"} | ${["-str alias -s -str STRING"]}                                   | ${["line -s abc"]}                            | ${[true]}  
    ${"line"} | ${["-str alias -s -str STRING -number NUMBER -number alias -n"]}   | ${["line -s abc -n 123"]}                     | ${[true]}  
    ${"line"} | ${["-str alias -s -str STRING"]}                                   | ${["line -s abc -str abc"]}                   | ${[false]} 
    ${"line"} | ${["-number alias -n -number NUMBERS"]}                            | ${["line -number 1 2 3 -n 4 5 6"]}            | ${[false]} 
    ${"line"} | ${["-number alias -n -number NUMBERS"]}                            | ${["line -n 4 5 6"]}                          | ${[true]}  
    ${"line"} | ${["-str STRINGS -str alias -s -number alias -n -number NUMBERS"]} | ${["line -s A B C -number 4 5 6"]}            | ${[true]}  
    ${"line"} | ${["-str STRINGS -str alias -s -number alias -n -number NUMBERS"]} | ${["line -s A B C -number 4 5 6 -str B C D"]} | ${[false]} 
    `(
        '3번 alias 포함 테스트 진행 "$type"을 타입으로 받고 "$commands"를 받았을 때, "$expected"가 나와야 한다',
        ({ name, type, commands, expected }) => {
            expect(sut(name, type, commands)).toStrictEqual(expected);
        }
    );
})

