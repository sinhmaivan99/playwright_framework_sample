# Playwright Framework Sample

Framework E2E mẫu dùng **Playwright + JavaScript** để kiểm thử luồng đăng nhập của [SauceDemo](https://www.saucedemo.com) theo hướng dễ mở rộng, dễ bảo trì và phù hợp làm nền cho các dự án automation thực tế.

---

## Mục lục

- [Cài đặt nhanh](#cài-đặt-nhanh)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Kiến trúc framework](#kiến-trúc-framework)
- [Giải thích từng thành phần](#giải-thích-từng-thành-phần)
- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [CI/CD](#cicd)
- [Test hiện có](#test-hiện-có)
- [Cách mở rộng framework](#cách-mở-rộng-framework)
- [Hạn chế hiện tại](#hạn-chế-hiện-tại)

---

## Cài đặt nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Cài browser cho Playwright
npm run browsers:install

# 3. Chạy toàn bộ test
npm test

# 4. Xem report
npm run report
```

---

## Cấu trúc thư mục

```text
playwright_framework_sample/
├── cores/
│   └── BasePage.js          # Lớp cơ sở cho mọi page object
├── pages/
│   ├── LoginPage.js         # Page object trang đăng nhập
│   └── InventoryPage.js     # Page object trang sản phẩm
├── fixtures/
│   ├── testFixtures.js      # Custom fixtures của Playwright
│   └── users.json           # Dữ liệu tài khoản test
├── tests/
│   └── login.spec.js        # Test cases luồng login
├── reports/                 # HTML & JUnit report (generated)
├── test-results/            # Screenshot, trace, video (generated)
├── .github/workflows/
│   └── playwright.yml       # CI pipeline
├── .env.dev                 # Biến môi trường dev
├── .env.staging             # Biến môi trường staging
├── .env.prod                # Biến môi trường prod
├── playwright.config.js     # Cấu hình Playwright
├── eslint.config.mjs        # Cấu hình ESLint
├── .prettierrc.json         # Cấu hình Prettier
└── package.json
```

---

## Kiến trúc framework

Project áp dụng các nguyên tắc:

| Nguyên tắc | Mô tả |
|---|---|
| **Page Object Model** | Tách locators và thao tác UI vào class riêng, test chỉ gọi method |
| **Custom Fixtures** | Đóng gói setup/teardown dùng lại giữa các test |
| **Error Constants** | Tập trung error messages trong page object, không hardcode trong test |
| **Environment Config** | Chọn URL và chế độ chạy theo biến môi trường |
| **Tagging Strategy** | Phân nhóm test bằng `@smoke`, `@regression`, `@critical` |

**Luồng phụ thuộc:**

```text
playwright.config.js  ──  nạp .env theo TEST_ENV
       │
login.spec.js  ──  dùng { test } từ testFixtures.js
       │                        │
       │                testFixtures.js  ──  tạo LoginPage, InventoryPage
       │                        │              và nạp users.js → users.json
       │                        │
   LoginPage.js  ──  kế thừa BasePage.js
   InventoryPage.js  ──  kế thừa BasePage.js
```

---

## Giải thích từng thành phần

### `cores/BasePage.js`

Lớp cơ sở cho mọi page object. Cung cấp các method dùng chung:

| Nhóm | Method | Mục đích |
|---|---|---|
| Navigation | `goto(pathname)` | Điều hướng đến path |
| Interactions | `click(locator)` | Click phần tử |
| | `fill(locator, value)` | Điền giá trị vào input |
| | `getText(locator)` | Lấy text của phần tử |
| Assertions | `expectVisible(locator)` | Kiểm tra phần tử hiển thị |
| | `expectHidden(locator)` | Kiểm tra phần tử ẩn |
| | `expectText(locator, text)` | Kiểm tra nội dung text |
| | `expectURL(urlPattern)` | Kiểm tra URL hiện tại |
| | `expectCount(locator, n)` | Kiểm tra số lượng phần tử |

Mọi page object chỉ cần `extends BasePage` để dùng toàn bộ methods này.

### `pages/LoginPage.js`

| Method | Mục đích |
|---|---|
| `goto()` | Mở trang login và chờ form xuất hiện |
| `login(username, password)` | Điền credentials và submit |
| `loginAs(user)` | Login bằng object `{ username, password }` |
| `expectErrorMessage(text)` | Kiểm tra error message |

Static property `LoginPage.ERROR_MESSAGES` chứa các constant error:
- `invalidCredentials` — sai thông tin đăng nhập
- `lockedUser` — tài khoản bị khóa

### `pages/InventoryPage.js`

| Method | Mục đích |
|---|---|
| `expectPageLoaded()` | Verify URL + heading "Products" + inventory list visible |
| `expectProductCount(n)` | Kiểm tra số lượng sản phẩm |

### `fixtures/testFixtures.js`

Mở rộng `test` của Playwright với các fixture:

| Fixture | Nhận được | Mô tả |
|---|---|---|
| `users` | Object dữ liệu | Chứa `validUser`, `lockedUser`, `invalidUser` |
| `loginPage` | `LoginPage` instance | Đã navigate đến trang login, sẵn sàng dùng |
| `inventoryPage` | `InventoryPage` instance | Đã login thành công, đang ở trang inventory |

### `fixtures/users.json`

Dữ liệu tài khoản test. Sửa file này để thay đổi credentials mà không đụng code.

---

## Các lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `npm test` | Chạy toàn bộ test |
| `npm run test:login` | Chỉ chạy file login test |
| `npm run test:smoke` | Chạy các test có tag `@smoke` |
| `npm run test:headed` | Chạy có mở trình duyệt |
| `npm run test:ui` | Chạy Playwright UI mode |
| `npm run lint` | Kiểm tra code bằng ESLint |
| `npm run lint:fix` | Tự động sửa lỗi ESLint |
| `npm run format` | Kiểm tra format bằng Prettier |
| `npm run format:write` | Tự động format code |
| `npm run browsers:install` | Cài browser binaries |
| `npm run report` | Mở HTML report |

---

## Cấu hình môi trường

Framework hỗ trợ 3 môi trường qua file `.env.*`:

| Biến | Mô tả | Mặc định |
|---|---|---|
| `TEST_ENV` | Môi trường chạy (`dev`, `staging`, `prod`) | `dev` |
| `BASE_URL` | URL gốc của app test | Theo `TEST_ENV` |
| `HEADLESS` | Bật/tắt headless (`true`/`false`) | `true` |

**Chạy theo môi trường (PowerShell):**

```powershell
$env:TEST_ENV="staging"; npm test
```

**Ghi đè URL và tắt headless:**

```powershell
$env:BASE_URL="https://www.saucedemo.com"; $env:HEADLESS="false"; npm run test:login
```

---

## CI/CD

GitHub Actions pipeline tại `.github/workflows/playwright.yml`:

**Triggers:** push lên `main`/`master`, tạo pull request.

**Các bước:**

1. Checkout source code
2. Setup Node.js 20
3. `npm ci`
4. Cài Playwright browsers
5. ESLint check
6. Prettier format check
7. Chạy test Playwright
8. Upload artifacts (HTML report, JUnit report)

---

## Test hiện có

| # | Test case | Tags |
|---|---|---|
| 1 | Login thành công với user hợp lệ | `@smoke` `@critical` |
| 2 | Login thất bại với user sai thông tin | `@regression` |
| 3 | Login thất bại với user bị khóa | `@regression` `@critical` |
| 4 | Inventory hiển thị 6 sản phẩm sau khi login | `@smoke` |

---

## Cách mở rộng framework

Khi thêm module test mới, đi theo quy trình:

1. **Tạo page object mới** trong `pages/` — kế thừa `BasePage`, định nghĩa locators trong constructor, viết method cho từng hành vi.
2. **Thêm fixture** trong `fixtures/testFixtures.js` nếu page object cần setup phức tạp (ví dụ: login trước khi dùng).
3. **Thêm dữ liệu** trong `fixtures/` nếu cần test data riêng.
4. **Viết spec mới** trong `tests/` và gắn tag phù hợp.

**Ví dụ thêm CartPage:**

```js
// pages/CartPage.js
const BasePage = require('../cores/BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectItemCount(count) {
    const { expect } = require('@playwright/test');
    await expect(this.cartItems).toHaveCount(count);
  }
}

module.exports = CartPage;
```

**Quy ước quan trọng:**

- Locators chỉ định nghĩa trong page object, không trong test.
- Test không gọi trực tiếp `locator.click()` / `locator.fill()` — luôn delegate qua BasePage (`this.click()`, `this.fill()`).
- Error messages đặt trong constants, không hardcode trong test.
- Assertion methods dùng prefix `expect*` nhất quán (`expectVisible`, `expectURL`, `expectText`, ...).

---

## Hạn chế hiện tại

- Mới có 1 luồng nghiệp vụ (login).
- Chỉ chạy trên Chromium, chưa cấu hình đa trình duyệt.
- Dữ liệu test tĩnh, chưa tích hợp API hoặc data factory.
- Chưa có helper cho API setup/cleanup.