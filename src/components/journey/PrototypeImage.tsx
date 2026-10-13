import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/** Handle asset failures that occur before React hydration as well as afterwards. */
export function PrototypeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const image = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (image.current?.complete && !image.current.naturalWidth) setMissing(true);
  }, []);
  if (missing)
    return (
      <div className={`${props.className ?? ""} journey-image-unavailable`}>
        <span>Fotografia aerea da inserire</span>
      </div>
    );
  return <img {...props} ref={image} onError={() => setMissing(true)} />;
}
