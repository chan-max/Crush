// options list
export const App = {
    renderDOM() {

    },
    renderCSS() {

    },
    props: {

    },
    source() {
        let num = 0
        let count = function () {
            console.log(this.num);
            this.num++
        }

        return {
            num, count
        }
    }
}

// DOM template
/*
    <div ></div>


*/