import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import HomePage from './pages/HomePage';
import FavouritesPage from './pages/FavouritesPage';
import ShowDetails from './components/ShowDetails';
import ShowGenre from './components/ShowGenre';
import AudioPlayer from './components/AudioPlayer';

import { fetchShowDetails } from './utils/api';
import { useFavourites } from './context/FavouritesContext';

function ShowDetailsPage() {
  const [currentShow, setCurrentShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { addToFavourites } = useFavourites();

  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  useEffect(() => {
    async function loadShowDetails() {
      try {
        setIsLoading(true);
        const show = await fetchShowDetails(id);

        if (show) {
          setCurrentShow(show);
          setError(null);
        } else {
          setError(new Error('Show not found'));
        }
      } catch (err) {
        console.error('Error fetching show details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadShowDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading show details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-text">
          Error loading show: {error.message}
        </div>
      </div>
    );
  }

  return (
    <ShowDetails
      show={currentShow}
      onPlayEpisode={handlePlayEpisode}
      onAddToFavourites={addToFavourites}
    />
  );
}

function App() {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const handleCloseAudio = () => {
    setCurrentEpisode(null);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-title">ShowHive</Link>
            <div className="navbar-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/favourites" className="nav-link">Favourites</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:id" element={<ShowDetailsPage />} />
          <Route
            path="/genre/:genreId"
            element={({ match }) => <ShowGenre genreId={match.params.genreId} />}
          />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>

        {currentEpisode && (
          <AudioPlayer
            episode={currentEpisode}
            onClose={handleCloseAudio}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
