if (import.meta.env.MODE === 'production') {
    for (const method in console) {
      if (typeof console[method] === 'function') {
        console[method] = () => {};
      }
    }
  }