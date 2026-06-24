import promptSync from 'prompt-sync';

const prompt = promptSync();
const yourage: string = prompt('What is your age? ');
console.log('hello There!!');

let age: number = Number(yourage);

if (age>=18)
    console.log('You are an adult');
else
    console.log('You are a minor');
