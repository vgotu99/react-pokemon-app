import React from 'react'
import DamageRelations from './DamageRelations'
import { useRef } from 'react'
import { useOnclickOutsideOfModal } from '../hooks/useOnclickOutsideOfModal'

const DamageModal = ({setIsModalOpen, damages}) => {
  const ref = useRef()

  useOnclickOutsideOfModal(ref, () => setIsModalOpen(false))

  return (
    <div  className='flex items-center justify-center z-40 fixed left-0 top-0 w-full h-full bg-gray-800/60'>
      <div ref={ref} className='modal bg-white rounded-lg w-1/2 mb-28'>
        <div className='flex flex-col items-start p-6 '>
          <div className='flex items-center w-full justify-between'>
            <div className='text-gray-900 font-medium text-lg'>
              데미지 관계
            </div>
            <span onClick={() => setIsModalOpen(false)} className='text-gray-900 text-lg cursor-pointer'>
              ❌
            </span>
          </div>
          <DamageRelations damages={damages}/>
        </div>
      </div>
    </div>
  )
}

export default DamageModal