# Outwork
A one time request hiring site

To run on local:<br/>
Requirements:<br/>
MongoDb must be installed, link: https://www.mongodb.com/try/download/community <br/>
Node.js must be installed, link:  https://nodejs.org/en/download/ <br/>

terminal commmands: <br/>
run cd to project root directory <br/>
run "npm install" without quotes to install project dependencies <br/>

setup environmental variables: <br/>
create a file with filename ".env" with content: <br/>

DATABASE_URL = mongodb://localhost/outwork <br/>
SESSION_SECRET = // 10 character long string for session authentication <br/>
USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN of google OAuth 2.0 credential https://console.cloud.google.com/apis/credentials with authorized redirect uri https://developers.google.com/oauthplayground<br/>

remember to not ".env" from configure .gitignore file to avoid security problems <br/>

run cd to project root directory <br/>
run "npm run devStart" on terminal <br/>

Ui Prototypes:
https://diannearoa1012.wixsite.com/website
