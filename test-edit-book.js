const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log('=== Testing Book Edit Functionality ===\n');

  // Step 1: Go to admin dashboard books section
  console.log('Step 1: Opening admin dashboard books section...');
  await page.goto('http://localhost:3000/dashboard/admin#books');
  await page.waitForTimeout(3000);

  // Step 2: Click View on first book
  console.log('Step 2: Clicking View button on first book...');
  const viewButton = await page.locator('button[title="View Book"]').first();
  await viewButton.click();
  await page.waitForTimeout(1000);

  // Step 3: Click Edit Book button
  console.log('Step 3: Clicking Edit Book button...');
  const editButton = await page.locator('text=Edit Book').first();
  await editButton.click();
  await page.waitForTimeout(1000);

  // Step 4: Get current title
  const titleInput = await page.locator('input').first();
  const originalTitle = await titleInput.inputValue();
  console.log(`Step 4: Original title: "${originalTitle}"`);

  // Step 5: Change the title
  const newTitle = originalTitle + " (Updated)";
  console.log(`Step 5: Changing title to: "${newTitle}"`);
  await titleInput.clear();
  await titleInput.fill(newTitle);
  await page.waitForTimeout(500);

  // Take screenshot before save
  await page.screenshot({ path: 'test-edit-before-save.png', fullPage: false });
  console.log('Screenshot saved: test-edit-before-save.png');

  // Step 6: Click Save Changes
  console.log('Step 6: Clicking Save Changes button...');
  const saveButton = await page.locator('text=Save Changes').first();
  await saveButton.click();
  await page.waitForTimeout(2000);

  // Take screenshot after save
  await page.screenshot({ path: 'test-edit-after-save.png', fullPage: false });
  console.log('Screenshot saved: test-edit-after-save.png');

  // Step 7: Check if the title updated in the table
  console.log('\nStep 7: Verifying update in the table...');
  const updatedTitle = await page.locator('text=' + newTitle).first();
  const isVisible = await updatedTitle.isVisible();
  console.log(`Title "${newTitle}" visible in table: ${isVisible}`);

  await browser.close();

  console.log('\n=== Test Complete ===');
  console.log(`Original title: "${originalTitle}"`);
  console.log(`New title: "${newTitle}"`);
  console.log(`Update successful: ${isVisible ? 'YES' : 'NO'}`);
})();
