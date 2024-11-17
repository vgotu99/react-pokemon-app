import { useEffect } from "react"

export const useOnclickOutsideOfModal = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if(!ref.current || ref.current.contains(e.target)) {
        return 
      }
  
      handler()
    }

    document.addEventListener('click', listener)
    
    return () => {
      document.addEventListener('click', listener)
    }
  }, [ref, handler])
  
}