<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
--> The Session is stored entirely on the server and is normally used for storing state on the server about the user currently using the website and any cached data being used by them so user don't have to log in every time user request a new page or resource.

2. What does bcrypt do to help us store passwords in a secure manner.
--> The bcrypt function hashes passwords with a salt to protect against rainbow table attacks.

3. What does bcrypt do to slow down attackers?
--> In bcrypy it uses bcrypt-cost which is a measure of how many times to run the hash on password, by increasing this iteration count can slow down computing power for attackers. 

4. What are the three parts of the JSON Web Token?
-->  Header
     Payload
     Signature