import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('podcastFavourites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to read favourites from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('podcastFavourites', JSON.stringify(favourites));
    } catch (error) {
      console.error('Failed to save favourites to localStorage:', error);
    }
  }, [favourites]);

  const addToFavourites = (episode, showId, showTitle) => {
    const uniqueId = `${showId}-${episode.episode}`;
    const existingFavourite = favourites.find((fav) => fav.uniqueId === uniqueId);

    if (!existingFavourite) {
      setFavourites((prev) => [
        ...prev,
        {
          ...episode,
          uniqueId,
          showId,
          showTitle,
          isFavourited: true,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const removeFromFavourites = (uniqueId) => {
    setFavourites((prev) => prev.filter((fav) => fav.uniqueId !== uniqueId));
  };

  const getSortedFavourites = (sortType) => {
    return useMemo(() => {
      switch (sortType) {
        case 'titleAsc':
          return [...favourites].sort((a, b) => a.title.localeCompare(b.title));
        case 'titleDesc':
          return [...favourites].sort((a, b) => b.title.localeCompare(a.title));
        case 'recentlyAdded':
          return [...favourites].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        case 'show':
          return [...favourites].sort((a, b) => a.showTitle.localeCompare(b.showTitle));
        default:
          return favourites;
      }
    }, [favourites, sortType]);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        getSortedFavourites,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
