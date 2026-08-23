'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  LogOut,
  Trash2,
  Edit2,
  RefreshCw,
  User,
  Layers,
  Award,
  Calendar,
  Building2,
  UserCheck,
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
  Loader2,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { LineIcon } from '@/components/icons/LineIcon';
import {
  ProfileData,
  ProjectData,
  CertificateData,
  ActivityData,
  SkillGroup,
  defaultProfile,
  defaultSkills,
  defaultActivities,
} from '@/lib/initial-data';
import { CertificateModal } from '@/components/CertificateModal';
import { AdminInactivityGuard } from '@/components/AdminInactivityGuard';

const AVAILABLE_ICONS = [
  { id: 'bot', label: 'AI / Bot', icon: Bot },
  { id: 'briefcase', label: 'Briefcase / Office', icon: Briefcase },
  { id: 'zap', label: 'Lightning / Automation', icon: Zap },
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
  const [activeTab, setActiveTab] = React.useState<'projects' | 'certificates' | 'activities' | 'skills' | 'profile'>('projects');
  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [profile, setProfile] = React.useState<ProfileData>(defaultProfile);
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [certificates, setCertificates] = React.useState<CertificateData[]>([]);
  const [activities, setActivities] = React.useState<ActivityData[]>([]);
  const [skillsList, setSkillsList] = React.useState<SkillGroup[]>(defaultSkills);

  // Search & Filter states for Admin list
  const [projectSearch, setProjectSearch] = React.useState('');
  const [projectFeaturedOnly, setProjectFeaturedOnly] = React.useState(false);

  const [certSearch, setCertSearch] = React.useState('');
  const [certFeaturedOnly, setCertFeaturedOnly] = React.useState(false);
  const [certPreviewError, setCertPreviewError] = React.useState(false);
  const [qrPreviewError, setQrPreviewError] = React.useState(false);
  const [previewCertInAdmin, setPreviewCertInAdmin] = React.useState<CertificateData | null>(null);

  const [activitySearch, setActivitySearch] = React.useState('');
  const [activityFeaturedOnly, setActivityFeaturedOnly] = React.useState(false);

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

  // Activity form state
  const [editingActivityId, setEditingActivityId] = React.useState<string | null>(null);
  const [activityForm, setActivityForm] = React.useState({
    title: '',
    role: '',
    org: '',
    period: '',
    desc: '',
    images: [] as string[],
    linkUrl: '',
    featured: true,
    order: 1,
  });
  const [activityUploading, setActivityUploading] = React.useState(false);

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
  const [cropImageDimensions, setCropImageDimensions] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cropZoom, setCropZoom] = React.useState(1);
  const [cropPosition, setCropPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const cropImageRef = React.useRef<HTMLImageElement | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Global authenticated API fetch wrapper with automatic 401 expiration handling
  const adminFetch = React.useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await fetch(input, init);
    if (res.status === 401) {
      showStatus('เซสชันบนเซิร์ฟเวอร์หมดอายุ กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...', 'error');
      setTimeout(() => {
        window.location.href = '/admin/login?reason=expired';
      }, 1200);
      throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    }
    return res;
  }, []);

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

      const [profRes, projRes, certRes, actRes] = await Promise.all([
        fetch('/api/profile', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/projects', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/certificates', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/activities', { cache: 'no-store' }).then((r) => r.json()),
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
      if (Array.isArray(actRes)) setActivities(actRes);
    } catch (err: any) {
      showStatus('โหลดข้อมูลไม่สำเร็จ: ' + err.message, 'error');
    }
  };

  React.useEffect(() => {
    loadAllData();
  }, []);

  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogoutAction = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (err) {
      router.push('/admin/login');
    } finally {
      setLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
  };

  // 2. Profile Crop and Upload Handlers
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showStatus('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setCropImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setCropImageSrc(dataUrl);
        setCropZoom(1);
        setCropPosition({ x: 0, y: 0 });
        setCropModalOpen(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: cropPosition.x,
      posY: cropPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setCropPosition({
      x: dragStart.posX + dx,
      y: dragStart.posY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      posX: cropPosition.x,
      posY: cropPosition.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setCropPosition({
      x: dragStart.posX + dx,
      y: dragStart.posY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCropSave = async () => {
    if (!cropImageSrc) return;

    const canvas = document.createElement('canvas');
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = cropImageSrc;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const cropBoxSize = 256;
    const minDim = Math.min(img.naturalWidth, img.naturalHeight);
    const baseScale = cropBoxSize / minDim;
    const totalScale = baseScale * cropZoom;

    const drawnWidth = img.naturalWidth * totalScale;
    const drawnHeight = img.naturalHeight * totalScale;

    const imageCenterCanvasX = 128 + cropPosition.x;
    const imageCenterCanvasY = 128 + cropPosition.y;

    const imgLeftInCrop = imageCenterCanvasX - drawnWidth / 2;
    const imgTopInCrop = imageCenterCanvasY - drawnHeight / 2;

    const sourceX = Math.max(0, -imgLeftInCrop / totalScale);
    const sourceY = Math.max(0, -imgTopInCrop / totalScale);
    const sourceSize = cropBoxSize / totalScale;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      showStatus('กำลังอัปโหลดรูปโปรไฟล์...');
      try {
        const formData = new FormData();
        formData.append('file', blob, 'avatar.png');
        formData.append('folder', 'avatars');

        const uploadRes = await adminFetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

        setProfile((prev) => ({ ...prev, imageUrl: uploadData.url }));
        setCropModalOpen(false);
        showStatus('อัปโหลดรูปโปรไฟล์สำเร็จ', 'success');
      } catch (err: any) {
        showStatus(err.message, 'error');
      }
    }, 'image/png');
  };

  const handleLineQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showStatus('กำลังอัปโหลด LINE QR Code...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'line-qr');
      const res = await adminFetch('/api/upload', {
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

  const [resumeUploading, setResumeUploading] = React.useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    showStatus('กำลังอัปโหลดและบันทึกไฟล์เรซูเม่...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resumes');
      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const updated = { ...profile, resumeUrl: data.url };
      setProfile(updated);

      const saveRes = await adminFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          skillsJson: JSON.stringify(skillsList),
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save profile');

      showStatus('อัปโหลดและบันทึกเรซูเม่สำเร็จ');
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setResumeUploading(false);
      e.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    const updated = { ...profile, resumeUrl: '' };
    setProfile(updated);
    try {
      const saveRes = await adminFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          skillsJson: JSON.stringify(skillsList),
        }),
      });
      if (!saveRes.ok) throw new Error('Failed to delete resume');
      showStatus('ลบเรซูเม่เรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 3. Project Handlers
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showStatus('กำลังอัปโหลดรูปภาพผลงานโปรเจกต์...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects');
      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setProjectForm((prev) => ({ ...prev, demoUrl: data.url }));
      showStatus('อัปโหลดรูปภาพโปรเจกต์สำเร็จ');
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        const res = await adminFetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        });
        if (!res.ok) throw new Error('Failed to update project');
        showStatus('อัปเดตโปรเจกต์เรียบร้อยแล้ว');
      } else {
        const res = await adminFetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        });
        if (!res.ok) throw new Error('Failed to create project');
        showStatus('เพิ่มโปรเจกต์ใหม่เรียบร้อยแล้ว');
      }

      resetProjectForm();
      const updatedProjects = await fetch('/api/projects').then((r) => r.json());
      if (Array.isArray(updatedProjects)) setProjects(updatedProjects);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleEditProject = (p: ProjectData) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      desc: p.desc,
      preview: p.preview || 'portfolio',
      githubUrl: p.githubUrl || '',
      demoUrl: p.demoUrl || '',
      featured: p.featured,
      order: p.order,
    });
    setActiveTab('projects');
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบโปรเจกต์ "${title}" หรือไม่?`)) return;
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      const res = await adminFetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      showStatus('ลบโปรเจกต์เรียบร้อยแล้ว');
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
    showStatus('กำลังอัปโหลดไฟล์ใบรับรอง...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'certificates');

      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setCertForm((prev) => ({ ...prev, imageUrl: data.url }));
      setCertPreviewError(false);
      showStatus('อัปโหลดไฟล์ใบรับรองสำเร็จ');
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setCertUploading(false);
    }
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCertId) {
        const res = await adminFetch(`/api/certificates/${editingCertId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certForm),
        });
        if (!res.ok) throw new Error('Failed to update certificate');
        showStatus('อัปเดตใบรับรองเรียบร้อยแล้ว');
      } else {
        const res = await adminFetch('/api/certificates', {
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
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      const res = await adminFetch(`/api/certificates/${id}`, { method: 'DELETE' });
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

  // 5. Activity Handlers (Multi-Image & Flexible Fields)
  const handleActivityImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActivityUploading(true);
    showStatus(`กำลังอัปโหลดรูปภาพ ${files.length} ภาพ...`);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('folder', 'activities');
        const res = await adminFetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        uploadedUrls.push(data.url);
      }
      setActivityForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      showStatus(`อัปโหลดรูปภาพสำเร็จ (${uploadedUrls.length} ภาพ)`);
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setActivityUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveActivityImage = (indexToRemove: number) => {
    setActivityForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title.trim()) {
      showStatus('กรุณาระบุชื่อกิจกรรม', 'error');
      return;
    }
    try {
      if (editingActivityId) {
        const res = await adminFetch(`/api/activities/${editingActivityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activityForm),
        });
        if (!res.ok) throw new Error('Failed to update activity');
        showStatus('อัปเดตกิจกรรมเรียบร้อยแล้ว');
      } else {
        const res = await adminFetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activityForm),
        });
        if (!res.ok) throw new Error('Failed to create activity');
        showStatus('เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว');
      }

      resetActivityForm();
      const updatedActivities = await fetch('/api/activities').then((r) => r.json());
      if (Array.isArray(updatedActivities)) setActivities(updatedActivities);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleEditActivity = (act: ActivityData) => {
    setEditingActivityId(act.id);
    setActivityForm({
      title: act.title,
      role: act.role || '',
      org: act.org || '',
      period: act.period || '',
      desc: act.desc || '',
      images: Array.isArray(act.images) ? act.images : [],
      linkUrl: act.linkUrl || '',
      featured: act.featured,
      order: act.order,
    });
    setActiveTab('activities');
  };

  const handleDeleteActivity = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบกิจกรรม "${title}" หรือไม่?`)) return;
    try {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      const res = await adminFetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete activity');
      showStatus('ลบกิจกรรมเรียบร้อยแล้ว');
      const updatedActivities = await fetch('/api/activities').then((r) => r.json());
      if (Array.isArray(updatedActivities)) setActivities(updatedActivities);
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const resetActivityForm = () => {
    setEditingActivityId(null);
    setActivityForm({
      title: '',
      role: '',
      org: '',
      period: '',
      desc: '',
      images: [],
      linkUrl: '',
      featured: true,
      order: activities.length + 1,
    });
  };

  // 6. Skills Handlers
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
    } else {
      const newSkill: SkillGroup = {
        id: Date.now().toString(),
        title: skillForm.title,
        desc: skillForm.desc,
        icon: skillForm.icon,
        skills: skillsArray,
      };
      updatedList = [...skillsList, newSkill];
    }

    setSkillsList(updatedList);
    resetSkillForm();

    try {
      const res = await adminFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(updatedList),
        }),
      });
      if (!res.ok) throw new Error('Failed to save skills');
      showStatus('บันทึกข้อมูลทักษะเรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
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
    setActiveTab('skills');
  };

  const handleDeleteSkill = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบหมวดหมู่ทักษะ "${title}" หรือไม่?`)) return;
    const updatedList = skillsList.filter((item) => item.id !== id);
    setSkillsList(updatedList);

    try {
      const res = await adminFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(updatedList),
        }),
      });
      if (!res.ok) throw new Error('Failed to delete skill');
      showStatus('ลบหมวดหมู่ทักษะเรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
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

  // 7. Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skillsJson: JSON.stringify(skillsList),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      showStatus('บันทึกข้อมูลโปรไฟล์และหน้าแรกเรียบร้อยแล้ว');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
      </div>
    );
  }

  // Filtered lists
  const filteredProjects = projects
    .filter((p) => {
      const matchQuery = p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.desc.toLowerCase().includes(projectSearch.toLowerCase());
      const matchFeatured = projectFeaturedOnly ? p.featured : true;
      return matchQuery && matchFeatured;
    })
    .sort((a, b) => {
      if (projectFeaturedOnly) return (a.order || 0) - (b.order || 0);
      return 0;
    });

  const filteredCertificates = certificates
    .filter((c) => {
      const matchQuery = c.name.toLowerCase().includes(certSearch.toLowerCase()) || c.org.toLowerCase().includes(certSearch.toLowerCase());
      const matchFeatured = certFeaturedOnly ? c.featured : true;
      return matchQuery && matchFeatured;
    })
    .sort((a, b) => {
      if (certFeaturedOnly) return (a.order || 0) - (b.order || 0);
      return 0;
    });

  const extractYear = (period?: string | null) => {
    if (!period) return 0;
    const matches = period.match(/\b(19\d\d|20\d\d|25\d\d)\b/g);
    if (!matches || matches.length === 0) return 0;
    const years = matches.map((y) => {
      const val = parseInt(y, 10);
      return val > 2400 ? val - 543 : val;
    });
    return Math.max(...years);
  };

  const filteredActivities = activities
    .filter((a) => {
      const matchQuery =
        a.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
        (a.org && a.org.toLowerCase().includes(activitySearch.toLowerCase())) ||
        (a.role && a.role.toLowerCase().includes(activitySearch.toLowerCase()));
      const matchFeatured = activityFeaturedOnly ? a.featured : true;
      return matchQuery && matchFeatured;
    })
    .sort((a, b) => {
      if (activityFeaturedOnly) return (a.order || 0) - (b.order || 0);
      const yA = extractYear(a.period);
      const yB = extractYear(b.period);
      if (yA !== yB) return yB - yA;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accent/10 text-accent">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-outfit text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Admin Control Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary mt-1">
            จัดการโปรเจกต์ ใบรับรอง กิจกรรม ทักษะ และข้อมูลส่วนตัวทั้งหมด
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-end">
          {/* Live Inactivity Session Countdown & Auto-Refresh Guard */}
          <AdminInactivityGuard timeoutMinutes={20} warningSeconds={60} />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-4 py-2 text-xs sm:text-sm font-medium gap-1.5 shadow-sm whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" /> ดูหน้าเว็บจริง
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 shadow-md bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white flex items-center transition-all cursor-pointer whitespace-nowrap"
            title="ออกจากระบบ Admin"
          >
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Floating Side Popup / Toast Notification */}
      {statusMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[9999] sm:max-w-md animate-in slide-in-from-top-4 sm:slide-in-from-right-8 fade-in duration-300 pointer-events-auto">
          <div
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3.5 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-zinc-900/95 border-emerald-500/40 text-white shadow-emerald-950/30'
                : 'bg-zinc-900/95 border-rose-500/40 text-white shadow-rose-950/30'
            }`}
          >
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 pt-0.5 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                {statusMessage.type === 'success' ? 'ดำเนินการสำเร็จ' : 'เกิดข้อผิดพลาด'}
              </h4>
              <p className="text-xs text-white/80 mt-0.5 leading-relaxed break-words font-normal">
                {statusMessage.text}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Semantic Color-Coded Navigation Tabs */}
      <div className="flex rounded-2xl bg-card border border-border p-1.5 mb-8 overflow-x-auto gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-fg-secondary hover:text-foreground hover:bg-tag-bg'
          }`}
        >
          <Layers className="w-4 h-4" /> ผลงาน ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex-1 min-w-[135px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-fg-secondary hover:text-foreground hover:bg-tag-bg'
          }`}
        >
          <Calendar className="w-4 h-4" /> กิจกรรม ({activities.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-fg-secondary hover:text-foreground hover:bg-tag-bg'
          }`}
        >
          <Award className="w-4 h-4" /> ใบรับรอง ({certificates.length})
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-fg-secondary hover:text-foreground hover:bg-tag-bg'
          }`}
        >
          <Sparkles className="w-4 h-4" /> ทักษะ ({skillsList.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[145px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-fg-secondary hover:text-foreground hover:bg-tag-bg'
          }`}
        >
          <User className="w-4 h-4" /> ข้อมูลส่วนตัว
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROJECTS (BLUE THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card on Left */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-outfit text-base font-bold text-foreground">
                    {editingProjectId ? 'แก้ไขข้อมูล Project' : 'เพิ่ม Project ใหม่'}
                  </h2>
                  <p className="text-[11px] text-fg-secondary">จัดการผลงานและโปรเจกต์เด่น</p>
                </div>
              </div>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                >
                  ✕ ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ชื่อโปรเจกต์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="เช่น AI Chat Assistant"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-blue-500 text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  คำอธิบายสั้นๆ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.desc}
                  onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                  placeholder="อธิบายว่าโปรเจกต์ช่วยแก้ปัญหาอะไร ภายใน 1–2 ประโยค"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-blue-500 text-xs sm:text-sm outline-none resize-none transition-colors"
                />
              </div>

              {/* Demo URL & Screenshot Upload (Seamless - No Nested Box) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Demo URL หรือ ภาพหน้าจอผลงาน
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://my-app.vercel.app หรืออัปโหลดรูปภาพผลงาน"
                    className="flex-1 px-3 py-2 rounded-xl bg-background border border-border focus:border-blue-500 text-xs sm:text-sm outline-none"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-card hover:bg-tag-bg border border-border text-xs cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-sm font-medium transition-colors">
                    <Upload className="w-3.5 h-3.5 text-blue-500" /> อัปโหลดภาพ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {projectForm.demoUrl && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-fg-secondary font-mono truncate max-w-[280px]">
                      🔗 {projectForm.demoUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, demoUrl: '' })}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer flex-shrink-0"
                    >
                      ลบออก
                    </button>
                  </div>
                )}
              </div>

              {/* UI Mockup Template Fallback */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  หรือเลือก UI Mockup จำลอง
                </label>
                <select
                  value={projectForm.preview}
                  onChange={(e) => setProjectForm({ ...projectForm, preview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-blue-500 text-xs outline-none cursor-pointer"
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
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GitHub Repository URL (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-blue-500 text-xs outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="projectFeatured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="projectFeatured" className="text-xs text-foreground font-semibold cursor-pointer">
                      ⭐ แสดงในหน้าแรก (Featured)
                    </label>
                  </div>
                  {projectForm.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold font-mono">
                      อันดับ #{projectForm.order || 1}
                    </span>
                  )}
                </div>

                {projectForm.featured && (
                  <div className="pt-2.5 border-t border-border/60 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        ลำดับที่แสดงในหน้าแรก:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={projectForm.order || 1}
                          onChange={(e) => setProjectForm({ ...projectForm, order: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-20 px-2.5 py-1 rounded-lg bg-background border border-border focus:border-blue-500 text-xs text-center font-mono font-bold outline-none"
                        />
                        <span className="text-[11px] text-fg-tertiary font-medium">ลำดับที่</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-fg-tertiary">
                      💡 อันดับ 1 จะแสดงอยู่หน้าสุดบนหน้าแรก (1, 2, 3...)
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold gap-1.5 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingProjectId ? 'อัปเดต Project' : 'บันทึก Project'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Projects List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="font-outfit text-base font-bold text-foreground">
                  โปรเจกต์ทั้งหมด
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {filteredProjects.length}
                </span>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="ค้นหาโปรเจกต์..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border focus:border-blue-500 text-xs outline-none"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-fg-tertiary" />
                </div>

                <button
                  type="button"
                  onClick={() => setProjectFeaturedOnly(!projectFeaturedOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                    projectFeaturedOnly
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-card border-border text-fg-secondary hover:text-foreground'
                  }`}
                >
                  ⭐ หน้าแรก
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-12 rounded-2xl bg-card border border-border text-center text-xs text-fg-secondary">
                ไม่พบผลงานที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredProjects.map((p, index) => {
                const demoLink = p.demoUrl || `/demo?preview=${p.preview}`;
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3.5 shadow-sm hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <a
                        href={demoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-14 h-14 rounded-xl bg-zinc-950 border border-border flex-shrink-0 flex items-center justify-center overflow-hidden hover:border-blue-500 group transition-all"
                        title="คลิกเพื่อเปิดดู Demo ในแท็บใหม่"
                      >
                        {p.demoUrl ? (
                          <img
                            src={
                              p.demoUrl.toLowerCase().endsWith('.png') ||
                              p.demoUrl.toLowerCase().endsWith('.jpg') ||
                              p.demoUrl.toLowerCase().endsWith('.jpeg') ||
                              p.demoUrl.toLowerCase().endsWith('.webp') ||
                              p.demoUrl.startsWith('/uploads/') ||
                              p.demoUrl.includes('supabase.co')
                                ? p.demoUrl
                                : `https://s0.wp.com/mshots/v1/${encodeURIComponent(p.demoUrl)}?w=200&h=200`
                            }
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            onError={(e: any) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-blue-500/10">
                            <Layers className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-500" />
                            <span className="text-[7px] font-bold mt-0.5 uppercase text-fg-tertiary">{p.preview}</span>
                          </div>
                        )}
                      </a>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-outfit text-sm font-bold text-foreground truncate">{p.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary font-mono">
                            #{index + 1}
                          </span>
                          {p.featured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium font-mono">
                              ⭐ หน้าแรก (อันดับ #{p.order || 1})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-fg-secondary mt-1 line-clamp-1">{p.desc}</p>
                        {p.demoUrl && (
                          <p className="text-[11px] text-blue-500 mt-1 truncate font-mono">
                            🔗 {p.demoUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditProject(p)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-500/10 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
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
      {/* TAB 2: ACTIVITIES & EXPERIENCE (AMBER THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form on Left (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Calendar className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-outfit text-base font-bold text-foreground">
                    {editingActivityId ? 'แก้ไขกิจกรรม / ประสบการณ์' : 'เพิ่มกิจกรรม / ประสบการณ์ใหม่'}
                  </h2>
                  <p className="text-[11px] text-fg-secondary">จัดการประวัติการร่วมกิจกรรมและเวิร์กช็อป</p>
                </div>
              </div>
              {editingActivityId && (
                <button
                  type="button"
                  onClick={resetActivityForm}
                  className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                >
                  ✕ ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ชื่อกิจกรรม / โครงการ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="เช่น ผู้ช่วยวิทยากรอบรม AI หรือ แข่งขันนวัตกรรม"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    บทบาท / หน้าที่
                  </label>
                  <input
                    type="text"
                    value={activityForm.role}
                    onChange={(e) => setActivityForm({ ...activityForm, role: e.target.value })}
                    placeholder="เช่น ผู้ช่วยวิทยากร, Lead"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    หน่วยงาน / สถาบัน
                  </label>
                  <input
                    type="text"
                    value={activityForm.org}
                    onChange={(e) => setActivityForm({ ...activityForm, org: e.target.value })}
                    placeholder="เช่น สาขาวิทยาการคอมฯ"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ช่วงเวลา / ปีที่จัด
                </label>
                <input
                  type="text"
                  value={activityForm.period}
                  onChange={(e) => setActivityForm({ ...activityForm, period: e.target.value })}
                  placeholder="เช่น 2024 หรือ ม.ค. 2024 - ปัจจุบัน"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  รายละเอียด / สิ่งที่ได้เรียนรู้
                </label>
                <textarea
                  rows={3}
                  value={activityForm.desc}
                  onChange={(e) => setActivityForm({ ...activityForm, desc: e.target.value })}
                  placeholder="อธิบายสรุปกิจกรรม ผลลัพธ์ หรือสิ่งที่ได้ลงมือทำ"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs sm:text-sm outline-none resize-none transition-colors"
                />
              </div>

              {/* Multi-Image Gallery (Seamless - No Nested Box) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    รูปภาพกิจกรรม (หลายภาพ)
                  </label>
                  {activityForm.images.length > 0 && (
                    <span className="text-[10px] font-mono text-fg-tertiary">
                      {activityForm.images.length} ภาพ
                    </span>
                  )}
                </div>

                <label className="w-full py-2.5 px-4 rounded-xl bg-card hover:bg-tag-bg border border-dashed border-border text-foreground text-xs font-medium cursor-pointer flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-4 h-4 text-amber-500" />
                  {activityUploading ? 'กำลังอัปโหลด...' : '📁 เลือกรูปภาพจากเครื่อง (หลายภาพ)'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={activityUploading}
                    onChange={handleActivityImagesUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded Images Preview Grid with Delete Buttons */}
                {activityForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2.5">
                    {activityForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative h-14 rounded-lg overflow-hidden border border-border bg-zinc-950 flex items-center justify-center"
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveActivityImage(idx)}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow cursor-pointer hover:scale-110 transition-transform"
                          title="ลบรูปนี้"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ลิงก์ที่เกี่ยวข้อง (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={activityForm.linkUrl}
                  onChange={(e) => setActivityForm({ ...activityForm, linkUrl: e.target.value })}
                  placeholder="https://facebook.com/... หรือโพสต์กิจกรรม"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-amber-500 text-xs outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="activityFeatured"
                      checked={activityForm.featured}
                      onChange={(e) => setActivityForm({ ...activityForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="activityFeatured" className="text-xs text-foreground font-semibold cursor-pointer">
                      ⭐ แสดงในหน้าแรก (Featured)
                    </label>
                  </div>
                  {activityForm.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold font-mono">
                      อันดับ #{activityForm.order || 1}
                    </span>
                  )}
                </div>

                {activityForm.featured && (
                  <div className="pt-2.5 border-t border-border/60 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        ลำดับที่แสดงในหน้าแรก:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={activityForm.order || 1}
                          onChange={(e) => setActivityForm({ ...activityForm, order: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-20 px-2.5 py-1 rounded-lg bg-background border border-border focus:border-amber-500 text-xs text-center font-mono font-bold outline-none"
                        />
                        <span className="text-[11px] text-fg-tertiary font-medium">ลำดับที่</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-fg-tertiary">
                      💡 อันดับ 1 จะแสดงอยู่หน้าสุดบนหน้าแรก (1, 2, 3...)
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={activityUploading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs sm:text-sm font-semibold gap-1.5 shadow-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingActivityId ? 'อัปเดตกิจกรรม' : 'บันทึกกิจกรรม'}
                </button>
              </div>
            </form>
          </div>

          {/* List on Right (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-outfit text-base font-bold text-foreground">
                  รายการกิจกรรม &amp; ประสบการณ์ทั้งหมด
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {filteredActivities.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-tertiary" />
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="ค้นหากิจกรรม / สถาบัน / บทบาท..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-xs outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setActivityFeaturedOnly(!activityFeaturedOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                  activityFeaturedOnly
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-card border-border text-fg-secondary hover:text-foreground'
                }`}
              >
                ⭐ หน้าแรก
              </button>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="p-12 rounded-2xl bg-card border border-border text-center text-xs text-fg-secondary">
                ไม่พบกิจกรรมที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredActivities.map((act, index) => {
                const imgCount = Array.isArray(act.images) ? act.images.length : 0;
                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-card border border-border flex items-start justify-between gap-3.5 shadow-sm hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex-shrink-0 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-outfit text-sm font-bold text-foreground leading-snug">
                            {act.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary font-mono">
                            #{index + 1}
                          </span>
                          {act.featured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium font-mono">
                              ⭐ หน้าแรก (อันดับ #{act.order || 1})
                            </span>
                          )}
                          {imgCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-medium flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5" /> {imgCount} ภาพ
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-fg-secondary">
                          {act.role && (
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {act.role}
                            </span>
                          )}
                          {act.org && <span>• {act.org}</span>}
                          {act.period && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold">
                              {act.period}
                            </span>
                          )}
                        </div>

                        {act.desc && (
                          <p className="text-xs text-fg-secondary mt-1.5 line-clamp-2 leading-relaxed font-normal">
                            {act.desc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditActivity(act)}
                        className="p-2 rounded-xl text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id, act.title)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
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
      {/* TAB 3: CERTIFICATES (EMERALD THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-outfit text-base font-bold text-foreground">
                    {editingCertId ? 'แก้ไขข้อมูล Certificate' : 'เพิ่ม Certificate ใหม่'}
                  </h2>
                  <p className="text-[11px] text-fg-secondary">จัดการใบประกาศนียบัตรและใบรับรอง</p>
                </div>
              </div>
              {editingCertId && (
                <button
                  type="button"
                  onClick={resetCertForm}
                  className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                >
                  ✕ ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ชื่อหลักสูตร / ใบรับรอง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  placeholder="เช่น Introduction to Artificial Intelligence"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-emerald-500 text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  สถาบัน / ผู้ออกใบรับรอง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certForm.org}
                  onChange={(e) => setCertForm({ ...certForm, org: e.target.value })}
                  placeholder="เช่น Coursera, Google, Microsoft, Chula"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-emerald-500 text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              {/* Certificate File Upload (Seamless - No Nested Box) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ไฟล์ภาพ หรือ PDF ใบรับรอง
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certForm.imageUrl}
                    onChange={(e) => {
                      setCertForm({ ...certForm, imageUrl: e.target.value });
                      setCertPreviewError(false);
                    }}
                    placeholder="https://... หรืออัปโหลดไฟล์"
                    className="flex-1 px-3 py-2 rounded-xl bg-background border border-border focus:border-emerald-500 text-xs sm:text-sm outline-none"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-card hover:bg-tag-bg border border-border text-xs cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-sm font-medium transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    {certUploading ? 'กำลังอัปโหลด...' : '📁 เลือกไฟล์'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleCertFileUpload}
                      disabled={certUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {certForm.imageUrl && (
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-fg-secondary font-mono truncate max-w-[240px]">
                      📄 {certForm.imageUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCertForm({ ...certForm, imageUrl: '' })}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer flex-shrink-0"
                    >
                      ลบออก
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="certFeatured"
                      checked={certForm.featured}
                      onChange={(e) => setCertForm({ ...certForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="certFeatured" className="text-xs text-foreground font-semibold cursor-pointer">
                      ⭐ แสดงในหน้าแรก (Featured)
                    </label>
                  </div>
                  {certForm.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      อันดับ #{certForm.order || 1}
                    </span>
                  )}
                </div>

                {certForm.featured && (
                  <div className="pt-2.5 border-t border-border/60 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ลำดับที่แสดงในหน้าแรก:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={certForm.order || 1}
                          onChange={(e) => setCertForm({ ...certForm, order: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-20 px-2.5 py-1 rounded-lg bg-background border border-border focus:border-emerald-500 text-xs text-center font-mono font-bold outline-none"
                        />
                        <span className="text-[11px] text-fg-tertiary font-medium">ลำดับที่</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-fg-tertiary">
                      💡 อันดับ 1 จะแสดงอยู่หน้าสุดบนหน้าแรก (1, 2, 3...)
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={certUploading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold gap-1.5 shadow-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingCertId ? 'อัปเดต Certificate' : 'บันทึก Certificate'}
                </button>
              </div>
            </form>
          </div>

          {/* List on Right */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-outfit text-base font-bold text-foreground">
                  รายการ Certificates ทั้งหมด
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {filteredCertificates.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-tertiary" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="ค้นหาใบรับรองในระบบ..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-card border border-border text-xs outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setCertFeaturedOnly(!certFeaturedOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                  certFeaturedOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-card border-border text-fg-secondary hover:text-foreground'
                }`}
              >
                ⭐ หน้าแรก
              </button>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="p-12 rounded-2xl bg-card border border-border text-center text-xs text-fg-secondary">
                ไม่พบใบรับรองที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredCertificates.map((c, index) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3.5 shadow-sm hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPreviewCertInAdmin(c)}
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                      style={{ backgroundColor: `${c.color || '#10B981'}20`, color: c.color || '#10B981' }}
                      title="คลิกเพื่อเปิดดูแบบเต็มจอ"
                    >
                      {c.org.slice(0, 2)}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-outfit text-sm font-bold text-foreground truncate">{c.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary font-mono">
                          #{index + 1}
                        </span>
                        {c.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                            ⭐ หน้าแรก (อันดับ #{c.order || 1})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-fg-secondary mt-1">{c.org}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditCertificate(c)}
                      className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCertificate(c.id, c.name)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SKILLS & CAPABILITIES (PURPLE THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-outfit text-base font-bold text-foreground">
                    {editingSkillId ? 'แก้ไขหมวดหมู่ทักษะ' : 'เพิ่มหมวดหมู่ทักษะใหม่'}
                  </h2>
                  <p className="text-[11px] text-fg-secondary">จัดการทักษะและความเชี่ยวชาญ</p>
                </div>
              </div>
              {editingSkillId && (
                <button
                  type="button"
                  onClick={resetSkillForm}
                  className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                >
                  ✕ ยกเลิก
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ชื่อหมวดหมู่ทักษะ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.title}
                  onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                  placeholder="เช่น AI-Powered Workflow (ก้าวข้ามภาษาและโค้ด)"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-purple-500 text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  เลือกไอคอนประจำหมวดหมู่
                </label>
                <select
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-purple-500 text-xs outline-none cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  คำอธิบายภาพรวมจุดเด่น <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={skillForm.desc}
                  onChange={(e) => setSkillForm({ ...skillForm, desc: e.target.value })}
                  placeholder="อธิบายว่าคุณมีความโดดเด่นในด้านนี้อย่างไร"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-purple-500 text-xs sm:text-sm outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  รายการทักษะย่อย (คั่นด้วยเครื่องหมายจุลภาค , ) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={skillForm.skillsInput}
                  onChange={(e) => setSkillForm({ ...skillForm, skillsInput: e.target.value })}
                  placeholder="AI Pair Programming, Prompt Engineering, Claude, ChatGPT, Gemini"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-purple-500 text-xs outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs sm:text-sm font-semibold gap-1.5 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingSkillId ? 'อัปเดตหมวดหมู่ทักษะ' : 'บันทึกหมวดหมู่ทักษะ'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-outfit text-base font-bold text-foreground">
                  หมวดหมู่ทักษะทั้งหมด
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {skillsList.length}
                </span>
              </div>
            </div>

            {skillsList.map((item, index) => {
              const matchedIcon = AVAILABLE_ICONS.find((ic) => ic.id === item.icon) || AVAILABLE_ICONS[0];
              const IconComp = matchedIcon.icon;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-3 shadow-sm hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-outfit text-sm font-bold text-foreground">{item.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tag-bg text-fg-tertiary font-mono">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-xs text-fg-secondary mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditSkill(item)}
                        className="p-2 rounded-xl text-purple-600 hover:bg-purple-500/10 transition-colors cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(item.id, item.title)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                    {item.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-tag-bg text-foreground font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROFILE & HOME PAGE HEADINGS (SKY THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
            {/* Header Title */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
              <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h2 className="font-outfit text-lg font-bold text-foreground">
                  ตั้งค่าโปรไฟล์ &amp; เนื้อหาเว็บไซต์
                </h2>
                <p className="text-xs text-fg-secondary">
                  จัดการข้อมูลส่วนตัว เรซูเม่ ช่องทางการติดต่อ และหัวข้อในหน้าหลัก
                </p>
              </div>
            </div>

            {/* Section 1: Hero Profile */}
            <div className="space-y-4">
              <h3 className="font-outfit text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>1.</span> ข้อมูลส่วนตัว (Hero Header)
              </h3>

              {/* Avatar Upload with Circle Crop (Seamless - No Nested Box) */}
              <div className="flex items-center gap-5">
                <div className="relative group flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-900 border border-border flex items-center justify-center">
                    <img
                      src={profile.imageUrl || defaultProfile.imageUrl}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-medium cursor-pointer transition-opacity">
                    <Upload className="w-4 h-4 mb-0.5" />
                    เปลี่ยนภาพ
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">รูปโปรไฟล์ (Avatar)</p>
                  <p className="text-[11px] text-fg-secondary">
                    กดเพื่อเลือกรูปภาพและครอบตัดแบบวงกลม
                  </p>
                  <label className="px-3 py-1.5 rounded-lg bg-card hover:bg-tag-bg border border-border text-xs cursor-pointer inline-flex items-center gap-1.5 font-medium transition-colors mt-0.5">
                    <Upload className="w-3.5 h-3.5 text-sky-500" /> อัปโหลดและครอบตัด
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Resume PDF File Upload (Seamless - No Nested Box) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-500" /> ไฟล์เรซูเม่ (Resume PDF)
                  </span>
                  {profile.resumeUrl && (
                    <span className="text-[10px] text-emerald-500 font-medium">✓ มีไฟล์เรซูเม่แล้ว</span>
                  )}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-semibold cursor-pointer gap-1.5 shadow-sm inline-flex items-center transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {resumeUploading ? 'กำลังอัปโหลด...' : '📁 อัปโหลดไฟล์เรซูเม่ (PDF)'}
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={resumeUploading}
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>

                  {profile.resumeUrl && (
                    <>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-card hover:bg-tag-bg border border-border text-xs text-foreground font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-sky-500" /> เปิดดูตัวอย่าง
                      </a>
                      <button
                        type="button"
                        onClick={handleResumeDelete}
                        className="px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-medium gap-1 inline-flex items-center cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> ลบเรซูเม่
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ตำแหน่ง / บทบาท <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  สโลแกน / Tagline <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none resize-none transition-colors"
                />
              </div>
            </div>

            {/* Section 2: About Me */}
            <div className="space-y-4 pt-6 border-t border-border/40">
              <h3 className="font-outfit text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>2.</span> About Me (เกี่ยวกับฉัน)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">หัวข้อส่วน About</label>
                <input
                  type="text"
                  value={profile.aboutHeading || 'About Me'}
                  onChange={(e) => setProfile({ ...profile, aboutHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  เนื้อหาเกี่ยวกับฉัน ย่อหน้าที่ 1 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={profile.about1}
                  onChange={(e) => setProfile({ ...profile, about1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  เนื้อหาเกี่ยวกับฉัน ย่อหน้าที่ 2 (ไม่บังคับ)
                </label>
                <textarea
                  rows={3}
                  value={profile.about2 || ''}
                  onChange={(e) => setProfile({ ...profile, about2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none resize-none transition-colors"
                />
              </div>
            </div>

            {/* Section 3: Section Headings */}
            <div className="space-y-4 pt-6 border-t border-border/40">
              <h3 className="font-outfit text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>3.</span> ปรับเปลี่ยนชื่อหัวข้อแต่ละ Section
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">หัวข้อ Projects</label>
                  <input
                    type="text"
                    value={profile.projectsHeading || 'Projects'}
                    onChange={(e) => setProfile({ ...profile, projectsHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">หัวข้อ Activities</label>
                  <input
                    type="text"
                    value={profile.activitiesHeading || 'Activities & Experience'}
                    onChange={(e) => setProfile({ ...profile, activitiesHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">หัวข้อ Certificates</label>
                  <input
                    type="text"
                    value={profile.certificatesHeading || 'Certificates'}
                    onChange={(e) => setProfile({ ...profile, certificatesHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">หัวข้อ Skills</label>
                  <input
                    type="text"
                    value={profile.skillsHeading || 'Skills & Capabilities'}
                    onChange={(e) => setProfile({ ...profile, skillsHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact & Socials */}
            <div className="space-y-4 pt-6 border-t border-border/40">
              <h3 className="font-outfit text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>4.</span> ช่องทางการติดต่อ (Contact &amp; Socials)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    เบอร์โทรศัพท์ (Phone) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                    <input
                      type="text"
                      required
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="064-965-9703"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    อีเมล (Email Address) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    GitHub URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                    <input
                      type="text"
                      required
                      value={profile.githubUrl}
                      onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    LINE Add Friend URL
                  </label>
                  <div className="relative">
                    <LineIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
                    <input
                      type="text"
                      value={profile.lineUrl || ''}
                      onChange={(e) => setProfile({ ...profile, lineUrl: e.target.value })}
                      placeholder="https://line.me/ti/p/..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* LINE QR Code (Seamless - No Nested Box) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  LINE QR Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-border overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                    {profile.lineQrUrl && !qrPreviewError ? (
                      <img
                        src={profile.lineQrUrl}
                        alt="LINE QR Code"
                        onError={() => setQrPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LineIcon className="w-6 h-6 text-[#06C755]" />
                    )}
                  </div>
                  <label className="px-3.5 py-1.5 rounded-lg bg-card hover:bg-tag-bg border border-border text-xs cursor-pointer inline-flex items-center gap-1.5 font-medium transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-500" /> อัปโหลดภาพ QR Code
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLineQrUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  ข้อความคำอธิบายการติดต่อ (Contact Description)
                </label>
                <textarea
                  rows={3}
                  value={profile.contactDesc || ''}
                  onChange={(e) => setProfile({ ...profile, contactDesc: e.target.value })}
                  placeholder="เขียนข้อความสรุปเป้าหมายและความพร้อมในการฝึกงาน..."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-sky-500 text-sm outline-none resize-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border/40 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-sm font-semibold gap-2 shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลงโปรไฟล์ทั้งหมด
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CERTIFICATE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewCertInAdmin && (
        <CertificateModal
          cert={previewCertInAdmin}
          onClose={() => setPreviewCertInAdmin(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROFILE AVATAR CROP MODAL */}
      {/* ========================================================================= */}
      {cropModalOpen && cropImageSrc && (() => {
        const cropBoxSize = 256;
        const nw = cropImageDimensions.width || 1;
        const nh = cropImageDimensions.height || 1;
        const minDim = Math.min(nw, nh);
        const baseScale = cropBoxSize / minDim;
        const baseWidth = nw * baseScale;
        const baseHeight = nh * baseScale;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-4">
                <h3 className="font-outfit text-base font-bold text-foreground">
                  ครอบตัดรูปโปรไฟล์ (Circle Crop)
                </h3>
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="p-1 rounded-lg text-fg-tertiary hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Crop Circular Viewport */}
              <div
                className="relative w-64 h-64 rounded-full overflow-hidden bg-zinc-950 cursor-grab active:cursor-grabbing flex items-center justify-center border-2 border-sky-500 shadow-inner my-2 select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  ref={cropImageRef}
                  src={cropImageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    minWidth: `${baseWidth}px`,
                    minHeight: `${baseHeight}px`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`,
                    transformOrigin: 'center center',
                  }}
                  className="pointer-events-none select-none transition-transform duration-75"
                />
              </div>

              <p className="text-[11px] text-fg-secondary mt-2">
                💡 คลิกหรือแตะแล้วลากภาพเพื่อปรับตำแหน่ง หรือใช้แถบเลื่อนด้านล่างเพื่อซูม
              </p>

              <div className="flex items-center gap-3 w-full my-4 px-2">
                <ZoomOut className="w-4 h-4 text-fg-tertiary flex-shrink-0" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-sky-500 cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-fg-tertiary flex-shrink-0" />
              </div>

              <div className="flex items-center justify-end gap-3 w-full pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-card hover:bg-tag-bg border border-border text-xs font-semibold text-foreground cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-semibold gap-1.5 shadow-sm inline-flex items-center cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" /> ใช้ภาพนี้
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* CLEAN MINIMALIST LOGOUT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Click */}
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => !loggingOut && setLogoutConfirmOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-150 space-y-4">
            {/* Clean Icon */}
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-outfit text-lg font-bold text-foreground">
                ยืนยันการออกจากระบบ
              </h3>
              <p className="text-xs sm:text-sm text-fg-secondary mt-1.5 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ Admin?
              </p>
            </div>

            {/* Flat Clean Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setLogoutConfirmOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-tag-bg hover:bg-border text-fg-secondary hover:text-foreground text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={loggingOut}
                onClick={confirmLogoutAction}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> กำลังออก...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" /> ออกจากระบบ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
