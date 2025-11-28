import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get computed styles for a test element
  const hasStyles = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) {
      const styles = window.getComputedStyle(header);
      return {
        backgroundColor: styles.backgroundColor,
        borderBottom: styles.borderBottom,
        display: styles.display
      };
    }
    return null;
  });

  console.log('Header styles:', hasStyles);

  await page.screenshot({ path: 'debug.png', fullPage: true });
  await browser.close();
})();
