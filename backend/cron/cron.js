import cron from 'cron';
import https from 'https';

const URL = "https://socialmedia-sk8n.onrender.com";

const job = new cron.CronJob("*/14 * * * *",function (){
   https
       .get(URL,(res) => {
           if(res.statusCode == 200){
            console.log("get req send successfully")
           }else{
            console.log("get req not send successfully",res.statusCode);
           }
          })
       .on("error",(e) =>{
        console.error("error in get req",e);
       });
});

export default job;