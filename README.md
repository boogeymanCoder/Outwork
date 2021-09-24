# Outwork
A one time request hiring site

To understand the code the developer suggests the following tutorial:<br/>
Web Dev Simplified - Full Stack Web Development Course: https://www.youtube.com/watch?v=XlvsJLer_No&list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM<br/>
gmail google OAuth 2.0 tutorial: https://youtu.be/18qA61bpfUs<br/>

To run on local:<br/>

Step 1 (Prepair requirements):<br/>
MongoDb must be installed, link: https://www.mongodb.com/try/download/community <br/>
Node.js must be installed, link:  https://nodejs.org/en/download/ <br/>

Step 2 (Setup terminal commmands): <br/>
on terminal change directory to project root directory <br/>
run "npm install" without quotes to install project dependencies <br/>

Step 4 (Setup environmental variables): <br/>
create a file with filename ".env" with content: <br/>
DATABASE_URL = mongodb://localhost/outwork <br/>
SESSION_SECRET = // 10 character long string for session authentication <br/>
USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN of google OAuth 2.0 credential https://console.cloud.google.com/apis/credentials<br/>
authorized redirect uri: https://developers.google.com/oauthplayground<br/>
gmail google OAuth 2.0 tutorial: https://youtu.be/18qA61bpfUs<br/>

  !Reminder: remember to not remove ".env" from configure .gitignore file to avoid security problems <br/>

Step 5 (Launch):
on terminal change directory to project root directory <br/>
run "npm run devStart" on terminal <br/>

  Ui Prototypes:
  https://diannearoa1012.wixsite.com/website
