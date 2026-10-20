import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

const FALLBACK_SRC = "/images/storia-lavoro.svg";

/** Handle asset failures that occur before React hydration as well as afterwards. */
export function PrototypeImage({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const image = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_SRC);
  const [missing, setMissing] = useState(false);

  const handleFail = () => {
    if (currentSrc !== FALLBACK_SRC) {
      setCurrentSrc(FALLBACK_SRC);
    } else {
      setMissing(true);
    }
  };

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_SRC);
    setMissing(false);
  }, [src]);

  useEffect(() => {
    if (image.current?.complete && !image.current.naturalWidth) {
      handleFail();
    }
  }, [currentSrc]);

  if (missing) {
    return <div className={`${props.className ?? ""} journey-image-unavailable`} aria-hidden="true" />;
  }

  return <img {...props} ref={image} src={currentSrc} alt={alt ?? ""} onError={handleFail} />;
}
