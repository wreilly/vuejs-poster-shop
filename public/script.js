new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { title: 'Item 1' },
            { title: 'Item 2' },
            { title: 'Item 3' }
        ],
        cartItems: [] // empty to begin
    },
    methods: {
        addItem: function(passedInMyItem) {
            console.log('We got: ', passedInMyItem.title)
            this.cartItems.push(passedInMyItem)
            this.total += 9.99
            console.log('in addItem this.total post ', this.total)
        }
    }
})

