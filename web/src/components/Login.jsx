import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { LogIn, Loader2, KeyRound, GraduationCap, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        username,
        password,
      });

      if (response.data.status) {
        onLoginSuccess({ username, password });
      } else {
        setError(response.data.msg || '登录失败,请检查账号信息后重试');
      }
    } catch (err) {
      setError(err.response?.data?.msg || '网络连接异常,请确认服务已启动后重试');
    } finally {
      setLoading(false);
    }
  };

  const errId = 'login-error';

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[400px] animate-pop-in">
        {/* 品牌区 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-focus">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">超星学习通</h1>
          <p className="mt-1.5 text-sm text-faint">自动化学习助手 · 登录以继续</p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift sm:p-7">
          <form onSubmit={handleLogin} aria-describedby={error ? errId : undefined} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username">手机号</Label>
              <Input
                id="username"
                ref={userRef}
                type="text"
                inputMode="tel"
                autoComplete="username"
                placeholder="请输入手机号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                id={errId}
                role="alert"
                className="flex items-start gap-2 rounded-lg bg-danger/5 px-3 py-2.5 text-[13px] leading-relaxed text-danger animate-fade-in"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  登录中
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  登录
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          <KeyRound className="mr-1 inline h-3 w-3 -translate-y-px" aria-hidden="true" />
          账号信息仅用于本机登录,不会上传至任何第三方
        </p>
      </div>
    </div>
  );
};

export default Login;
