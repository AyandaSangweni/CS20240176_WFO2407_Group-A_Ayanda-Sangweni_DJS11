import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useFavourites } from '../context/FavouritesContext';
import LoadingSpinner from './LoadingSpinner';  // Add this line to import the spinner

const ShowDetails = ({ show }) => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show?.seasons?.length > 0) {
      setSelectedSeason(show.seasons[0]);
      setLoading(false);  // Once show data is ready, stop loading
    }
  }, [show]);

  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  const handleClosePlayer = () => {
    setCurrentEpisode(null);
  };

  const toggleFavourite = (episode) => {
    const uniqueId = `${show.id}-${episode.episode}`;
    const isFavourite = favourites.some((fav) => fav.uniqueId === uniqueId);

    if (isFavourite) {
      removeFromFavourites(uniqueId);
    } else {
      addToFavourites(episode, show.id, show.title);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading show details..." />;  // Show the spinner when loading
  }

  if (!show) {
    return <div>Show not found</div>;  // In case show is null/undefined
  }

  return (
    <div className="show-details-container">
      <div className="show-header">
        <img src={show.image} alt={show.title} className="show-image" />
        <div>
          <h1 className="show-title">{show.title}</h1>
          <p>{show.description}</p>
        </div>
      </div>

      <div className="seasons-container">
        <h2 className="seasons-heading">Seasons</h2>
        <div className="season-buttons">
          {show.seasons.map((season, index) => (
            <button
              key={index}
              onClick={() => setSelectedSeason(season)}
              className={`season-button ${selectedSeason === season ? 'selected' : ''}`}
            >
              Season {index + 1} ({season.episodes.length})
            </button>
          ))}
        </div>

        {selectedSeason && (
          <div>
            <h3 className="episodes-heading">Episodes</h3>
            {selectedSeason.episodes.map((episode) => {
              const uniqueId = `${show.id}-${episode.episode}`;
              const isFavourite = favourites.some((fav) => fav.uniqueId === uniqueId);

              return (
                <div key={episode.episode} className="episode-item">
                  <span>{episode.title}</span>
                  <div className="episode-buttons">
                    <button onClick={() => handlePlayEpisode(episode)} className="play-button">
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                    <button onClick={() => toggleFavourite(episode)} className="favourite-button">
                      <FontAwesomeIcon icon={isFavourite ? faStar : faStarRegular} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {currentEpisode && (
        <AudioPlayer episode={currentEpisode} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default ShowDetails;
