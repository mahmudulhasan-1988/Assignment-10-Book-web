const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  // Go to admin dashboard books section
  await page.goto('http://localhost:3000/dashboard/admin#books');
  await page.waitForTimeout(3000);
  
  // Click the Create New Book button
  const createButton = await page.locator('text=Create New Book').first();
  await createButton.click();
  await page.waitForTimeout(1000);
  
  // Take screenshot of the modal
  await page.screenshot({ path: 'final-create-modal.png', fullPage: false });
  console.log('Create modal screenshot saved');
  
  await browser.close();
})();
