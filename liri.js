var Twitter = require('twitter');
var keys = require('./keys.js')
var Spotify = require('node-spotify-api');
var request = require('request')
var fs = require("fs")

var client = new Twitter(
{
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify(
{
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret,
});

var OMDBKey = keys.OMDBKey;

var command = process.argv[2]

var getTweets = function()
{
  client.get('statuses/user_timeline', function(error, tweets, response) 
  {
    if(error) throw error;
    console.log("Here are the user's most recent tweets and times.")

    for (var i=0; i<tweets.length; i++)
    {
      console.log(tweets[i].created_at+": "+tweets[i].text);
    }
  });  
}

var getSpotifyInfo = function(string)
{
  spotify.search({ type: "track", query: string, limit: 1}, function(err, data) 
  {
    if (err) 
    {
      return console.log('Error occurred: ' + err);
    }

    var artistsString = data.tracks.items[0].artists[0].name

    for (var i=1; i<data.tracks.items[0].artists.length; i++)
    {
      if (i === data.tracks.items[0].artists.length-1)
      {
        artistsString = artistsString+", and "+data.tracks.items[0].artists[i].name
      }

      else
      {
        artistsString = artistsString+", "+data.tracks.items[0].artists[i].name
      }
    }

    console.log("-----------------------------------------")
    console.log("Artists: "+artistsString); 
    console.log("Song Name: "+data.tracks.items[0].name); 
    console.log("Preview Link: "+data.tracks.items[0].external_urls.spotify);
    console.log("From Album: "+data.tracks.items[0].album.name);
  });
}

var getOMDBInfo = function(string)
{
      request("http://www.omdbapi.com/?t="+string+"&y=&plot=short&apikey="+OMDBKey+"", function(err, response, body)
    {
      if (!err && response.statusCode===200)
      {
        console.log("-----------------------------------------")
        console.log("Movie Title: "+JSON.parse(body).Title)
        console.log("Year Released: "+JSON.parse(body).Year)
        console.log("IMDB Rating: "+JSON.parse(body).imdbRating)
        console.log("Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value)
        console.log("Country of Production: "+JSON.parse(body).Country)
        console.log("Language: "+JSON.parse(body).Language)
        console.log("Plot: "+JSON.parse(body).Plot)
        console.log("Actors: "+JSON.parse(body).Actors)
     }

    else
    {
      console.log("Response Status Code: "+response.statusCode)
      console.log(err)
    }
  })
}


if (command === "my-tweets")
{
  getTweets()
}


else if (command === "spotify-this-song")
 {
  if (process.argv[3]===undefined)
  {
    getSpotifyInfo("The Sign Ace of Base")
  }

  else
  {
    getSpotifyInfo(process.argv[3])
  }
}


else if (command === "movie-this")
{
  if (process.argv[3]===undefined)
  {
    getOMDBInfo("Mr.Nobody")
  }

  else
  {
    getOMDBInfo(process.argv[3])
  }
}


else if (command === "do-what-it-says")
{
  fs.readFile("random.txt", "utf8", function(err, data)
  {
    if (err)
    {
      return console.log(err)
    }

    else
    {
      var array = data.split(",")
      console.log(array)

      if (array[0] === "my-tweets")
      {
        getTweets()
      }


      else if (array[0] === "spotify-this-song")
       {
        if (array[1]===undefined)
        {
          getSpotifyInfo("The Sign Ace of Base")
        }

        else
        {
          getSpotifyInfo(array[1])
        }
      }


      else if (array[0] === "movie-this")
      {
        if (array[1]===undefined)
        {
          getOMDBInfo("Mr.Nobody")
        }

        else
        {
          getOMDBInfo(array[1])
        }
      }
    }
  })
}