export const sortShowsAlphabetically = (shows, ascending = true) => {
    return [...shows].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return ascending ? comparison : -comparison;
    });
  };
  
  export const sortShowsByUpdateDate = (shows, mostRecent = true) => {
    return [...shows].sort((a, b) => {
      const dateA = new Date(a.updated);
      const dateB = new Date(b.updated);
      return mostRecent ? dateB - dateA : dateA - dateB;
    });
  };