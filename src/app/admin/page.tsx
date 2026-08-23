'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  LogOut,
  Trash2,
  Edit2,
  RefreshCw,
  Eye,
  User,
  Layers,
  Award,
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
  X,
  Plus,
  Sparkles,
  Phone,
  Mail,
  Bot,
  Briefcase,
  Zap,
  Globe,
  Code,
  Cpu,
  Terminal,
  Wrench,
  Search,
  Check,
  ExternalLink,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { LineIcon } from '@/components/icons/LineIcon';
import { ProfileData, ProjectData, CertificateData, SkillGroup, defaultProfile, defaultSkills } from '@/lib/initial-data';
import { CertificateModal } from '@/components/CertificateModal';
import { AdminInactivityGuard } from '@/components/AdminInactivityGuard';

const AVAILABLE_ICONS = [
  { id: 'bot', label: 'Bot / AI', icon: Bot },
  { id: 'briefcase', label: 'Briefcase / Office', icon: Briefcase },
  { id: 'zap', label: 'Zap / Automation', icon: Zap },
  { id: 'globe', label: 'Globe / Web', icon: Globe },
  { id: 'code', label: 'Code / Programming', icon: Code },
  { id: 'cpu', label: 'CPU / System', icon: Cpu },
  { id: 'sparkles', label: 'Sparkles / Innovation', icon: Sparkles },
  { id: 'terminal', label: 'Terminal / CLI', icon: Terminal },
  { id: 'wrench', label: 'Wrench / Tools', icon: Wrench },
  { id: 'layers', label: 'Layers / Architecture', icon: Layers },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'projects' | 'certificates' | 'skills' | 'profile'>('projects');
  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [profile, setProfile] = React.useState<ProfileData>(defaultProfile);
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [certificates, setCertificates] = React.useState<CertificateData[]>([]);
  const [skillsList, setSkillsList] = React.useState<SkillGroup[]>(defaultSkills);

  // Search & Filter states for Admin list
  const [projectSearch, setProjectSearch] = React.useState('');
  const [projectFeaturedOnly, setProjectFeaturedOnly] = React.useState(false);

  const [certSearch, setCertSearch] = React.useState('');
  const [certFeaturedOnly, setCertFeaturedOnly] = React.useState(false);
  const [certPreviewError, setCertPreviewError] = React.useState(false);
  const [qrPreviewError, setQrPreviewError] = React.useState(false);
  const [previewCertInAdmin, setPreviewCertInAdmin] = React.useState<CertificateData | null>(null);

  // Project form state
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [projectForm, setProjectForm] = React.useState({
    title: '',
    desc: '',
    preview: 'portfolio',
    githubUrl: '',
    demoUrl: '',
    featured: false,
    order: 1,
  });

  // Certificate form state
  const [editingCertId, setEditingCertId] = React.useState<string | null>(null);
  const [certForm, setCertForm] = React.useState({
    name: '',
    org: '',
    color: '#4F46E5',
    imageUrl: '',
    featured: false,
    order: 1,
  });
  const [certUploading, setCertUploading] = React.useState(false);

  // Skill form state
  const [editingSkillId, setEditingSkillId] = React.useState<string | null>(null);
  const [skillForm, setSkillForm] = React.useState({
    title: '',
    desc: '',
    icon: 'bot',
    skillsInput: '',
  });

  // Profile Crop Modal state
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [cropZoom, setCropZoom] = React.useState(1);
  const [cropPosition, setCropPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const cropImageRef = React.useRef<HTMLImageElement | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // 1. Check Auth & Load Data
  const loadAllData = async () => {
    try {
      const authRes = await fetch('/api/auth');
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push('/admin/login');
        return;
      }
      setAuthChecked(true);

      const [profRes, projRes, certRes] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/certificates').then((r) => r.json()),
      ]);

      if (profRes && !profRes.error) {
        setProfile(profRes);
        if (profRes.skillsJson) {
          try {
            const parsed = JSON.parse(profRes.skillsJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSkillsList(parsed);
            }
          } catch (e) {
            console.warn('Using default skills');
          }
        }
      }
      if (Array.isArray(projRes)) setProjects(projRes);
      if (Array.isArray(certRes)) setCertificates(certRes);
    } catch (err: any) {
      showStatus('โหลดข้อมูลไม่สำเร็จ: ' + err.message, 'error');
    }
  };

  React.useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (err) {
      router.push('/admin/login');
    }
  };

  // 2. Profile Crop and Upload Handlers
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setCropImageSrc(fileReader.result as string);
        setCropZoom(1);
        setCropPosition({ x: 0, y: 0 });
        setCropModalOpen(true);
      };
      fileReader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setCropZoom(1);
        setCropPosition({ x: 0, y: 0 });
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSaveCrop = async () => {
    if (!cropImageRef.current || !cropImageSrc) return;

    try {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = cropImageRef.current;
      const ringSize = 260;
      const scale = size / ringSize;

      const displayW = img.width * cropZoom;
      const displayH = img.height * cropZoom;

      const imgX = (cropPosition.x - displayW / 2 + ringSize / 2) * scale;
      const imgY = (cropPosition.y - displayH / 2 + ringSize / 2) * scale;
      const imgW = displayW * scale;
      const imgH = displayH * scale;

      ctx.drawImage(img, imgX, imgY, imgW, imgH);
      const base64 = canvas.toDataURL('image/jpeg', 0.9);

      // Upload to server
      const formData = new FormData();
      formData.append('base64', base64);
      formData.append('folder', 'avatars');
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const finalUrl = uploadData.url || base64;

      setProfile({ ...profile, imageUrl: finalUrl });
      setCropModalOpen(false);
      showStatus('ครอบตัดและอัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus('เกิดข้อผิดพลาดในการครอบตัด: ' + err.message, 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...profile,
        skillsJson: JSON.stringify(skillsList),
      };
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      showStatus('บันทึกข้อมูลหน้าเว็บและโปรไฟล์เรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleLineQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showStatus('กำลังอัปโหลด LINE QR Code...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'line-qr');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setProfile({ ...profile, lineQrUrl: data.url });
      setQrPreviewError(false);
      showStatus('อัปโหลด LINE QR Code สำเร็จ');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 3. Project Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        const res = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        });
        if (!res.ok) throw new Error('Failed to update project');
        showStatus('แก้ไขผลงานเรียบร้อยแล้ว');
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        });
        if (!res.ok) throw new Error('Failed to create project');
        showStatus('เพิ่มผลงานใหม่เรียบร้อยแล้ว');
      }

      resetProjectForm();
      const updatedProjects = await fetch('/api/projects').then((r) => r.json());
      if (Array.isArray(updatedProjects)) setProjects(updatedProjects);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleEditProject = (proj: ProjectData) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      desc: proj.desc,
      preview: proj.preview,
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      featured: proj.featured,
      order: proj.order,
    });
    setActiveTab('projects');
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบผลงาน "${title}" หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      showStatus('ลบผลงานเรียบร้อยแล้ว');
      const updatedProjects = await fetch('/api/projects').then((r) => r.json());
      if (Array.isArray(updatedProjects)) setProjects(updatedProjects);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      desc: '',
      preview: 'portfolio',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      order: projects.length + 1,
    });
  };

  // 4. Certificate Handlers
  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCertUploading(true);
    setCertPreviewError(false);
    showStatus('กำลังอัปโหลดไฟล์ใบรับรอง...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'certificates');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setCertForm({ ...certForm, imageUrl: data.url });
      showStatus('อัปโหลดไฟล์ใบรับรองสำเร็จ');
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setCertUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCertId) {
        const res = await fetch(`/api/certificates/${editingCertId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certForm),
        });
        if (!res.ok) throw new Error('Failed to update certificate');
        showStatus('แก้ไขใบรับรองเรียบร้อยแล้ว');
      } else {
        const res = await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certForm),
        });
        if (!res.ok) throw new Error('Failed to create certificate');
        showStatus('เพิ่มใบรับรองใหม่เรียบร้อยแล้ว');
      }

      resetCertForm();
      const updatedCerts = await fetch('/api/certificates').then((r) => r.json());
      if (Array.isArray(updatedCerts)) setCertificates(updatedCerts);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleEditCertificate = (cert: CertificateData) => {
    setEditingCertId(cert.id);
    setCertPreviewError(false);
    setCertForm({
      name: cert.name,
      org: cert.org,
      color: cert.color,
      imageUrl: cert.imageUrl || '',
      featured: cert.featured,
      order: cert.order,
    });
    setActiveTab('certificates');
  };

  const handleDeleteCertificate = async (id: string, name: string) => {
    if (!confirm(`ยืนยันการลบใบรับรอง "${name}" หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete certificate');
      showStatus('ลบใบรับรองเรียบร้อยแล้ว');
      const updatedCerts = await fetch('/api/certificates').then((r) => r.json());
      if (Array.isArray(updatedCerts)) setCertificates(updatedCerts);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const resetCertForm = () => {
    setEditingCertId(null);
    setCertPreviewError(false);
    setCertForm({
      name: '',
      org: '',
      color: '#4F46E5',
      imageUrl: '',
      featured: false,
      order: certificates.length + 1,
    });
  };

  // 5. Skills Handlers
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillForm.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      showStatus('กรุณาระบุทักษะอย่างน้อย 1 รายการ', 'error');
      return;
    }

    let updatedList: SkillGroup[];
    if (editingSkillId) {
      updatedList = skillsList.map((item) =>
        item.id === editingSkillId
          ? {
              ...item,
              title: skillForm.title,
              desc: skillForm.desc,
              icon: skillForm.icon,
              skills: skillsArray,
            }
          : item
      );
      showStatus('แก้ไขหมวดหมู่ทักษะเรียบร้อยแล้ว');
    } else {
      const newSkill: SkillGroup = {
        id: String(Date.now()),
        title: skillForm.title,
        desc: skillForm.desc,
        icon: skillForm.icon,
        skills: skillsArray,
      };
      updatedList = [...skillsList, newSkill];
      showStatus('เพิ่มหมวดหมู่ทักษะใหม่เรียบร้อยแล้ว');
    }

    setSkillsList(updatedList);
    resetSkillForm();

    // Auto-sync with profile
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(updatedList),
        }),
      });
    } catch (e) {
      console.warn('Auto sync skills failed');
    }
  };

  const handleEditSkill = (item: SkillGroup) => {
    setEditingSkillId(item.id);
    setSkillForm({
      title: item.title,
      desc: item.desc,
      icon: item.icon || 'bot',
      skillsInput: item.skills.join(', '),
    });
  };

  const handleDeleteSkill = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบหมวดหมู่ทักษะ "${title}" หรือไม่?`)) return;
    const updatedList = skillsList.filter((item) => item.id !== id);
    setSkillsList(updatedList);
    showStatus('ลบหมวดหมู่ทักษะเรียบร้อยแล้ว');

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(updatedList),
        }),
      });
    } catch (e) {
      console.warn('Auto sync skills failed');
    }
  };

  const resetSkillForm = () => {
    setEditingSkillId(null);
    setSkillForm({
      title: '',
      desc: '',
      icon: 'bot',
      skillsInput: '',
    });
  };

  const handleResetSkillsDefault = async () => {
    if (!confirm('ต้องการคืนค่าทักษะเริ่มต้นหรือไม่?')) return;
    setSkillsList(defaultSkills);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(defaultSkills),
        }),
      });
      showStatus('คืนค่าทักษะเริ่มต้นเรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 6. Seed Samples or Clear
  const handleSeed = async (target: string) => {
    if (!confirm('ต้องการนำเข้าข้อมูลตัวอย่างเข้าสู่ฐานข้อมูลหรือไม่?')) return;
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seed failed');
      showStatus(data.message || 'นำเข้าข้อมูลตัวอย่างสำเร็จ');
      loadAllData();
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // Filtered lists for Admin view
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.desc.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesFeatured = !projectFeaturedOnly || p.featured;
    return matchesSearch && matchesFeatured;
  });

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.org.toLowerCase().includes(certSearch.toLowerCase());
    const matchesFeatured = !certFeaturedOnly || c.featured;
    return matchesSearch && matchesFeatured;
  });

  if (!authChecked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-fg-secondary text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-accent" /> กำลังตรวจสอบสิทธิ์...
        </div>
      </div>
    );
  }

  return (
    <AdminInactivityGuard timeoutMinutes={20} warningSeconds={60}>
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accent/10 text-accent">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-outfit text-2xl font-bold text-foreground">Admin Control Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary mt-1">
            ระบบจัดการเนื้อหา ข้อมูลหน้าบ้าน โปรเจกต์ ใบรับรอง ทักษะ และการติดต่อทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-3.5 py-2 text-xs gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> ดูหน้าเว็บจริง
          </a>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Status Toast Alert */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Navigation Tabs (4 Comprehensive Tabs) */}
      <div className="flex rounded-xl bg-tag-bg p-1 border border-border mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'projects' ? 'bg-card text-foreground shadow-sm' : 'text-fg-secondary hover:text-foreground'
          }`}
        >
          <Layers className="w-4 h-4" /> ผลงาน ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'certificates' ? 'bg-card text-foreground shadow-sm' : 'text-fg-secondary hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" /> ใบรับรอง ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'skills' ? 'bg-card text-foreground shadow-sm' : 'text-fg-secondary hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" /> ทักษะ &amp; Workflow ({skillsList.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'profile' ? 'bg-card text-foreground shadow-sm' : 'text-fg-secondary hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" /> ข้อมูลหน้าเว็บ &amp; โปรไฟล์
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROJECTS */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold text-foreground">
                {editingProjectId ? 'แก้ไข Project' : 'เพิ่ม Project ใหม่'}
              </h2>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="text-xs text-fg-secondary hover:text-foreground"
                >
                  ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">ชื่อ Project *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="เช่น AI Chat Assistant"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">คำอธิบายสั้นๆ *</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.desc}
                  onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                  placeholder="อธิบายว่าโปรเจกต์ช่วยแก้ปัญหาอะไร ภายใน 1–2 ประโยค"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>

              {/* Demo URL Section */}
              <div className="p-3.5 rounded-xl border border-accent/20 bg-accent/5 space-y-2">
                <label className="block text-xs font-semibold text-accent">
                  Demo URL (ลิงก์เว็บไซต์ผลงานสำหรับพรีวิวสด)
                </label>
                <input
                  type="url"
                  value={projectForm.demoUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                  placeholder="https://my-app.vercel.app หรือ /demo?preview=..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none"
                />
                <p className="text-[10px] text-fg-tertiary">
                  หากใส่ลิงก์เว็บไซต์ กรอบ Preview จะแสดงผลเว็บสด (Live iframe) ให้คลิกได้ทันที
                </p>
              </div>

              {/* UI Mockup Template Fallback */}
              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  หรือเลือก UI Mockup จำลอง
                </label>
                <select
                  value={projectForm.preview}
                  onChange={(e) => setProjectForm({ ...projectForm, preview: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none cursor-pointer"
                >
                  <option value="chat">AI Chat Interface (โทน Indigo)</option>
                  <option value="tasks">Task &amp; Workflow Manager (โทน Teal)</option>
                  <option value="quiz">Quiz / Form System (โทน Amber)</option>
                  <option value="portfolio">Portfolio Showcase (โทน Slate)</option>
                  <option value="weather">Dashboard &amp; Metrics (โทน Sky)</option>
                  <option value="expense">Analytics &amp; Graphs (โทน Emerald)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">GitHub Repository URL (ไม่บังคับ)</label>
                <input
                  type="url"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">ลำดับการแสดง</label>
                  <input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="projFeatured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent cursor-pointer"
                  />
                  <label htmlFor="projFeatured" className="text-xs font-medium text-foreground cursor-pointer">
                    แสดงหน้าแรก (Featured)
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {editingProjectId ? 'บันทึกการแก้ไข' : 'เพิ่มผลงาน Project'}
                </button>
              </div>
            </form>
          </div>

          {/* Project List with Search Filter */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h2 className="font-outfit text-base font-bold text-foreground">
                รายการ Projects ทั้งหมด ({filteredProjects.length})
              </h2>
              <button
                type="button"
                onClick={() => handleSeed('projects')}
                className="text-xs text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <RefreshCw className="w-3 h-3" /> นำเข้าตัวอย่างเริ่มต้น
              </button>
            </div>

            {/* Quick Search & Filter in Admin */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-tertiary" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="ค้นหาโปรเจกต์ในระบบ..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => setProjectFeaturedOnly(!projectFeaturedOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  projectFeaturedOnly ? 'bg-accent text-white border-accent' : 'bg-card border-border text-fg-secondary'
                }`}
              >
                ⭐ เฉพาะหน้าแรก
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-fg-secondary">
                ไม่พบผลงานที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredProjects.map((p) => {
                const demoLink = p.demoUrl || `/demo?preview=${p.preview}`;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between gap-3.5 shadow-sm hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Project Preview Thumbnail in Admin */}
                      <a
                        href={demoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 rounded-lg bg-zinc-900 border border-border flex-shrink-0 flex items-center justify-center overflow-hidden hover:border-accent group transition-all"
                        title="คลิกเพื่อเปิดดู Demo ในแท็บใหม่"
                      >
                        {p.demoUrl ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center text-emerald-400 bg-emerald-500/10">
                            <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[7px] font-bold mt-0.5">LIVE</span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-accent/15">
                            <Layers className="w-5 h-5 group-hover:scale-110 transition-transform text-accent" />
                            <span className="text-[7px] font-bold mt-0.5 uppercase text-fg-tertiary">{p.preview}</span>
                          </div>
                        )}
                      </a>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-outfit text-sm font-semibold text-foreground truncate">{p.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary">
                            ลำดับ {p.order}
                          </span>
                          {p.featured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                              หน้าแรก
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-fg-secondary mt-0.5 line-clamp-1">{p.desc}</p>
                        {p.demoUrl && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                            🔗 Live: {p.demoUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditProject(p)}
                        className="p-2 rounded-lg bg-tag-bg hover:bg-border text-fg-secondary hover:text-foreground transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CERTIFICATES (With Live Preview Before & After Save) */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold text-foreground">
                {editingCertId ? 'แก้ไข Certificate' : 'เพิ่ม Certificate ใหม่'}
              </h2>
              {editingCertId && (
                <button
                  type="button"
                  onClick={resetCertForm}
                  className="text-xs text-fg-secondary hover:text-foreground"
                >
                  ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">ชื่อหลักสูตร / ใบรับรอง *</label>
                <input
                  type="text"
                  required
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  placeholder="เช่น Introduction to Artificial Intelligence"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">สถาบัน / ผู้ออกใบรับรอง *</label>
                <input
                  type="text"
                  required
                  value={certForm.org}
                  onChange={(e) => setCertForm({ ...certForm, org: e.target.value })}
                  placeholder="เช่น Coursera, Google, Udemy"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              {/* Upload Certificate File & Instant Preview */}
              <div className="p-3.5 rounded-xl border border-border bg-tag-bg/60 space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  อัปโหลดไฟล์ภาพหรือ PDF ใบรับรอง
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleCertFileUpload}
                  disabled={certUploading}
                  className="w-full text-xs text-fg-secondary file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover cursor-pointer"
                />
                <p className="text-[10px] text-fg-tertiary">
                  รองรับไฟล์ภาพ (.jpg, .png, .webp) และเอกสาร PDF โดยตรง
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] text-fg-tertiary uppercase">หรือใส่ลิงก์รูปภาพ</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <input
                  type="text"
                  value={certForm.imageUrl}
                  onChange={(e) => {
                    setCertForm({ ...certForm, imageUrl: e.target.value });
                    setCertPreviewError(false);
                  }}
                  placeholder="https://example.com/cert.jpg หรือ /uploads/..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none"
                />

                {/* Instant Visual Preview Frame with Error Detection & PDF Support */}
                {certForm.imageUrl && (
                  (() => {
                    const isCertPdf =
                      certForm.imageUrl.toLowerCase().endsWith('.pdf') ||
                      certForm.imageUrl.includes('.pdf') ||
                      certForm.imageUrl.startsWith('data:application/pdf');

                    if (isCertPdf) {
                      return (
                        <div className="mt-3 p-3 rounded-xl border border-rose-500/20 bg-background space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-rose-500" /> พรีวิวไฟล์เอกสาร PDF
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> ไฟล์ PDF ถูกต้อง พร้อมเปิดดูใน Modal
                            </span>
                          </div>

                          <div className="relative rounded-lg overflow-hidden border border-border bg-zinc-950 flex flex-col items-center justify-center p-3">
                            <div className="w-full flex items-center justify-between pb-2 text-xs text-white border-b border-white/10 mb-2">
                              <span className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] truncate max-w-[180px]">
                                <FileText className="w-3.5 h-3.5" /> {certForm.imageUrl.split('/').pop()}
                              </span>
                              <a
                                href={certForm.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-white flex items-center gap-1 transition-colors"
                              >
                                เปิดดู PDF เต็ม <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            <iframe
                              src={`${certForm.imageUrl}#toolbar=0`}
                              title="PDF Preview"
                              className="w-full h-44 rounded border-0 bg-white"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setCertForm({ ...certForm, imageUrl: '' });
                                setCertPreviewError(false);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-colors z-10"
                              title="ลบไฟล์"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="mt-3 p-3 rounded-xl border border-border bg-background space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-accent" /> พรีวิวก่อนบันทึก
                          </span>
                          {!certPreviewError ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> โหลดรูปสำเร็จ
                            </span>
                          ) : (
                            <span className="text-rose-500 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> โหลดรูปไม่สำเร็จ
                            </span>
                          )}
                        </div>

                        <div className="relative rounded-lg overflow-hidden border border-border bg-zinc-950 flex items-center justify-center min-h-[140px] max-h-48 p-2">
                          <img
                            src={certForm.imageUrl}
                            alt="Certificate Preview"
                            onError={() => setCertPreviewError(true)}
                            onLoad={() => setCertPreviewError(false)}
                            className="max-h-44 object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCertForm({ ...certForm, imageUrl: '' });
                              setCertPreviewError(false);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-colors"
                            title="ลบรูป"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">สีประจำใบรับรอง</label>
                  <input
                    type="color"
                    value={certForm.color}
                    onChange={(e) => setCertForm({ ...certForm, color: e.target.value })}
                    className="w-full h-9 p-1 rounded-lg bg-background border border-border cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">ลำดับการแสดง</label>
                  <input
                    type="number"
                    value={certForm.order}
                    onChange={(e) => setCertForm({ ...certForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="certFeatured"
                  checked={certForm.featured}
                  onChange={(e) => setCertForm({ ...certForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-accent cursor-pointer"
                />
                <label htmlFor="certFeatured" className="text-xs font-medium text-foreground cursor-pointer">
                  แสดงในหน้าแรก (Featured)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {editingCertId ? 'บันทึกการแก้ไข' : 'เพิ่ม Certificate'}
                </button>
              </div>
            </form>
          </div>

          {/* Certificate List with Thumbnails & Search */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h2 className="font-outfit text-base font-bold text-foreground">
                รายการ Certificates ทั้งหมด ({filteredCertificates.length})
              </h2>
              <button
                type="button"
                onClick={() => handleSeed('certificates')}
                className="text-xs text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <RefreshCw className="w-3 h-3" /> นำเข้าตัวอย่างเริ่มต้น
              </button>
            </div>

            {/* Search & Filter in Admin */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-tertiary" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="ค้นหาใบรับรอง หรือสถาบัน..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => setCertFeaturedOnly(!certFeaturedOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  certFeaturedOnly ? 'bg-accent text-white border-accent' : 'bg-card border-border text-fg-secondary'
                }`}
              >
                ⭐ เฉพาะหน้าแรก
              </button>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-fg-secondary">
                ไม่พบใบรับรองที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredCertificates.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between gap-3 shadow-sm hover:border-border-hover transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Live Thumbnail Preview in List (Clickable to open modal) */}
                    <button
                      type="button"
                      onClick={() => setPreviewCertInAdmin(c)}
                      className="group/thumb relative cursor-zoom-in text-left flex-shrink-0"
                      title="คลิกเพื่อดูตัวอย่างใบรับรอง"
                    >
                      {c.imageUrl ? (
                        c.imageUrl.toLowerCase().endsWith('.pdf') || c.imageUrl.includes('.pdf') ? (
                          <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex-shrink-0 flex flex-col items-center justify-center text-rose-500 shadow-sm group-hover/thumb:scale-105 transition-transform">
                            <FileText className="w-5 h-5" />
                            <span className="text-[8px] font-bold uppercase tracking-wider">PDF</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-border flex-shrink-0 flex items-center justify-center overflow-hidden p-0.5 group-hover/thumb:scale-105 transition-transform">
                            <img
                              src={c.imageUrl}
                              alt={c.name}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        )
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-sm group-hover/thumb:scale-105 transition-transform"
                          style={{ backgroundColor: c.color || '#4F46E5' }}
                        >
                          <Award className="w-6 h-6" />
                        </div>
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-outfit text-sm font-semibold text-foreground truncate">{c.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary">
                          ลำดับ {c.order}
                        </span>
                        {c.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            หน้าแรก
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-fg-secondary mt-0.5">{c.org}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditCertificate(c)}
                      className="p-2 rounded-lg bg-tag-bg hover:bg-border text-fg-secondary hover:text-foreground transition-colors"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCertificate(c.id, c.name)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SKILLS & CAPABILITIES */}
      {/* ========================================================================= */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold text-foreground">
                {editingSkillId ? 'แก้ไขหมวดหมู่ทักษะ' : 'เพิ่มหมวดหมู่ทักษะใหม่'}
              </h2>
              {editingSkillId && (
                <button
                  type="button"
                  onClick={resetSkillForm}
                  className="text-xs text-fg-secondary hover:text-foreground"
                >
                  ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  ชื่อหมวดหมู่ทักษะ *
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.title}
                  onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                  placeholder="เช่น AI-Powered Workflow (ก้าวข้ามภาษาและโค้ด)"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  เลือกไอคอนประจำหมวดหมู่
                </label>
                <select
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  คำอธิบายหมวดหมู่ *
                </label>
                <textarea
                  required
                  rows={3}
                  value={skillForm.desc}
                  onChange={(e) => setSkillForm({ ...skillForm, desc: e.target.value })}
                  placeholder="อธิบายจุดเด่นหรือลักษณะการทำงานในหมวดหมู่นี้"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  รายการทักษะ / เครื่องมือ (คั่นด้วยเครื่องหมายจุลภาค ,) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={skillForm.skillsInput}
                  onChange={(e) => setSkillForm({ ...skillForm, skillsInput: e.target.value })}
                  placeholder="เช่น Google Workspace, Google Sheets, Microsoft 365, Google Apps Script"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none"
                />
                <p className="text-[10px] text-fg-tertiary mt-1">
                  ใส่เครื่องหมายจุลภาค (,) เพื่อแยกแต่ละป้าย Tag ทักษะ
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {editingSkillId ? 'บันทึกหมวดหมู่' : 'เพิ่มหมวดหมู่ทักษะ'}
                </button>
              </div>
            </form>
          </div>

          {/* Skills List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-outfit text-base font-bold text-foreground">หมวดหมู่ทักษะปัจจุบัน</h2>
              <button
                type="button"
                onClick={handleResetSkillsDefault}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> คืนค่าทักษะเริ่มต้น
              </button>
            </div>

            {skillsList.map((item) => (
              <div
                key={item.id || item.title}
                className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm hover:border-border-hover transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-tag-bg border border-border text-accent">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="font-outfit text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditSkill(item)}
                      className="p-2 rounded-lg bg-tag-bg hover:bg-border text-fg-secondary hover:text-foreground transition-colors"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(item.id, item.title)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-fg-secondary leading-relaxed">{item.desc}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-tag-bg border border-border text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROFILE & FULL SITE CONTENT */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
            <div>
              <h2 className="font-outfit text-xl font-bold text-foreground">จัดการข้อมูลหน้าเว็บ &amp; โปรไฟล์</h2>
              <p className="text-xs text-fg-secondary mt-0.5">
                แก้ไขข้อความ สโลแกน ข้อมูลส่วนตัว ช่องทางติดต่อ และหัวข้อทุกส่วนบนหน้าแรก
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSeed('profile')}
              className="text-xs text-accent hover:underline flex items-center gap-1 flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> คืนค่าเริ่มต้น
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-8">
            {/* Section 1: Hero & Avatar */}
            <div className="space-y-4">
              <h3 className="font-outfit text-sm font-bold text-foreground uppercase tracking-wider text-accent">
                1. Hero Section &amp; ข้อมูลเบื้องต้น
              </h3>

              {/* Avatar Upload / Crop UI */}
              <div className="p-4 rounded-xl border border-border bg-tag-bg/50 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background shadow-inner">
                  <img
                    src={profile.imageUrl || defaultProfile.imageUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <label className="block text-xs font-semibold text-foreground">
                    อัปโหลดรูปโปรไฟล์ (ภาพ หรือ PDF พร้อมครอบตัดวงกลม)
                  </label>
                  <p className="text-[11px] text-fg-secondary leading-normal">
                    เลือกไฟล์ภาพ (.jpg, .png, .webp) หรือ PDF เพื่อเข้าสู่หน้าต่างครอบตัดวงกลม
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleProfileFileChange}
                    className="text-xs text-fg-secondary file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">
                  หรือใส่ลิงก์รูปโปรไฟล์ (Image URL)
                </label>
                <input
                  type="text"
                  value={profile.imageUrl}
                  onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">ตำแหน่ง / สาขาวิชา *</label>
                  <input
                    type="text"
                    required
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">สโลแกน / Tagline *</label>
                <textarea
                  rows={2}
                  required
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>
            </div>

            {/* Section 2: About Me */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-outfit text-sm font-bold text-foreground uppercase tracking-wider text-accent">
                2. About Me (เกี่ยวกับฉัน)
              </h3>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">หัวข้อส่วน About</label>
                <input
                  type="text"
                  value={profile.aboutHeading || 'About Me'}
                  onChange={(e) => setProfile({ ...profile, aboutHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">คำอธิบาย About (ย่อหน้าที่ 1) *</label>
                <textarea
                  rows={3}
                  required
                  value={profile.about1}
                  onChange={(e) => setProfile({ ...profile, about1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">คำอธิบาย About (ย่อหน้าที่ 2)</label>
                <textarea
                  rows={3}
                  value={profile.about2}
                  onChange={(e) => setProfile({ ...profile, about2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>
            </div>

            {/* Section 3: Section Headings */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-outfit text-sm font-bold text-foreground uppercase tracking-wider text-accent">
                3. หัวข้อแต่ละส่วนบนหน้าเว็บ (Section Headings)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">หัวข้อ Projects</label>
                  <input
                    type="text"
                    value={profile.projectsHeading || 'Projects'}
                    onChange={(e) => setProfile({ ...profile, projectsHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">หัวข้อ Certificates</label>
                  <input
                    type="text"
                    value={profile.certificatesHeading || 'Certificates'}
                    onChange={(e) => setProfile({ ...profile, certificatesHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">หัวข้อ Skills</label>
                  <input
                    type="text"
                    value={profile.skillsHeading || 'Skills & Capabilities'}
                    onChange={(e) => setProfile({ ...profile, skillsHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact & Socials */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-outfit text-sm font-bold text-foreground uppercase tracking-wider text-accent">
                4. การติดต่อ &amp; หาที่ฝึกงาน (Get in Touch)
              </h3>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">หัวข้อส่วนติดต่อ</label>
                <input
                  type="text"
                  value={profile.contactHeading || 'Get in Touch'}
                  onChange={(e) => setProfile({ ...profile, contactHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-secondary mb-1">ข้อความรายละเอียดการติดต่อ / หาที่ฝึกงาน</label>
                <textarea
                  rows={3}
                  value={profile.contactDesc || ''}
                  onChange={(e) => setProfile({ ...profile, contactDesc: e.target.value })}
                  placeholder="เขียนข้อความเชิญชวนให้ติดต่อเรื่องการฝึกงานหรือร่วมงาน"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">เบอร์โทรศัพท์ (Phone Number)</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="เช่น 064-965-9703"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">LINE Add Friend URL</label>
                  <input
                    type="url"
                    value={profile.lineUrl || ''}
                    onChange={(e) => setProfile({ ...profile, lineUrl: e.target.value })}
                    placeholder="https://line.me/ti/p/..."
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={profile.githubUrl}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent text-sm outline-none"
                  />
                </div>
              </div>

              {/* LINE QR Code Upload & Live Preview */}
              <div className="p-3.5 rounded-xl border border-border bg-tag-bg/50 space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  อัปโหลดรูปภาพ LINE QR Code (ไม่บังคับ)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLineQrUpload}
                  className="text-xs text-fg-secondary file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover cursor-pointer"
                />
                {profile.lineQrUrl && (
                  <div className="flex items-center gap-3 pt-2 p-2 rounded-lg bg-background border border-border">
                    <img
                      src={profile.lineQrUrl}
                      alt="LINE QR Code"
                      onError={() => setQrPreviewError(true)}
                      onLoad={() => setQrPreviewError(false)}
                      className="w-16 h-16 rounded-lg object-contain bg-white border border-border p-1"
                    />
                    <div className="text-xs space-y-1">
                      {!qrPreviewError ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> ภาพ QR Code พร้อมใช้งาน
                        </span>
                      ) : (
                        <span className="text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> ภาพ QR Code เสียหาย
                        </span>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() => setProfile({ ...profile, lineQrUrl: '' })}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          ลบรูปภาพ QR Code
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="btn-primary px-8 py-3 text-sm gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="w-4 h-4" /> บันทึกข้อมูลหน้าเว็บและโปรไฟล์
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CIRCULAR CROP MODAL FOR PROFILE */}
      {/* ========================================================================= */}
      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCropModalOpen(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit text-base font-bold text-foreground">ครอบตัดรูปโปรไฟล์ทรงกลม</h3>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="p-1 rounded-lg text-fg-secondary hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-fg-secondary">
              ลากเพื่อเลื่อนตำแหน่งภาพ และใช้แถบเลื่อนด้านล่างเพื่อย่อ/ขยายรูป
            </p>

            {/* Circular Preview Container */}
            <div
              className="relative w-[260px] h-[260px] mx-auto rounded-full overflow-hidden border-4 border-accent shadow-2xl bg-zinc-900 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX, y: e.clientY, posX: cropPosition.x, posY: cropPosition.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                setCropPosition({
                  x: dragStart.posX + (e.clientX - dragStart.x),
                  y: dragStart.posY + (e.clientY - dragStart.y),
                });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <img
                ref={cropImageRef}
                src={cropImageSrc}
                alt="Crop Target"
                draggable={false}
                style={{
                  transform: `translate(calc(-50% + ${cropPosition.x}px), calc(-50% + ${cropPosition.y}px)) scale(${cropZoom})`,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  maxWidth: 'none',
                }}
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3 px-4">
              <ZoomOut className="w-4 h-4 text-fg-secondary" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-tag-bg rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <ZoomIn className="w-4 h-4 text-fg-secondary" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-tag-bg text-xs font-medium text-foreground hover:bg-border transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                className="btn-primary px-5 py-2 text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> บันทึกรูปภาพ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal Preview inside Admin */}
      <CertificateModal
        cert={previewCertInAdmin}
        onClose={() => setPreviewCertInAdmin(null)}
      />
    </div>
    </AdminInactivityGuard>
  );
}
