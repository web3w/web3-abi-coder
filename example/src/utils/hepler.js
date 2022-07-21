//数据
export const templateCsv = "data:text/csv;charset=utf-8,\ufeff"
    + "Rich,THg65VygURFAdhLes9nok4yE58dGAyrcTr,1.2\n"
    + "七天,THg65VygURFAdhLes9nok4yE58dGAyrcTr,1.6\n";


export const readFile = (file, fileList) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        if (typeof reader == 'undefined') {
            throw new Error("FileReader not support")
        }

        reader.onload = (e) => {
            resolve(reader.result)
        }
        reader.onerror = e => {
            reject(e)
        }
        if (file.type === 'text' || file.type === "text/csv") {
            reader.readAsText(file)
        } else if (file.type === 'binary') {
            reader.readAsBinaryString(file)
        } else {
            reader.readAsArrayBuffer(file)
        }
    })
}
export const splitCSV = (dataStr) => {
    const datas = dataStr.split(/\r\n|\n|\r/);
    return datas.map((val, index) => {
        const [name, to, value] = val.split(',')
        const id = index + 1
        const itemId = `trc20-${id}-${to}`
        const item = {
            id, name, to, value, state: "Send"
        }
        window.sessionStorage.setItem(itemId, JSON.stringify(item))
        return item
    })
}
export const getSessionItems = () => {
    const selectedTrc20 = JSON.parse(window.sessionStorage.getItem("selected-trc20"))
    const session = Object.keys(window.sessionStorage)
    const keys = session.filter(val => val.substring(0, 5) === 'trc20').sort((a, b) => {
        return a.split("-")[1] - b.split("-")[1]
    });
    const items = []
    for (const key of keys) {
        if (key.substring(0, 5) === "trc20") {
            const itemStr = window.sessionStorage.getItem(key)
            const item = JSON.parse(itemStr)
            items.push(item)
        }
    }
    return {items, selectedTrc20}
}
export const clearSessionItems = () => {
    const session = Object.keys(window.sessionStorage)
    session.filter(val => val.substring(0, 5) === 'trc20').forEach((key) => {
        window.sessionStorage.removeItem(key)
    });
}

export function transformTime(timestamp = +new Date()) {
    if (timestamp) {
        const time = new Date(timestamp);
        const y = time.getFullYear();
        const M = time.getMonth() + 1;
        const d = time.getDate();
        const h = time.getHours();
        const m = time.getMinutes();
        const s = time.getSeconds();
        return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    } else {
        return '';
    }
}

function addZero(m) {
    return m < 10 ? '0' + m : m;
}

// https://api.shasta.trongrid.io/v1/accounts/TNETu5nHBrrReq9m6fawdjUASFdLarWmC4/transactions/trc20?only_from=true&limit=50&only_confirmed=true
// https://cn.developers.tron.network/reference/get-trc20-transaction-info-by-account-address
export const getEventLogs = async (page, formData, host) => {
    // console.log(host)
    if (!formData.account) throw new Error("eventLogs account undefined")
    let query = `only_from=true&limit=50&only_confirmed=true`
    if (formData.trc20) {
        query += '&contract_address=' + formData.trc20
    }
    if (formData.dateRange) {
        const start = formData.dateRange[0].valueOf()
        const end = formData.dateRange[1].valueOf()
        query += `&min_timestamp=${start}&max_timestam=p${end}`
    }

    let url = `${host}/v1/accounts/${formData.account}/transactions/trc20?${query}`
    console.log("Account query:", url)

    const pageIndexStr = window.sessionStorage.getItem("pageIndex")

    if (pageIndexStr) {
        const pageIndex = JSON.parse(pageIndexStr)
        if (pageIndex.links && pageIndex.links.next) {
            url = pageIndex.links.next
        } else {
            window.sessionStorage.removeItem("pageIndex")
        }
    }

    const res = await fetch(url)
    const data = []
    if (res.ok) {
        const resData = await res.json()
        if (resData.success === true && resData.meta) {
            window.sessionStorage.setItem("pageIndex", JSON.stringify(resData.meta))
        }
        if (resData.success) {
            resData.data.forEach(val => {
                //name, address,
                const {decimals, symbol} = val.token_info
                data.push({
                    time: val.block_timestamp,
                    from: val.from,
                    to: val.to,
                    value: (val.value / Math.pow(10, decimals)).toFixed(4),
                    symbol: symbol,
                    type: val.type,
                    txId: val.transaction_id
                })
            })
        }
    }

    return {
        total: data.length < 50 ? data.length : 50,
        list: data,
    }
}


export const delay = (n) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}
 
export const exportsCSV = (_headers = [], _body = [], name = 'csv') => {
    const headers = [_headers.join()] // 格式化表头
    const body = _body.map(item => { // 格式化表内容
        const line = Object.values(item).join()
        return line
    })
    const output = headers.concat(body).join('\n') // 合并

    const BOM = '\uFEFF'
    debugger
    // 创建一个文件CSV文件
    let blob = new Blob([BOM + output], {type: 'text/csv'})
    // IE
    if (navigator.msSaveOrOpenBlob) {
        // 解决大文件下载失败
        // 保存到本地文件
        navigator.msSaveOrOpenBlob(blob, `${name}.csv`)
    } else {
        // let uri = encodeURI(`data:text/csv;charset=utf-8,${BOM}${output}`)
        let downloadLink = document.createElement('a')
        // downloadLink.href = uri
        //  因为url有最大长度限制，encodeURI是会把字符串转化为url，超出限制长度部分数据丢失导致下载失败,为此我采用创建Blob（二进制大对象）的方式来存放缓存数据，具体代码如下：
        downloadLink.setAttribute('href', URL.createObjectURL(blob))
        downloadLink.download = `${name}.csv`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }
    // callback()
}
