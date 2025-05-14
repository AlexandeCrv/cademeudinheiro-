"use client";

import { useState, useEffect } from "react";
import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"; // Ajuste aqui
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationSystem({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!token) return;

    // This would be replaced with an actual API call in production
    const fetchNotifications = async () => {
      try {
        // Simulating API response with mock data
        const mockNotifications = [
          {
            id: "1",
            title: "Gasto Excessivo",
            message:
              'Seus gastos na categoria "Alimentação" excederam 20% do orçamento mensal.',
            type: "warning",
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: false,
          },
          {
            id: "2",
            title: "Meta Próxima",
            message: 'Sua meta "Fundo de Emergência" está a 5 dias do prazo final.',
            type: "info",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: false,
          },
          {
            id: "3",
            title: "Entrada Significativa",
            message:
              "Parabéns! Você recebeu uma entrada de R$ 2.500,00, 25% acima da média mensal.",
            type: "success",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            read: true,
          },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));

    // In a real app, you would make an API call here to update the read status
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    setUnreadCount(0);

    // In a real app, you would make an API call here to update all read statuses
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "agora";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min atrás`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d atrás`;
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      case "info":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-gray-900 border border-purple-900/50 p-0 shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="font-medium text-white">Notificações</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">Nenhuma notificação</div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors",
                    !notification.read && "bg-purple-900/10"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4
                          className={cn(
                            "text-sm font-medium",
                            !notification.read ? "text-white" : "text-gray-300"
                          )}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
