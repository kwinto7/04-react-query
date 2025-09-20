import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import css from './MovieModal.module.css'
import type { Movie } from '../../types/movie'


interface MovieModalProps {
    movie: Movie
    onClose: () => void
}


const IMG_ORIGINAL = (p: string | null) => p ? `https://image.tmdb.org/t/p/original${p}` : ''


export default function MovieModal({ movie, onClose }: MovieModalProps){
// Закриття по ESC
    const onEsc = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
    }, [onClose])


// Заборона скролу body та слухач ESC
useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)
    return () => {
        window.removeEventListener('keydown', onEsc)
        document.body.style.overflow = prev
    }
}, [onEsc])


// Клік по бекдропу
const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose()
}


const node = (
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdropClick}>
        <div className={css.modal}>
            <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>&times;</button>
            {movie.backdrop_path ? (
                <img src={IMG_ORIGINAL(movie.backdrop_path)} alt={movie.title} className={css.image} />
            ) : null}
            <div className={css.content}>
                <h2>{movie.title}</h2>
                <p>{movie.overview || '—'}</p>
                <p><strong>Release Date:</strong> {movie.release_date || '—'}</p>
                <p><strong>Rating:</strong> {typeof movie.vote_average === 'number' ? `${movie.vote_average}/10` : '—'}</p>
            </div>
        </div>
    </div>
)


    return createPortal(node, document.body)
}