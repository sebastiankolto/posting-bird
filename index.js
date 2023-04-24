import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    // If the target clicked has a data set like so it is the like icon
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) //Run the handleLikeClick function with the uuid of the corresponding like
    }

    //If the target clicked has a data set retweet it is the retweet icon
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }

    //If the target clicked has a data set reply it is the reply icon
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }

    //if the target has an id tweet-btn
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }

    else if(e.target.dataset.comment){
        console.log("it should work")
        handleCommenting(e.target.dataset.comment)
    }
})



//Handlelikeclick, we get the uuid from the e.target.dataset and we insert is inside the function body
function handleLikeClick(tweetId){
    //Get the correct tweet like, filter the tweetsdata, every tweet, return the tweet that has the uuid same as the uuid used as an argument from the e.target
    const targetTweetObj = tweetsData.filter((tweet)=>{
        return tweet.uuid === tweetId
    })[0] //We get an array, we need an object, so we have to put [0] so the first object in the array, which is the only one

    //We have inside the correct object an isLiked boolean to know if it was clicked or not
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--  //If it is true, we decrease the like number
    }
    else{
        targetTweetObj.likes++ //if it is false we increase the like number
    }
    //After the if or else runs, we have to set the boolean to the opposite of the current one 
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    //We have to run the render function which shows the html
    render()
}




function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}


//EXPLAIN
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}


function handleCommenting(tweetId){
    const targetTweetObj = tweetsData.filter((item)=>{
        return item.uuid === tweetId
    })[0]

    const commentInput = document.querySelector(`#comment-${tweetId}`).value

    targetTweetObj.replies.push({
            handle: `@Sebastian`,
            profilePic: `images/sebastian.jpg`,
            tweetText: commentInput
    })

    render()
    // So the current one stays open, not closing the replies
    handleReplyClick(tweetId)
}


//Get the tweetinput
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    // Resetting tweetinput to a single line
    tweetInput.style.height = "";

    //If it has a value, we can put it in the beginning of tweetsdata, so it appears first in the list
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Sebastian`,
            profilePic: `images/Sebastian.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()      //We add an uuid to it so we can work with it later
        })

    //We run the render function, now with the new data from the input field
    render()
    tweetInput.value = ''
    }

}


//To create the html
function getFeedHtml(){
    let feedHtml = ``
    
    //We need a foreach to go through all the data we have available
    tweetsData.forEach(function(tweet){
        
        //Like icon class is empty, we add something to it when we click it
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        //We create a variable for the replies, in which we will add the html
        let repliesHtml = ''
        
        //We are inside the tweet for each loop, and if the length of tweet.replies is bigger than 0 it means there are some replies
        if(tweet.replies.length > 0){
            //We create a for each for the replies, inside the main for each
            tweet.replies.forEach((reply)=>{
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner-replies">
                        <div>
                            <img src="${reply.profilePic}" class="profile-pic">
                        </div>
                        <div class="tweet-inner-replies-content">
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        }
        
        //Feed html is populated with all the available data from the for each of tweet
        //This feedhtml also holds the other variable replies, so this is the main, inside it put the replies. 
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <div>
                    <img src="${tweet.profilePic}" class="profile-pic">
                </div>
                <div class="tweet-data">
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}


                <div class="tweet-reply">
						<div class="tweet-inner-replies">
							<img src="images/Sebastian.jpg" class="profile-pic">
							<div class="tweet-inner-replies-content">
								<p class="handle">Sebastian</p>
								<div class="tweet-comment">
									<input type="text" placeholder="Reply to ${tweet.handle}" class="comment" id="comment-${tweet.uuid}"></input>
									<i class="fa-solid fa-share" id="submit-comment" data-comment="${tweet.uuid}"></i>
								</div>
							</div>
						</div>
					</div>  
            </div>   
        </div>
    `
   })

   //We return the feed html to the function so the function holds the value, it also holds the replies
   return feedHtml
}


//The render function finds the correct tag, and it adds the getFeedHtml to it, 
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


// Counting characters
const tweetInput = document.getElementById('tweet-input');
const charCount = document.getElementById('char-count');

tweetInput.addEventListener('input', function() {

    // Tweetinput taking up more lines if text is longer
    tweetInput.style.height = "auto";
    tweetInput.style.height = `${tweetInput.scrollHeight}px`;
    
    // Counting characters left
    const maxLength = 60;
    const remainingChars = maxLength - this.value.length;
  
    if (remainingChars <= 10) {
        charCount.style.display = "flex";
        charCount.innerHTML = `${remainingChars}`;
    } else {
        charCount.innerHTML = "";
        charCount.style.display = "none";
    }
});
