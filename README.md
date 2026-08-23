# 🌟 เว็บไซต์พอร์ตโฟลิโอส่วนตัว (Personal Portfolio Website)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<br />

เว็บไซต์พอร์ตโฟลิโอส่วนตัวระดับโมเดิร์น พัฒนาด้วย **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma ORM** และเชื่อมต่อกับ **Supabase (PostgreSQL, Auth, Storage)** ครบวงจร ทั้งการจัดแสดงผลงาน กิจกรรม ใบรับรอง ทักษะความสามารถ พร้อมระบบจัดการหลังบ้าน (Admin Control Center) ที่ปลอดภัย ใช้งานง่าย และรองรับทุกอุปกรณ์

---

## 🌟 ฟีเจอร์เด่นของระบบ (Key Features)

### 🎨 1. ส่วนหน้าบ้านสำหรับผู้เข้าชม (Public Features)
- **⚡ Next.js 16 & React 19**: ประสิทธิภาพสูง โหลดเร็ว รองรับทั้ง Server-Side Rendering (SSR) และ Client Components
- **🚀 จัดแสดงผลงาน (Projects Showcase)**: มีกรอบพรีวิวผลงาน ปุ่มเปิดดู **Live Demo** ในแท็บใหม่อัตโนมัติ และลิงก์ Source Code บน GitHub
- **📸 กิจกรรมและประสบการณ์ (Activities & Experience)**:
  - แสดงภาพแบบ **Collage Grid** พร้อมตัวเลขบอกจำนวนภาพที่เหลือ (`+N`)
  - หน้าต่างป๊อปอัปดูภาพกิจกรรมขนาดใหญ่ พร้อมปุ่มเลื่อนดูภาพแบบสไลด์โชว์
  - หน้าแยกเฉพาะสำหรับกิจกรรมทั้งหมด (`/activities`)
- **🏆 จัดแสดงใบรับรอง (Certificates Showcase)**:
  - รองรับทั้งไฟล์ภาพ (`.png`, `.jpg`, `.webp`) และเอกสาร **PDF** โดยเรนเดอร์ภาพตัวอย่างหน้าแรกผ่าน **PDF.js**
  - ค้นหาแบบเรียลไทม์ (Live Search) และฟิลเตอร์ตามผู้ออกใบรับรอง
  - หน้าต่างดูใบรับรองขนาดใหญ่ (Certificate Modal Viewer) และหน้าแยกเฉพาะ (`/certificates`)
- **📄 ดูเรซูเม่ (Resume PDF Viewer Modal)**: ป๊อปอัปดูไฟล์เรซูเม่ฉบับเต็มโดยไม่ต้องออกจากหน้าเว็บ พร้อมปุ่มดาวน์โหลด
- **💬 ติดต่อและโซเชียลมีเดีย**: รองรับการเปิดหน้าต่างเพิ่มเพื่อนผ่าน **LINE QR Code**, อีเมล, เบอร์โทรศัพท์ และ GitHub
- **🌓 รองรับ 2 ธีม (Dark / Light Mode)**: สลับธีมมืดและสว่างอย่างนุ่มนวล พร้อมบันทึกการตั้งค่าลง LocalStorage
- **📱 Fully Responsive**: ใช้งานได้อย่างสมบูรณ์แบบบนสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์

---

### 🔒 2. ระบบจัดการหลังบ้านและความปลอดภัย (Admin Control Center)
- **🔐 ยืนยันตัวตนด้วย Supabase Auth**: ล็อกอินผ่านระบบความปลอดภัยมาตรฐาน พร้อมตรวจสอบสิทธิ์ Whitelist (`ADMIN_EMAIL`) เฉพาะผู้ดูแลระบบ
- **⏱️ ระบบตรวจจับการไม่ใช้งาน (Smart Inactivity Auto-Logout)**: 
  - รีเซ็ตเวลานับถอยหลังอัตโนมัติเมื่อมีการขยับเมาส์หรือพิมพ์ข้อความ
  - หากไม่มีการใช้งานเกิน 20 นาที ระบบจะแสดงแจ้งเตือนนับถอยหลัง 60 วินาที และออกจากระบบให้อัตโนมัติ
- **🎨 ดีไซน์แยกสีตามหมวดหมู่ (Semantic Color Coding)**:
  - 🔵 **Projects**: โทนสีน้ำเงิน (Blue)
  - 🟠 **Activities**: โทนสีส้มอำพัน (Amber)
  - 🟢 **Certificates**: โทนสีเขียวมรกต (Emerald)
  - 🟣 **Skills**: โทนสีม่วง (Purple)
  - 🌐 **Profile**: โทนสีฟ้าสดใส (Sky)
- **✂️ ระบบครอบตัดรูปโปรไฟล์ (Circle Avatar Cropper)**: ปรับขนาดพอดีกับกรอบวงกลม (Fit to Viewport) ลากจัดตำแหน่ง (Pan) และซูมได้อย่างแม่นยำ
- **📂 จัดเก็บไฟล์บน Cloud (Supabase Storage)**: จัดเก็บไฟล์ภาพและ PDF แยกโฟลเดอร์เป็นระเบียบ พร้อมระบบ Local Storage Fallback
- **🛡️ ระบบ Zero-Downtime Fallback Layer**: หาก Database ติดขัด ระบบจะดึงข้อมูลตัวอย่างขึ้นมาแสดงผลให้อัตโนมัติ เว็บไซต์จึงเปิดได้ตลอดเวลาไม่มีหน้าขาว

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| หมวดหมู่ | เทคโนโลยี | รายละเอียด |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | React Framework สำหรับ Production |
| **UI Library** | React 19 | ไลบรารีสร้าง User Interface |
| **Language** | TypeScript | เขียนโค้ดแบบ Type-Safe |
| **Styling** | Tailwind CSS | Utility-First CSS Framework |
| **Database** | PostgreSQL | ฐานข้อมูลเชิงสัมพันธ์ประสิทธิภาพสูง |
| **ORM** | Prisma ORM | Object-Relational Mapping สำหรับจัดการ Database |
| **Backend & Cloud** | Supabase | Auth, PostgreSQL Database และ Storage Buckets |
| **PDF Rendering** | PDF.js (pdfjs-dist) | เรนเดอร์ไฟล์ PDF เป็นรูปภาพตัวอย่าง |
| **Icons** | Lucide React | ไอคอนสไตล์โมเดิร์น |
| **Deployment** | Vercel | แพลตฟอร์มคลาวด์สำหรับโฮสต์เว็บแอปพลิเคชัน |

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
My-Portfolio/
├── prisma/
│   ├── schema.prisma              # Schema กำหนดโครงสร้างตารางฐานข้อมูล (Profile, Project, Certificate, Activity)
│   └── seed.ts                    # สคริปต์ Seed นำเข้าข้อมูลเริ่มต้นลงฐานข้อมูล
├── public/
│   ├── images/                    # รูปภาพตั้งต้นของระบบ (LINE QR, ฯลฯ)
│   └── uploads/                   # โฟลเดอร์จัดเก็บไฟล์อัปโหลดในโหมด Local
├── src/
│   ├── app/
│   │   ├── activities/page.tsx    # หน้ารวมกิจกรรมและประสบการณ์ทั้งหมด
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # หน้าเข้าสู่ระบบผู้ดูแล (Minimalist Login)
│   │   │   └── page.tsx           # หน้าแดชบอร์ดจัดการระบบหลังบ้าน (Admin Control Center)
│   │   ├── api/                   # REST API Routes (auth, profile, projects, activities, certificates, upload, seed)
│   │   ├── certificates/page.tsx  # หน้ารวมใบรับรองทั้งหมด พร้อมระบบค้นหาและฟิลเตอร์
│   │   ├── demo/page.tsx          # หน้าต่างจำลอง Interactive Live Demo
│   │   ├── projects/page.tsx      # หน้ารวมโปรเจกต์และผลงานทั้งหมด
│   │   ├── globals.css            # กำหนดตัวแปรธีม โทนสี และสไตล์ปุ่มกด
│   │   ├── layout.tsx             # Root Layout (Navbar, Footer, ThemeProvider)
│   │   └── page.tsx               # หน้าแรกของเว็บไซต์พอร์ตโฟลิโอ
│   ├── components/                # คอมโพเนนต์ UI ทั้งหมด
│   │   ├── ActivityCard.tsx       # การ์ดแสดงกิจกรรม พร้อม Collage Grid
│   │   ├── AdminInactivityGuard.tsx # ระบบตรวจจับการไม่ใช้งานและ Auto-Logout
│   │   ├── CertificateCard.tsx    # การ์ดแสดงใบรับรอง รองรับทั้งภาพและ PDF
│   │   ├── CertificateModal.tsx   # ป๊อปอัปดูใบรับรองขนาดใหญ่
│   │   ├── Footer.tsx             # ส่วนท้ายของเว็บไซต์
│   │   ├── LineModal.tsx          # ป๊อปอัปสแกน LINE QR Code
│   │   ├── Navbar.tsx             # แถบนำทางด้านบน
│   │   ├── PdfThumbnail.tsx       # คอมโพเนนต์เรนเดอร์ภาพตัวอย่าง PDF
│   │   ├── ProjectCard.tsx        # การ์ดแสดงโปรเจกต์และผลงาน
│   │   ├── ResumeModal.tsx        # ป๊อปอัปเปิดดูเอกสารเรซูเม่ PDF
│   │   ├── SkillsSection.tsx      # ส่วนแสดงทักษะความสามารถ
│   │   ├── ThemeProvider.tsx      # Context Provider สำหรับ Dark/Light Mode
│   │   └── ThemeToggle.tsx        # ปุ่มสลับ Dark/Light Mode
│   └── lib/                       # ไฟล์ Helper & Client Instances (Prisma, Supabase, Auth, Initial Data)
├── .env.example                   # ตัวอย่างตัวแปร Environment Variables
├── package.json                   # การตั้งค่า Dependencies และ Build Scripts
├── tailwind.config.ts             # การตั้งค่า Tailwind CSS
└── tsconfig.json                  # การตั้งค่า TypeScript
```

---

## 🚀 ขั้นตอนการติดตั้งและรันในเครื่อง (Getting Started)

### 1. โคลน Repository และติดตั้ง Dependencies
```bash
git clone https://github.com/Cha-Khiao/My-Portfolio.git
cd My-Portfolio
npm install
```

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (`.env`)
คัดลอกไฟล์ `.env.example` เป็น `.env`:
```bash
cp .env.example .env
```
จากนั้นกรอกข้อมูลการเชื่อมต่อ Supabase:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
ADMIN_EMAIL="your-email@example.com"
AUTH_SECRET="super-secret-key"
```

### 3. ซิงค์โครงสร้างฐานข้อมูล (Prisma)
```bash
npx prisma db push
```

*(ทางเลือก) รันคำสั่ง Seed นำเข้าข้อมูลเริ่มต้น:*
```bash
npm run prisma:seed
```

### 4. รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
```bash
npm run dev
```
เปิดเว็บเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 การนำขึ้นระบบออนไลน์ (Deployment to Vercel)

1. ทำการ Push โค้ดขึ้น **GitHub Repository**
2. ไปที่แดชบอร์ดของ **[Vercel](https://vercel.com)** แล้วกด **Add New Project** $\rightarrow$ เลือก Repository นี้
3. ตั้งค่า **Environment Variables** ในหน้าการตั้งค่าของ Vercel ให้ครบถ้วนตามไฟล์ `.env`
4. กด **Deploy** เว็บไซต์จะถูก Build และออนไลน์พร้อมใช้งานทันที

---

## 👤 ผู้พัฒนา (Author)

- **GitHub**: [@Cha-Khiao](https://github.com/Cha-Khiao)

---

## 📄 ลิขสิทธิ์ (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต **[MIT License](LICENSE)**
