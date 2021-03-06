/* MAIN FILE : ALL ACTIONS TO CONNECT VIEW WITH SERVER */
import * as url from './js/url';
import * as db from './js/db';
import * as url from './js/url';
import * as newSlideshow from './js/newSlideshow';
import './style.css';

var res = {
    pwd: '',
    slides: [],
    title: ''
};

var bgPictureValue;
var bgColorValue;

const app = document.querySelector('#app');
const join = document.querySelector('#join');
const newBtn = document.querySelector('#new');
const slideshow = document.querySelector('#slideshow');
const workspace = document.querySelector('#workspace');
const actionsBtn = document.querySelector('#actions');

const error = document.querySelector('#error');
const success = document.querySelector('#success');

const pwdModal = document.querySelector('#pwdModal');
const pwdValue = document.querySelector('#password');
const passwordBtn = document.querySelector('#passwordBtn');
const passwordCancel = document.querySelector('#passwordCancel');
const overlay = document.querySelector('#overlay');

const shareModal = document.querySelector('#shareModal');
const linkOutput = document.querySelector('#linkOutput');
const shareCancel = document.querySelector('#shareCancel');
const pwdOutput = document.querySelector('#pwdOutput');

const linkBtn = document.querySelector('#linkBtn');
const linkCancel = document.querySelector('#linkCancel');

const btns = document.querySelector('.btns');
const newSlideBtn = document.querySelector('#newSlide');
const saveBtn = document.querySelector('#save');
const updateBtn = document.querySelector('#update');
const shareBtn = document.querySelector('#share');
const removeSlide = document.querySelector('#delete');

const bgBtn = document.querySelector('#bgBtn');
const bgCancel = document.querySelector('#bgCancel');
const bgPicture = document.querySelector('#bgPicture');
const bgColor = document.querySelector('#bgColor');

const closeNewBtn = document.querySelector('#slideshow .close');

var slidesContainer;

db.init();
url.check(app);

if(join){
    join.addEventListener('click', function(){
        const input = document.querySelector('#joinValue');
        if(input.value){
            url.go(input.value);
        } 
    });
}

newBtn.addEventListener('click', () => {
    const title = document.querySelector('#newValue');
    res.title = title.value;

    const tmp = document.createElement('div');
    tmp.classList.add('slides-container');
    app.innerHTML = '';
    app.appendChild(tmp);

    newSlideshow.showElement(slideshow);
    slidesContainer = document.querySelector('.slides-container');
    newSlideshow.insert(slideshow, slidesContainer, res.title);   
    newSlideshow.showElement(actions);
    newSlideshow.hideElement(document.querySelector('#update'));
    
});

actionsBtn.addEventListener('click', () => {
    newSlideshow.toggleElement(btns);
});

newSlideBtn.addEventListener('click', () => {
    newSlideshow.showElement(slideshow);
    newSlideshow.showElement(closeNewBtn);
    newSlideshow.init(slideshow, slidesContainer);
});

closeNewBtn.addEventListener('click', () => {
    newSlideshow.hideElement(slideshow);
});

saveBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    pwdModal.classList.add('active');
});

shareCancel.addEventListener('click', function(){
    shareModal.classList.remove('active');
    overlay.classList.remove('active');
});

linkCancel.addEventListener('click', function(){
    linkModal.classList.remove('active');
    overlay.classList.remove('active');
});

linkBtn.addEventListener('click', function(){
    const theLink = document.querySelector('.slide.active .wrapper-link a');
    theLink.href = linkModal.querySelector('#link').value;
    theLink.innerHTML = linkModal.querySelector('#linkTxt').value;

    linkModal.classList.remove('active');
    overlay.classList.remove('active');
});

updateBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    pwdModal.classList.add('active'); 
});

passwordCancel.addEventListener('click', () => {
    overlay.classList.remove('active');
    pwdModal.classList.remove('active');
});

passwordBtn.addEventListener('click', () => {
    const mdp = localStorage.getItem('pwd');
    const testMdp = pwdValue.value;

    if(url.getParameterByName('i')){
        if(mdp == testMdp){
            success.classList.add('active');
            setTimeout(() => {
                success.classList.remove('active');
            }, 3000);
            
            const newSlides = [];

            let slides = document.querySelectorAll('.slide');
            slides.forEach((slide) => {
                newSlides.push(slide.outerHTML);
            })
            db.update(url.getParameterByName('i'), newSlides);

            pwdOutput.innerHTML = mdp;
            linkOutput.innerHTML = window.location;
            

            overlay.classList.remove('active');
            pwdModal.classList.remove('active');

            shareModal.classList.add('active');
            overlay.classList.add('active');

        }else{
            error.classList.add('active');
            setTimeout(() => {
                error.classList.remove('active');
            }, 3000);
        }
    }else if(testMdp){
        success.classList.add('active');
        setTimeout(() => {
            success.classList.remove('active');
        }, 3000);

        res.pwd = testMdp;

        let slides = document.querySelectorAll('.slide');
        slides.forEach((slide) => {
            res.slides.push(slide.outerHTML);
        })
        if(localStorage.getItem('id')){
            db.remove(localStorage.getItem('id'));
        }
        localStorage.setItem('id', db.push(res));

        pwdOutput.innerHTML = testMdp;
        linkOutput.innerHTML = window.location.protocol + '//' + window.location.hostname + '/?i=' + localStorage.getItem('id');
        

        overlay.classList.remove('active');
        pwdModal.classList.remove('active');

        shareModal.classList.add('active');
        overlay.classList.add('active');
    }
});

bgBtn.addEventListener('click', () => {
    let img = document.querySelector('.slide.active > .bg > img');
    let bg = document.querySelector('.slide.active > .bg');
    console.log(img);
    img.setAttribute('src', bgPictureValue);
    bg.style.background = bgColorValue;

    bgPictureValue = '';
    bgColorValue = '';

    newSlideshow.closeBgSelect();
});

bgCancel.addEventListener('click', () => {
    newSlideshow.closeBgSelect();
});

bgPicture.addEventListener('change', (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
        bgPictureValue = reader.result;
    }
});

bgColor.addEventListener('change', (e) => {
    bgColorValue = e.target.value;
});

removeSlide.addEventListener('click', () => {
    let parent = document.querySelector('.slides-container');
    let tmp = document.querySelector('.slide.active');

    parent.removeChild(tmp);

    document.querySelectorAll('.slide')[0].classList.add('active');
});