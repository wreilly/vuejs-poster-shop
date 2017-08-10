new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { id: 1, title: 'Item 1' },
            { id: 2, title: 'Item 2' },
            { id: 3, title: 'Item 3' }
        ],
        cartItems: [] // empty to begin
    },
    methods: {
        addItem: function(passedInMyIndex) {
            console.log('We got: -01- ', this.items[passedInMyIndex].title)

            /* findIndex()
             http://ecma-international.org/ecma-262/7.0/index.html#sec-array.prototype.findindex
             [, thisArg]
             https://h3manth.com/new/blog/2014/thisarg-in-javascript/
             */
            var wr__that = this // Yep. The old "this equals that" or "that = this" trick. Works.

            var foundCartItemIndex = this.cartItems.findIndex(function(cartItemThisTime) {
                console.log('We got: -02- ', wr__that.items[passedInMyIndex].title)
                return cartItemThisTime.id === wr__that.items[passedInMyIndex].id
                }, wr__that); // <<< Pass in your thisArg as 2nd param to findIndex()

            if (foundCartItemIndex === -1) {
                // Not found in cart. Add it!
                var tempCartItemToAdd = this.items[passedInMyIndex]
                tempCartItemToAdd.qty = 1 // Tack on a 'qty' property
                this.cartItems.push(tempCartItemToAdd)
            } else {
                this.cartItems[foundCartItemIndex].qty += 1
            }
            this.total += 9.99
            console.log('in addItem this.total post ', this.total)
        }
    }
})

