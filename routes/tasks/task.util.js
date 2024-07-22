const formatTaskStatus = (status) => {

    const columns = {

    };

    status.forEach(element => {
        columns[element.columnId]=element;
    });
    return columns;
}
const formatAllTasks=(allTasks)=>{
    const allTaskResult={

    }
    allTasks.forEach((task)=>{
        allTaskResult[task._id]=task
    })
    return allTaskResult
}

module.exports= { formatTaskStatus, formatAllTasks}