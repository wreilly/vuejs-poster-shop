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
        addItem: function(passedInMyIndex) {
            console.log('We got: ', this.items[passedInMyIndex].title)
            this.cartItems.push(this.items[passedInMyIndex])
            this.total += 9.99
            console.log('in addItem this.total post ', this.total)
        }
    }
})

