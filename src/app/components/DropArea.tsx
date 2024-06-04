import React from 'react'

interface DropAreaProps {
    id: string
    status: string
}

function DropArea({id, status}: DropAreaProps) {
  return (
    <div data-column={status} data-id={id} className="my-2 h-0.5 w-full bg-cyan-400 rounded opacity-0">
      
    </div>
  )
}

export default DropArea
