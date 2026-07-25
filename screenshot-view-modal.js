const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  // Go to admin dashboard books section
  await page.goto('http://localhost:3000/dashboard/admin#books');
  await page.waitForTimeout(3000);
  
  // Click the View button (eye icon) on the first book
  const viewButton = await page.locator('button[title="View Book"]').first();
  await viewButton.click();
  await page.waitForTimeout(1000);
  
  // Take screenshot of the modal
  await page.screenshot({ path: 'final-view-modal.png', fullPage: false });
  console.log('View modal screenshot saved');
  
  await browser.close();
})();
