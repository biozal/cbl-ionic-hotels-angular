import { Injectable } from '@angular/core';
/*
old import for couchbase-lite
import {
  Database,
  DatabaseConfiguration,
  MutableDocument
} from '@ionic-enterprise/couchbase-lite';
*/

import {
  CapacitorEngine,
  Database,
  FileSystem,
  DatabaseConfiguration,
  Collection,
  MutableDocument,
  LogDomain,
  LogLevel } from 'cbl-ionic';

import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: Database;

  //added collection for default collection support
  private collection: Collection;

  private DOC_TYPE_HOTEL = 'hotel';
  private DOC_TYPE_BOOKMARKED_HOTELS = 'bookmarked_hotels';
  private bookmarkDocument: MutableDocument;

  constructor() {
    //load the engine
    const engine = new CapacitorEngine();
  }

  public async getHotels(): Promise<Hotel[]> {
    await this.initializeDatabase();

    return await this.retrieveHotelList();
  }

  private async initializeDatabase() {
    await this.seedInitialData();

    this.bookmarkDocument = await this.findOrCreateBookmarkDocument();
  }

  private async seedInitialData() {
    /* Note about encryption: In a real-world app, the encryption key should not be hardcoded like it is here.
     One strategy is to auto generate a unique encryption key per user on initial app load, then store it securely in the device's keychain for later retrieval.
     Ionic's Identity Vault (https://ionic.io/docs/identity-vault) plugin is an option. Using IV’s storage API, you can ensure that the
     key cannot be read or accessed without the user being authenticated first. */

    //added code to get proper path to save database per platform
    const fileSystem = new FileSystem();
    const directoryPath = await fileSystem.getDefaultPath();

    const dc = new DatabaseConfiguration();

    //added setting the directory
    dc.setDirectory(directoryPath);

    dc.setEncryptionKey('8e31f8f6-60bd-482a-9c70-69855dd02c39');
    this.database = new Database("travel", dc);
    //setup logging
    this.database.setLogLevel(LogDomain.ALL, LogLevel.VERBOSE);

    await this.database.open();

    //added collection since we save to collections now, not the database
    //for simplicity, we are using the default collection which is
    //the scope: _default and collection: _default
    this.collection = await this.database.defaultCollection();

    const len = (await this.getAllHotels()).length;
    if (len === 0) {
      const hotelFile = await import('../data/hotels');

      for (const hotel of hotelFile.hotelData) {
        const doc = new MutableDocument()
          .setNumber('id', hotel.id)
          .setString('name', hotel.name)
          .setString('address', hotel.address)
          .setString('phone', hotel.phone)
          .setString('type', this.DOC_TYPE_HOTEL);

        //old way of saving
        //this.database.save(doc);

        //we save documents to collections now and this is an async operation
        await this.collection.save(doc);
      }
    }
  }

  private async retrieveHotelList(): Promise<Hotel[]> {
    // Get all hotels
    const hotelResults = await this.getAllHotels();
    //defect where it wouldn't load because this needs to be awaited first
    //const hotelResults = this.getAllHotels();

    // Get all bookmarked hotels
    const bookmarks = this.bookmarkDocument.getArray('hotels') as number[];

    const hotelList: Hotel[] = [];
    for (const key in hotelResults) {

      //old
      //let singleHotel = hotelResults[key]["_"] as Hotel;

      //using collection name now, so need to look for the documents using that
      const singleHotel = hotelResults[key]["_default"] as Hotel;

      // Set bookmark status
      singleHotel.bookmarked = bookmarks.includes(singleHotel.id);

      hotelList.push(singleHotel);
    }

    return hotelList;
  }

  public async searchHotels(name): Promise<Hotel[]> {
    //old way
    //const query = this.database.createQuery(
    //    `SELECT * FROM _ WHERE name LIKE '%${name}%' AND type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);

    //we use scopes and collections now, update query for this
    const query = this.database.createQuery(
      `SELECT * FROM _default._default WHERE name LIKE '%${name}%' AND type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);

    //we don't need double awaits in the new framework
    //const results = await (await query.execute()).allResults();

    //new way
    const results = await query.execute();

    let filteredHotels: Hotel[] = [];
    for (var key in results) {
      //old way without scopes/collections
      //let singleHotel = results[key]["_"] as Hotel;

      //new way
      let singleHotel = results[key]["_default"] as Hotel;

      filteredHotels.push(singleHotel);
    }

    return filteredHotels;
  }

  public async bookmarkHotel(hotelId: number) {
    let hotelArray = this.bookmarkDocument.getArray("hotels") as number[];
    hotelArray.push(hotelId);
    this.bookmarkDocument.setArray("hotels", hotelArray);

    //old way
    //this.database.save(this.bookmarkDocument);

    //we use collections to save documents now
    await this.collection.save(this.bookmarkDocument);
  }

  // Remove bookmarked hotel from bookmark document
  public async unbookmarkHotel(hotelId: number) {
    let hotelArray = this.bookmarkDocument.getValue("hotels") as number[];
    hotelArray = hotelArray.filter(id => id !== hotelId);
    this.bookmarkDocument.setArray("hotels", hotelArray);

    this.database.save(this.bookmarkDocument);
  }

  private async findOrCreateBookmarkDocument(): Promise<MutableDocument> {
    // Meta().id is a GUID like e15d1aa2-9be3-4e02-92d8-82bd9d05d8e3

    //old way
    //const bookmarkQuery = this.database.createQuery(
    //  `SELECT META().id AS id FROM _ WHERE type = '${this.DOC_TYPE_BOOKMARKED_HOTELS}'`);

    //new way using default scope and collection
    const bookmarkQuery = this.database.createQuery(
      `SELECT META().id AS id FROM _default._default WHERE type = '${this.DOC_TYPE_BOOKMARKED_HOTELS}'`);

    //old way required multiple objects, new way is simpler
    //const resultSet = await bookmarkQuery.execute();
    //const resultList = await resultSet.allResults();

    //new way resultSets are returned from execution directly
    const resultList = await bookmarkQuery.execute();

    let mutableDocument: MutableDocument;
    if (resultList.length === 0) {
      mutableDocument = new MutableDocument()
        .setString("type", this.DOC_TYPE_BOOKMARKED_HOTELS)
        .setArray("hotels", new Array());
      this.database.save(mutableDocument);
    } else {
      const docId = resultList[0]["id"];
      //old way
      //const doc = await this.database.getDocument(docId);

      //new way from collections
      const doc = await this.collection.document(docId);
      mutableDocument = MutableDocument.fromDocument(doc);
    }

    return mutableDocument;
  }

  private async getAllHotels() {
    //old way
    //const query = this.database.createQuery(`SELECT * FROM _ WHERE type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);

    //new way updated the query to use the proper scope and collection name
    const query = this.database.createQuery(`SELECT * FROM _default._default WHERE type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);

    //old way
    //const result = await query.execute();
    //return await result.allResults();

    //new way
    return await query.execute();
  }
}
