// RIVUS P40: SessionGuard — wraps dashboard children with idle/session timeout
'use client';

import { useSessionTimeout } from '@/lib/hooks/useSessionTimeout';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  useSessionTimeout();
  return <>{children}</>;
}
