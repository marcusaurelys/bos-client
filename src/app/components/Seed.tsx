'use client'

import { Button } from '@/components/ui/button'
import { seed_tickets_collection } from '@/db/chat'
export default function Seed() {
  
  const handleClick = async () => {
    await seed_tickets_collection()
  }
  
  return (
    <>
      <Button onClick={handleClick}>
        {"It's time to seed"}
      </Button>
    </>
  );
};
