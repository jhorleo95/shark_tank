import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdateSuccess: () => void;
}

export default function ProfileModal({ isOpen, onClose, user, onUpdateSuccess }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<any>({});
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_password: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) setFormData({
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || ''
    });
    setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    setError('');
    setSuccess('');
    setActiveTab('profile');
  }, [user, isOpen]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess('Perfil actualizado exitosamente.');
        onUpdateSuccess();
      } else {
        setError('Error al actualizar el perfil. Verifica los datos.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return setError('Las nuevas contraseñas no coinciden.');
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: passwords.old_password,
          new_password: passwords.new_password
        })
      });
      if (res.ok) {
        setSuccess('Contraseña cambiada. Cerrando sesión...');
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.old_password ? data.old_password[0] : 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem'
  };

  const labelStyle = { fontSize: '0.9rem', color: '#94a3b8' };
  const btnStyle = { background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '2px solid transparent' };
  const activeBtnStyle = { ...btnStyle, color: 'var(--primary)', borderBottom: '2px solid var(--primary)', fontWeight: 600 };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil">
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
        <button style={activeTab === 'profile' ? activeBtnStyle : btnStyle} onClick={() => {setActiveTab('profile'); setError(''); setSuccess('');}}>Datos Personales</button>
        <button style={activeTab === 'security' ? activeBtnStyle : btnStyle} onClick={() => {setActiveTab('security'); setError(''); setSuccess('');}}>Seguridad</button>
      </div>

      {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ background: 'rgba(39, 201, 63, 0.1)', color: '#4ade80', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nombre de Usuario</label>
            <input required style={inputStyle} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input style={inputStyle} value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input style={inputStyle} value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Correo Electrónico</label>
            <input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <button disabled={loading} type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Contraseña Actual</label>
            <input required type="password" style={inputStyle} value={passwords.old_password} onChange={e => setPasswords({...passwords, old_password: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Nueva Contraseña</label>
            <input required type="password" style={inputStyle} value={passwords.new_password} onChange={e => setPasswords({...passwords, new_password: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Confirmar Nueva Contraseña</label>
            <input required type="password" style={inputStyle} value={passwords.confirm_password} onChange={e => setPasswords({...passwords, confirm_password: e.target.value})} />
          </div>
          <button disabled={loading} type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      )}
    </Modal>
  );
}
