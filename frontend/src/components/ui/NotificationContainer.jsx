import useNotificationStore from '../../store/useNotificationStore';
import Alert from './Alert';

export default function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="animate-[slideIn_0.2s_ease-out]"
        >
          <Alert
            type={n.type}
            message={n.message}
            onClose={() => removeNotification(n.id)}
          />
        </div>
      ))}
    </div>
  );
}
