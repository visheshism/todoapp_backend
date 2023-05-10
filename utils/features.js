export const genArr = (length) => {
    let arr = ''
    const arr1 = '4629871350'
    const arr2 = 'vxlfwrdpoutijncmkzsegabhyq'
    const arrSel = [arr1, arr2];
    let el;
    function returnArrEl() {
        el = arrSel[Math.floor(Math.random() * 2)]
        return el[Math.floor(Math.random() * el.length)]
    }

    while (arr.length < length) {
        el = returnArrEl()
        if (el == arr[arr.length - 1] || el == arr[arr.length - 2]) {
            el = returnArrEl()
        }
        arr += el
    }
    return arr
}

export const genUserIty = () => {
    return genArr(10)
}

export const genTodoIty = () => {
    return genArr(6)
}

export const genRandom = (length) => {
    let arr = ''
    let el;
    const arrMain = 'kz7jduv6bt83nqa1i2owg5smcxpehlfr4y0'
    function returnArrEl() {
        return arrMain[Math.floor(Math.random() * arrMain.length)]
    }
    while (arr.length < length) {
        el = returnArrEl()
        if (el == arr[arr.length - 1] || el == arr[arr.length - 2]) {
            el = returnArrEl()
        }
        arr += el
    }
    return arr
}

export const currentDateTime = () => {
    var today = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30));
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}