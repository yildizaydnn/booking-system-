import { useState } from 'react';
import { Layout } from './components/layout';
import { NotificationContainer, ConfirmDialog } from './components/ui';

// Mock user — will be replaced with auth store later
const mockUser = {
  firstName: 'Aydin',
  lastName: 'Yildiz',
  email: 'aydin@slotify.com',
  role: 'BUSINESS_OWNER',
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <>
      <Layout
        activePage={activePage}
        onNavigate={setActivePage}
        role={mockUser.role}
        user={mockUser}
      >
        <div className="flex items-center justify-center h-96 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-400 text-lg">
            {activePage} sayfası buraya gelecek
          </p>
        </div>
      </Layout>

      <NotificationContainer />
      <ConfirmDialog />
    </>
  );
}

export default App;
