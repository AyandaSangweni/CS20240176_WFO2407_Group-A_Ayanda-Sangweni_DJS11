import React, { useState, useEffect } from 'react';
import { fetchGenre } from '../utils/api';
import { genreMap } from '../utils/genreMap';
import ShowCard from './ShowCard';
import LoadingSpinner from './LoadingSpinner';

const ShowGenre = ({ genreId }) => {
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenre = async () => {
      setIsLoading(true);
      const genreData = await fetchGenre(genreId);
      setGenre({
        name: genreMap[genreId] || 'N/A',
        shows: genreData.shows,
      });
      setIsLoading(false);
    };

    loadGenre();
  }, [genreId]);

  if (isLoading) {
    return <LoadingSpinner text="Loading Genre..." />;
  }

  if (!genre) {
    return <div className="show-genre-error">No genre found</div>;
  }

  return (
    <div className="show-genre-container">
      <h1 className="show-genre-title">{genre.name} Podcasts</h1>
      <div className="show-genre-grid">
        {genre.shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default ShowGenre;