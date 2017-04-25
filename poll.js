// API: https://www.npmjs.com/package/twitter
const autolinker = require('text-autolinker')
const Twitter = require('twitter')
const sentiment = require('sentiment')
const moment = require('moment')
const fs = require('fs')

//Twitter API access info
// const client = new Twitter({
// 	consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
// 	consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
// 	access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
// 	access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
// })


//Variables
var inputname = "output_2017-03-25_14-24-BeyondWland.json"
var tweets = []
var sentiments = []
var tweetChunks
var maxRetweet
var minRetweet
var maxFavorite
var minFavorite
var maxTime = 5*60*1000 //five minutes
var minTime = 1*60*1000 //one minute
var pollWindow = 0.5*60*1000 
var waitTime = 1*60*1001 // ~fifteen minutes


function init(){
	
	var contents = fs.readFileSync(inputname)
	var data = JSON.parse(contents)
	

	//initialize variables
	minFavorite = 0
	minRetweet = 0
	maxFavorite = 4
	maxRetweet = 4

	var total = tweets.length
	// var k, count = 0, chunk = 180
	// var tempWait = waitTime
	// tweetChunks = Math.ceil(total/180)
	var pollFunction = null

	for(var k = 0; k < total; k++){
		(function (k){
			var r1 = sentiment()
			console.log(data[k].text)
			sentiments.push(sentiment(data[k].text))
		}).call(this, k);
	}

	for(j = 0; j < data.length; j++){
		//console.log(sentiments[j])
		tweets.push({
			id: data[j].id,
			rt_overtime: data[j].rt_overtime,
			fav_overtime: data[j].fav_overtime,
			time: data[j].time,
			user: data[j].user,
			user_location: data[j].user_location,
			profile_pic: data[j].profile_pic,
			followers: data[j].followers,
			following: data[j].following,
			text: data[j].text,
			fixed_text: data[j].fixed_text,
			sentiment: sentiments[j],
			coordinates: data[j].coordinates,
			event_location: data[j].location
		})
	}

	setTimeout(output, pollWindow)
	//dump to new file
	// if(total < 180){
	// 	setTimeout(output, pollWindow)
	// }
	// else{
	// 	setTimeout(output, waitTime*tweetChunks)
	// }
}

// const poll = (current, total) => {
// 	var i = current
// 	client.get('statuses/lookup', {id: tweets[i].id} , (error, tweet) => {
// 		if(error){
// 			console.log(error)
// 			temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
// 			tweets[i].rt_overtime.push(temp)

// 			temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
// 			tweets[i].fav_overtime.push(temp)

// 			temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
// 			var newTime = parseInt(tweets[i].time[0])
// 			newTime += temp
// 			tweets[i].time.push(newTime.toString())
// 		}
// 		else{
// 			// console.log(tweet)
// 			if(tweet.length != 0){
// 				console.log("Found : ", tweets[i].id)
// 				var temp

// 				//check to see if max values need to be changed.
// 				if(tweet.retweet_count > maxRetweet){maxRetweet = tweet.retweet_count}
// 				if(tweet.favorite_count > maxFavorite){maxFavorite = tweet.favorite_count}

// 				if(tweets[i].rt_overtime[0] == tweet.retweet_count){
// 					temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet)
// 					tweets[i].rt_overtime.push(Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet))
// 				}
// 				else{
// 					tweets[i].rt_overtime.push(tweet.retweet_count)
// 				}

// 				if(tweets[i].fav_overtime[0] == tweet.favorite_count){
// 					temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
// 					tweets[i].fav_overtime.push(temp)
// 				}
// 				else{
// 					tweets[i].fav_overtime.push(tweet.favorite_count)
// 				}

// 				temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
// 				var newTime = parseInt(tweets[i].time[0])
// 				newTime += temp
// 				tweets[i].time.push(newTime.toString())
// 			}
// 			else{
// 				console.log("Unable to find tweet with id: ", tweets[i].id)
// 				temp = Math.floor(Math.random() * (maxRetweet - minRetweet) + minRetweet) 
// 				tweets[i].rt_overtime.push(temp)

// 				temp = Math.floor(Math.random() * (maxFavorite - minFavorite) + minFavorite)
// 				tweets[i].fav_overtime.push(temp)

// 				temp = Math.floor(Math.random() * (maxTime - minTime) + minTime)
// 				var newTime = parseInt(tweets[i].time[0])
// 				newTime += temp
// 				tweets[i].time.push(newTime.toString())
// 			}
// 		}
// 	})

// 	if(current >= total){
// 		output()
// 	}
// 	if((current + 1)%180 == 0){
// 		console.log("Waiting 15 minutes to begin polling again. . .")
// 		setTimeout(poll(current + 1, total), waitTime)
// 	}
// 	else{
// 		if(current + 1 <= total){
// 			poll(current + 1, total)
// 		}
// 	}
// }


const output = () => {
	var json = JSON.stringify(tweets, null, 4)
	var filename = 'sentiment_poll_' + inputname
	fs.writeFile(filename, json, 'utf8', (error) => {
		if (error) throw error
		console.log('File saved as: ' + filename)
		process.exit()
	})
}

init()