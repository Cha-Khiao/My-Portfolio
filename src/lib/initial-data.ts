export interface SkillGroup {
  id: string;
  title: string;
  desc: string;
  icon: string; // 'bot' | 'briefcase' | 'zap' | 'globe' | 'code' | 'cpu' | 'sparkles'
  skills: string[];
}

export interface ProfileData {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  about1: string;
  about2: string;
  imageUrl: string;
  email: string;
  githubUrl: string;
  lineUrl?: string;
  lineId?: string;
  lineQrUrl?: string;
  phone?: string;
  aboutHeading?: string;
  projectsHeading?: string;
  certificatesHeading?: string;
  skillsHeading?: string;
  contactHeading?: string;
  contactDesc?: string;
  skillsJson?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  desc: string;
  preview: string; // 'chat' | 'tasks' | 'quiz' | 'portfolio' | 'weather' | 'expense'
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
}

export interface CertificateData {
  id: string;
  name: string;
  org: string;
  color: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

export const defaultSkills: SkillGroup[] = [
  {
    id: '1',
    title: 'AI-Powered Workflow (ก้าวข้ามภาษาและโค้ด)',
    icon: 'bot',
    desc: 'ใช้ AI เป็นล่ามแปลภาษา ที่ปรึกษา และผู้ช่วยเขียนโค้ด ทำให้สามารถวิเคราะห์โจทย์ แก้ปัญหา และพัฒนาโปรเจกต์ได้โดยไม่ถูกจำกัดด้วยทักษะภาษาอังกฤษหรือการจำไวยากรณ์โค้ด',
    skills: ['AI Pair Programming', 'Prompt Engineering', 'Claude', 'ChatGPT', 'Gemini', 'Cursor AI'],
  },
  {
    id: '2',
    title: 'Productivity & Office Suites (งานสำนักงาน)',
    icon: 'briefcase',
    desc: 'จัดการเอกสาร ตารางคำนวณ ออกแบบแบบฟอร์ม ฐานข้อมูลสำนักงาน และการประสานงานบนคลาวด์ได้อย่างคล่องแคล่วและเป็นระเบียบ',
    skills: ['Google Workspace', 'Google Sheets / Docs', 'Google Forms', 'Microsoft 365', 'Microsoft Excel', 'Word / PowerPoint'],
  },
  {
    id: '3',
    title: 'Automation & Scripting (ระบบอัตโนมัติ)',
    icon: 'zap',
    desc: 'เชื่อมต่อข้อมูลและสร้างกระบวนการทำงานอัตโนมัติด้วย Google Apps Script (GAS) เพื่อลดงานซ้ำซ้อน เช่น การดึงข้อมูลแบบฟอร์ม ส่งอีเมลแจ้งเตือน และจัดการข้อมูล',
    skills: ['Google Apps Script (GAS)', 'Workflow Automation', 'Sheets Formulas', 'Data Digitization', 'API Integration'],
  },
  {
    id: '4',
    title: 'Web & Cloud Delivery (การสร้างและนำระบบขึ้นใช้งาน)',
    icon: 'globe',
    desc: 'พัฒนาเว็บแอปพลิเคชันและโปรเจกต์ดิจิทัลโดยให้ AI ช่วยตรวจสอบและประกอบโค้ด พร้อมนำขึ้นคลาวด์ให้ใช้งานได้จริงอย่างมีประสิทธิภาพ',
    skills: ['Next.js (AI-Assisted)', 'TypeScript / React', 'Tailwind CSS', 'PostgreSQL / Prisma', 'Git & GitHub', 'Vercel'],
  },
];

export const defaultProfile: ProfileData = {
  id: 'profile',
  name: 'Prasopphol Talhom',
  role: 'Computer Science Student',
  tagline: 'พอร์ตโฟลิโอรวบรวมผลงานและโปรเจกต์ต่างๆ แม้ไม่ได้เชี่ยวชาญการเขียนโค้ดหรือภาษาอังกฤษ แต่ถนัดการใช้ AI มาช่วยคิด วิเคราะห์ แก้ปัญหา และสร้างสรรค์ผลงานจริงในหลากหลายด้าน',
  aboutHeading: 'About Me',
  about1: 'ผมเป็นนักศึกษาวิทยาการคอมพิวเตอร์ที่สร้างเว็บไซต์นี้ขึ้นมาเพื่อเป็นพอร์ตโฟลิโอรวบรวมผลงานและโปรเจกต์ต่างๆ ผมอาจไม่ได้เป็นคนที่เก่งภาษาอังกฤษหรือเชี่ยวชาญด้านการเขียนโค้ดด้วยตัวเองตั้งแต่เริ่มต้น แต่ผมมองว่า AI คือเครื่องมือและพาร์ทเนอร์ที่ทรงพลังในการก้าวข้ามข้อจำกัดเหล่านั้น',
  about2: 'ผมจึงมุ่งเน้นการใช้ความถนัดด้าน AI มาประยุกต์ใช้งานในหลากหลายมิติ ไม่ว่าจะเป็นการพัฒนาซอฟต์แวร์ เว็บแอปพลิเคชัน การจัดการข้อมูล หรือการแก้ปัญหาเฉพาะทาง โดยทำงานร่วมกับ AI อย่างเป็นระบบ ตั้งแต่วิเคราะห์โจทย์ ออกแบบ วางแผน ไปจนถึงทดสอบและส่งมอบผลงานที่ใช้งานได้จริง',
  projectsHeading: 'Projects',
  certificatesHeading: 'Certificates',
  skillsHeading: 'Skills & Capabilities',
  contactHeading: 'Get in Touch',
  contactDesc: 'ผมกำลังมองหาโอกาสในการฝึกงาน เพื่อนำทักษะด้านการประยุกต์ใช้ AI ทำงานอย่างเป็นระบบ การสร้างระบบอัตโนมัติ (GAS) และการจัดการงานดิจิทัลไปช่วยซัพพอร์ตทีม พร้อมเรียนรู้และพัฒนาตัวเองอย่างเต็มที่ หากองค์กรหรือทีมของท่านกำลังเปิดรับนักศึกษาฝึกงาน สามารถติดต่อพูดคุยกับผมได้เลยครับ',
  imageUrl: 'https://github.com/Cha-Khiao.png',
  email: 'kingdomdemon703@gmail.com',
  githubUrl: 'https://github.com/Cha-Khiao',
  lineUrl: 'https://line.me/ti/p/swWxGS9q9y',
  lineId: '',
  lineQrUrl: '/images/line-qr.jpg',
  phone: '064-965-9703',
  skillsJson: JSON.stringify(defaultSkills),
};

export const defaultProjects: ProjectData[] = [
  { id: '1', title: 'AI Chat Assistant', desc: 'ผู้ช่วยสนทนาที่ตอบคำถามจากบริบท พร้อมหน้าจอสำหรับติดตามบทสนทนาอย่างเป็นระบบ', preview: 'chat', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/demo?preview=chat', featured: true, order: 1 },
  { id: '2', title: 'Task Manager', desc: 'ระบบจัดการงานที่ช่วยจัดหมวดหมู่ ติดตามสถานะ และกำหนดวันครบกำหนด', preview: 'tasks', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/demo?preview=tasks', featured: true, order: 2 },
  { id: '3', title: 'Quiz Generator', desc: 'เครื่องมือสร้างแบบทดสอบจากเนื้อหา พร้อมตรวจคำตอบและสรุปผล', preview: 'quiz', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/demo?preview=quiz', featured: true, order: 3 },
  { id: '4', title: 'Portfolio Website', desc: 'เว็บไซต์แสดงผลงานที่รองรับทุกขนาดหน้าจอ พร้อมโหมดสว่างและโหมดมืด', preview: 'portfolio', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/', featured: false, order: 4 },
  { id: '5', title: 'Weather Dashboard', desc: 'แดชบอร์ดสำหรับดูข้อมูลสภาพอากาศปัจจุบันและแนวโน้มในรูปแบบที่อ่านง่าย', preview: 'weather', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/demo?preview=weather', featured: false, order: 5 },
  { id: '6', title: 'Expense Tracker', desc: 'เครื่องมือบันทึกค่าใช้จ่ายรายวัน พร้อมกราฟสรุปภาพรวมในแต่ละเดือน', preview: 'expense', githubUrl: 'https://github.com/Cha-Khiao', demoUrl: '/demo?preview=expense', featured: false, order: 6 },
];

export const defaultCertificates: CertificateData[] = [
  { id: '1', org: 'Coursera', name: 'Introduction to Artificial Intelligence', color: '#2563EB', imageUrl: '', featured: true, order: 1 },
  { id: '2', org: 'Udemy', name: 'The Complete Web Development Bootcamp', color: '#7C3AED', imageUrl: '', featured: true, order: 2 },
  { id: '3', org: 'freeCodeCamp', name: 'Responsive Web Design', color: '#0F766E', imageUrl: '', featured: true, order: 3 },
  { id: '4', org: 'freeCodeCamp', name: 'JavaScript Algorithms & Data Structures', color: '#B45309', imageUrl: '', featured: false, order: 4 },
  { id: '5', org: 'Coursera', name: 'Python for Everybody Specialization', color: '#0369A1', imageUrl: '', featured: false, order: 5 },
  { id: '6', org: 'Coursera', name: 'Version Control with Git', color: '#BE123C', imageUrl: '', featured: false, order: 6 },
];
