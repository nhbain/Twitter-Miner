// API: https://www.npmjs.com/package/twitter
const autolinker = require('text-autolinker')
const Twitter = require('twitter')
const moment = require('moment')
const fs = require('fs')
var sentiment = require('sentiment')

//Twitter API access info
const client = new Twitter({
	consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
	consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
	access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
	access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
})


//Variables
var inputname = "ComboStream-21.json"
var tweets = []
var maxRetweet
var minRetweet
var maxFavorite
var minFavorite
var maxTime = 5*60*1000 //five minutes
var minTime = 1*60*1000 //one minute
var pollWindow = 1 
var tempResponse

function init(){
	
	var contents = fs.readFileSync(inputname)
	var data = JSON.parse(contents)
	
	for(j = 0; j < data.length; j++){
		if(data[j].following>44&&data[j].following<5315&&data[j].followers>40&&data[j].followers<4996){
			
		var stmt = sentiment(data[j].text);
			
			tweets.push({
				id: data[j].id,
				rt_overtime: data[j].rt_overtime[0],
				fav_overtime: data[j].fav_overtime[0],
				time: data[j].time[0],
				user: data[j].user,
				user_location: data[j].user_location,
				profile_pic: data[j].profile_pic,
				followers: data[j].followers,
				following: data[j].following,
				text: data[j].text,
				fixed_text: data[j].fixed_text,
				coordinates: data[j].coordinates,
				event_location: data[j].location,
				stmt: stmt
			})
			console.log(stmt)

		}
	}


//dump to new file
	setTimeout(output, pollWindow)
}

const output = () => {
	var json = JSON.stringify(tweets, null, 4)
	var filename = 'ft_' + inputname
	fs.writeFile(filename, json, 'utf8', (error) => {
		if (error) throw error
		console.log('File saved as: ' + filename)
		process.exit()
	})
}

init()