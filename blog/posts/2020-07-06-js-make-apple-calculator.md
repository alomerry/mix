---
layout: Post
title: 前端作业-计算器
subtitle: 
author: Alomerry Wu
date: 2020-07-06
headerImage: /img/in-post/2020-07-06/header.jpg
catalog: true
tags:
- Y2020
---

<!-- Description. -->

<!-- more -->

![calculate.png][1]

## 思路

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Calculator</title>
</head>
<style>
    #calculator {
        width: 16rem;
        background-color: black;
        padding: 5px;
        font-family: "Lucida Console", Monaco, monospace;
    }

    td {
        width: 3rem;
        padding: 5px;
        height: 3rem;
        border-radius: 40px;
        border: black 2px solid;
        text-align: center;
        font-weight: 500;
        font-size: 1.7rem;
    }

    #calculator div.scream {
        height: 3rem;
        height: 5rem;
        color: white;
        line-height: 5rem;
        font-size: 3.4rem;
        text-align: right;
    }

    table.button tr.line1 td.item-1,
    table.button tr.line1 td.item-2,
    table.button tr.line1 td.item-3 {
        background-color: #acabab;
    }

    table.button tr.line1 td.item-4,
    table.button tr.line2 td.item-4,
    table.button tr.line3 td.item-4,
    table.button tr.line4 td.item-4,
    table.button tr.line5 td.item-3 {
        background-color: orange;
        color: white;
    }

    table.button tr.line2 td.item-1,
    table.button tr.line2 td.item-2,
    table.button tr.line2 td.item-3,
    table.button tr.line3 td.item-1,
    table.button tr.line3 td.item-2,
    table.button tr.line3 td.item-3,
    table.button tr.line4 td.item-1,
    table.button tr.line4 td.item-2,
    table.button tr.line4 td.item-3,
    table.button tr.line5 td.item-1,
    table.button tr.line5 td.item-2 {
        background-color: #535353;
        color: white;
    }
</style>
<body>
<div id="calculator">
    <div class="scream">0</div>
    <div>
        <table class="button">
            <tr class="line1">
                <td value="&" class="item-1">AC</td>
                <td value="?" class="item-2">+/-</td>
                <td value="%" class="item-3">%</td>
                <td value="/" class="item-4">/</td>
            </tr>
            <tr class="line2">
                <td value="7" class="item-1">7</td>
                <td value="8" class="item-2">8</td>
                <td value="9" class="item-3">9</td>
                <td value="*" class="item-4">X</td>
            </tr>
            <tr class="line3">
                <td value="4" class="item-1">4</td>
                <td value="5" class="item-2">5</td>
                <td value="6" class="item-3">6</td>
                <td value="-" class="item-4">-</td>
            </tr>
            <tr class="line4">
                <td value="1" class="item-1">1</td>
                <td value="2" class="item-2">2</td>
                <td value="3" class="item-3">3</td>
                <td value="+" class="item-4">+</td>
            </tr>
            <tr class="line5">
                <td colspan="2" value="0" class="item-1">0</td>
                <td value="." class="item-2">.</td>
                <td value="=" class="item-3">=</td>
            </tr>
        </table>
    </div>
</div>
<script>
    class Num {
        constructor() {
            this.hasPoint = false
            this.hasNum = false
            this.number = 0;
        }

        get number() {
            return this._number;
        }

        set number(number) {
            this._number = number;
        }

        get hasNum() {
            return this._hasNum;
        }

        set hasNum(hasNum) {
            this._hasNum = hasNum;
        }

        get hasPoint() {
            return this._hasPoint;
        }

        set hasPoint(hasPoint) {
            this._hasPoint = hasPoint;
        }

        clear() {
            this._hasNum = false;
            this._hasPoint = false;
            this._number = 0;
        }
    }

    class Operator {
        constructor() {
            this.hasOp = false;
            this.op = '';
        }

        get op() {
            return this._op;
        }

        set op(op) {
            this._op = op;
        }

        get hasOp() {
            return this._hasOp;
        }

        set hasOp(hasOp) {
            this._hasOp = hasOp;
        }

        clear() {
            this._hasOp = false;
            this._op = '';
        }
    }

    window.onload = function () {
        let a = new Num(), b = new Num();
        let op = new Operator();
        let result = 0;

        let tds = document.getElementsByTagName('td');

        for (let i = 0; i < tds.length; i++) {
            tds[i].addEventListener('click', function () {
                let content = tds[i].getAttribute('value');

                if (content === '.') {
                    if (op.hasOp) {
                        if (!b.hasPoint) {
                            b.hasPoint = true;
                            b.number += '.';
                            writeToScream(b.number);
                        }
                    } else {
                        if (!a.hasPoint) {
                            a.hasPoint = true;
                            a.number += '.';
                            writeToScream(a.number);
                        }
                    }
                }

                if (/[0-9]/.test(content)) {
                    result = 0;
                    if (op.hasOp) {
                        //操作b
                        if (b.hasPoint) {
                            b.number = b.number + '' + content;
                        } else {
                            b.hasNum = true
                            b.number *= 10;
                            b.number += (1 * content);
                        }
                        writeToScream(b.number);
                    } else {
                        //操作a
                        if (a.hasPoint) {
                            a.number = a.number + '' + content;
                        } else {
                            a.hasNum = true
                            a.number *= 10;
                            a.number += (1 * content);
                        }
                        writeToScream(a.number);
                    }
                }

                if (/[+\-*%\/]/.test(content)) {
                    if (op.hasOp) {
                        a.number = !a.hasNum ? 0 : a.number;
                        a.hasNum = true;
                        if (b.hasNum) {
                            a.number = calculate(a, b, result, op);
                            writeToScream(a.number);
                            b.clear();
                        }
                    } else {
                        op.hasOp = true;
                        if (result != 0 && !a.hasNum) {
                            a.number = result;
                            a.hasNum = true;
                            a.hasPoint = result.toString().split('.').length > 1 ? true : false;
                            result = 0;
                        }
                    }
                    op.op = content;
                }

                switch (content) {
                        // +/-
                    case '?': {
                        if (result != 0 && !a.hasNum) {
                            a.number = result * -1;
                            a.hasNum = true;
                            a.hasPoint = result.toString().split('.').length > 1 ? true : false;
                            result = 0;
                            writeToScream(a.number);
                        } else if (b.hasNum) {
                            b.number = b.number * -1;
                            writeToScream(b.number);
                        } else {
                            a.number = a.number * -1;
                            writeToScream(a.number);
                        }
                        console.log(a.number, b.number)
                        break;
                    }
                        //AC
                    case '&': {
                        a.clear();
                        b.clear();
                        op.clear();
                        result = 0;
                        writeToScream(0)
                        break;
                    }
                    case '=': {
                        result = calculate(a, b, result, op);
                        writeToScream(result);
                        a.clear();
                        b.clear();
                        op.clear();
                        console.log(result);
                        break;
                    }

                }
            }, false);
        }

        /**
         * 计算 numberA 和 numberB 的 operator 操作结果
         * @param numberA 待操作数对象 A
         * @param numberB 待操作数对象 B
         * @param numberResult 上一次的结果，当操作数 A 未赋值时使用
         * @param operator 操作符对象
         * @returns {number} 计算结果
         */
        function calculate(numberA, numberB, numberResult, operator) {
            let res = 0;
            let tmpNumberA = Number.parseFloat(numberA.number),
                    tmpNumberB = Number.parseFloat(numberB.number);

            switch (operator.op) {
                case '+': {
                    res = add(tmpNumberA, tmpNumberB);
                    break;
                }
                case '-': {
                    res = sub(tmpNumberA, tmpNumberB);
                    break;
                }
                case '*': {
                    res = mul(tmpNumberA, tmpNumberB);
                    break;
                }
                    //NaN
                case '/': {
                    res = div(tmpNumberA, tmpNumberB);
                    break;
                }
                    //NaN
                case '%': {
                    res = Math.floor(tmpNumberA % tmpNumberB);
                    break;
                }
                default: {
                    if (numberA.hasNum) {
                        res = tmpNumberA;
                    } else
                        res = numberResult;
                }
            }
            return res;
        }

        function mul(arg1, arg2) {
            let l1, l2, m, n;
            try {
                l1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                l2 = 0;
            }

            m = Math.pow(10, l1)
            n = Math.pow(10, l2)
            return (arg1 * m * arg2 * n) / m / n;
        }

        function sub(arg1, arg2) {
            let l1, l2, m;
            try {
                l1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                l2 = 0;
            }

            m = Math.pow(10, Math.max(l1, l2))
            return (arg1 * m - arg2 * m) / m;
        }

        function div(arg1, arg2) {
            let l1, l2, m, n;
            try {
                l1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                l2 = 0;
            }

            m = Math.pow(10, l1)
            n = Math.pow(10, l2)
            return ((arg1 * m) / (arg2 * n)) / m * n;
        }

        function add(arg1, arg2) {
            let l1, l2, m;
            try {
                l1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                l2 = 0;
            }

            m = Math.pow(10, Math.max(l1, l2))
            return (arg1 * m + arg2 * m) / m;
        }

        function writeToScream(res) {
            document.getElementsByClassName('scream')[0].innerHTML = res;
        }
    }
</script>
</body>
</html>
```

[1]: http://alomerry.com/usr/uploads/2020/07/871769878.png