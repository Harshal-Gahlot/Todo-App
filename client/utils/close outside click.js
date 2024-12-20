import { useEffect } from "react";

export default function useClosePopupOutside(popupRef, onOutsideClick, onOutsideClickArg) {
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (!popupRef.current.contains(event.target)) {
                onOutsideClick(_ => onOutsideClickArg);
            };
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, onOutsideClick]);

    return null;
}