require('dotenv').config();

const puppeteer = require('puppeteer');

const USERNAME = process.env.NAUKRI_USERNAME;
const PASSWORD = process.env.NAUKRI_PASSWORD;

console.log("Username loaded:", USERNAME);

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  // 1. Navigate to Naukri Login
  await page.goto('https://www.naukri.com/nlogin/login');

  // 2. Log in
  await page.type('#usernameField', USERNAME);
  await page.type('#passwordField', PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // 3. Search for Azure DevOps Jobs
  await page.goto('https://www.naukri.com/azure-devops-engineer-jobs');

  // 4. Apply to job listings
  const jobCards = await page.$$('.jobTuple');

  for (const card of jobCards) {
    const easyApplyBtn = await card.$('.apply-button');

    if (easyApplyBtn) {
      await easyApplyBtn.click();
      await page.waitForTimeout(2000); // wait for modal
      const applyNow = await page.$('button[type="submit"]');
      if (applyNow) {
        await applyNow.click();
        console.log('✅ Applied to a job!');
      }
    }

    await page.waitForTimeout(3000); // delay between applications
  }

  await browser.close();
})();
