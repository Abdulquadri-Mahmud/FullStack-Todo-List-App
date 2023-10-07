getDocs(collectionRefference)
    .then((snapshot) => {
        let todoList = []
        snapshot.docs.forEach((doc) => {
            todoList.push({...doc.data(), id: doc.id})
        })
        console.log(todoList);
})