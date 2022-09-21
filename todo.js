// Tüm Elementleri seçme:
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo"); //İçindeki değeri almak için
const todoList = document.querySelector(".list-group"); //Todoları bunun içine ekleyeceğiz.
const firstCardBody = document.querySelectorAll(".card-body")[0]; //Bunun içine alert ekleyeceğiz. Parent ı olacak.
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.getElementById("clear-todos");

eventListeners(); //Tüm event listenerları bu fonksiyonun içinde toplayağız ve sayfa açıldığında çalışacak.

function eventListeners() {
    form.addEventListener("submit", addTodo); //form submit olduğunda addTodo fonksiyonunu çalıştıracak.
    document.addEventListener("DOMContentLoaded", LoadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);

}
function clearAllTodos() {
    if (confirm("Tüm Todoları temizlemek istediğinize emin misiniz?")) { //True olduğunda çalışacak şekilde.
        // Todoları arayüzden temizleme:
        // todoList.innerHTML = ""; //Bu yöntem biraz yavaş.
        while (todoList.firstElementChild != null) { //Bu yöntem innerHtml methodundan daha hızlı ancak proje büyük değilse önceki tercih edilebilir.
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");

    }
}
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase(); //Büyük küçük harf duyarlılığı olmaması açısından hepsini küçük harf yapıyoruz.
    const listItems = document.querySelectorAll(".list-group-item"); // Li leri çekiyoruz.(Todoları)

    listItems.forEach(function (liItem) { //Her biri üzerinde gezineceğiz.
        const text = liItem.textContent.toLowerCase(); //Aynı sebepten dolayı küçük harf.
        if (text.indexOf(filterValue) === -1) { //IndexOf ile filter içine yazdığımız herhangi bir değerin li lerin içinde olup olmadığını kontrol ediyoruz. Eğer yoksa -1 dönüyor.
            liItem.setAttribute("style", "display : none!important"); //Bulamadığı için inline CSS ile display özelliğini none yapıyoruz. important ekleme sebebimiz Bootstrap'teki display block özelliğinin important olarak baskın olması.

        }
        else {
            liItem.setAttribute("style", "display : block");
        }

    })
}
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove(); //i elementinin parentı a, onun parentı ise li. Biz li ye ulaşıp onu siliyoruz.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); //Bizim storage da stokladığımız şey li elementinin text contenti. Bu fonksiyona onu göndereceğiz.
        showAlert("success", "Başarıyla kaldırıldı.");
    }
}
function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo, index) { //Her bir eleman üzerinde geziyoruz ve eşit olanı bulup onu sileceğiz. Splice methodu için index numarası lazım. forEach methodu bize onu da veriyor.
        if (deletetodo === todo) {
            todos.splice(index, 1); //Önce index sonra o indexten itibaren kaç tane eleman sileceksek.
        }
    })
    // Sildikten sonra elimizde kalan todos arrayinin tekrardan storage a yazacağız.
    localStorage.setItem("todos", JSON.stringify(todos));

}
function LoadAllTodosToUI() {
    let todos = getTodosFromStorage(); //Tekrar tekrar yazmaya gerek olmadan storagedan todos ları çekiyoruz.

    todos.forEach(function (todo) {
        addTodoToUI(todo); //Daha önce yazdığımız fonksiyonu kullanıyoruz. Her bir todoyu gezinerek tekrardan UI ya yazmış oluyoruz.
    })
}
function addTodo(e) {
    const newTodo = todoInput.value.trim(); //Forma yazılan değeri alıp newTodo değişkenine atıyoruz.Trim fonksiyonu ile string in başındaki ve sonundaki boşlukları siliyoruz.
    const todos = getTodosFromStorage();

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir Todo giriniz..."); //Input un içi boşsa showAlert fonksiyonu çalışacak. 
        // Öncelikle alertin tipini gönderiyoruz.(success ya da danger), Daha sonra içindeki mesajı.
    }
    else if (todos.includes(newTodo)) {
        showAlert("danger", "Böyle bir Todo zaten mevcut..."); //Input a yazılan şey daha önce yazıldıysa alert veriyoruz . 
    }
    else {
        addTodoToUI(newTodo); //Daha sade bir görünüm için bu fonksiyonları dışarıda ayrı olarak yazıyoruz.
        showAlert("success", "Başarıyla eklendi.");
        addTodoToStorage(newTodo); //Todoları storage a ekleme.
    }


    e.preventDefault(); // Submit durumunda yönlendirme olmasın diye default özelliğini kapatıyoruz.
}
function getTodosFromStorage() { //Storage tan todoları alma. Bunu birden fazla kullanacağımız için ayrı olarak yazdık.
    let todos;

    if (localStorage.getItem("todos") === null) { //Eğer daha önceden localstorage da key oluşturulmamışsa oluşturuyoruz.
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos")); //Eğer varsa onu seçiyoruz. İçeride string olarak tutulduğu için json.parse ile onu array olarak alıyoruz.
    }
    return todos;
}
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage(); //Bu fonksiyonu burada da yazabildik.

    todos.push(newTodo); //newTodo yu array in içine attık.

    localStorage.setItem("todos", JSON.stringify(todos)); //todos adıyla key açtık ve bizdeki todos adındaki array i string olarak value değerine ekledik.


}
function showAlert(type, message) { //Önce alertin tipini sonra da mesajı alan bir fonksiyon oluşturuyoruz.
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert); //FirstCardbody ye child olarak ekledik.
    setTimeout(function () {  //SetTimeout fonksiyonu ile alertimiz bizim belirledğimizi ms kadar görünecek sonra içine yazdığımız remove ile kaybolacak.
        alert.remove();
    }, 1000);

}
function addTodoToUI(newTodo) { //String değerini list item olarak UI'a ekleyecek.
    // List Item oluşturma
    const listItem = document.createElement("li");
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item"
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";    // ToDo nun adını text node olarak ekleme. Zaten newTodo olarak almıştık.

    listItem.appendChild(document.createTextNode(newTodo)); //Li elementinin text contenti newTodo ya yazdığımız şey olacak.
    listItem.appendChild(link); //link li elementinin bir çocuğu. 

    todoList.appendChild(listItem); //Oluşturduğumuz list Item o ul nin içine ekleyeceğiz. Todolist e 
    todoInput.value = ""; //Eklendikten sonra input un içine boşaltmak için.
}