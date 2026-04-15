# Playwright Framework Sample

Framework E2E mẫu dùng Playwright + TypeScript để kiểm thử luồng đăng nhập của SauceDemo theo hướng dễ mở rộng, dễ bảo trì và phù hợp để làm nền cho các dự án automation thực tế.

## Mục tiêu dự án

- Xây dựng bộ khung kiểm thử E2E rõ ràng theo mô hình Page Object Model.
- Tách dữ liệu test, fixture và logic tương tác UI thành các lớp riêng biệt.
- Hỗ trợ chạy test theo môi trường bằng biến môi trường.
- Có sẵn lint, format, typecheck, report và pipeline CI.

## Công nghệ sử dụng

- Playwright Test
- TypeScript
- ESLint
- Prettier
- dotenv
- GitHub Actions

## Chức năng hiện có

- Kiểm thử đăng nhập thành công với tài khoản hợp lệ.
- Kiểm thử đăng nhập thất bại với tài khoản sai thông tin.
- Kiểm thử đăng nhập thất bại với tài khoản bị khóa.
- Kiểm tra điều hướng đến trang inventory sau khi đăng nhập thành công.
- Gắn tag test như `@smoke`, `@regression`, `@critical` để lọc khi chạy.
- Sinh report HTML và JUnit sau khi chạy test.

## Cấu trúc thư mục

```text
playwright_framework_sample/
|-- cores/
|   `-- BasePage.ts
|-- fixtures/
|   |-- testFixtures.ts
|   |-- users.json
|   `-- users.ts
|-- pages/
|   `-- LoginPage.ts
|-- reports/
|   |-- html/
|   `-- junit/
|-- test-results/
|   `-- .last-run.json
|-- tests/
|   `-- login.spec.ts
|-- .env.dev
|-- .env.prod
|-- .env.staging
|-- .gitignore
|-- .prettierignore
|-- .prettierrc.json
|-- eslint.config.mjs
|-- package.json
|-- playwright.config.ts
|-- tsconfig.json
`-- README.md
```

## Giải thích từng phần

### `cores/`

Chứa các thành phần nền tảng dùng chung.

- `BasePage.ts`: lớp cơ sở cho các page object, gom các thao tác phổ biến như `goto`, chờ URL và assert phần tử hiển thị.

### `pages/`

Chứa Page Object cho từng màn hình.

- `LoginPage.ts`: định nghĩa locator và hành vi của trang login như nhập username, password và bấm đăng nhập.

### `fixtures/`

Chứa dữ liệu và custom fixture để tái sử dụng giữa các test.

- `users.json`: dữ liệu tài khoản mẫu gồm user hợp lệ, user bị khóa và user không hợp lệ.
- `users.ts`: định nghĩa kiểu dữ liệu TypeScript và export dữ liệu test theo kiểu an toàn.
- `testFixtures.ts`: mở rộng fixture mặc định của Playwright để inject `loginPage`, `users` và `authenticatedPage`.

### `tests/`

Chứa các test case E2E.

- `login.spec.ts`: bộ test cho luồng đăng nhập với 4 kịch bản chính.

### `reports/` và `test-results/`

Chứa kết quả sau khi chạy test.

- `reports/html/`: report HTML để xem trực quan.
- `reports/junit/`: file XML phục vụ CI/CD hoặc tích hợp test management.
- `test-results/`: artifact chi tiết hơn như trace, screenshot, video khi test lỗi.

## Kiến trúc test

Dự án đang áp dụng các nguyên tắc sau:

- `Page Object Model`: tách locator và thao tác UI khỏi nội dung test.
- `Typed Fixtures`: đóng gói dữ liệu và trạng thái dùng lại, giảm lặp code.
- `Environment-based config`: chọn URL và chế độ chạy theo `TEST_ENV`.
- `Tagging strategy`: hỗ trợ chia nhóm test theo mức độ ưu tiên hoặc mục đích chạy.

Luồng phụ thuộc hiện tại:

1. `playwright.config.ts` nạp file `.env` theo `TEST_ENV`.
2. `tests/login.spec.ts` dùng `test` từ `fixtures/testFixtures.ts`.
3. `testFixtures.ts` tạo `LoginPage` và nạp dữ liệu từ `users.ts`.
4. `users.ts` đọc dữ liệu tĩnh từ `users.json`.
5. `LoginPage.ts` kế thừa `BasePage.ts` để tái sử dụng hành vi chung.

## Cấu hình môi trường

Framework hỗ trợ 3 file môi trường:

- `.env.dev`
- `.env.staging`
- `.env.prod`

Biến môi trường hiện có:

- `BASE_URL`: URL gốc của ứng dụng test.
- `HEADLESS`: bật hoặc tắt chế độ headless.
- `TEST_ENV`: chọn môi trường, mặc định là `dev`.

Ví dụ cấu hình hiện tại:

```env
BASE_URL=https://www.saucedemo.com
HEADLESS=true
```

## Cấu hình Playwright

Một số điểm quan trọng trong `playwright.config.ts`:

- `testDir: './tests'`
- `fullyParallel: true`
- `workers: 4` khi chạy local, `1` khi chạy CI
- `retries: 1` khi local, `2` khi CI
- Chụp `screenshot`, `trace`, `video` khi test thất bại
- Reporter gồm:
  - `list`
  - `html` tại `reports/html`
  - `junit` tại `reports/junit/results.xml`
- Project browser hiện tại: `chromium`

## Các script có sẵn

Trong `package.json` đang có các script sau:

```bash
npm test
npm run test:login
npm run test:smoke
npm run test:headed
npm run test:ui
npm run lint
npm run lint:fix
npm run format
npm run format:write
npm run typecheck
npm run browsers:install
npm run report
```

Ý nghĩa nhanh:

- `npm test`: chạy toàn bộ test.
- `npm run test:login`: chỉ chạy file test login.
- `npm run test:smoke`: chạy các test có tag `@smoke`.
- `npm run test:headed`: chạy test có mở trình duyệt.
- `npm run test:ui`: chạy bằng Playwright UI mode.
- `npm run lint`: kiểm tra quy tắc code bằng ESLint.
- `npm run format`: kiểm tra format bằng Prettier.
- `npm run typecheck`: kiểm tra kiểu TypeScript.
- `npm run browsers:install`: cài browser binaries cho Playwright.
- `npm run report`: mở report HTML sau khi chạy test.

## Cách cài đặt và chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Cài browser cho Playwright

```bash
npm run browsers:install
```

### 3. Chạy test mặc định

```bash
npm test
```

### 4. Chạy theo môi trường

Trên PowerShell:

```powershell
$env:TEST_ENV="staging"
npm test
```

Hoặc chạy có ghi đè URL:

```powershell
$env:BASE_URL="https://www.saucedemo.com"
$env:HEADLESS="false"
npm run test:login
```

## Bộ test hiện tại

Hiện tại dự án có 4 test case trong luồng login:

1. Login thành công với user hợp lệ.
2. Login thất bại với user sai thông tin.
3. Login thất bại với user bị khóa.
4. Inventory hiển thị sau khi login thành công.

Kết quả report hiện có trong dự án cho thấy:

- Tổng số test: `4`
- Failures: `0`
- Errors: `0`
- Trạng thái lần chạy gần nhất: `passed`

## Chất lượng mã nguồn

Dự án đã có sẵn các lớp bảo vệ chất lượng:

- TypeScript `strict` mode.
- ESLint cho JavaScript và TypeScript.
- Prettier để chuẩn hóa format.
- Ignore các thư mục generated như `reports`, `playwright-report`, `test-results`.

## CI/CD

Pipeline GitHub Actions tại `.github/workflows/playwright.yml` sẽ tự động chạy khi:

- push lên `main`
- push lên `master`
- tạo pull request

Luồng CI hiện tại:

1. Checkout source code.
2. Cài Node.js 20.
3. `npm ci`.
4. Cài Playwright browsers.
5. Chạy `lint`.
6. Chạy `format` check.
7. Chạy `typecheck`.
8. Chạy test Playwright.
9. Upload artifact gồm HTML report, JUnit report và test results.

## Cách mở rộng framework

Khi thêm module test mới, có thể đi theo quy trình sau:

1. Tạo page object mới trong `pages/`.
2. Nếu có thao tác dùng chung, đưa vào `cores/BasePage.ts` hoặc tạo helper riêng.
3. Thêm fixture mới trong `fixtures/testFixtures.ts` nếu cần tái sử dụng rộng.
4. Tạo dữ liệu test tĩnh trong `fixtures/users.json` hoặc tách file dữ liệu mới.
5. Viết spec mới trong `tests/` và gắn tag phù hợp.

Ví dụ mở rộng hợp lý:

- thêm `InventoryPage.ts`
- thêm `cart.spec.ts`
- thêm fixture cho session người dùng đã đăng nhập
- thêm test data cho nhiều role khác nhau

## Khi nào nên dùng framework này

Phù hợp khi bạn cần:

- một boilerplate Playwright TypeScript gọn nhưng có tổ chức tốt
- demo Page Object Model và custom fixtures
- nền tảng ban đầu cho framework automation nội bộ
- tích hợp CI đơn giản với report artifact rõ ràng

## Hạn chế hiện tại

- Mới có 1 luồng nghiệp vụ là login.
- Mới chạy project `chromium`, chưa cấu hình đa trình duyệt.
- Dữ liệu test còn tĩnh, chưa tích hợp API hoặc data factory.
- Chưa có helper dùng chung cho API, auth token, test utilities hoặc test hooks phức tạp.

## Hướng phát triển tiếp theo

- Bổ sung page object cho inventory, cart, checkout.
- Mở rộng chạy đa browser như Firefox và WebKit.
- Tách test theo domain và thêm tag chiến lược hơn.
- Thêm helper cho API setup hoặc cleanup dữ liệu.
- Tích hợp report nâng cao như Allure nếu cần.

## Tóm tắt

Đây là một framework Playwright mẫu được tổ chức tốt theo TypeScript, Page Object Model và custom fixtures. Dự án hiện đủ các thành phần nền tảng để phát triển tiếp thành framework E2E chuẩn hơn: cấu hình môi trường, quality checks, CI, report và dữ liệu test tách biệt.