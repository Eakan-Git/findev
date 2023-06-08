/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useEffect } from "react";

const useDontTriggerParentWhenClickChild = (ref: any, childrenRef: any, callbackFn: () => void) => {
  useEffect(() => {
    const handleClickChildren = (event: any) => {
      if (Array.isArray(childrenRef.current)) {
        if (
          ref.current &&
          ref.current.contains(event.target) &&
          childrenRef.current.every((child: any) => !child.contains(event.target))
        ) {
          callbackFn();
        }
      } else {
        if (
          ref.current &&
          ref.current.contains(event.target) &&
          childrenRef.current &&
          !childrenRef.current.contains(event.target)
        ) {
          callbackFn();
        }
      }
    };

    document.addEventListener("mousedown", handleClickChildren);
    return () => {
      document.removeEventListener("mousedown", handleClickChildren);
    };
  }, [ref, childrenRef, callbackFn]);
};

export default useDontTriggerParentWhenClickChild;
