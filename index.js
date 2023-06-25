import { menuArray } from './data.js'

const menuEl = document.getElementById('menu')
const orderEl = document.getElementById('order')
const payForm = document.getElementById('payment')
let order = {} 

function initializeMenu(){
    for(const menuItem of menuArray)
        menuEl.appendChild(createMenuItemEl(menuItem))
}

function createMenuItemEl(menuItem){
    let menuItemEl = document.createElement("div")
    menuItemEl.id = menuItem['id']
    menuItemEl.className = "menu-item"
    
    menuItemEl.innerHTML += `
        <img src="${menuItem['emoji']}"/>
        <div>
            <h4>${menuItem['name']}</h4>
            <p>${menuItem['ingredients']}</p>
            <h5>$${menuItem['price']}</h5>
        </div>
        <button class="add-item">+</button>
    `
    
    return menuItemEl
}

function renderOrder(){
    let totalPrice = 0
    let totalItems = 0   
    orderEl.innerHTML = ""
    
    if(Object.keys(order).length > 0){
        orderEl.innerHTML += `<h4 id="order-title">Your order</h4>`
        
        for(const item in order){
            const calcPrice = order[item]['price'] *  order[item]['count']
            totalPrice += calcPrice
            totalItems += order[item]['count']       
            orderEl.appendChild(generateOrderItem(item, order[item]['count'], calcPrice))
        }
        
        orderEl.appendChild(generateOrderItem("Total Price", totalItems, totalPrice, "total-price"))
        orderEl.innerHTML += `<button id="btn-click">Complete order</button>`
    } 
}

function generateOrderItem(name, count, totalPrice, id=false) {
    const itemEl = document.createElement("div")
    if(id)
        itemEl.id = id
    itemEl.className = "order-item"
    
    itemEl.innerHTML += `
            <h4>${ name }</h4>
            ${ count > 1 ? `<h6>x${ count }</h6>` : "" }
            <p class="remove-item">${id ? "remove all" : "remove" }</p>
            <h5>$${ totalPrice }</h5>`
     

    return itemEl
}

function bindAddEvent(){
    const buttonsListEl = document.getElementsByClassName('add-item')
    for(let i = 0; i < buttonsListEl.length; i++){
        buttonsListEl[i].addEventListener("click", event => {
            const itemParent = buttonsListEl[i].parentElement.children[1].children
            const itemName = itemParent[0].textContent
            const itemPrice = parseInt(itemParent[2].textContent.replace("$", ""))
            
            if(order[itemName])
                order[itemName]['count'] += 1
            else
                order[itemName] = { count: 1, price: itemPrice}
            console.log(order)
            renderOrder()
            bindRemoveEvent()
            bindCompleteEvent()
        }) 
    }   
}

function bindRemoveEvent(){
    const removeListEl = document.getElementsByClassName('remove-item')

    for(let i = 0; i < removeListEl.length; i++){
        removeListEl[i].addEventListener("click", event => {
            const itemParent = removeListEl[i].parentElement.children
            const itemName = itemParent[0].textContent
            
            if(removeListEl[i].textContent === "remove all")
                order = {}
            else if(order[itemName]['count'] === 1)
                delete order[itemName]
            else
                order[itemName]['count'] -= 1
            
            renderOrder()
            bindRemoveEvent()
            bindCompleteEvent()
            
        }) 
    }
}

function bindCompleteEvent(){
    document.getElementById('btn-click')?.addEventListener('click', event => {
        const paymentFormEl = document.getElementById('payment')
        paymentFormEl.style.display = "flex"
    })  
}

initializeMenu()
bindAddEvent()

document.getElementById('proceed-payment').addEventListener('click', event => {
    if(payForm.checkValidity()){
        event.preventDefault()
        
        const loadingEl = document.getElementById('loading-screen')  
        loadingEl.style.display = "flex"
        loadingEl.children[0].style.display = "flex"
        loadingEl.children[1].style.display = "flex"
        
        setTimeout(() => {
            loadingEl.children[0].style.display = "none"
            loadingEl.children[1].style.display = "none"
            loadingEl.children[2].style.display = "flex"
            loadingEl.children[3].style.display = "flex"
        }, 3000)
        
        setTimeout(() => {
            payForm.style.display = "none"
            payForm.reset()
            loadingEl.style.display = "none"
            loadingEl.children[2].style.display = "none"
            loadingEl.children[3].style.display = "none"
            order = {}
            renderOrder()
        }, 6000)
    }
})

