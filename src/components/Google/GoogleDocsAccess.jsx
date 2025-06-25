import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/docs/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/documents.readonly";

function GoogleDocsAccess() {
  useEffect(() => {
    // Initialize the Google API client
    gapi.load("client:auth2", initClient);
  }, []);

  // Initialize the API client
  const initClient = () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      console.log("API client initialized");
    }).catch((error) => {
      console.error("Error initializing client", error);
    });
  };

  // Sign in function
  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      console.log("Signed in successfully!");
      getDoc();
    }).catch((error) => {
      console.error("Error signing in", error);
    });
  };

  // Function to retrieve a Google Doc by ID
  const getDoc = async () => {
    const docId = 'YOUR_DOCUMENT_ID';
    try {
      const response = await gapi.client.docs.documents.get({
        documentId: docId,
      });
      console.log(response);
    } catch (error) {
      console.error("Error getting document", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}

export default GoogleDocsAccess;
