import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsBadgeProps {
  count: number;
}

const NotificationsBadge: React.FC<NotificationsBadgeProps> = ({ count }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-orange-500/20"
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsBadge;
