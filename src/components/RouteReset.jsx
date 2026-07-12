import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetVideo } from '../store/videoSlice.js'

export default function RouteReset() {
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!location.pathname.startsWith('/processing') &&
            !location.pathname.startsWith('/results')) {
            dispatch(resetVideo())
        }
    }, [location.pathname, dispatch])

    return null
}