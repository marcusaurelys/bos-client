'use client'
import React, { useState, useEffect } from 'react'
import { useDataContext } from '@/contexts/DataContext'
import Column from './Column'
import Filter from './Filter'
    
export default function Board() {
  return (
    <div className="flex justify-center items-start w-full h-full">
      <div className="flex flex-col w-fit justify-center">
        <div className="z-10 relative my-3" >
          <Filter/>
        </div>
        <div className="flex gap-12 flex-wrap"> 
          <Column title="Pending" status="pending"/>
          <Column title="Open" status="open"/>
          <Column title="Closed" status="closed"/>
        </div>
      </div>   
    </div>
  )
}
