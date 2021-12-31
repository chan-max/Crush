let uid = 0;
function getCommonComponentnistance() {
    return {
        uid: uid++,
        context: Object.create(null),
        container: null,
        styleSheet: null,
        inited: [],
        beforeMount: [],
        mounted: [],
        beforeDestroy: [],
        destroyed: []
    };
}
export { getCommonComponentnistance };
