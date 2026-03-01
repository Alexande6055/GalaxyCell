import { AlertCircle, Lock, RefreshCw, Shield, User as UserIcon } from 'lucide-react'
import {  useState } from 'react'
import { FontStyle } from '../utils/Data'
import logo from '../assets/logo.png'
import { useAuth } from '../contexts/AuthContext'
import type { UserBack } from '../utils/DataTypeBackEnd'

interface LoginPageProps {
    onLogin?: (user: UserBack) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const userBack = await login(username, password)
            if (userBack) {
                onLogin?.(userBack)
            } else {
                setError('Credenciales incorrectas. Intente nuevamente.')
            }
        } catch (e) {
            setError('Error en el inicio de sesión. Intente más tarde.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0D1B4F 0%, #1A237E 40%, #0D3B7A 100%)" }}>
            <FontStyle />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute rounded-full opacity-10" style={{
                        width: `${100 + i * 80}px`, height: `${100 + i * 80}px`,
                        background: i % 2 === 0 ? "#007BFF" : "#00E5FF",
                        top: `${10 + i * 15}%`, left: `${5 + i * 16}%`,
                        filter: "blur(40px)", transform: "translateZ(0)"
                    }} />
                ))}
            </div>
            <div className="relative z-10 w-full max-w-sm mx-4">
                <div className="glass rounded-3xl p-8 fade-in">
                    <div className="text-center mb-8">
                        <div className="w-54 h-54 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'transparent' }}>
                            <img src={logo} alt="Galaxy Cell logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="font-display font-bold text-3xl text-white tracking-tight">Galaxy Cell</h1>
                        <p className="text-blue-200 text-sm mt-1">Sistema de Gestión Administrativa</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-blue-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">Usuario</label>
                            <div className="relative">
                                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                                <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/60 text-sm transition-all"
                                    placeholder="Ingresa tu usuario" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-blue-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">Contraseña</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/60 text-sm transition-all"
                                    placeholder="••••••••" />
                            </div>
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2.5">
                                <AlertCircle size={14} className="text-red-400" />
                                <p className="text-red-300 text-xs">{error}</p>
                            </div>
                        )}
                        <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold btn-primary transition-all text-sm mt-2 disabled:opacity-60">
                            {loading ? <RefreshCw size={16} className="inline animate-spin mr-2" /> : null}
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/10">
                        <p className="text-blue-300 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                            <Shield size={12} /> Acceso Restringido y Auditado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};