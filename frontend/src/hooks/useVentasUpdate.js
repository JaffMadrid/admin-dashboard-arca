import { useState } from 'react';

export const useVentasUpdate = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const triggerUpdate = () => setUpdateTrigger(prev => prev + 1);
  return { updateTrigger, triggerUpdate };
};