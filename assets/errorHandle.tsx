

const errorHandle = async (error : Error) => {
    switch(error.message) {
        case '':
            return ('Insufficent Funds!');
        default:
            console.log(error)
            return ('Insufficient Funds!');
    }
}


export default errorHandle