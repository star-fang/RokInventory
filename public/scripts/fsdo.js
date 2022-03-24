import {getFirestore, collection, query, where, onSnapshot, doc, runTransaction, getDoc} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

export default class FSDO { // Firebasestore Data Object

  constructor() {
    this.fs = getFirestore() 
    this.linked = new Map();
  }

  /**
   * @param {string} collectionId
   */
  unlinkCollection( collectionId ) {
    if( this.linked.has( collectionId ) ) {
      const unlink = this.linked.get( collectionId );
      if( unlink instanceof Function ) {
        unlink();
      }
      this.linked.delete( collectionId );
    }
  }

  /**
   * @param {string} collectionId 
   * @param {function} onChange
   */
  linkCollection( collectionId, onChange ) {
    this.unlinkCollection( collectionId )
    let q = query( collection( this.fs, collectionId ) );
    
    const unlink = onSnapshot( q, ( snapshot ) => {
      snapshot.docChanges().forEach( ( change ) => {
        onChange( change );
      });
    });
    this.linked.set( collectionId, unlink )
  }

  /**
   * @param {String} collectionId
   * @param {String} docId
   * @param {Boolean} backup 
   * @returns {Promise}
   */
  readDocument( collectionId, docId ) {
    return new Promise( async ( resolve, reject ) => {
      console.log(`read: ${collectionId} ${docId}`)
      const docRef = doc( this.fs, collectionId, docId );
      console.log( docRef );
      const docSnapshot = await getDoc( docRef );

      if( docSnapshot.exists() ) {
        resolve( docSnapshot.data() );
      } else {
        reject( "No such document")
      }
    });
  }
  
  /** Atomic processing
   * @param {String} collectionId
   * @param {String} docId
   * @param {Object} factor
   * @param {Boolean} backup
   * @returns {Promise}
   */
  updateDocument( collectionId, docId, factor, backup ) {
    return new Promise( async ( resolve, reject ) => {
      const docRef = doc( this.fs, collectionId, docId );
      try{
        const updateTransaction = await runTransaction( this.fs, async (transaction) => {
          let docSnapshot = backup? await transaction.get( docRef ) : null;
          transaction.update( docRef, factor );
          resolve( docSnapshot );
        });
        console.log( `transaction: ${updateTransaction}`)
      } catch( err ) {
        reject(err);
      }
    });
  }

  /** Atomic processing
   * @param {String} collectionId
   * @param {String} docId
   * @param {Object} factor
   * @param {Boolean} backup
   * @param {Boolean} merge
   * @returns {Promise}
   */
   setDocument( collectionId, docId, factor, backup, merge ) {
    return new Promise( async ( resolve, reject ) => {
      const docRef = doc( this.fs, collectionId, docId );
      try{
        const setTransaction = await runTransaction( this.fs, async (transaction) => {
          let docSnapshot = backup? await transaction.get( docRef ) : null;
          transaction.set( docRef, factor, {merge: merge} );
          resolve( docSnapshot );
        });
        console.log( `transaction: ${setTransaction}`)
      } catch( err ) {
        reject(err);
      }
    });
  }

  /** Atomic processing
   * @param {String} collectionId
   * @param {String} docId
   * @param {Boolean} backup
   * @returns {Promise}
   */
  deleteDocument( collectionId, docId, backup ) {
    return new Promise( async ( resolve, reject ) => {
      const docRef = doc( this.fs, collectionId, docId );
      try{
        const deleteTransaction = await runTransaction( this.fs, async (transaction) => {
          let docSnapshot = backup? await transaction.get( docRef ) : null;
          transaction.delete( docRef );
          resolve( docSnapshot );
        });
        console.log( `transaction: ${deleteTransaction}`)
      } catch( err ) {
        reject(err);
      }
    });
  }


} // FSDO class
  
  

  
  