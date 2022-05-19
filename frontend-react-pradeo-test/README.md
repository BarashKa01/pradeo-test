1- npm install
2 - npm run start

Front address : localhost:3000

FOLDERS :

AppStore = Contains components of the user's apps list and a app component
Users = Contains a users list, and an upload dashboard for applications

Workflow :

We can select a user, upload some files, open the application store, and wait for result status.
In the same time, it's possible to modify name and comment of the app, or deleting it.
All actions/status update is refreshed by the front-end. A request is running each 2 seconds to update the application list (AppStore component) editing and deleting is handled by the AppComponent.


