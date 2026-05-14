'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, Network, Activity, ArrowRight, ShieldCheck, Box, ExternalLink } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/items/')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setProductos(data.slice(-4).reverse());
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Activity className={styles.logoIcon} /> 
          <span>EVM Pro</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.loginBtn}>Iniciar Sesión</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>v2.0 Premium Edition</div>
          <h1 className={styles.title}>
            Gestión Clínica <br/>
            <span className={styles.highlight}>Inteligente</span>
          </h1>
          <p className={styles.subtitle}>
            El ecosistema definitivo para potenciar la administración, el control de inventarios y la distribución multisucursal de tu clínica.
          </p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryBtn}>
              Acceder al Portal <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        <div className={styles.heroGraphic}>
          <div className={styles.glowCircle}></div>
          <div className={styles.glassCardWrapper}>
            <div className={styles.glassCard}>
              <div className={styles.mockupHeader}>
                <span className={styles.dot} style={{background: '#ff5f56'}}></span>
                <span className={styles.dot} style={{background: '#ffbd2e'}}></span>
                <span className={styles.dot} style={{background: '#27c93f'}}></span>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupSidebar}>
                  <div className={styles.mockupSkeleton} style={{width: '100%', height: '20px', marginBottom: '1rem'}}></div>
                  <div className={styles.mockupSkeleton} style={{width: '80%', height: '10px', marginBottom: '0.5rem'}}></div>
                  <div className={styles.mockupSkeleton} style={{width: '60%', height: '10px', marginBottom: '0.5rem'}}></div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupChart}>
                     <div className={styles.bar} style={{height: '40%'}}></div>
                     <div className={styles.bar} style={{height: '70%'}}></div>
                     <div className={styles.bar} style={{height: '50%'}}></div>
                     <div className={styles.bar} style={{height: '90%'}}></div>
                  </div>
                  <div className={styles.mockupList}>
                     <div className={styles.mockupListItem}></div>
                     <div className={styles.mockupListItem}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className={`${styles.floatingElement} ${styles.float1}`}><ShieldCheck size={24} color="#4ade80" /></div>
            <div className={`${styles.floatingElement} ${styles.float2}`}><Package size={24} color="#60a5fa" /></div>
          </div>
        </div>
      </header>

      {/* Metrics Banner */}
      <div className={styles.metricsBanner}>
        <div className={styles.metric}>
          <span className={styles.metricValue}>99.9%</span>
          <span className={styles.metricLabel}>Uptime Garantizado</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricValue}>+10k</span>
          <span className={styles.metricLabel}>Items Gestionados</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricValue}>Real-Time</span>
          <span className={styles.metricLabel}>Sincronización</span>
        </div>
      </div>

      {/* Servicios */}
      <section id="servicios" className={styles.services}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Arquitectura de Nivel Empresarial</h2>
          <p className={styles.sectionSubtitle}>Diseñado para soportar operaciones clínicas críticas con precisión milimétrica.</p>
        </div>
        
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrapper}>
              <Box size={28} className={styles.serviceIcon} />
            </div>
            <h3>Inventario Centralizado</h3>
            <p>Control exacto de todos tus productos médicos, lotes y stock crítico en tiempo real a nivel global.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrapper}>
              <Network size={28} className={styles.serviceIcon} />
            </div>
            <h3>Escalabilidad Multisucursal</h3>
            <p>Monitorea y transfiere recursos de forma inteligente entre diferentes clínicas o sucursales.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrapper}>
              <Activity size={28} className={styles.serviceIcon} />
            </div>
            <h3>Operaciones Ágiles</h3>
            <p>Registra entradas, salidas y mantenedores de manera fluida y con validaciones estrictas.</p>
          </div>
        </div>
      </section>

      {/* Últimos Productos */}
      <section className={styles.products}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Módulo de Productos</h2>
          <p className={styles.sectionSubtitle}>Explora el catálogo sincronizado en tiempo real desde la base de datos.</p>
        </div>

        <div className={styles.productsGrid}>
          {productos.length > 0 ? productos.map((prod) => (
            <div key={prod.id} className={styles.productCard}>
              <div className={styles.productImgContainer}>
                {prod.fotografia ? (
                  <img src={prod.fotografia} alt={prod.descripcion_corta} className={styles.productImg} />
                ) : (
                  <div className={styles.noImg}><Package size={32} /><br/>Sin Foto</div>
                )}
                <div className={styles.productOverlay}>
                  <span className={styles.overlayCode}>{prod.codigo_actual}</span>
                </div>
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productBrand}>{prod.marca_nombre || 'Genérico'}</span>
                <h3 className={styles.productName}>{prod.descripcion_corta}</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productStatus}>
                    <span className={styles.statusDot}></span>
                    {prod.estado}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className={styles.emptyState}>
              <Package size={48} color="#475569" style={{marginBottom: '1rem'}} />
              <p>Aún no hay productos en la vitrina.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>
            <Activity size={20} color="#3b82f6" /> 
            <span>EVM Pro</span>
          </div>
          <p>© 2026 Sistema Clínico EvolucionMedic. Desarrollado para Shark Tank Incubator.</p>
        </div>
      </footer>
    </div>
  );
}
