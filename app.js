const template = `
    <button onclick={add(66)}>

    </button>
`

const style = `
    @#app{
        color:@mainColor;
    }
`

const App = {
    template,
    style,
    source({computed}){
        let num = 0
        let add = () => this.num++
        let sub = () => this.num--

        const double = computed(({emit}) => this.num * 2)

        return {
            num,
            add,
            sub,
            double
        }
    }
}

export {
    App
}