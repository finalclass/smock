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

// Helper: prepare comment form (set author name + fill name prompt)
async function prepareCommentForm(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('smock_author', JSON.stringify({ name: 'Tester', timestamp: Date.now() }));
  });
  await page.reload();
  await page.waitForSelector('.comments-panel');

  // The name prompt should detect localStorage and auto-show form,
  // but if it still shows the prompt, fill it
  const namePrompt = page.locator('#comment-name-prompt');
  if (await namePrompt.isVisible()) {
    await page.locator('#name-prompt-input').fill('Tester');
    await page.locator('#name-prompt-btn').click();
  }
  await expect(page.locator('#comment-form-inner')).toBeVisible({ timeout: 5000 });
}

// Helper: add a comment via LiveView form
async function addComment(page: Page, body: string) {
  await page.evaluate(() => {
    const authorInput = document.getElementById('comment-author') as HTMLInputElement;
    if (authorInput) authorInput.value = 'Tester';
  });

  const textarea = page.locator('#comment-form-inner textarea[name="body"]');
  await textarea.fill(body);
  await page.locator('#comment-form-inner button[type="submit"]').click();
  await page.waitForSelector(`.comment-body:has-text("${body}")`, { timeout: 5000 });
}

test.describe('Comments — Widok komentarzy [e2e]', () => {
  let token: string;
  let mockSlug: string;

  test.beforeAll(async ({ request }) => {
    const data = await setupTestData(request);
    token = data.token;
    mockSlug = data.mockSlug;
  });

  test('Formularz komentarzy jest ciągle widoczny na dole strony', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('.comments-panel');
    await prepareCommentForm(page);

    // comment-form-bottom is visible
    const formBottom = page.locator('.comment-form-bottom');
    await expect(formBottom).toBeVisible();

    // comments-scroll has overflow-y: auto
    const commentsScroll = page.locator('.comments-scroll');
    await expect(commentsScroll).toBeVisible();
    const overflowY = await commentsScroll.evaluate((el) => getComputedStyle(el).overflowY);
    expect(overflowY).toBe('auto');

    // Form is below comments scroll
    const scrollBox = await commentsScroll.boundingBox();
    const formBox = await formBottom.boundingBox();
    expect(scrollBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(formBox!.y).toBeGreaterThan(scrollBox!.y);
  });

  test('Wszystkie komentarze — przełącznik Ta strona / Wszystkie', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('.comments-panel');
    await prepareCommentForm(page);

    const suffix = Date.now().toString(36);

    // Add comment on index.html (current page)
    await addComment(page, `Index comment ${suffix}`);

    // Switch to about.html
    await page.selectOption('#page-select', 'about.html');
    await page.waitForTimeout(500);

    // Add comment on about.html
    await addComment(page, `About comment ${suffix}`);

    // "Ta strona" (default) — only about.html comment visible
    await expect(page.locator(`.comment-body:has-text("About comment ${suffix}")`)).toBeVisible();
    await expect(page.locator(`.comment-body:has-text("Index comment ${suffix}")`)).not.toBeVisible();

    // Switch to "Wszystkie" — both visible
    await page.locator('.toggle-btn:has-text("Wszystkie")').click();
    await page.waitForTimeout(300);
    await expect(page.locator(`.comment-body:has-text("About comment ${suffix}")`)).toBeVisible();
    await expect(page.locator(`.comment-body:has-text("Index comment ${suffix}")`)).toBeVisible();

    // Switch back to "Ta strona" — only about.html
    await page.locator('.toggle-btn:has-text("Ta strona")').click();
    await page.waitForTimeout(300);
    await expect(page.locator(`.comment-body:has-text("About comment ${suffix}")`)).toBeVisible();
    await expect(page.locator(`.comment-body:has-text("Index comment ${suffix}")`)).not.toBeVisible();
  });

  test('Ukrywanie resolved — Hide resolved', async ({ page }) => {
    await page.goto(`/p/${token}/${mockSlug}`);
    await page.waitForSelector('.comments-panel');
    await prepareCommentForm(page);

    const suffix = Date.now().toString(36);

    // Add a comment
    await addComment(page, `Resolve test ${suffix}`);

    // Resolve it
    const commentItem = page.locator(`.comment-item:has-text("Resolve test ${suffix}")`);
    await commentItem.locator('.btn-resolve').click();
    await page.waitForTimeout(500);

    // Resolved section visible
    await expect(page.locator('.resolved-section')).toBeVisible();
    await expect(page.locator(`.resolved-section .comment-body:has-text("Resolve test ${suffix}")`)).toBeVisible();

    // Check "Hide resolved"
    await page.locator('.hide-resolved-toggle input[type="checkbox"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.resolved-section')).not.toBeVisible();

    // Uncheck "Hide resolved"
    await page.locator('.hide-resolved-toggle input[type="checkbox"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.resolved-section')).toBeVisible();
  });
});
