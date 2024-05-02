total = 0
function loadMoreNS() {
    for (i = 0; i < 100; i++) {
        d = document.createElement("div")
        a = document.createElement("a")
        a.innerText = `Number Sense #${i + total + 1}`
        a.href = `page.html?${i+total+1}`
        d.appendChild(a)
        a = document.createElement("a")
        a.innerText = `Number Sense #${i + total + 1} Answer Key`
        a.href = `page.html?a${i+total+1}`
        d.appendChild(a)
        d.className="linkSet"
        document.getElementById("ns").appendChild(d)
    }
    total+=100
}
loadMoreNS()

total2 = 0
function loadMoreRW() {
    for (i = 0; i < 100; i++) {
        d = document.createElement("div")
        a = document.createElement("a")
        a.innerText = `Ready Writing #${i + total2 + 1}`
        a.href = `rw.html?${i+total+1}`
        d.appendChild(a)
        d.className="linkSet"
        document.getElementById("rw").appendChild(d)
    }
    total2+=100
}
loadMoreRW()