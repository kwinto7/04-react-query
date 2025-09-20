import styles from './MovieGrid.module.css'
import type { Movie } from '../../types/movie'

interface MovieGridProps {
  movies: Movie[]
  onSelect: (movie: Movie) => void   
}

const IMG = (p: string | null) => (p ? `https://image.tmdb.org/t/p/w342${p}` : '')

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        {movies.map((m) => (
          <article key={m.id} className={styles.card}>
            {m.poster_path ? (
              <img
                className={styles.poster}
                src={IMG(m.poster_path)}
                alt={m.title}
                loading="lazy"
                onClick={() => onSelect(m)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(m)
                  }
                }}
              />
            ) : (
              <div
                className={styles.poster}
                aria-label="No poster"
                onClick={() => onSelect(m)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(m)
                  }
                }}
              />
            )}
            <div className={styles.body}>
              <h3 className={styles.title}>{m.title}</h3>
              <p className={styles.meta}>{m.release_date || '—'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}