# PIM Automation - Playwright TypeScript

Dự án automation test cho ứng dụng PIM (Product Information Management) sử dụng Playwright và TypeScript.

---

## Mục lục

1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Cài đặt](#cài-đặt)
4. [Cấu hình URL và Credentials](#cấu-hình-url-và-credentials)
5. [Chạy tests](#chạy-tests)
6. [Cấu trúc dự án](#cấu-trúc-dự-án)
7. [Thêm test mới](#thêm-test-mới)
8. [Cấu hình GitHub Secrets](#cấu-hình-github-secrets)
9. [GitHub Actions](#github-actions)
10. [Xem báo cáo kết quả](#xem-báo-cáo-kết-quả)

---

## Tổng quan dự án

Dự án này cung cấp bộ automation test cho ứng dụng PIM với các tính năng:

- Hỗ trợ **3 môi trường**: `test`, `stag` (staging), `prod` (production)
- Mỗi môi trường có URL và credentials riêng biệt
- Sử dụng **Page Object Model (POM)** để dễ bảo trì
- Tích hợp **GitHub Actions** để chạy tự động khi push code hoặc tạo Pull Request
- Báo cáo HTML chi tiết cho từng môi trường

---

## Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | 18.x trở lên |
| npm     | 9.x trở lên |
| Git     | Bất kỳ phiên bản nào |

Kiểm tra phiên bản Node.js:

```bash
node --version
npm --version
```

---

## Cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd automation
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cài đặt Playwright browsers

```bash
npx playwright install chromium
```

Hoặc cài đặt tất cả browsers (nếu cần):

```bash
npx playwright install
```

### Bước 4: Tạo file cấu hình môi trường

Copy file mẫu và điền thông tin thực tế:

```bash
cp .env.example .env.test
cp .env.example .env.stag
cp .env.example .env.prod
```

---

## Cấu hình URL và Credentials

Mỗi môi trường có một file `.env` riêng. **Không commit các file này lên git** (đã được thêm vào `.gitignore`).

### File `.env.test` - Môi trường Test

```env
BASE_URL=https://test.pim-app.com
USERNAME=your_test_username
PASSWORD=your_test_password
```

### File `.env.stag` - Môi trường Staging

```env
BASE_URL=https://stag.pim-app.com
USERNAME=your_stag_username
PASSWORD=your_stag_password
```

### File `.env.prod` - Môi trường Production

```env
BASE_URL=https://pim-app.com
USERNAME=your_prod_username
PASSWORD=your_prod_password
```

**Lưu ý quan trọng:**
- Thay thế các giá trị placeholder bằng thông tin thực tế của từng môi trường
- Không bao giờ commit file `.env.*` lên Git (chỉ commit `.env.example`)
- Đối với CI/CD, sử dụng GitHub Secrets thay vì file `.env`

---

## Chạy tests

### Chạy tests cho môi trường cụ thể

```bash
# Chạy tests trên môi trường TEST
npm run test:test

# Chạy tests trên môi trường STAGING
npm run test:stag

# Chạy tests trên môi trường PRODUCTION
npm run test:prod
```

### Chạy tests cho tất cả môi trường (tuần tự)

```bash
npm run test:all
```

### Chạy file test cụ thể

```bash
# Chỉ chạy login tests trên môi trường test
ENV=test npx playwright test tests/auth/login.spec.ts

# Chỉ chạy product tests trên staging
ENV=stag npx playwright test tests/pim/product.spec.ts
```

### Chạy test theo tên

```bash
# Chạy test có tên chứa "Login thành công"
ENV=test npx playwright test -g "Login thành công"
```

### Xem báo cáo sau khi chạy

```bash
npm run report
```

---

## Cấu trúc dự án

```
automation/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── src/
│   ├── config/
│   │   └── environments.ts         # Đọc và validate config từ env vars
│   ├── fixtures/
│   │   └── auth.fixture.ts         # Custom fixtures (loginPage, authenticatedPage)
│   ├── pages/
│   │   ├── BasePage.ts             # Base class cho tất cả page objects
│   │   └── LoginPage.ts            # Page Object cho trang Login
│   └── utils/
│       └── helpers.ts              # Utility functions (screenshot, test data, retry)
├── tests/
│   ├── auth/
│   │   └── login.spec.ts           # Test cases cho Authentication
│   └── pim/
│       └── product.spec.ts         # Test cases cho Product Management
├── .env.example                    # File mẫu cấu hình (commit lên git)
├── .env.test                       # Cấu hình môi trường TEST (KHÔNG commit)
├── .env.stag                       # Cấu hình môi trường STAGING (KHÔNG commit)
├── .env.prod                       # Cấu hình môi trường PRODUCTION (KHÔNG commit)
├── .gitignore
├── package.json
├── playwright.config.ts            # Cấu hình Playwright
├── tsconfig.json                   # Cấu hình TypeScript
└── README.md
```

---

## Thêm test mới

### Bước 1: Tạo Page Object (nếu cần)

Tạo file mới trong `src/pages/`, ví dụ `src/pages/ProductPage.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly addProductButton: Locator;
  readonly productNameInput: Locator;
  readonly saveButton: Locator;
  readonly productList: Locator;

  constructor(page: Page) {
    super(page);
    // Cập nhật selectors cho đúng với app
    this.addProductButton = page.locator('[data-testid="add-product"]');
    this.productNameInput = page.locator('[name="product-name"]');
    this.saveButton = page.locator('button[type="submit"]');
    this.productList = page.locator('.product-list');
  }

  async navigateToProducts() {
    await this.navigate('/pim/products');
  }

  async createProduct(name: string) {
    await this.addProductButton.click();
    await this.productNameInput.fill(name);
    await this.saveButton.click();
    await this.waitForPageLoad();
  }

  async expectProductVisible(name: string) {
    await expect(this.productList.getByText(name)).toBeVisible();
  }
}
```

### Bước 2: Tạo file test mới

Tạo file trong `tests/`, ví dụ `tests/pim/category.spec.ts`:

```typescript
import { test, expect } from '../../src/fixtures/auth.fixture';
import { ProductPage } from '../../src/pages/ProductPage';
import { generateTestData } from '../../src/utils/helpers';

test.describe('PIM - Category Management', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productPage = new ProductPage(authenticatedPage);
    await productPage.navigateToProducts();
  });

  test('TC-CAT-001: Tạo category mới', async ({ authenticatedPage }) => {
    const testData = generateTestData('category');
    // Implement test steps
    await productPage.createProduct(testData.name);
    await productPage.expectProductVisible(testData.name);
  });
});
```

### Bước 3: Cập nhật selectors

Mở browser và dùng Playwright Inspector để tìm selectors chính xác:

```bash
ENV=test npx playwright test --headed --debug
```

### Quy ước đặt tên test cases

| Prefix | Ý nghĩa |
|--------|---------|
| `TC-AUTH-XXX` | Test cases Authentication |
| `TC-PIM-XXX` | Test cases PIM module |
| `TC-CAT-XXX` | Test cases Category |
| `TC-RPT-XXX` | Test cases Reports |

---

## Cấu hình GitHub Secrets

Để GitHub Actions chạy được, bạn cần thêm các secrets sau vào repository GitHub.

### Cách thêm GitHub Secrets

1. Vào repository trên GitHub
2. Chọn **Settings** > **Secrets and variables** > **Actions**
3. Chọn tab **Secrets**
4. Click **New repository secret** và thêm từng secret

### Danh sách secrets cần thêm

#### Môi trường TEST

| Secret Name | Mô tả | Ví dụ |
|-------------|-------|-------|
| `TEST_BASE_URL` | URL ứng dụng môi trường test | `https://test.pim-app.com` |
| `TEST_USERNAME` | Username đăng nhập test | `test_user` |
| `TEST_PASSWORD` | Password đăng nhập test | `test_pass_123` |

#### Môi trường STAGING

| Secret Name | Mô tả | Ví dụ |
|-------------|-------|-------|
| `STAG_BASE_URL` | URL ứng dụng môi trường staging | `https://stag.pim-app.com` |
| `STAG_USERNAME` | Username đăng nhập staging | `stag_user` |
| `STAG_PASSWORD` | Password đăng nhập staging | `stag_pass_123` |

#### Môi trường PRODUCTION

| Secret Name | Mô tả | Ví dụ |
|-------------|-------|-------|
| `PROD_BASE_URL` | URL ứng dụng production | `https://pim-app.com` |
| `PROD_USERNAME` | Username đăng nhập production | `prod_user` |
| `PROD_PASSWORD` | Password đăng nhập production | `prod_pass_123` |

### Cấu hình GitHub Environments (tùy chọn - bảo mật cao hơn)

Để tăng bảo mật, bạn có thể cấu hình secrets ở cấp Environment thay vì Repository:

1. Vào **Settings** > **Environments**
2. Tạo 3 environments: `test`, `stag`, `prod`
3. Thêm secrets tương ứng vào từng environment
4. Có thể thêm **Protection rules** cho môi trường `prod` (yêu cầu approval trước khi chạy)

---

## GitHub Actions

### Khi nào workflow chạy tự động?

Workflow chạy tự động khi:
- **Push code** lên branch `main` hoặc `develop`: chạy test môi trường `test` và `stag`
- **Tạo Pull Request** vào branch `main` hoặc `develop`: chạy test môi trường `test` và `stag`

**Lưu ý:** Môi trường `prod` chỉ chạy khi trigger thủ công (Manual Dispatch) để tránh ảnh hưởng production.

### Chạy thủ công (Manual Dispatch)

1. Vào tab **Actions** trên GitHub repository
2. Chọn workflow **Playwright Tests**
3. Click **Run workflow**
4. Chọn branch và **Environment** muốn chạy:
   - `test`: Chỉ chạy môi trường test
   - `stag`: Chỉ chạy môi trường staging
   - `prod`: Chỉ chạy môi trường production
   - `all`: Chạy cả 3 môi trường
5. Click **Run workflow**

### Cấu trúc Jobs trong workflow

```
Playwright Tests
├── test-env  (Tests - TEST Environment)
│   ├── Chạy: khi push/PR hoặc manual với env=test/all
│   └── Report: playwright-report-test
├── test-stag (Tests - STAGING Environment)
│   ├── Chạy: khi push/PR hoặc manual với env=stag/all
│   └── Report: playwright-report-stag
└── test-prod (Tests - PRODUCTION Environment)
    ├── Chạy: CHỈ khi manual với env=prod/all
    └── Report: playwright-report-prod
```

---

## Xem báo cáo kết quả

### Xem báo cáo local

Sau khi chạy tests, mở báo cáo HTML:

```bash
# Mở báo cáo mặc định
npm run report

# Mở báo cáo cho môi trường cụ thể
npx playwright show-report playwright-report/test
npx playwright show-report playwright-report/stag
npx playwright show-report playwright-report/prod
```

### Xem báo cáo trên GitHub Actions

1. Vào tab **Actions** trên GitHub repository
2. Chọn workflow run muốn xem
3. Scroll xuống phần **Artifacts**
4. Download artifact tương ứng:
   - `playwright-report-test`: Báo cáo môi trường test
   - `playwright-report-stag`: Báo cáo môi trường staging
   - `playwright-report-prod`: Báo cáo môi trường production
5. Giải nén file zip và mở file `index.html` trong browser

---

## Câu hỏi thường gặp

### Lỗi "Missing required environment variables"

Kiểm tra file `.env.{env}` đã được tạo và điền đúng thông tin chưa.

```bash
# Kiểm tra file .env.test tồn tại
ls -la .env.*
```

### Lỗi "Cannot find module"

Chạy lại `npm install`:

```bash
npm install
npx playwright install chromium
```

### Tests fail do selectors không đúng

Dùng Playwright Inspector để tìm selectors chính xác:

```bash
ENV=test npx playwright codegen https://your-app-url.com
```

### Cần chạy tests với headed browser (có giao diện)

```bash
ENV=test npx playwright test --headed
```

---

## Đóng góp

Khi thêm test mới, vui lòng:
1. Tạo branch mới từ `develop`
2. Đặt tên branch theo convention: `feat/TC-XXX-ten-feature`
3. Tạo Pull Request vào `develop`
4. Đảm bảo tests pass trên CI trước khi merge
