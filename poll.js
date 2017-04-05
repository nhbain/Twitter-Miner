// API: https://www.npmjs.com/package/twitter
const autolinker = require('text-autolinker')
const Twitter = require('twitter')
const moment = require('moment')
const fs = require('fs')

//Twitter API access info
const client = new Twitter({
	consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
	consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
	access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
	access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
})


//Variables
var contents;
var tweets;
var maxRetweet;
var maxFavorite;

function init(){
	contents = fs.readFileSync("output_2017-03-25_12-12-BeyondWland.json")
	tweets = JSON.parse(contents)
	minFavorite = 1;
	minRetweet = 1;
	maxFavorite = 2;
	maxRetweet = 2;

	

	for(i = 0; i < tweets.length; i++){
		console.log("ID tweets[0]: ", tweets[i].id)
		client.get('statuses/lookup', {id: tweets[i].id} , (error, tweet) => {
			if(error){
				console.log(error)
			}
			else{
				if(tweet != null){
					console.log("Found : ", tweets[i].id)
					if((tweets[i].rt_overtime[0] == 0) && (tweet.retweet_count == 0)){
						tweets[i].rt_overtime.push()
					}
				}
			}
		})
	}	
}

init();