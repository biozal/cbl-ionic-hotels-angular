This is an updated version of the Demo app for the "Build Offline-Enabled Mobile Apps With Ionic and Couchbase Lite" talk at Couchbase Connect 2021. The app allows users to search and bookmark hotels using data loaded from a Couchbase Lite database.


## Features

* Data from a Couchbase Lite database: The database is embedded into the Android and iOS apps.

* UI components powered by Ionic Framework: search bar, bookmarks, icons, list items, and more.

* Bookmarked hotels: Saved in a Couchbase Lite database.

* Cross-platform: Create iOS and Android apps from the same codebase.

## Tech Details

- UI: [Ionic Framework 7](https://ionicframework.com) and [Angular 12](https://angular.io)
- Native runtime: [Capacitor 5](https://capacitorjs.com)
- Database: Couchbase Lite v3.x using [CBL-Ionic](https://cbl-ionic.dev)

## How to Run

Note: Installing and running this app, which uses Couchbase Lite Enterprise Edition, requires a license from Couchbase.

- Install the Ionic CLI: `npm install -g @ionic/cli`

### Setup cbl-ionic plugin

- Clone the following repos into the same folder
	- This repository
	- https://github.com/Couchbase-Ecosystem/cblite-js
	- https://github.com/Couchbase-Ecosystem/cbl-js-swift/
	- https://github.com/Couchbase-Ecosystem/cbl-ionic
- Setup cblite-js by installing dependencies for both the cblite and cblite-tests npm packages.  Run the following commands from the root of the cblite-js repo:
    ```shell
    cd cblite-js
    cd cblite
    npm install
    npm run build
    cd ../cblite-tests
    npm install
    npm run build
    cd ../..
    ```
- Install the dependencies on cbl-ionic plugin
    ```shell
    cd cbl-ionic
    npm install
    ```
- Install SwiftLint if you're on macOS.
    ```shell
    brew install swiftlint
    ```	
- Install CocoaPods for cbl-ionic plugin 
    ```shell
    cd ios
    pod install 
    cd ..
	```
- Run npm build to build Javascript - from project root.
    ```shell
    npm run build
    npm run verify
    ```
### Setup the demo app
- change directory into this repo

- Install the dependencies: 
	```shell
	npm install
	```
- Install Cocoapods into iOS 
   ```shell
    cd ios
	  cd App
    pod install 
    cd ../..
	```
- Build the app:
```shell 
  npm build
  npx cap sync
 ```
- Run the app on your device:
 ```shell
 npx cap open ios
 ```
