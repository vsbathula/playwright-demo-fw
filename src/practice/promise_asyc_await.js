const returnPromise = new Promise((resolve, reject) => {
    return setTimeout(() => {
        resolve('Promise resolved!!!');
    }, 10000);
});

// JS Engine will not wait for the promise to be resolved
// promise is an object tht represents the eventual completion or failure of an asynchronous operation and its resulting value.
returnPromise.then((res) => {
    console.log(res);
})
console.log('Sequntial line print before promise execution');


const returnPromise1 = new Promise((resolve, reject) => {
    return setTimeout(() => {
        resolve('Promise resolved!!!');
    }, 10000);
});
const returnPromise2 = new Promise((resolve, reject) => {
    return setTimeout(() => {
        resolve('Promise resolved!!!');
    }, 20000);
});

// JS Engine will waiting for the promise to be resolved
async function asynPromiseHandler() {
    const val = await returnPromise1;
    console.log('returnPromise1')
    console.log(val);
    const val2 = await returnPromise2;
    console.log('returnPromise2')
    console.log(val2);
    
}
asynPromiseHandler();

