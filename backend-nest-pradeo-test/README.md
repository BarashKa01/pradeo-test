1 - npm install
2 - create "pradeo_test" MySQL Database
3 - npm run start:dev

Backend address : localhost:5000


FOLDERS :

/users = Controller contains fixtures to load fake users, provide a list of users, procide a user

/apps = Controller provide a list of all uploaded file by the user, a POST route to handle file upload, 

/routine = contains the main routine to check application reputation, how it works :

- First get applications which are not uploaded, and those which are uploaded but with a report to check
- checking if report check in waiting
- if no report pending, go upload a file
- else, check every 15 seconds

/utils/virus-total.utils.ts = It's a class used to upload a file, check a report, and mark a file as "on upload" to avoid sending a file which is already in upload process.

Database structure :

 user = Straightfoward structure of a lambda user which can have many applications entity (OneToMany)
 android_app = mainly, this structure follow the main idea of : 
 
 - hash : is used to upload the related file, this hash is générated by Multer package on the POST android-apps-controller
 - is_safe : is the final result of the app checking process, the front-end will be based on it to display the status
 - is_verified : It tells to the backend if the app as been uploaded and report verified, if false, the application is "on upload" state or not uploaded
 - on_upload : Tells if the file is on upload to the 3rd party API, if true, the attached file will not be uploaded at each interval of the checking routine
 
 Finaly its ManyToOne relation with user
