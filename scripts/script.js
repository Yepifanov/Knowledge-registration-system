/**
 * Created by g.yepifanov on 19.12.2017.
 */

window.onload = function () {

    var menuList = document.getElementById('nav1');
    menuList.addEventListener("mouseover", function (event) { //обработчик события на выпадающее меню
        var target = event.target;
        if (target.className == "menu-list__item") {
            var dropDown = target.getElementsByClassName("menu-list__dropdown");
            closeMenu();
            dropDown[0].style.display = 'block'; // тот объект, на котором было события в массиве [0]
        }
    });


    document.addEventListener("mouseover", function (event) { //если курсор не над выпадающем меню - закрываем его
        var target = event.target;

        if (target.className != 'menu-list__item' && target.className != 'menu-list__dropdown' && target.className != "menu-list__submenu") {
            closeMenu();
        }
    });

    function closeMenu() { //ф-я закрытия меню
        var dropDown = document.getElementsByClassName('menu-list__dropdown');
        for (var i = 0; i < dropDown.length; i++) {
            dropDown[i].style.display = "none";
        }
    }

    var listView = document.getElementById("list");
    var tileView = document.getElementById("tile");
    var mainWrapper = document.getElementById("wrapper");
    var descrArray = document.getElementsByClassName("description");
    var skillClassArr = document.getElementsByClassName("skill");

    tileView.addEventListener("click", function () { //обработчик на вид: плитка
        tileView.style.fontWeight = "bold";
        listView.style.fontWeight = "normal";
        mainWrapper.style.flexDirection = "row";

        for (var i = 0; i < descrArray.length; i++) {
            descrArray[i].style.display = "block";
            descrArray[i].style.width = "300px";
            skillClassArr[i].style.backgroundImage = "url(img/skills/skill_bg.png)";
        }
    });

    listView.addEventListener("click", function () { //обработчик на вид: список
        tileView.style.fontWeight = "normal";
        listView.style.fontWeight = "bold";
        mainWrapper.style.flexDirection = "column";

        //for (var i = 0; i < descrArray.length; i++) { //при списке описание отображаем справа от картинки
        //    descrArray[i].style.display = "inline-block";
        //    descrArray[i].style.verticalAlign = "100px";
        //    descrArray[i].style.width = "160px";
        //    skillClassArr[i].style.backgroundImage = "url(img/skills/skill_bg_list.png)";
        //}
    });

    var allSkills = document.getElementById('allSkills');
    var mySkills = document.getElementById('mySkills');

    function allCheckView () { //вернуть checked по умолчанию
        var allCheckView = document.getElementsByClassName("allCheck");
        for (i = 0; i < allCheckView.length; i++) {
            allCheckView[i].checked = true;
        }
    }

    allSkills.addEventListener("click", function () {
        showSkills(skills, false);
        allCheckView();
    });


    mySkills.addEventListener("click", function () { //переделать по возможности (showSkills(skills, true);)
        allCheckView();
        mainWrapper.innerHTML = ''; //очистка поля

        for (i = 0; i < skills.length; i++) { // переделать, избежать копипасту
            var skill = skills[i];

            if (skill.rate > 0) {       //рисуем скиллы только с рейтингом
                mainWrapper.appendChild(generateSkillView(skill));
                $('.star-' + skill.id).raty({
                    path: 'img/star-rating',
                    cancel: true,
                    cancelPlace: 'right',
                    cancelOff: 'cancel-off.png',
                    cancelOn: 'cancel-on.png',
                    target: '.hint-' + skill.id,
                    space: false,
                    click: (function (skill) {
                        return function (score) {
                            skill.rate = score;
                        }
                    })(skill),
                    score: skill.rate
                });
            }
        }
    });



   //Тут сохраняются параметри для фильтрации
    var filterParams = {
        frontend: true,
        backend: true,
        database: true
    };

    //Тут храняться все скиллы(картинка+описание+звезды)
    var skills = [];

    var xhr = new XMLHttpRequest();     //получаем джсон-файл асинхронно
    xhr.open("GET", "data.json");
    xhr.onload = function (event) {
        skills = JSON.parse(event.target.responseText);//сохраняем ответ в массив skills
        showSkills(skills, true);
    };
    xhr.onerror = function (event) {    //обрабатываем ошибку получения джсона
        alert(event.target.status + ': ' + event.target.statusText);
    };
    xhr.send();


    function showSkills(skills, useFilter) {        //useFilter добавлен для отобр. allSkills & mySkills
        mainWrapper.innerHTML = '';                 //очистка поля

        for (i = 0; i < skills.length; i++) {
            var skill = skills[i];

            if (useFilter && !canShowSkill(skill)) {   //проверяем каждый скилл на возможность показа
                continue;
            }

            mainWrapper.appendChild(generateSkillView(skill));

            $('.star-' + skill.id).raty({
                path: 'img/star-rating',
                cancel: true,    //изменить на true для отображения кнопки отмены рейтинга
                cancelPlace: 'right',
                cancelOff: 'cancel-off.png',
                cancelOn: 'cancel-on.png',
                target: '.hint-' + skill.id,
                space: false,
                click: (function (skill) {
                    return function (score) {
                        skill.rate = score;
                    }
                })(skill),
                score: skill.rate
            });
        }
    }

    //Проряет можно ли скилл отображать(он проходит фильтрацию по параметрам filterParams)
    function canShowSkill(skill) {

        var mapDirectionToFilter = {
            'Front-End': 'frontend',
            'Back-End': 'backend',
            'Database': 'database'
        };

        if (!filterParams[mapDirectionToFilter[skill.direction]]) {
            return false;
        }

        if (filterParams.level === 'easy' && skill.difficulty > 4) {
            return false;
        } else if (filterParams.level === 'normal' &&  (skill.difficulty < 5 || skill.difficulty > 7)) {
            return false;
        } else if (filterParams.level === 'hard' && skill.difficulty < 8) {
            return false;
        }


        if (filterParams.popularity === "low" && skill.popularity != "Low") {
            return false;
        } else if (filterParams.popularity === "medium" && skill.popularity != "Medium") {
            return false;
        } else if (filterParams.popularity === "high" && skill.popularity != "High") {
            return false;
        }


        if (filterParams.year === "70" && (skill.year < 1970 || skill.year > 1980)){
            return false;
        } else if (filterParams.year === "80" && (skill.year < 1981 || skill.year > 1990)){
            return false;
        } else if (filterParams.year === "90" && (skill.year < 1991 || skill.year > 2000)){
            return false;
        }else if (filterParams.year === "00" && (skill.year < 2001 || skill.year > 2017)){
            return false;
        }

        if( filterParams.starRating === "1" && skill.rate != 1) {
            return false;
        } else if( filterParams.starRating === "2" && skill.rate != 2) {
            return false;
        } else if( filterParams.starRating === "3" && skill.rate != 3) {
            return false;
        } else if( filterParams.starRating === "4" && skill.rate != 4) {
            return false;
        } else if( filterParams.starRating === "5" && skill.rate != 5) {
            return false;
        }

        return true;
    }


    //ф-я отрисовки каждого скила по его данным из массива skills
    function generateSkillView(skill) {
        var skillNode = document.createElement('div');
        skillNode.classList.add('skill');
        if (skill.direction === 'Back-End') {
            skillNode.classList.add('back-block');
        } else if (skill.direction === 'Front-End') {
            skillNode.classList.add('front-block');
        } else {
            skillNode.classList.add('database-block');
        }

        var imgNode = document.createElement('img');
        imgNode.className = 'skill__image';
        imgNode.setAttribute('alt', skill.name);
        imgNode.setAttribute('title', skill.name);
        imgNode.src = 'img/skills/' + skill.id + '.png';
        skillNode.appendChild(imgNode);

        var descriptionNode = document.createElement('div');
        descriptionNode.className = 'description';
        skillNode.appendChild(descriptionNode);


        descriptionNode.appendChild(generateSkillAttributeView('Name', 'name', skill.name));
        descriptionNode.appendChild(generateSkillAttributeView('Direction', 'direction', skill.direction));
        descriptionNode.appendChild(generateSkillAttributeView('Difficulty', 'difficulty', skill.difficulty));
        descriptionNode.appendChild(generateSkillAttributeView('Popularity', 'popularity', skill.popularity));
        descriptionNode.appendChild(generateSkillAttributeView('Year', 'year', skill.year));

        var starNode = document.createElement('div');
        starNode.className = 'star-' + skill.id;
        starNode.innerText = 'Skill: ';
        descriptionNode.appendChild(starNode);


        var hint = document.createElement('div');
        hint.style.display = "none";
        hint.className = 'hint-' + skill.id;
        descriptionNode.appendChild(hint);

        return skillNode;
    }

    //генерируем описание к картинке
    function generateSkillAttributeView(name, className, value) {
        var attrNode = document.createElement('span');
        var nameNode = document.createElement('span');
        nameNode.innerText = name + ': ';
        var valueNode = document.createElement('span');
        valueNode.className = className;
        valueNode.innerText = value;
        attrNode.appendChild(nameNode);
        attrNode.appendChild(valueNode);
        attrNode.appendChild(document.createElement('br'));

        return attrNode;
    }

    //обработчик на смену фильтрации
    var allFiltrations = document.getElementsByClassName('filtration');
    for (i = 0; i < allFiltrations.length; i++) {
        var filtration = allFiltrations[i];
        filtration.addEventListener('change', createFiltrationAndApply);
    }

    //Меняем фильтрацию и по ней рисуем скиллы
    function createFiltrationAndApply(event) {
        filterParams = filterParams || {};

        var target = event.target;
        var filtrationName = target.name;

        if (target.type === 'checkbox') {
            filterParams[filtrationName] = target.checked;
        } else {
            filterParams[filtrationName] = target.value;
        }

        showSkills(skills, true);
    }


     //СЛАЙДЕР

    var slides = document.querySelectorAll('#slides .slide');
    var currentSlide = 0;
    var slideInterval = setInterval(nextSlide,2000);

    function nextSlide(){
        slides[currentSlide].className = 'slide';
        currentSlide = (currentSlide+1)%slides.length; //если слайд последний - возвр. на первый 5%5=0
        slides[currentSlide].className = 'slide showing';
    }
};


//google-map api
function initMap() {
    var myAdress = {lat: 50.377136, lng: 30.450861};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: myAdress
    });
    var marker = new google.maps.Marker({
        position: myAdress,
        map: map
    });
}

function getCurrentYear () {
    var currentDate = new Date();
    return currentDate.getFullYear()
}
