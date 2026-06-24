import {test,expect} from '@playwright/test';

//syntax:

/*
test("title of the test",({//ficture - global variable --- page, browser})=>{

    //step1
    //step2
    //step3

})
    */

test("verify the title of the page",async({page})=>{
    await page.goto("https://www.google.com/")
    await expect(page).toHaveTitle("Google")
    console.log(await page.title())

})