export async function fetchUrl(url: string) {
    const res = await fetch(url);
    if (res.ok) {
        return res.text();
    } else {
        throw new Error("Fatch Error")
    }
}

;(async () => {

    const nn =await fetchUrl("https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/0xb3c05b1d")

    console.log(nn)
    
   const res1 = await fetchUrl('https://api.belo.app/public/price');

    const nn1 =await fetchUrl("https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/a9059cbb")
   
    // 合并两升序列表 https://blog.51cto.com/u_15055361/5536887
    const l1 = [1, 2, 4], l2 = [3, 3, 4]
    for (let i = 0; i < l1.length; i++) {
        const start = l2.findIndex((val)=>val>l1[i])
        l2.splice(start,0,l1[i])
    }
    console.log(l2)

    console.log(l2.reverse())

    const target = 6
    for (let i = 0; i < l1.length; i++) {
       const i2 = l1.findIndex(val=>val+l1[i] == target)
        if(i2>0){
            console.log(i,i2)
        }
    }

    const l3 = [1,2,3,4,5]
    console.log(l3.splice(l3.length-2,1))
    console.log(l3)

    const l4 =  [-1,0,1,2,-1,-4]


    const res = 0
    for (let i = 0; i < l4.length; i++) {
        const i2 = l1.findIndex(val=>val+l1[i] == target)
        if(i2>0){
            console.log(i,i2)
        }
    }
})()
