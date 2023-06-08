import { useEffect } from "react";

const useClickOutside = (ref: any, callbackFn: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (ref.current && !ref.current.contains(event.target)) {
        callbackFn();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callbackFn]);
};

export default useClickOutside;
