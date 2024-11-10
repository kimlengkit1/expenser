// import EncryptedStorage from 'react-native-encrypted-storage';
import * as SecureStore from 'expo-secure-store';

export interface IUserInfo {
    id: number,
    email: string,
    // token: string,
}

const SecureDBGateway = {
    save: async function(userInfo: IUserInfo){
        try {
            await SecureStore.setItemAsync(
                "user_session",
                JSON.stringify(userInfo)
            );
          } 
          catch (error) {
            console.error("Error Saving: " + error);
            return null 
          }
    }, 
    load: async function(){
        try{
            const session = await SecureStore.getItemAsync("user_session");
    
            if (session != undefined && session != null) {
                let userInfo: IUserInfo = JSON.parse(session)
                return userInfo; 
            }
            return false; 
        }
        catch(error){
            console.error("Error Loading: " + error);
            return null;
        }
    }, 
    delete: async function(){
        try{
            await SecureStore.deleteItemAsync("user_session");
            return true;
        }
        catch(error){
            console.error("Error Deleting: " + error);
            return null;
        }
    }, 
}

// const SecureDBGateway = {
//     save: async function(userInfo: IUserInfo){
//         try {
//             SecureStore.setItem(
//                 "user_session",
//                 JSON.stringify(userInfo)
//             );
//           } 
//           catch (error) {
//             console.error("Error Saving: " + error);
//             return null 
//           }
//     }, 
//     load: async function(){
//         try{
//             const session = SecureStore.getItem("user_session");
    
//             if (session != undefined && session != null) {
//                 let userInfo: IUserInfo = JSON.parse(session)
//                 return userInfo; 
//             }
//             return false; 
//         }
//         catch(error){
//             console.error("Error Loading: " + error);
//             return null;
//         }
//     }, 
//     delete: async function(){
//         try{
//             await SecureStore.deleteItemAsync("user_session");
//             return true;
//         }
//         catch(error){
//             console.error("Error Deleting: " + error);
//             return null;
//         }
//     }, 
// }

export default SecureDBGateway;