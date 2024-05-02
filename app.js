function splitmix32(a) {
    return function() {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}

var num = 1
var answers = false
if (window.location.href.includes("?a")) {
    answers = true
    num = parseInt(window.location.href.split("?a")[1])
} else {
    num = parseInt(window.location.href.split("?")[1])
}
const random = splitmix32(num)

document.getElementById("title").innerText = `Number Sense #${num}`

class Question {
    constructor(text, answer, range=false, equality="=", unit="") {
        this.text = text
        this.answer = answer
        this.unit = unit
        this.equality = equality
        this.range = range
    }
    getAnswer() {
        if (this.range) {
            return `(${Math.floor(this.answer*0.95)}, ${Math.ceil(this.answer*1.05)})`
        }
        return this.answer
    }
}

function addTwo() {
    a = Math.round(random()*9000 + 1000)
    b = Math.round(random()*9000 + 1000)
    return new Question(
        `<mn>${a}</mn><mo>+</mo><mn>${b}</mn>`,
        a + b
    )
}
function subtractTwo() {
    a = Math.round(random()*9000 + 1000)
    b = Math.round(random()*9000 + 1000)
    return new Question(
        `<mn>${Math.max(a, b)}</mn><mo>-</mo><mn>${Math.min(a, b)}</mn>`,
        Math.abs(a - b)
    )
}
function addMultiple() {
    list = []
    for (i = 0; i < Math.floor(random()*3) + 3;i++) {
        list.push(Math.floor(random()*30)+10)
    }
    return new Question(
        `<mn>${list.join("</mn><mo>+</mo><mn>")}</mn>`,
        list.reduce((partialSum, a) => partialSum + a, 0)
    )
}
function baseConversion() {
    original = Math.floor(random()*20)+5
    base = Math.floor(random()*10+5)
    base = base == 10 ? 9 : base
    base2 = Math.floor(random()*5+6)
    converted = original.toString(base).toUpperCase()
    converted2 = original.toString(base2)
    return new Question(
        `<msub><mn>${converted}</mn><mn>${base}</mn></msub>`,
        converted2,
        false,
        "=",
        `base ${base2}`
    )
}
function multiplyTwoLarge() {
    a = Math.round(random()*9000 + 1000)
    b = Math.round(random()*9000 + 1000)
    return new Question(
        `<mi>${a}</mi><mo>&#xd7;</mo><mi>${b}</mi>`,
        a*b,
        true
    )
}
function mutiplyTwoDiff() {
    a = Math.floor(random()*60)+20
    b = Math.floor(random()*(a - 20)) + 10
    return new Question (
        `<mn>${a-b}</mn><mo>&#xd7;</mo><mn>${a+b}</mn>`,
        a**2 - b**2
    )
}
function diffTwoSquares() {
    a = Math.floor(random()*60)+20
    b = Math.floor(random()*(a - 20)) + 10
    return new Question (
        `<msup><mn>${Math.max(a, b)}</mn><mn>2</mn></msup></mn><mo>-</mo><msup><mn>${Math.min(a, b)}</mn><mn>2</mn></msup>`,
        (a+b)*(a-b)
    )
}
function squared() {
    a = Math.round(random()*100)
    return new Question(
        `<msup><mi>${a}</mi><mi>2</mi></msup>`,
        a**2
    )
}
function sqrt() {
    a = Math.round(random()*9000) + 500
    return new Question(
        `<msqrt><mn>${a}</mn></msqrt>`,
        Math.sqrt(a),
        true
    )
}
function percentOf() {
    a = Math.round(random()*100) + 1
    tP = Math.round(random()*2) + 1
    b = a*(2**tP)*(5**Math.round(random()*(3 - tP)))
    return new Question(
        `<mn>${a}</mn><mi>&#xA0;is what percent of&#xA0;</mi><mn>${b}</mn>`,
        a/b*100,
        false,
        "?",
        "%"
    )
}
function percentOf2() {
    a = Math.round(random()*100) + 1
    tP = Math.round(random()*2) + 1
    b = a*(2**tP)*(5**Math.round(random()*(3 - tP)))
    return new Question(
        `<mn>${a/b*100}</mn><mo>%</mo><mi>&#xA0;of&#xA0;</mi><mn>${b}</mn>`,
        a,
        false,
        "="
    )
}
function setRender(list) {
    if (list.length >= 3) {
        return `<mo>{</mo><mn>${list[0]}</mn><mo>,</mo><mn>${list.slice(1, list.length - 1).join("</mn><mo>,</mo><mn>")}</mn><mo>,</mo><mn>${list[list.length - 1]}</mn><mo>}</mo>`
    } else if (list.length == 2) {
        return `<mo>{</mo><mn>${list[0]}</mn><mo>,</mo><mn>${list[list.length - 1]}</mn><mo>}</mo>`
    } else if (list.length == 1) {
        console.log(list)
        return `<mo>{</mo><mn>${list[list.length - 1]}</mn><mo>}</mo>`
    } else {
        return `<mi>&#x2205;</mi>`
    }
}
function setUnion() {
    list1 = []
    list2 = []
    let size = Math.round(random()*3) + 1
    for (let j = 1; j <= size; j++) {
        if (random() < 0.3) {
            list1.push(j)
        } else if (random() < 0.6) {
            list2.push(j)
        } else {
            list1.push(j)
            list2.push(j)
        }
    }
    return new Question(
        `<mi>The size of&#xA0;</mi>${setRender(list1)}<mo>&#x222a;</mo>${setRender(list2)}`,
        size,
        false,
        "is",
    )
}
function setIntersection() {
    list1 = []
    list2 = []
    let size = Math.round(random()*3) + 1
    let shared = 0
    for (let j = 1; j <= size; j++) {
        if (random() < 0.3) {
            list1.push(j)
        } else if (random() < 0.6) {
            list2.push(j)
        } else {
            list1.push(j)
            list2.push(j)
            shared++
        }
    }
    return new Question(
        `<mi>The size of&#xA0;</mi>${setRender(list1)}<mo>&#x2229;</mo>${setRender(list2)}`,
        shared,
        false,
        "is",
    )
}
function average() {
    list = []
    sum = 0
    total = [2, 4, 5][Math.floor(random()*3)]
    for (i = 0; i < total; i++ ) { 
        a = Math.floor(random()*20+1)
        list.push(a)
        sum += a
    }
    return new Question(
        `<mi>The average of&#xA0;</mi><mn>${list.join("</mn><mi>,&#xA0;</mi><mn>")}</mn>`,
        sum/total,
        false,
        "is"
    )
}
function twoLinear() {
    // ax + by = c
    // dx + ey = f


    // dx + db/ay = dc/a
    // (e - db/a)y = (f - dc/a)
    // y = (f - dc/a)/(e - db/a)
    // x = (c - by)/a
    // a != 0
    // ea != db

    a = Math.floor(random()*9) + 1
    a = a * (random() < 0.5 ? -1 : 1)
    b = Math.floor(random()*9) + 1
    b = b * (random() < 0.5 ? -1 : 1)
    c = Math.floor(random()*9) + 1
    c = c * (random() < 0.5 ? -1 : 1)
    d = Math.floor(random()*9) + 1
    d = d * (random() < 0.5 ? -1 : 1)
    e = Math.floor(random()*9) + 1
    e = e*a == d*b ? e + 1 : e
    f = Math.floor(random()*9) + 1

    y = (f*a - d*c)/(e*a - d*b)
    x = (c - b*y)/a

    xy = random() < 0.5

    return new Question(
        `<mtext>If&#xA0;</mtext><mn>${Math.abs(a) == 1 ? "" : a}</mn><mi>x</mi><mo>${b < 0 ? "-" : "+"}</mo><mn>${Math.abs(b) == 1 ? "" : Math.abs(b)}</mn><mi>y</mi><mo>=</mo><mn>${c}</mn><mtext>&#xA0;and&#xA0;</mtext><mn>${Math.abs(d) == 1 ? "" : d}</mn><mi>x</mi><mo>+</mo><mn>${e == 1 ? "" : e}</mn><mi>y</mi><mo>=</mo><mn>${f}</mn><mo>,</mo><mi>&#xA0;${xy ? "x" : "y"}</mi>`,
        `${xy ? reduceFraction(e*c - b*f, e*a - b*d) : reduceFraction(f*a - d*c,e*a - d*b)}`
    )
}

function gcf(a, b) {
    for (i = a; i > 0; i--) {
        if (b % i == 0 && a % i == 0) {
            return i
        }
    }
}
function reduceFraction(upper, lower) {
    if (upper == 0) {
        return "0"
    }
    return `${Math.abs(upper)/gcf(Math.abs(upper), Math.abs(lower))*Math.sign(upper)/Math.sign(lower)}/${Math.abs(lower/gcf(Math.abs(upper), Math.abs(lower)))}`
    // return `${upper}/${lower}`
}

const questionTypes = [
    addTwo,
    subtractTwo,
    addMultiple,
    mutiplyTwoDiff,
    average,
    multiplyTwoLarge,
    sqrt,
    squared,
    diffTwoSquares,
    baseConversion,
    twoLinear,
    percentOf,
    percentOf2,
    setUnion,
    setIntersection
]

var currentColumn = 0
for (let i = 1; i <= 80; i++) {
// let j = 0
// let len
// window.addEventListener("keydown", () => {
//     let i = Math.floor(j/2) + 1
//     if (j % 2 == 0) {
        currentPillar = document.getElementById(["11", "12", "21", "22"][currentColumn])
        fillColumn(i, currentPillar)
    // } else {
        if (currentPillar.getBoundingClientRect().bottom > document.getElementsByClassName("page")[Math.floor(currentColumn/2)].getBoundingClientRect().bottom) {
            document.getElementById(`q${i}`).remove()
            currentColumn++
            currentPillar = document.getElementById(["11", "12", "21", "22"][currentColumn])
            fillColumn(i, currentPillar)
        }
    // }
    // j++
// })
}
function fillColumn(num, col) {
    let sectorSize = 10
    let q = questionTypes[Math.floor((Math.ceil(num/sectorSize) - 1)/(80/sectorSize)*questionTypes.length + random()*sectorSize/80*questionTypes.length)]()
    let newStuff = `<p class="question ${q.range ? "special" : ""}" id="q${num}">(${num}) <math xmlns="http://www.w3.org/1998/Math/MathML">${q.text}<mo>${q.equality}</mo></math><u><math><mn class="${answers ? 'key' : 'notKey'}">${q.getAnswer()}</mn></math></u><math><mo class="unit">${q.unit}</mo></math></p>`
    col.innerHTML += newStuff
}