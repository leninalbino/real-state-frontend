import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, KeyRound, Home } from 'lucide-react';
import { useAuth } from '../../../app/auth/useAuth';
import { forgotPassword, resetPassword } from '../services/authService';
import { TextInput } from '../../../shared/ui/TextInput';

const AccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const recoveryTimeoutRef = useRef<number | null>(null);
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      const result = await forgotPassword(forgotEmail);
      setRecoveryMessage(result.message);
      if (result.token) {
        setResetToken(result.token);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al solicitar recuperación';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken || !newPassword || newPassword !== confirmNewPassword) {
      return;
    }

    setAuthError('');
    setAuthLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setRecoveryMessage('Contraseña actualizada. Inicia sesión.');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      if (recoveryTimeoutRef.current) {
        window.clearTimeout(recoveryTimeoutRef.current);
      }
      recoveryTimeoutRef.current = window.setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setRecoveryMessage('');
      }, 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al restablecer';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password === registerData.confirmPassword && 
        registerData.fullName && registerData.email && registerData.password) {
      setAuthError('');
      setAuthLoading(true);
      try {
        await register({
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
        });
        navigate(from, { replace: true });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al registrar';
        setAuthError(message);
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    return () => {
      if (recoveryTimeoutRef.current) {
        window.clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Fondo con imagen de propiedad y overlay elegante */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000")',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Patrón sutil para textura */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255,255,255) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <header className="relative px-4 py-4 z-10">
        <button
          type="button"
          onClick={handleGoBack}
          className="text-white hover:text-yellow-300 transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      </header>

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center px-4 z-10">
        <div className="w-full max-w-md">
          {!showForgotPassword && !showRegister ? (
            <>
              {/* Logo/Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mb-4 shadow-lg">
                  <Home size={32} className="text-slate-900" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Bienes Raíces</h1>
                <p className="text-yellow-300 text-sm font-medium">Portal Inmobiliario</p>
              </div>

              {/* Login Card - Estilo translúcido moderno */}
              <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
                  <p className="text-white/70 text-sm mt-1">Accede a tu cuenta inmobiliaria</p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                  {/* Usuario Input */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Usuario o Email
                    </label>
                    <TextInput
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  {/* Contraseña Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Contraseña
                    </label>
                    <TextInput
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={!username || !password || authLoading}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      username && password && !authLoading
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <KeyRound size={20} />
                    <span>{authLoading ? 'Validando...' : 'Iniciar Sesión'}</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-white/5 to-transparent text-white/50">o</span>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-3 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="w-full text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                  >
                    Crear una nueva cuenta
                  </button>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-white/50 text-xs mt-8">
                © 2026 Bienes Raíces. Plataforma Inmobiliaria Profesional.
              </p>
            </>
          ) : showForgotPassword && !showRegister ? (
            <>
              {/* Forgot Password Card */}
              <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h2>
                <p className="text-white/70 text-sm mb-6">
                  Ingresa tu email registrado y te enviaremos las instrucciones para recuperar tu contraseña.
                </p>

                {authError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
                    {authError}
                  </div>
                )}

                {recoveryMessage && (
                  <div className="mb-6 p-4 bg-green-500/30 border border-green-400/50 rounded-lg backdrop-blur-sm">
                    <p className="text-green-200 text-sm font-medium">{recoveryMessage}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="recover-email"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Correo Electrónico
                    </label>
                    <TextInput
                      id="recover-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!forgotEmail || authLoading}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      forgotEmail && !authLoading
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {authLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </button>
                </form>

                {resetToken && (
                  <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        Token de recuperación
                      </label>
                      <TextInput
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        variant="unstyled"
                        className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        Nueva contraseña
                      </label>
                      <TextInput
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        variant="unstyled"
                        className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        Confirmar contraseña
                      </label>
                      <TextInput
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        variant="unstyled"
                        className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                      />
                      {newPassword &&
                        confirmNewPassword &&
                        newPassword !== confirmNewPassword && (
                          <p className="text-red-300 text-xs mt-2">
                            Las contraseñas no coinciden
                          </p>
                        )}
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !resetToken ||
                        !newPassword ||
                        newPassword !== confirmNewPassword ||
                        authLoading
                      }
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        resetToken &&
                        newPassword &&
                        newPassword === confirmNewPassword &&
                        !authLoading
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {authLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full mt-4 py-2 text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                >
                  Volver a Iniciar Sesión
                </button>
              </div>
            </>
          ) : showRegister && !showForgotPassword ? (
            <>
              {/* Register Card */}
              <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
                <p className="text-white/70 text-sm mb-6">
                  Regístrate para acceder a tu portal inmobiliario
                </p>

                {authError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                  {/* Nombre Completo */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Nombre Completo
                    </label>
                    <TextInput
                      id="fullName"
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      placeholder="Juan Pérez"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Correo Electrónico
                    </label>
                    <TextInput
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="ejemplo@correo.com"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Contraseña
                    </label>
                    <TextInput
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Confirmar Contraseña
                    </label>
                    <TextInput
                      id="confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      variant="unstyled"
                      className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 placeholder-gray-500"
                    />
                    {registerData.password && registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                      <p className="text-red-300 text-xs mt-2">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={
                      !registerData.fullName ||
                      !registerData.email ||
                      !registerData.password ||
                      !registerData.confirmPassword ||
                      registerData.password !== registerData.confirmPassword ||
                      authLoading
                    }
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      registerData.fullName &&
                      registerData.email &&
                      registerData.password &&
                      registerData.confirmPassword &&
                      registerData.password === registerData.confirmPassword &&
                      !authLoading
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Home size={20} />
                    <span>{authLoading ? 'Creando...' : 'Crear Cuenta'}</span>
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="w-full mt-4 py-2 text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
                >
                  Volver a Iniciar Sesión
                </button>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AccessPage;
