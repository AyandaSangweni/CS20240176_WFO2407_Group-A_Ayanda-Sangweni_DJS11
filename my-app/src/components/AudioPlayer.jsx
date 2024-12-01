import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTimes } from '@fortawesome/free-solid-svg-icons';


const AudioPlayer = ({ episode, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.play();

    const updateProgress = () => {
      const progressPercent = Math.round((audio.currentTime / audio.duration) * 100);
      setProgress(progressPercent);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [episode]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={episode.file} onEnded={onClose} />
      <div className="audio-player-info">
        <div className="audio-player-title">{episode.title}</div>
        <div className="audio-player-progress-bar">
          <div className="audio-player-progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="audio-player-controls">
        <button onClick={togglePlay} className="audio-player-btn audio-player-toggle">
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button onClick={onClose} className="audio-player-btn audio-player-close">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
