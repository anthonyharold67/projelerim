const form = document.querySelector("section.top-banner form");
const input = document.querySelector("#city");
const msg = document.querySelector("span.msg");
const cityList = document.querySelector(".ajax-section .cities");
let fahren = document.getElementById("f");
let celsius = document.getElementById("c");
let english = document.getElementById("en");
let turkish = document.getElementById("tr")

localStorage.setItem("apiKey", EncryptStringAES("4d8fb5b93d4af21d66a2948710284366"));

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    getWeatherDataFromApi();
});

const getWeatherDataFromApi = async() =>{
    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    let inputVal = input.value;
    let units = fahren.checked ? "imperial":"metric";
    let lang = turkish.checked ? "tr" : "en";
    //////////// let mode = "xml";
    // alert("apiKey : " + apiKey);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;
    
    if(inputVal != ""){
        try {
            const response = await axios.get(url);
            // console.log(response);
            const { main, name, sys, weather} = response.data;
            // console.log(weather[0].icon);
            //image url
            const iconUrl = `https://openweathermap.org/img/wn/${
                weather[0].icon}@2x.png`;
            console.log(response);
            let cityCardList = cityList.querySelectorAll(".city");
            let cityCardListArray = Array.from(cityCardList);
            if(cityCardListArray.length > 0){
                const filteredArray = cityCardListArray.filter(card => card.querySelector(".city-name span").innerText == name);
                if(filteredArray.length > 0){
                    msg.innerText = `turkish.checked ? "${name} şehrinin hava durumu bilgilerine sahipsiniz.Lütfe başka bir şehir arayın😉":"You already know the weather for ${name}, Please search for another city 😉"`;
                    setTimeout(()=>{
                        msg.innerText = "";
                    }, 5000);
                    form.reset();
                    input.focus();
                    return;
                }
            }
            
            let createdCityCardLi = document.createElement("li");
            createdCityCardLi.classList.add("city");
            createdCityCardLi.innerHTML = `
            <h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>${fahren.checked ? "°F":"°C"}</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`;
            cityList.prepend(createdCityCardLi);
            form.reset();
            input.focus();
                
        } 
        catch (error) {
            msg.innerText = error;
            setTimeout(()=>{
                msg.innerText = "";
            }, 5000);
        }
    }

}