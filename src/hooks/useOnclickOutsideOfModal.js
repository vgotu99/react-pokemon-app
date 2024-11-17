import { useEffect } from "react"

export const useOnclickOutsideOfModal = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if(!ref.current || ref.current.contains(e.target)) {
        return 
      }
  
      handler()
    }

    document.addEventListener('mousedown', listener)
    
    return () => {
      document.addEventListener('mousedown', listener)
    }
  }, [ref, handler])
  
}