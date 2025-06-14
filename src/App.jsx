import {createSignal, onMount} from 'solid-js';
import styles from './App.module.css';
import * as auth0 from '@auth0/auth0-spa-js';

//"@auth0/auth0-spa-js": "^1.20.0",

function App() {
  //const AUTH0_DOMAIN = "auth0.dev.furniturebusiness.biz";
  //const AUTH0_CLIENT_ID = "6OIfQulnDUBXFZ19yL6sEHH7pGfv8MDX";
  //const redirectUri = "https://proxyman.debug:3000";
  //const scope = "openid profile"; //openid profile email
  //const audience = "https://proxyman.debug:3000";
  //const responseType = "code token id_token";
  //const responseMode = "form_post";

  /*
  const webAuth = new auth0.WebAuth({
    domain:       AUTH0_DOMAIN,
    clientID:     AUTH0_CLIENT_ID
  });
  */

  const APP_ClientID = "6OIfQulnDUBXFZ19yL6sEHH7pGfv8MDX"; //"qH0jAg3dWgEu0kIBabKKZmEP4Yb4mJQR";
  const APP_domain = "auth0.dev.furniturebusiness.biz"; //"dev-4k823wpk7p6qlxdz.us.auth0.com";
  const APP_apiAudience = "https://dev-4k823wpk7p6qlxdz.us.auth0.com/api/v2/"; //"https://test-api-a/";
  const APP_scope = "openid profile";

  let auth0Client = null;

  const configureClient = async () => {

    auth0Client = await auth0.createAuth0Client({
      domain: APP_domain,
      clientId: APP_ClientID,
      cacheLocation: "localstorage",
      //useRefreshTokens: true,
      useFormData: true
    });
  };

  //onMount(async () => {
  //  await configureClient();
  //});



  const loginHandler = async (e) => {
    const response = await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        //ui_locales: "de-DE",
        screen_hint: "login",
        //login_hint: "maslovskypk@gmail.com",
        scope: APP_scope,
        //audience: APP_apiAudience
      }
    });
    await isAuthenticatedHandler();
  };

  const logoutHandler = async (e) => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }});

    //await isAuthenticatedHandler();
  };

  const isAuthenticatedHandler = async (e) => {
    if (!auth0Client) {
      console.log("auth0Client is null");
      setIsAuth(false);
      return;
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    setIsAuth(isAuthenticated);
    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
      //const token = await auth0Client.getTokenSilently();
      
      auth0Client.getTokenSilently().then((token) => {
        console.log("token", token);
      });

      const user = await auth0Client.getUser();
      console.log("user", user);
    }
  };


  const [isAuth, setIsAuth] = createSignal(false);
  //window.onload = 
  onMount(async () => {
    await configureClient();

    await isAuthenticatedHandler();    
    if (isAuth()) {
      window.history.replaceState({}, document.title, window.location.pathname);    
      return;
    }

    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("state=") && (query.includes("code=") || query.includes("error="))) {

      try {
        // Process the login state
        await auth0Client.handleRedirectCallback();
      } catch(e) {
        console.log("Error", e);
      }

      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");

      await isAuthenticatedHandler(); 
    }
  });











  return (
    <div class={styles.App}>
      <button type="button" class="text-white bg-blue-800 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-4 me-12 mb-20 mt-10 ms-20
                                              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                                    disabled:bg-gray-400 
                                              "
        onClick={loginHandler} disabled={isAuth()}>
          Login
      </button>

      <button  id="login" type="button" class="btn-primary disabled:bg-gray-400"
        onClick={logoutHandler} disabled={!isAuth()}>
          Logout
      </button>

      <button type="button" class="text-white bg-blue-800 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-4 me-12 mb-20 mt-10 ms-20
                                              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                                              
                                              "
        onClick={isAuthenticatedHandler}>
          isAuthenticated
      </button>

    </div>
  );
}

export default App;
