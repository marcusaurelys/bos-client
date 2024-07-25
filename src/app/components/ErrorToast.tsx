'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ClientToastProps {
  errorMessage: string | null;
}

const ClientToast: React.FC<ClientToastProps> = ({ errorMessage }) => {
  const {toast} = useToast();

  useEffect(() => {
    if (errorMessage) {
      toast({
        variant: 'destructive',
        title: 'Error',
        duration: 5000,
        description: errorMessage,
      });
    }
  }, [errorMessage, toast]);

  return null
};

export default ClientToast;
