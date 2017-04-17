# Import the necessary package to process data in JSON format
try:
    import json
except ImportError:
    import simplejson as json

# Import the necessary methods from "twitter" library
from twython import Twython, TwythonError

import random

# Twitter Credentials and Instantiation ----------------------------------------
ACCESS_TOKEN = '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa'
ACCESS_SECRET = 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
CONSUMER_KEY = 'iCqI27Unu8I8z8X8ktqkqdekS'
CONSUMER_SECRET = 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8'

twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
twitter.verify_credentials()
# Twitter Credentials and Instantiation ----------------------------------------

# Load File ----------------------------------------
filename = 'output_2017-03-25_12-12-BeyondWland.json'
with open(filename) as data_file:
    tweets = json.load(data_file)
# Load File ----------------------------------------

# Global Variables ----------------------------------------


random.seed(a=None)
# Global Variables ----------------------------------------

# Output Function ----------------------------------------
def output():
    outputFile = 'pypoll_' + filename
    with open(outputFile, 'w') as outfile:
        json.dump(tweets, outfile, indent=4)
    return
# Output Function ----------------------------------------

# Poll Function -------------------------------------------------
def poll(current, limit):
    count = 1
    minFavorite = 0
    minRetweet = 0
    maxFavorite = 4
    maxRetweet = 4
    minTime = 1*60*1000 # one minute
    maxTime = 5*60*1000 # five minutes

    for i in tweets:
        if (count%180 == 0):
            time.sleep(15*61)

        try:
            tweet = twitter.show_status(id = i['id'])

            # Check if max values need adjusting
            if (tweet['retweet_count'] > maxRetweet): maxRetweet = tweet['retweet_count']
            if (tweet['favorite_count'] > maxFavorite): maxFavorite = tweet['favorite_count']

            if(i['rt_overtime'][0] == tweet['retweet_count']):
                temp = random.randint(minRetweet, maxRetweet)
                i['rt_overtime'].append(temp)
            else:
                i['rt_overtime'].append(tweet['retweet_count'])

            if(i['fav_overtime'][0] == tweet['favorite_count']):
                temp = random.randint(minFavorite, maxFavorite)
                i['fav_overtime'].append(temp)
            else:
                i['fav_overtime'].append(tweet['favorite_count'])

            temp = random.randint(minTime, maxTime)
            newtime = int(i['time'][0])
            newtime += temp
            i['time'].append(newtime)          

        except TwythonError as e:
            print e.error_code

            temp = random.randint(minRetweet, maxRetweet)
            i['rt_overtime'].append(temp)

            temp = random.randint(minFavorite, maxFavorite)
            i['fav_overtime'].append(temp)

            temp = random.randint(minTime, maxTime)
            newtime = int(i['time'][0])
            newtime += temp
            i['time'].append(newtime)
            
            # print json.dumps(tweet['id'], indent=4)
        count += 1
# test = twitter.show_status(id = "112652479837110273") 
# Poll Function -------------------------------------------------

poll(0, len(tweets))
output()

# tweets[0]["fav_overtime"].append(200)
# output()
# print json.dumps(tweets[0]["fav_overtime"], indent=4)

