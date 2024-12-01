import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGenre } from '../utils/api';
import { genreMap } from '../utils/genreMap.js';

const ShowCard = ({ show }) => {
  const [genreNames, setGenreNames] = useState([]);

  useEffect(() => {
    const loadGenreNames = async () => {
      const genreData = await Promise.all(show.genres.map(fetchGenre));
      setGenreNames(genreData.map(genre => genreMap[genre.id] || 'N/A'));
    };
    loadGenreNames();
  }, [show.genres]);

  return (
    <Link to={`/show/${show.id}`} className="show-card">
      <img src={show.image} alt={show.title} className="show-card-image" />
      <div className="show-card-content">
        <h2 className="show-card-title">{show.title}</h2>
        <div className="show-card-details">
          <span>Seasons: {show.seasons.length}</span>
          <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
          <span>{genreNames.join(', ')}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;