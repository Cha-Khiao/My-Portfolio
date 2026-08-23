import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.profile.upsert({
      where: { id: 'profile' },
      update: {
        phone: '064-965-9703',
        lineUrl: 'https://line.me/ti/p/swWxGS9q9y',
        lineId: '',
        lineQrUrl: '/images/line-qr.jpg',
      },
      create: {
        id: 'profile',
        name: 'Prasopphol Talhom',
        role: 'Computer Science Student',
        tagline: 'พอร์ตโฟลิโอรวบรวมผลงานและโปรเจกต์ต่างๆ แม้ไม่ได้เชี่ยวชาญการเขียนโค้ดหรือภาษาอังกฤษ แต่ถนัดการใช้ AI มาช่วยคิด วิเคราะห์ แก้ปัญหา และสร้างสรรค์ผลงานจริงในหลากหลายด้าน',
        about1: 'ผมเป็นนักศึกษาวิทยาการคอมพิวเตอร์ที่สร้างเว็บไซต์นี้ขึ้นมาเพื่อเป็นพอร์ตโฟลิโอรวบรวมผลงานและโปรเจกต์ต่างๆ ผมอาจไม่ได้เป็นคนที่เก่งภาษาอังกฤษหรือเชี่ยวชาญด้านการเขียนโค้ดด้วยตัวเองตั้งแต่เริ่มต้น แต่ผมมองว่า AI คือเครื่องมือและพาร์ทเนอร์ที่ทรงพลังในการก้าวข้ามข้อจำกัดเหล่านั้น',
        about2: 'ผมจึงมุ่งเน้นการใช้ความถนัดด้าน AI มาประยุกต์ใช้งานในหลากหลายมิติ ไม่ว่าจะเป็นการพัฒนาซอฟต์แวร์ เว็บแอปพลิเคชัน การจัดการข้อมูล หรือการแก้ปัญหาเฉพาะทาง โดยทำงานร่วมกับ AI อย่างเป็นระบบ ตั้งแต่วิเคราะห์โจทย์ ออกแบบ วางแผน ไปจนถึงทดสอบและส่งมอบผลงานที่ใช้งานได้จริง',
        imageUrl: 'https://github.com/Cha-Khiao.png',
        email: 'kingdomdemon703@gmail.com',
        githubUrl: 'https://github.com/Cha-Khiao',
        phone: '064-965-9703',
        lineUrl: 'https://line.me/ti/p/swWxGS9q9y',
        lineId: '',
        lineQrUrl: '/images/line-qr.jpg',
      },
    });
    console.log('Database profile updated successfully!');
  } catch (err) {
    console.log('DB Note:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
