import { initializeApp } from 'firebase/app';

// Importing firebase methods from firestore object
import{
    addDoc,collection,
    deleteDoc,doc,
    getFirestore,onSnapshot,
    orderBy,query,
    serverTimestamp,
}from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNbvIjsWol5EL8jUo8D4wmlK1iVZJkV4A",
    authDomain: "todo-list-5b91d.firebaseapp.com",
    projectId: "todo-list-5b91d",
    storageBucket: "todo-list-5b91d.appspot.com",
    messagingSenderId: "818189213823",
    appId: "1:818189213823:web:b64ce7f3629f5e862b1f4a"
};

initializeApp(firebaseConfig);

// Initialize database
const dataBase = getFirestore()

// database collection refference
const collectionRefference = collection(dataBase, 'Todo-List-App');

// using query
const q = query(collectionRefference, orderBy('createdAt'));

const showList = document.querySelector('.showList');
const addList = document.querySelector('.addList');
const alert = document.querySelector('.alert');

// creating a reaLtime collection data
onSnapshot(q, (snapshot) => {
    var todoLists = [];
    snapshot.docs.forEach((doc) => {
        todoLists.push({...doc.data(), id: doc.id});
    });
    console.log(todoLists);
    todoLists.forEach((todos) => {
        function createListsElement() {
            const createParent = document.createElement('div');
            const createChild2 = document.createElement('div');
            const createChild = document.createElement('div');
            const createText = document.createElement('p');
            const createDelete = document.createElement('i');

            function setAttributes(){
                createParent.setAttribute('class', 'createParent');
                createChild2.setAttribute('class', 'createChild2')
                createChild.setAttribute('class', 'createChild');
                createText.setAttribute('class', 'createText');
                createDelete.setAttribute('class', 'createDelete fas fa-trash-alt');
            }setAttributes();

            function addTextToUserList(){
                createText.innerText = todos.userList;
            }addTextToUserList();

            function addEvent(){
                createDelete.addEventListener('click', ()=>{
                    const doccumentRefference = doc(dataBase, 'Todo-List-App', todos.id);
                    deleteDoc(doccumentRefference).then(() => {
                        addList.reset();
                        location.reload();
                    });
                });
            }addEvent();

            function appendElement() {
                createChild.append(createText, createDelete)
                createChild2.append(createChild)
                createParent.append(createChild2);
                showList.append(createParent);
            }appendElement();

        }createListsElement();
    });
});
const onlineCont = document.querySelector('.onlineCont');
const wrapper = document.querySelector('.wrapper');
const close = document.querySelector('.close');

function checkOnline(){
    let checkIfUserIsOnline = navigator.onLine;
    if (checkIfUserIsOnline) {
        setTimeout(() => {
            wrapper.style.opacity = '1';
            wrapper.style.transition = 'linear 2s'
            onlineCont.style.display = 'none';
        }, 1000);
    }else{
        setTimeout(() => {
            onlineCont.style.display = 'block';
            wrapper.style.opacity = '0';
            close.addEventListener('click', ()=> {
                onlineCont.style.display = 'none';
            })
        }, 1000);
    }
}
document.addEventListener('DOMContentLoaded', ()=> {
    checkOnline()
});


// Adding user lists
addList.addEventListener('submit', (event) => {
    event.preventDefault();
    if (addList.userList.value === '') {
        alert.innerText = 'Kindly input some text';
        addList.userList.addEventListener('change', ()=>{
            alert.innerText = '';
        })
    }else{
        addDoc(collectionRefference, {
            userList : addList.userList.value,
            createdAt : serverTimestamp()
        }).then(() => {
            console.log('Stored');
            addList.reset();
            alert.innerText = 'Successfully Stored To The Database!';
            setTimeout(() => {
                alert.innerText = '';
                location.reload()
            }, 3000);
        }).catch((err) => {
            alert.innerText = 'An error occured while storing your list to database';
            setTimeout(() => {
                alert.innerText = '';
            }, 1000);
            console.log(err.message);
        });
    }
});
