import { useEffect } from "react"


export const useCursorHover = (hovered: boolean) => {

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = 'pointer'
        } else {
            document.body.style.cursor = 'default'
        }
    },[hovered])

}