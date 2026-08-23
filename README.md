# เว็บไซต์พอร์ตโฟลิโอส่วนตัว (Personal Portfolio Website)

เว็บไซต์พอร์ตโฟลิโอส่วนตัวที่ทันสมัยและมีประสิทธิภาพสูง พัฒนาด้วย **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM** และเชื่อมต่อกับ **Supabase (PostgreSQL, Authentication, Storage)** พร้อมระบบจัดการเนื้อหาหลังบ้าน (Admin Control Center) ที่ปลอดภัยและใช้งานง่าย

---

## 🌟 ฟีเจอร์เด่นของระบบ (Key Features)

### 🎨 1. ส่วนหน้าบ้านสำหรับผู้เข้าชม (Public Features)
- **⚡ รวดเร็วและทันสมัย (Next.js & React 19)**: โหลดไว รองรับทั้ง Server-Side Rendering (SSR) และ Client Components
- **🚀 จัดแสดงผลงาน (Projects Showcase)**: มีกรอบพรีวิวผลงาน และปุ่มเปิดดู **Live Demo** ในแท็บใหม่อัตโนมัติ
- **🏆 จัดแสดงใบรับรอง (Certificates Showcase)**: รองรับทั้งไฟล์ **รูปภาพ** และเอกสาร **PDF** พร้อมระบบค้นหาแบบเรียลไทม์ (Live Search) และฟิลเตอร์หมวดหมู่อัตโนมัติ
- **🌓 รองรับ 2 ธีม (Dark / Light Mode)**: สลับธีมมืด-สว่างได้อย่างราบรื่น พร้อมบันทึกสถานะลงใน LocalStorage
- **📱 รองรับทุกหน้าจอ (Fully Responsive)**: แสดงผลสวยงามทั้งบนสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์

### 🔒 2. ระบบจัดการหลังบ้านและความปลอดภัย (Admin & Security)
- **🔐 ยืนยันตัวตนด้วย Supabase Auth**: ล็อกอินด้วย Email & Password ผ่านระบบความปลอดภัยมาตรฐานของ Supabase
- **🚫 ปิดการสมัครสมาชิกสาธารณะ (Admin Only)**: บุคคลภายนอกไม่สามารถสมัครสมาชิกได้ มีเพียงผู้ดูแลที่กำหนดไว้ใน Whitelist (`ADMIN_EMAIL`) เท่านั้นที่เข้าใช้งานได้
- **⏱️ ระบบตรวจจับการไม่มีการใช้งาน (Smart Inactivity Auto-Logout)**: 
  - รีเซ็ตเวลานับถอยหลังอัตโนมัติทุกครั้งที่พิมพ์หรือขยับเมาส์ (ไม่เด้งออกขณะทำงาน)
  - หากปล่อยหน้าจอทิ้งไว้นิ่งๆ นาน 20 นาที ระบบจะแสดงการแจ้งเตือน 60 วินาที และออกจากระบบให้อัตโนมัติเพื่อความปลอดภัย
- **📂 จัดเก็บไฟล์บน Cloud (Supabase Storage)**: แยกโฟลเดอร์เก็บไฟล์ภาพและ PDF เป็นระเบียบ (`certificates/`, `avatars/`, `line-qr/`, `projects/`)
- **🛡️ ระบบ Fallback Layer**: หาก Database อยู่ในช่วงรีสตาร์ท หน้าเว็บจะยังคงแสดงผลข้อมูลตัวอย่างได้อย่างราบรื่น 100% ไม่มีหน้าขาว

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) ผ่าน [Prisma ORM](https://www.prisma.io/)
- **Cloud Backend**: [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting & Deployment**: [Vercel](https://vercel.com/)

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
portfi456/
├── prisma/
│   ├── schema.prisma              # โครงสร้างตารางฐานข้อมูล (Profile, Project, Certificate)
│   └── seed.ts                    # สคริปต์นำเข้าข้อมูลตัวอย่างตั้งต้น
├── public/
│   └── images/                    # รูปภาพตั้งต้นของระบบ
├── src/
│   ├── app/
│   │   ├── api/                   # REST API Routes (auth, profile, projects, certificates, upload, seed)
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # หน้าเข้าสู่ระบบผู้ดูแล (Discreet Minimal Login)
│   │   │   └── page.tsx           # หน้าแดชบอร์ดจัดการเนื้อหาหลังบ้าน (Admin Control Center)
│   │   ├── projects/page.tsx      # หน้ารวมผลงานทั้งหมด
│   │   ├── certificates/page.tsx  # หน้ารวมใบรับรองทั้งหมด (พร้อมตัวกรองและช่องค้นหา)
│   │   ├── globals.css            # กำหนดธีม สี และปุ่มกดทรงมิติ 3D (Tactile Buttons)
│   │   ├── layout.tsx             # Root Layout (Navbar, Footer, Fonts)
│   │   └── page.tsx               # หน้าแรกของเว็บไซต์พอร์ตโฟลิโอ
│   ├── components/                # คอมโพเนนต์ UI ทั้งหมด (Cards, Modals, Sections, Guard)
│   └── lib/                       # ไฟล์ Helper (Prisma, Supabase, Auth, Initial Data)
├── .env.example                   # ตัวอย่างตัวแปร Environment Variables
├── package.json                   # การตั้งค่า Dependencies และ Scripts
└── tsconfig.json                  # การตั้งค่า TypeScript
```

---

## 🚀 ขั้นตอนการติดตั้งและรันในเครื่อง (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าไฟล์ `.env`
คัดลอกไฟล์ `.env.example` เป็น `.env` แล้วกรอกค่าการเชื่อมต่อ Supabase:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
ADMIN_EMAIL="your-email@example.com"
AUTH_SECRET="super-secret-key"
```

### 3. เชื่อมต่อโครงสร้างฐานข้อมูล (Prisma)
```bash
npx prisma db push
```

### 4. เริ่มต้นรันเซิร์ฟเวอร์สำหรับพัฒนา
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 การนำขึ้นระบบออนไลน์ (Deployment to Vercel)

1. นำโค้ดขึ้น **GitHub Repository**
2. นำเข้าโปรเจกต์บน **[Vercel](https://vercel.com)**
3. ตั้งค่า **Environment Variables** ให้ตรงกับในไฟล์ `.env`
4. กด **Deploy** เว็บไซต์จะออนไลน์พร้อมใช้งานทันที

---

## 👤 ผู้พัฒนา (Author)

- **GitHub**: [@Cha-Khiao](https://github.com/Cha-Khiao)

---

## 📄 ลิขสิทธิ์ (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต **[MIT License](LICENSE)**