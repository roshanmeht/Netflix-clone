let apn_key = 'e168d7949e6ab8f8eed942502be59103';
let apnstart = "https://api.themoviedb.org/3";
let imgpath = "https://image.tmdb.org/t/p/original";
let imgpath_lowQuality="https://image.tmdb.org/t/p/w500";
// let youtube_api=`AIzaSyCqWdI63gb0HSS3JpTkedaPtXWPmdtx3BM`;
// let youtube_api=`AIzaSyAkGR6iHabe8waX0-0B0fTFm_k39CrbowU`;
let youtube_api=`AIzaSyAI-4RRBz2qw9lXwN4iuMtoRMfjvXgbP4s`;
youtubeVideoSearchUsingId=`https://www.youtube.com/watch?v={video_id}`;
youtubeVideoSearchUsingYoutubeApi=`https://www.googleapis.com/youtube/v3/search?part=snippet&q={search_string}&key=${youtube_api}`;



const apnPaths = {
  fetchAllCategories: `${apnstart}/genre/movie/list?api_key=${apn_key}`,
  fetchmovieslist: (id) => `${apnstart}/discover/movie?api_key=${apn_key}&with_genres=${id}`,
  fetchTrendingMoviesList: `${apnstart}/trending/movie/day?api_key=${apn_key}`,
  youtubeVideoSearchUsingYoutubeApi:(search_string)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search_string}&key=${youtube_api}`
}





//main function which will fetch and build all movies categories on the frontend side 
function main() {
  fetchandbuildallcategories(apnPaths.fetchAllCategories);

}

//function for fetching trending movies
function trendingNowSection() {
  buildMovieSection(apnPaths.fetchTrendingMoviesList, 'Trending Now')
}

//Boot up the WebPage
window.addEventListener('load', function () {
  fetchTrendingMovies(apnPaths.fetchTrendingMoviesList);
  trendingNowSection();
  main();
});

function fetchandbuildallcategories(url) {
  fetch(url)
    .then(res => res.json())
    .then(res => {
      let categories = res.genres;
      if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach((arr) => {
          
          buildMovieSection(apnPaths.fetchmovieslist(arr.id), arr.name)
        })

      }
    })
    .catch(err => console.log(err));

}

function buildMovieSection(url, categoryName) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      //  console.log(res.results,category);
     let movieslist=res.results;
       buildmovieslist(movieslist, categoryName);

    })
    .catch(err => console.log(err))
  // console.log(category);
}

function buildmovieslist(list, categoryName) {
  const div_container = document.getElementById('movies-cont');
  let moviesthumbnailHTML = list.map((item) => {
    // return `<div class="movies-poster" onmouseover="youtubeTrailor1('${item.title}','${item.id}')">
    // <img src="${imgpath_lowQuality}${item.backdrop_path}" alt="${item.original_title}" class="movies-poster-img" onclick="youtubeTrailor('${item.title}')"}></img>

    // <iframe id=${item.id}></iframe>
   
    // </div>`
  return `<img src="${imgpath_lowQuality}${item.backdrop_path}" alt="${item.original_title}" class="movies-poster" onclick="youtubeTrailor('${item.title}')"}></img>`
  });
  let moviesthumbnailHTML1 = moviesthumbnailHTML.join(' ');
  
  let insertedHTMLBody =
    `<div class="movies-container-heading" >${categoryName}<span class="expand">Explore All></span></div>
  <div class="movies-thumbnail">
  ${moviesthumbnailHTML1}</div>`

  // console.log(insertedHTMLBody);

  //append dynamically created html to main div container
  div_container.innerHTML += insertedHTMLBody;
}


//header background
let nav = document.getElementById('navv');
let mainn=document.getElementsByClassName('main')[0];

window.addEventListener("scroll", function () {
  nav.style.cssText = 'background-color:black;position:fixed;top:0px;z-index:1';
  mainn.style.cssText='position:absolute;bottom:0;z-index:0';
  if (window.pageYOffset == 0){
    nav.style.cssText = 'background-color:none;transition:background-color 0.5s linear';
  }
});


//banner update using api
function fetchTrendingMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      let trendingmoviearray = res.results;
      console.log("1st" ,trendingmoviearray);
      let index=parseInt(Math.random()*trendingmoviearray.length);
      let item=trendingmoviearray[index];
      console.log(item);
      buildTrendingMovies(item);
    })
    .catch((err) => console.log(err));
}

function buildTrendingMovies(movie) {
  console.log('2',movie);
  let banner = document.getElementsByClassName('banner')[0];
  let movieTitle = document.getElementById('movie-title');
  let overview=document.getElementById('overview');
  let playbutton=document.getElementsByClassName('play-button')[0];
  let moreInfoButton=document.getElementsByClassName('moreinfo-button')[0];


playbutton.onclick=function(){
  youtubeTrailor(movie.title);
}

moreInfoButton.onclick=function(){
  moreInfo(movie.overview);
}

  movieTitle.innerHTML = movie.original_title;
  // banner.style.cssText = `background-image:url('${imgpath}${movie.backdrop_path}')`;

  banner.style.backgroundImage = `url('${imgpath}${movie.backdrop_path}')`;

  

  overview.innerHTML=`${movie.overview.length>160 ? movie.overview.slice(0,150).trim()+'...' : movie.overview}`;
}


//movie trailor play using youtube api when user hover on movie thumbnail
function youtubeTrailor1(movies,id){
  fetch(apnPaths.youtubeVideoSearchUsingYoutubeApi(movies))
  .then((res)=>res.json())
  .then((res)=>{
    document.getElementById(id).src=`https://www.youtube.com/embed/${res.items[0].id.videoId}?autoplay=1&mute=1`;
    console.log(document.getElementById(id));
  })
  .catch((err)=>console.log(err));

}


//movie trailor play using youtube api when user click on movie thumbnail
function youtubeTrailor(movies){
  fetch(apnPaths.youtubeVideoSearchUsingYoutubeApi(movies))
  .then((res)=>res.json())
  .then((res)=>{
     //console.log(res.items[0].id.videoId);
    let youtubeurl=`https://www.youtube.com/watch?v=${res.items[0].id.videoId}`;
    window.open(youtubeurl,'_blank',`width=600px,height=390px`);
   
  })
  .catch((err)=>console.log(err));

}

//function to view more info part
function moreInfo(name){
   console.log(name);
}






