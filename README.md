Requeriments: 
	MongoDB  
	babel (npm install -g babel) to compile ES6  
	bower (npm install -g bower) deps.  

Config: 

	
	$ npm install 
	$ cd loginserver && bower install && cd ..

if is necesary, change to public ip and port in file (line 12 and 13):

		./gameserver/src/initializer.js

and compile again, (with babel):

		$ babel gameserver/src/ -s -d gameserver/lib/ --presets es2015


To run:

	$ npm run start 