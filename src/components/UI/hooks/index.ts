import { useState, useEffect, RefObject, useMemo } from 'react';

function getIsMobile() {
  // definition of mobile width, this is the trigger to switch
  return window.innerWidth<800
}

const screenWidthOffset = 36

function getScreenWidth() {
  return window.innerWidth - screenWidthOffset
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    function handleResize() {
        setIsMobile(getIsMobile());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function useScreenWidth() {
  const [width, setWidth] = useState(getScreenWidth());

  useEffect(() => {
    function handleResize2() {
      setWidth(getScreenWidth());
    }

    window.addEventListener('resize', handleResize2);
    return () => window.removeEventListener('resize', handleResize2);
  }, []);

  return width;
}

export { useIsMobile, useScreenWidth, getScreenWidth, getIsMobile, screenWidthOffset }


export const useIsOnScreen = (ref: RefObject<HTMLElement>) => {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  ), [ref])


  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}