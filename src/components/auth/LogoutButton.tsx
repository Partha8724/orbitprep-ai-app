'use client';

import { logoutAction } from '@/app/auth-actions';

export function LogoutButton() {
  return (
    <button
      onClick={() => logoutAction()}
      className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
    >
      Logout
    </button>
  );
}
