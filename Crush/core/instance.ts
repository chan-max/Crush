
let uid = 0

function getCommonComponentnistanceProperties(){
    return {
        uid:uid++,
        or:[],

    }
}
/*

    const app = {
        props:

        source:

        template:

        style:
    }


*/

interface componentOptions{
    props?:Object | Array<string>
    template?:string
    style?:string
    inited?:Function
}

function initComponentOptions(options:componentOptions){

}

