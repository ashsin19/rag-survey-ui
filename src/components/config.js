const loadRuntimeConfig = async () => {
    try {
      const response = await fetch("https://storage.googleapis.com/rag-app-deployments_cloudbuild/runtime-config.json");
      if (!response.ok) throw new Error("Failed to load runtime config");
      const config = await response.json();
      console.log("Loaded runtime config:", config);
      return config;
    } catch (error) {
      console.error("Error loading runtime config:", error);
      return { REACT_APP_BACKEND_URL: "https://python-rag-app-369543119888.us-central1.run.app" }; // Fallback
    }
  };
  
  export default loadRuntimeConfig;
  