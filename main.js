const puppeteer = require("puppeteer");

const dotenv = require('dotenv')

dotenv.config();

const MAIN_URL =
  "https://www.linkedin.com/search/results/people/?keywords=Tech%20recruiter&origin=SWITCH_SEARCH_VERTICAL&sid=.y7";

const LOGIN_URL = "https://www.linkedin.com/login";



//required to setup dotenv here

const CREDENTIALS = {
  USERNAME: process.env.LINKEDIN_USERNAME,
  PASSWORD: process.env.LINKEDIN_PASSWORD,
};

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();



//firstly go to login page and wait for it's content to load.
  await page.goto(LOGIN_URL, {
    waitUntil: "domcontentloaded",
  });



  // here we are query selecting the id of username and password fields, and typing in our credentials.
  await page.type("#username", CREDENTIALS.USERNAME);


  // utilizing timeout to make it more "human" and hopefully bypass the security-check of linkedin
  await page.setDefaultTimeout(4000); 

  await page.type("#password", CREDENTIALS.PASSWORD);


  await page.setDefaultTimeout(2000); 

  //clicking in the "LOGIN" button
  await page.click(
    'button[class="btn__primary--large from__button--floating"]'
  );


  await page.setDefaultTimeout(10000);


  //no we go to the meat of this scrapper, here i used the URL with keywords 'Tech Recruiter'
  await page.goto(MAIN_URL);

  const finalRes = await page.evaluate(() => {

    const tech_recruiters = document.querySelectorAll('.reusable-search__result-container')


    //beginning of data 
    

    // oh well, got blocked by security because i didn't add the timeouts, lol, gotta wait for a few hours before trying again :D
    const data = Array.from(tech_recruiters).map(tr => ({
        fullName: tr.querySelector('.app-aware-link ').innerText
    }))

    return data;
  });
  
  console.log(finalRes);
  await page.close();
}

main();
