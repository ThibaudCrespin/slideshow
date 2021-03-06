var database;

export const init = () => {
    const config = {
        apiKey: "AIzaSyBo9ND2NmHSGXpLb6-CRp8Epyn9lRQJbP8",
        authDomain: "slideshow-dc259.firebaseapp.com",
        databaseURL: "https://slideshow-dc259.firebaseio.com",
        projectId: "slideshow-dc259",
        storageBucket: "slideshow-dc259.appspot.com",
        messagingSenderId: "104655350834"
    };
    database = firebase.initializeApp(config).database().ref();
}

export const get = (a) => {
    return firebase.database().ref(a).once('value');
}

export const push = (object) => {
    let res = database.push(object);
    return res.key;
}

export const update = (a, obj) => {
    firebase.database().ref().child('/'+a)
        .update({ slides: obj });
}

export const remove = (a) => {
    firebase.database().ref(a).remove();
}