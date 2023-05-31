export const getCollectionName=(uid1,uid2)=>{
    const splittedArray=(uid1+uid2).split('');
    splittedArray.sort();
    let collectionName="";
    splittedArray.map((char)=>{
        collectionName+=char;
        return 1;
    })
    return collectionName;
}