console.log("let's write js");
let currentSong= new Audio();
let songs;
let currentFolder;
let cardContainer=document.querySelector(".cardContainer")
async function  getVideo(folder){
    currentFolder=folder;
    let a=await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response =await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    for(let i=0;i<as.length;i++){
       const ele=as[i];
       if(ele.href.endsWith(".mp3")){
        songs.push(ele.href.split(`/${folder}/`)[1])
       }     
    }
    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+`<li>   
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song}</div>
                                <div>Atif</div>
                            </div>
                            <div class="playCursor">  <img class="invert" src="playsong.svg" alt=""></div>
                          
                         </li>`;
    }
    //attaced event listner for each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
}
const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/song/" +track);
    currentSong.src=`/${currentFolder}/` + track
 
    if(!pause){
        currentSong.play();
        PLAY.src="pause.svg"
    }
    
    document.querySelector(".songInfo").innerHTML=decodeURI(track)
    document.querySelector(".songTime").innerHTML="00.00/00.00"
}
const changeTomin=(time)=>{
    let min=time/60;
    min=parseInt(min)
    let sec=time%60;
    sec=parseInt(sec)
    return `${min}.${sec}`
}
async function displayAlbum(){
    let a=await fetch(`http://127.0.0.1:3000/song/`)
    let response =await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchor =div.getElementsByTagName("a")
    let array=Array.from(anchor);
    for (let index = 0; index < array.length; index++) {
        const e= array[index];   
        if(e.href.includes("/song")){
            let folder=e.href.split("/").slice(-2)[0]
            //get metadata from folder
            let a=await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`)
            let response =await a.json();
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}"  class="card ">
                        <div class="play">
                            <img src="play.svg" alt="">
                        </div>

                        <img src="spodify_img.jpg
                            " alt="">

                        <p>
                        <h2>
                           ${response.title}
                        </h2>
                            ${response.discription}
                        </p>
                    </div>`
        }
    }
     //load the playlist whenever card is clicked 
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        let songs=await getVideo(`song/${item.currentTarget.dataset.folder}`);
    })
   })
    console.log(div)
    
}

async function main(){
    await getVideo("");
    //play the first video
    playMusic(currentFolder,true)
    //display all the albums on the page
    displayAlbum()

    
    //attach event listner to play ,next and prev
    PLAY.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            PLAY.src="pause.svg"
        }else{
            currentSong.pause()
            PLAY.src="playsong.svg"
            
          
        }
    })
    //listen for timeUpdate event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songTime").innerHTML=`${changeTomin(currentSong.currentTime)}/${changeTomin(currentSong.duration)}`
        document.querySelector(".circle").style.left=currentSong.currentTime/currentSong.duration*100+"%";
    })
    //addevent listener to seekerbar
    document.querySelector(".seekBar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width*100)
        document.querySelector(".circle").style.left=
        (e.offsetX/e.target.getBoundingClientRect().width*100) +"%";
        currentSong.currentTime=(currentSong.duration*percent)/100;
    })
    //add eventlistener for hamburger
    document.querySelector(".ham").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0+"%";
    })
    //add eventlistener for cross
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left=-110+"%";
    })
    prev.addEventListener("click",()=>{
       let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        console.log(index)
        if(index-1>=0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        console.log(index)
        if(index+1<songs.length){
            playMusic(songs[index+1])
        }
    })
   //add an event to volume
   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=(e.target.value)/100;
   })
   //add event listener to mute the track
   document.querySelector(".volume >img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            currentSong.volume=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg",);
            currentSong.volume=0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
            
        }
   })
}
main()

// mySong.play();
// mySong.addEventListener("loadeddata",()=>{
//     let duration= mySong.duration;
//     console.log(duration)
// });