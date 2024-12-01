import React, { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FavouritesPage = () => {
  const { favourites, removeFromFavourites } = useFavourites();
  const [sortOption, setSortOption] = useState('default');

  const groupedFavourites = React.useMemo(() => {
    const grouped = favourites.reduce((acc, episode) => {
      const key = `${episode.showId}-${episode.season}`;
      if (!acc[key]) {
        acc[key] = {
          showTitle: episode.showTitle,
          season: episode.season,
          episodes: []
        };
      }
      acc[key].episodes.push(episode);
      return acc;
    }, {});

    // Sort episodes within each group
    Object.values(grouped).forEach((group) => {
      switch (sortOption) {
        case 'titleAsc':
          group.episodes.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '')
          );
          break;
        case 'titleDesc':
          group.episodes.sort((a, b) =>
            (b.title || '').localeCompare(a.title || '')
          );
          break;
        case 'recentlyAdded':
          group.episodes.sort(
            (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
          );
          break;
        default:
          group.episodes.sort((a, b) => a.episode - b.episode);
      }
    });

    // Sort groups by showTitle and season
    return Object.entries(grouped).sort((a, b) => {
      if ((a[1].showTitle || '').localeCompare(b[1].showTitle || '') === 0) {
        return a[1].season - b[1].season;
      }
      return (a[1].showTitle || '').localeCompare(b[1].showTitle || '');
    });
  }, [favourites, sortOption]);

  return (
    <div className="favourites-container">
      <h1 className="favourites-title">Favourite Shows</h1>

      <div className="favourites-sort">
        <label htmlFor="sort" className="favourites-sort-label">Sort episodes by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="favourites-sort-select"
        >
          <option value="default">Episode Number</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>

      {Object.keys(groupedFavourites).length === 0 ? (
        <p className="favourites-empty">No favourites yet</p>
      ) : (
        <div className="favourites-list">
          {groupedFavourites.map(([key, group]) => (
            <div key={key} className="show-group">
              <h2 className="show-title">{group.showTitle}</h2>
              <h3 className="season-title">Season {group.season}</h3>
              <div className="episode-list">
                {group.episodes.map((episode) => (
                  <div key={episode.uniqueId} className="favourites-item">
                    <div className="favourites-item-info">
                      <h4 className="episode-title">
                        Episode {episode.episode}: {episode.title || 'Untitled'}
                      </h4>
                      <p className="favourites-item-date">
                        Added: {new Date(episode.addedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromFavourites(episode.uniqueId)}
                      className="favourites-item-remove"
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
