import React, { useState, useEffect, useMemo } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import AdvancedSettings from './AdvancedSettings';
import {
  BookOpen, SlidersHorizontal, LogOut, Play, Save, Loader2,
  Check, Search, GraduationCap, AlertCircle, BookX, Github,
} from 'lucide-react';
import api from '../api/axios';

const selectCls =
  'h-10 w-full cursor-pointer rounded-lg border border-line bg-white px-3 text-sm text-ink ' +
  'transition-shadow focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15';

const CourseSelection = ({ userInfo, onStartStudy, onLogout, starting, startError, preview = false }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [query, setQuery] = useState('');
  const [settings, setSettings] = useState({
    speed: 1.0,
    jobs: 1,
    notopen_action: 'retry',
    tiku_config: {},
    notification_config: { provider: 'Windows' },
    ocr_config: {},
  });

  useEffect(() => {
    if (preview) {
      setCourses([
        { courseId: 'preview-001', title: '大学英语（演示课程）' },
        { courseId: 'preview-002', title: '高等数学（演示课程）' },
        { courseId: 'preview-003', title: '计算机基础（演示课程）' },
      ]);
      setSelectedCourses(['preview-001']);
      setLoading(false);
      return;
    }
    fetchConfig();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/config');
      if (response.data.status && response.data.data) {
        const cfg = response.data.data;
        if (cfg.settings) {
          setSettings((prev) => {
            const merged = { ...prev, ...cfg.settings };
            // 默认启用 Windows 系统通知(老配置未记录过通知方式时回填);
            // 用户明确选择过(含"不使用通知")则尊重其选择
            if (typeof merged.notification_config?.provider !== 'string') {
              merged.notification_config = {
                ...(merged.notification_config || {}),
                provider: 'Windows',
              };
            }
            return merged;
          });
        }
        if (Array.isArray(cfg.selectedCourses)) {
          setSelectedCourses(cfg.selectedCourses);
        }
      }
    } catch (err) {
      console.error('加载已保存配置失败:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.post('/courses', {
        username: userInfo.username,
        password: userInfo.password,
      });

      if (response.data.status) {
        setCourses(response.data.data);
      }
    } catch (err) {
      console.error('获取课程列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.title?.toLowerCase().includes(q) || String(c.courseId).includes(q)
    );
  }, [courses, query]);

  const selectedCount = selectedCourses.length;
  const effectiveCount = selectedCount > 0 ? selectedCount : courses.length;

  const handleStartStudy = () => {
    onStartStudy({
      ...settings,
      course_list: selectedCount > 0 ? selectedCourses : courses.map((c) => c.courseId),
    });
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setSaveStatus('');
      const payload = { settings, selectedCourses };
      const response = await api.post('/config', payload);
      if (!response.data.status) {
        console.error('保存配置失败:', response.data.msg);
        setSaveStatus(response.data.msg || '保存失败,请重试');
      } else {
        setSaveStatus('配置已保存');
      }
    } catch (err) {
      console.error('保存配置请求失败:', err);
      setSaveStatus('保存请求失败');
    } finally {
      setSaving(false);
    }
  };

  /* ---------- 载入态 ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden="true" />
        <p className="text-sm text-faint">正在获取课程列表</p>
      </div>
    );
  }

  /* ---------- 主视图 ---------- */
  return (
    <div className="min-h-screen bg-canvas">
      {/* 顶栏 */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
              <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[15px] font-semibold leading-tight">超星学习通</p>
              <p className="text-xs leading-tight text-faint">课程管理</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/RRRRUDDDD/chaoxing-gui"
              target="_blank"
              rel="noreferrer"
              aria-label="在 GitHub 上查看项目"
              title="在 GitHub 上查看项目"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors duration-150 hover:bg-soft hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
            {userInfo?.username && (
              <span className="hidden font-mono text-xs text-faint sm:inline tnum">
                {userInfo.username}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <main className="page-shell py-[clamp(1.5rem,2.5vw,3rem)]">
        {/* 页首 */}
        <div className="mb-7 animate-stagger-up">
          <h1 className="text-2xl font-semibold tracking-tight">选择课程并配置学习参数</h1>
          <p className="mt-1.5 text-sm text-faint">
            未选择任何课程时,默认学习全部 {courses.length} 门课程
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(21.25rem,24vw,30rem)] lg:items-start 2xl:gap-8">
          {/* 左:课程列表 */}
          <section
            aria-label="课程列表"
            className="rounded-xl border border-line bg-white shadow-card animate-stagger-up"
            style={{ animationDelay: '80ms' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold">
                <BookOpen className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
                课程列表
                <span className="ml-1 rounded-full bg-soft px-2 py-0.5 text-xs text-faint tnum">
                  已选 {selectedCount > 0 ? selectedCount : '全部'} / 共 {courses.length}
                </span>
              </h2>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索课程"
                  aria-label="搜索课程"
                  className="h-8 w-44 rounded-lg border border-line bg-white pl-8 pr-3 text-[13px] placeholder:text-faint/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-soft">
                  <BookX className="h-5 w-5 text-faint" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[15px] font-medium">暂无课程</p>
                <p className="mt-1 text-[13px] text-faint">
                  未能从学习通获取课程,请确认账号后再试
                </p>
              </div>
            ) : (
              <ul className="max-h-[clamp(32.5rem,65vh,52rem)] divide-y divide-line overflow-y-auto scroll-brutal px-2 py-1.5">
                {filteredCourses.map((course) => {
                  const selected = selectedCourses.includes(course.courseId);
                  return (
                    <li key={course.courseId}>
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.courseId)}
                        aria-pressed={selected}
                        className={`group flex w-full items-center gap-3.5 rounded-lg px-3 py-3 text-left transition-colors duration-150 hover:bg-soft focus-visible:bg-soft focus-visible:outline-none ${
                          selected ? 'bg-brand-soft/60' : ''
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                            selected
                              ? 'border-brand bg-brand text-white'
                              : 'border-faint/40 text-transparent group-hover:border-faint'
                          }`}
                          aria-hidden="true"
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3.5} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">
                            {course.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-faint tnum">
                            ID: {course.courseId}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <li className="py-10 text-center text-[13px] text-faint">
                    未找到与「{query}」匹配的课程
                  </li>
                )}
              </ul>
            )}
          </section>

          {/* 右:配置面板 */}
          <aside
            aria-label="学习配置"
            className="space-y-4 animate-stagger-up lg:sticky lg:top-24"
            style={{ animationDelay: '160ms' }}
          >
            <div className="rounded-xl border border-line bg-white shadow-card">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                <SlidersHorizontal className="h-4 w-4 text-brand" aria-hidden="true" />
                <h2 className="text-[15px] font-semibold">学习配置</h2>
              </div>

              <div className="space-y-5 p-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speed">播放倍速</Label>
                    <span className="font-mono text-xs font-medium text-brand tnum">
                      {Number(settings.speed).toFixed(1)}x
                    </span>
                  </div>
                  <input
                    id="speed"
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) => setSettings({ ...settings, speed: parseFloat(e.target.value) })}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                  />
                  <p className="text-xs text-faint">范围 1.0 - 2.0</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jobs">并发章节数</Label>
                  <Input
                    id="jobs"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.jobs}
                    onChange={(e) => setSettings({ ...settings, jobs: parseInt(e.target.value) || 1 })}
                  />
                  <p className="text-xs text-faint">同时处理的章节数量,默认1，建议最高不超过4</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notopen">未开放章节处理</Label>
                  <select
                    id="notopen"
                    value={settings.notopen_action}
                    onChange={(e) => setSettings({ ...settings, notopen_action: e.target.value })}
                    className={selectCls}
                  >
                    <option value="retry">重试</option>
                    <option value="ask">询问</option>
                    <option value="continue">跳过</option>
                  </select>
                </div>

                <div className="border-t border-line pt-5">
                  <AdvancedSettings settings={settings} onChange={setSettings} />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-line bg-white p-5 shadow-card">
              <Button className="w-full" size="lg" onClick={handleStartStudy} disabled={starting}>
                {starting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    任务启动中
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" />
                    开始学习
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full" size="sm" onClick={handleSaveConfig} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    保存中
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                    保存当前配置
                  </>
                )}
              </Button>
              {startError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg bg-danger/5 px-3 py-2.5 text-xs leading-relaxed text-danger animate-fade-in"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{startError}</span>
                </div>
              )}
              {saveStatus && (
                <p className="text-center text-xs text-success animate-fade-in" role="status">
                  {saveStatus}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CourseSelection;
