// src/2048/loadResources.js
export const loadResources = (urls) => {
    return Promise.all(
      urls.map((url) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.async = true;
          script.type = 'module';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      })
    );
  };
  
  export const loadCss = (href) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };
  