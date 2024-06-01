This is an updated version of the Demo app for the "Build Offline-Enabled Mobile Apps With Ionic and Couchbase Lite" talk at Couchbase Connect 2021. The app allows users to search and bookmark hotels using data loaded from a Couchbase Lite database.

This app is build on Capacitor 6 - and it's recommended you have a basic understanding of Capacitor and Ionic before running this app.

[Capacitor docs](https://capacitorjs.com/docs/basics/workflow)
[Ionic docs](https://ionicframework.com/docs/core-concepts/cross-platform)


## Features

* Data from a Couchbase Lite database: The database is embedded into the Android and iOS apps.

* Plugin is designed using Capacitor 

* UI components powered by Ionic Framework: search bar, bookmarks, icons, list items, and more.

* Bookmarked hotels: Saved in a Couchbase Lite database.

* Cross-platform: Create iOS and Android apps from the same codebase.

## Tech Details

- UI: [Ionic Framework 8](https://ionicframework.com) and [Angular 17](https://angular.io)
- Native runtime: [Capacitor 6](https://capacitorjs.com)
- Database: Couchbase Lite v3.x using [CBL-Ionic](https://cbl-ionic.dev)

## How to Run

Note: Installing and running this app, which uses Couchbase Lite Enterprise Edition, requires a license from Couchbase.

- Install the Ionic CLI: `npm install -g @ionic/cli`

### Setup cbl-ionic plugin

- Clone the following repos into the same folder

```shell
    git clone git@github.com:biozal/cbl-ionic-hotels-angular.git
    git clone --recurse-submodules git@github.com:Couchbase-Ecosystem/cbl-ionic.git
    cd cbl-ionic
    git submodule update --remote --recursive
```


- Setup cbl-ionic by installing the dependencies and building the plugin 
    ```shell
    npm install
    cd ios
    pod install
    cd ..
    npm run build
    cd ..
    ```

### Setup demo app 

- Install the dependencies for the demo app 
    ```shell
    cd cbl-ionic-hotels-angular
    npm install
    cd ios/App
    pod install
    cd ../..
    ```

- Build the app:
```shell 
  npm run build
  npx cap sync
 ```
- Run the app on your device from Xcode:
 ```shell
    npx cap open ios
 ```
 or 
 - Run via capacitor (recommended)
 **iOS**
 ```shell
   ionic capacitor run ios -l --external 
 ```
 **Android**
 ```shell
   ionic capacitor run android -l --external
 ```
 
