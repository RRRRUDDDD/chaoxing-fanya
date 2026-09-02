import React, { useState } from 'react';
import Login, { SAVED_LOGIN_KEY } from './components/Login';
import CourseSelection from './components/CourseSelection';
import StudyProgress from './components/StudyProgress';
import api from './api/axios';

function App() {
  const [step, setStep] = useState('login');
  const [userInfo, setUserInfo] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleLoginSuccess = (info) => {
    setUserInfo(info);
    setStep('courses');
  };

  const handleStartStudy = async (settings) => {
    if (starting) return;
    setStarting(true);
    setStartError('');
    try {
      const response = await api.post('/start', {
        username: userInfo.username,
        password: userInfo.password,
        ...settings,
      });

      if (response.data.status) {
        setTaskId(response.data.data.task_id);
        setStep('progress');
      } else {
        setStarting(false);
        setStartError(response.data.msg || '启动学习任务失败,请检查配置后重试');
      }
    } catch (err) {
      console.error('启动学习任务失败:', err);
      setStartError(err.response?.data?.msg || '启动学习任务失败,请检查配置后重试');
    } finally {
      setStarting(false);
    }
  };

  const handleLogout = () => {
    // 用户主动退出登录,清除本地保存的自动登录凭据
    try {
      localStorage.removeItem(SAVED_LOGIN_KEY);
    } catch (e) {
      // 存储不可用时忽略
    }
    setUserInfo(null);
    setTaskId(null);
    setStep('login');
  };

  const handleBackToHome = () => {
    setTaskId(null);
    setStep('courses');
  };

  return (
    <div className="App">
      {step === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {step === 'courses' && (
        <CourseSelection
          userInfo={userInfo}
          onStartStudy={handleStartStudy}
          onLogout={handleLogout}
          starting={starting}
          startError={startError}
        />
      )}
      {step === 'progress' && taskId && (
        <StudyProgress taskId={taskId} onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
