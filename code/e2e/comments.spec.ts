import { test, expect, Page, APIRequestContext } from '@playwright/test';

// Extract CSRF token from HTML
function extractCsrf(html: string): string {
  const m = html.match(/name="_csrf_token" value="([^"]+)"/);
  return m ? m[1] : '';
}

// Setup: login as admin, create project, upload mock, set to review
async function setupTestData(request: APIRequestContext) {
  // Get CSRF from login page
  const loginPage = await request.get('/login');
  const csrf = extractCsrf(await loginPage.text());

  // Login
  await request.post('/login', {
    form: { email: 'cap', password: 'admin', _csrf_token: csrf },
  });

  // Get home page CSRF and create project
  const homePage = await request.get('/');
  const csrf2 = extractCsrf(await homePage.text());
  await request.post('/projects', {
    form: { name: 'E2E Test Project', _csrf_token: csrf2 },
  });

  // Get project detail page to extract token and api_key
  const homePage2 = await request.get('/');
  const homeHtml2 = await homePage2.text();
  const projectLinkMatch = homeHtml2.match(/href="\/projects\/(\d+)"/);
  const projectId = projectLinkMatch ? projectLinkMatch[1] : '';

  const projectPage = await request.get(`/projects/${projectId}`);
  const projectHtml = await projectPage.text();

  // HTML structure: <div class="credential"><label>Token</label><code>VALUE</code></div>
  const tokenMatch = projectHtml.match(/Token<\/label>\s*<code>([^<]+)<\/code>/);
  const apiKeyMatch = projectHtml.match(/API Key<\/label>\s*<code>([^<]+)<\/code>/);

  const token = tokenMatch ? tokenMatch[1].trim() : '';
  const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

  // Upload mock with 2 pages via API
  const mockResp = await request.post(`/api/projects/${token}/mocks`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    multipart: {
      name: 'Test Mock',
      file0: { name: 'index.html', mimeType: 'text/html', buffer: Buffer.from('<html><body><h1>Index Page</h1><p>Main content</p></body></html>') },
      file1: { name: 'about.html', mimeType: 'text/html', buffer: Buffer.from('<html><body><h1>About Page</h1><p>About content</p></body></html>') },
    },
  });
  const mock = await mockResp.json();

  // Set mock to review
  await request.put(`/api/projects/${token}/mocks/${mock.id}`, {
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    data: JSON.stringify({ status: 'review' }),
  });

  return { token, apiKey, mockSlug: mock.slug as string, mockId: mock.id as number };
}

// Helper: prepare author name in localStorage
async function prepareAuthorName(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('smock_author', JSON.stringify({ name: 'Tester', timestamp: Date.now() }));
  });
  await page.reload();
  await page.waitForSelector('smock-comments');
}

// Helper: create a thread by clicking on the overlay
async function createThread(page: Page, body: string, position = { x: 0.5, y: 0.3 }) {
  // Ensure iframe is loaded and overlay is ready
  const iframe = page.locator('#mock-iframe');
  await iframe.waitFor({ state: 'attached', timeout: 10000 });
  await page.waitForTimeout(500);

  const overlay = page.locator('#comment-overlay');
  const overlayBox = await overlay.boundingBox();
  if (!overlayBox) throw new Error('Overlay not found');

  // Close any existing compose bubble first
  const existingBubble = page.locator('.comment-bubble');
  if (await existingBubble.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Click on overlay to open compose bubble
  await overlay.click({ position: { x: overlayBox.width * position.x, y: overlayBox.height * position.y } });
  await page.waitForTimeout(300);

  // Fill textarea in bubble and send
  const bubble = page.locator('.comment-bubble');
  await expect(bubble).toBeVisible({ timeout: 5000 });
  await bubble.locator('.bubble-textarea').fill(body);
  await bubble.locator('.bubble-send-btn').click();
  await page.waitForTimeout(1000);
}

test.describe('Comments — Thread-based system [e2e]', () => {
  let token: string;
  let mockSlug: string;

  test.beforeEach(async ({ request }) => {
    const data = await setupTestData(request);
    token = data.token;
    mockSlug = data.mockSlug;
  });

  // @axiom: comments.md#flow-tworzenia-nowego-wątku
  test('Thread creation via overlay click, bubble, and submit', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);
    await createThread(page, `Test thread ${suffix}`);

    // Verify thread appears in panel (inside shadow DOM)
    const smockComments = page.locator('smock-comments');
    const threadItem = smockComments.locator('.thread-item');
    await expect(threadItem.first()).toBeVisible({ timeout: 5000 });
  });
  // /@axiom: comments.md#flow-tworzenia-nowego-wątku

  // @axiom: comments.md#flow-odpowiadania-w-wątku
  test('Reply in thread', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);
    await createThread(page, `Reply test ${suffix}`);

    // Click on thread item in panel to open the thread bubble
    const smockComments = page.locator('smock-comments');
    const threadItem = smockComments.locator(`.thread-item`).first();
    await expect(threadItem).toBeVisible({ timeout: 5000 });
    await threadItem.click();
    await page.waitForTimeout(500);

    // Verify thread bubble is open with existing comment
    const bubble = page.locator('.comment-bubble .bubble-thread');
    await expect(bubble).toBeVisible({ timeout: 5000 });

    // Add reply
    await bubble.locator('.bubble-textarea').fill(`Reply ${suffix}`);
    await bubble.locator('.bubble-send-btn').click();
    await page.waitForTimeout(1000);
  });
  // /@axiom: comments.md#flow-odpowiadania-w-wątku

  // @axiom: comments.md#resolve-i-usunięcie-wątku
  test('Resolve and delete thread (two-step delete)', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);
    await createThread(page, `Resolve test ${suffix}`);

    // Click pin to open thread
    const pin = page.locator('.comment-pin').first();
    await pin.click();
    await page.waitForTimeout(300);

    // Resolve
    const resolveBtn = page.locator('.bubble-resolve-btn');
    await resolveBtn.click();
    await page.waitForTimeout(1000);

    // Create another thread to test delete
    await createThread(page, `Delete test ${suffix}`, { x: 0.7, y: 0.7 });

    // Click pin to open thread
    const pin2 = page.locator('.comment-pin').first();
    await pin2.click();
    await page.waitForTimeout(300);

    // First click on Delete -> shows "Sure?"
    const deleteBtn = page.locator('.bubble-delete-btn');
    await deleteBtn.click();
    await page.waitForTimeout(300);

    // Second click confirms
    const sureBtn = page.locator('.bubble-delete-btn');
    await sureBtn.click();
    await page.waitForTimeout(1000);
  });
  // /@axiom: comments.md#resolve-i-usunięcie-wątku

  // @axiom: comments.md#wszystkie-komentarze
  test('Ta strona / Wszystkie toggle', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);

    // Create thread on index.html
    await createThread(page, `Index thread ${suffix}`);

    // Switch to about.html
    await page.selectOption('#page-select', 'about.html');
    await page.waitForTimeout(500);

    // Create thread on about.html
    await createThread(page, `About thread ${suffix}`);

    // "Ta strona" (default) — only about.html thread visible
    const smockComments = page.locator('smock-comments');
    // Thread items are in shadow DOM
    await page.waitForTimeout(500);

    // Switch to "Wszystkie"
    const allBtn = smockComments.locator('.toggle-btn:has-text("Wszystkie")');
    await allBtn.click();
    await page.waitForTimeout(500);

    // Switch back to "Ta strona"
    const thisPageBtn = smockComments.locator('.toggle-btn:has-text("Ta strona")');
    await thisPageBtn.click();
    await page.waitForTimeout(500);
  });
  // /@axiom: comments.md#wszystkie-komentarze

  // @axiom: comments.md#ukrywanie-resolved
  test('Hide resolved toggle', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);
    await createThread(page, `Hide resolved test ${suffix}`, { x: 0.8, y: 0.8 });

    // Resolve the thread by clicking on thread item in panel, then resolve in bubble
    const smockComments2 = page.locator('smock-comments');
    const threadItem = smockComments2.locator('.thread-item').first();
    await expect(threadItem).toBeVisible({ timeout: 10000 });
    await threadItem.click();
    await page.waitForTimeout(500);
    await page.locator('.bubble-resolve-btn').click();
    await page.waitForTimeout(1000);

    // Resolved section should be visible by default
    const smockComments = page.locator('smock-comments');
    const resolvedSection = smockComments.locator('.resolved-section');
    await expect(resolvedSection).toBeVisible({ timeout: 5000 });

    // Click "Hide resolved"
    const hideBtn = smockComments.locator('.hide-toggle-btn:has-text("Hide resolved")');
    await hideBtn.click();
    await page.waitForTimeout(300);
    await expect(resolvedSection).not.toBeVisible();

    // Click "Show resolved"
    const showBtn = smockComments.locator('.hide-toggle-btn:has-text("Show resolved")');
    await showBtn.click();
    await page.waitForTimeout(300);
    await expect(resolvedSection).toBeVisible();
  });
  // /@axiom: comments.md#ukrywanie-resolved

  // @axiom: comments.md#zmiana-imienia
  test('Name change (zmien imie)', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const smockComments = page.locator('smock-comments');

    // Click "zmien imie"
    const changeNameBtn = smockComments.locator('#change-name-btn');
    await changeNameBtn.click();
    await page.waitForTimeout(300);

    // localStorage should be cleared
    const stored = await page.evaluate(() => localStorage.getItem('smock_author'));
    expect(stored).toBeNull();

    // Click on overlay — should show name prompt in bubble
    const overlay = page.locator('#comment-overlay');
    const overlayBox = await overlay.boundingBox();
    if (overlayBox) {
      await overlay.click({ position: { x: overlayBox.width * 0.5, y: overlayBox.height * 0.5 } });
    }
    await page.waitForTimeout(300);

    // Fill name prompt in bubble
    const nameInput = page.locator('.bubble-name-input');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill('Nowe Imie');
    await page.locator('.bubble-name-btn').click();
    await page.waitForTimeout(300);

    // Now the compose form should appear in the bubble
    const textarea = page.locator('.bubble-textarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });
  });
  // /@axiom: comments.md#zmiana-imienia

  test('Cross-page navigation — click thread from different page', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('smock-comments');
    await prepareAuthorName(page);

    const suffix = Date.now().toString(36);

    // Create thread on index.html
    await createThread(page, `Cross-page ${suffix}`);

    // Navigate to about.html
    await page.selectOption('#page-select', 'about.html');
    await page.waitForTimeout(500);
    await expect(page.locator('#page-select')).toHaveValue('about.html');

    // Show all threads
    const smockComments = page.locator('smock-comments');
    const allBtn = smockComments.locator('.toggle-btn:has-text("Wszystkie")');
    await allBtn.click();
    await page.waitForTimeout(500);

    // Click on the thread from index.html to navigate back
    const threadItem = smockComments.locator('.thread-item').first();
    await threadItem.click();
    await page.waitForTimeout(2000);

    // Verify we navigated back to index.html
    await expect(page.locator('#page-select')).toHaveValue('index.html', { timeout: 10000 });
  });
});
