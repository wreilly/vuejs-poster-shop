var PRICE = 9.99 // const in ES6

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { id: 1, title: 'Item 1' },
            { id: 2, title: 'Item 2' },
            { id: 3, title: 'Item 3' }
        ],
        cartItems: [], // empty to begin. qty, price additional properties in the cart.
        search: ''
    },
    methods: {
        onSubmit: function (eventPassed) {
            eventPassed.preventDefault()

            console.log('onSubmit submitted, and this.search is ', this.search)

            // console.log(this.$http)

            this.$http
                .get('/search/'.concat('90s'))
                .then(function(response) {
                console.log(response)
                })
        },
        inc: function(cartItem) {
            console.log('inc ? cartItem, cartItem.qty ', cartItem, cartItem.qty)
          cartItem.qty += 1
            console.log('inc ? cartItem.qty ', cartItem.qty)
        },
        dec: function(cartItem) {
            // Don't allow going below 0! (nor "to zero")
            if (cartItem.qty > 1) {
                cartItem.qty -= 1
            } else {
                // if we get here it is 0 - do not display '0' to screen. just remove from cart
                // console.log('You can\'t take one out, because right now there are 0 of this bad boy in cart ', cartItem.title)
                var myIndex = this.cartItems.findIndex((it) => it.id === cartItem.id)
                this.cartItems.splice(myIndex, 1)
            }

        },
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

                /*
                (RE)-Learning!!!
                1. Do NOT just assign ('=') an Object onto a new variable.
                Q. Why?
                A. That new variable is pointing to the SAME Object. Not what you want.

                2. Instead, use Object.assign() ...
                 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
                 */

/* Not What You Want:
                var tempCartItemToAdd = this.items[passedInMyIndex]
*/
                var tempCartItemToAdd = Object.assign({}, this.items[passedInMyIndex]) // << YES.
                tempCartItemToAdd.qty = 1 // Tack on a 'qty' property
                tempCartItemToAdd.price = PRICE // Likewise a (hard-coded) price - same for all
                this.cartItems.push(tempCartItemToAdd)
            } else {
                this.cartItems[foundCartItemIndex].qty += 1
            }
            this.total += 9.99
            console.log('in addItem this.total post ', this.total)
        }
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2))
        }
/*
        // Who knew?
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
        var myFormatter = Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2 // with : 2 get $123.80 << with : 0 I wasn't getting the final '0' in '.80'  - it was '.8' (not cool)
        })

        return myFormatter.format(priceNumber)
*/

    }
})

