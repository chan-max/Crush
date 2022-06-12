

export var nextTick = (fn: Function, args = undefined) => {
    var p = Promise.resolve(args)
    p.then(fn.bind(null))
}

var queueJobs = new Set()
export function queueJob(job: Function) {
    queueJobs.add(job)
    nextTick(executeQueueJobs)
}

function executeQueueJobs() {
    queueJobs.forEach((job: any) => {
        job()
        queueJobs.delete(job)
    });
}