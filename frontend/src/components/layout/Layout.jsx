import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  dashboard: 'Dashboard',
  appointments: 'Randevular',
  services: 'Hizmetler',
  'working-hours': 'Çalışma Saatleri',
  settings: 'İşletme Bilgileri',
  businesses: 'İşletmeler',
  users: 'Kullanıcılar',
  statistics: 'İstatistikler',
};

export default function Layout({ children, activePage, onNavigate, role, user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} activePage={activePage} onNavigate={onNavigate} />

      <div className="ml-60">
        <Topbar title={pageTitles[activePage] || 'Dashboard'} user={user} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
