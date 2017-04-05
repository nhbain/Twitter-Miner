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
var tweets = []
var maxRetweet
var minRetweet
var maxFavorite
var minFavorite
var maxTime = 5*60*1000 //five minutes
var minTime = 1*60*1000 //one minute
var pollWindow = 1*60*1000 


function init(){
	var contents = fs.readFileSync("output_2017-03-25_12-12-BeyondWland.json")
	var data = JSON.parse(contents)
	for(j = 0; j < data.length - 1; j++){
		tweets.push({
			id: data[j].id,
			rt_overtime: [data[j].rt_overtime[0]],
			fav_overtime: [data[j].fav_overtime[0]],
			time: [data[j].time[0]],
			user: data[j].user,
			user_location: data[j].user_location,
			profile_pic: data[j].profile_pic,
			followers: data[j].followers,
			following: data[j].following,
			text: data[j].text,
			fixed_text: data[j].fixed_text,
			coordinates: data[j].coordinates,
			event_location: data[j].location
		})
	}


	//initialize variables
	minFavorite = 0
	minRetweet = 0
	maxFavorite = 1
	maxRetweet = 1

	for(i = 0; i < tweets.length - 1; i++){
		client.get('statuses/lookup', {id: tweets[i].id} , (error, tweet) => {
			if(error){
				console.log(error)
			}
			else{
				// console.log(tweet)
				if(tweet != []){
					console.log("i: ", i)
					console.log("Found : ", tweets[i].id)
					var temp

					//check to see if max values need to be changed.
					if(tweet.retweet_count > maxRetweet){maxRetweet = tweet.retweet_count}
					if(tweet.favorite_count > maxFavorite){maxFavorite = tweet.favorite_count}

					if(tweets[i].rt_overtime[0] == tweet.retweet_count){
						temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
						tweets[i].rt_overtime.push(temp)
					}
					else{
						tweets[i].rt_overtime.push(tweet.retweet_count)
					}

					if(tweets[i].fav_overtime[0] == tweet.favorite_count){
						temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
						tweets[i].fav_overtime.push(temp)
					}
					else{
						tweets[i].fav_overtime.push(tweet.favorite_count)
					}

					temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
					tweets[i].time.push(temp)
				}
				else{
					console.log("Unable to find tweet with id: ", tweets[i].id)
					temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
					tweets[i].rt_overtime.push(temp)

					temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
					tweets[i].fav_overtime.push(temp)

					temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
					tweets[i].time.push(temp)
				}
			}
		})
	}
	//dump to new file
	setTimeout(output, pollWindow)
}

const output = () => {
	var json = JSON.stringify(tweets, null, 4)
	var filename = 'poll_output_' + moment().format('YYYY-MM-DD_HH-mm') + '-BeyondWland' + '.json'
	fs.writeFile(filename, json, 'utf8', (error) => {
		if (error) throw error
		console.log('File saved as: ' + filename)
		process.exit()
	})
}

const poll = () => {
	for(i = 0; i < tweets.length; i++){
		client.get('statuses/lookup', {id: tweets[i].id} , (error, tweet) => {
			if(error){
				console.log(error)
			}
			else{
				console.log(tweet)
				if(tweet != []){
					console.log("Found : ", tweets[i].id)
					var temp

					//check to see if max values need to be changed.
					if(tweet.retweet_count > maxRetweet){maxRetweet = tweet.retweet_count}
					if(tweet.favorite_count > maxFavorite){maxFavorite = tweet.favorite_count}

					if(tweets[i].rt_overtime[0] == tweet.retweet_count){
						temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
						tweets[i].rt_overtime.push(temp)
					}
					else{
						tweets[i].rt_overtime.push(tweet.retweet_count)
					}

					if(tweets[i].fav_overtime[0] == tweet.favorite_count){
						temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
						tweets[i].fav_overtime.push(temp)
					}
					else{
						tweets[i].fav_overtime.push(tweet.favorite_count)
					}

					temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
					tweets[i].time.push(temp)
				}
				else{
					console.log("Unable to find tweet with id: ", tweets[i].id)
					temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
					tweets[i].rt_overtime.push(temp)

					temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
					tweets[i].fav_overtime.push(temp)

					temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
					tweets[i].time.push(temp)
				}
			}
		})
	}
	//dump to new file
	setTimeout(output, pollWindow)
}

init()