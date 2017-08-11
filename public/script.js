var PRICE = 9.99 // const in ES6

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
/* bye-bye:
            { id: 1, title: 'Item 1' },
            { id: 2, title: 'Item 2' },
            { id: 3, title: 'Item 3' }
        ],
*/
        cartItems: [], // empty to begin. 'qty', 'price' are additional properties, only in the cart.
        newSearch: '',
        lastSearch: '',
        searchCount: 0
    },
    methods: {
        onSubmit: function (eventPassed) {
            eventPassed.preventDefault()

            console.log('onSubmit submitted, and this.newSearch is ', this.newSearch)

            // console.log(this.$http)

            this.$http
                // .get('/search/'.concat('Alighieri'))
                .get('/search/'.concat(this.newSearch))
                .then(function(response) {
                console.log(response)
                    this.items = response.data // Also: response.body
                    this.searchCount = response.data.length
                    this.lastSearch = this.newSearch
                    console.log('Here is one: ', this.items[1]) /*
                     .link: 'http://i.imgur.com/jD7m7oc.jpg'
                     .title: 'A monument to lab rats killed in experiments.'
                     */
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

/* ***************************
DATA STUFF FROM IMGUR RESPONSE
******************************
 this.$http
 .get('/search/'.concat('90s'))
 .then(function(response) {
 console.log(response)
 })
 },


 RESPONSE OBJECT from Imgur call
 +++++++++++++++++++++++++++

 onSubmit submitted, and this.newSearch is
 script.js:26
 Response {
 url: "/search/Alighieri",
 ok: true,
 status: 200,
 statusText: "OK",
 headers: Headers, …}
 body:
 Array(6)
 0: {id: "0h4uXVP", title: "Dante Alighieri - "Nature"", description: "Therefore, we must preserve it to the best of our ability. ", datetime: 1440707779, type: "image/png", …}
 1: {id: "T7GO163", title: "Dante Alighieri Highschool Expansion, Bucharest", description: null, datetime: 1465051440, type: "image/jpeg", …}
 2: {id: "egoEji1", title: ""E quindi uscimmo a riveder le stelle" ", description: null, datetime: 1408057407, type: "image/jpeg", …}
 3: {id: "NtTEqqZ", title: "Found this while reading about Dante Alighieri; Oops", description: null, datetime: 1390594144, type: "image/png", …}
 4: {id: "HRam61M", title: "Meet my friend Sir Raphael „Abrams“  Alighieri", description: "We are homies for 1 and a half years now", datetime: 1455898476, type: "image/jpeg", …}
 5: {id: "ckMhcmQ", title: "Weather stuff", description: "That moment when you are hearing a local radio and…from Argentina. There about 40° outside i think. ",
 datetime: 1451335277,
 type: "image/jpeg", …}
 length: 6
 __proto__: Array(0)
 bodyText: "[{"id":"0h4uXVP","title":"Dante Alighieri - \"Nature\"","description":"Therefore, we must preserve it to the best of our ability. ... ]"
 headers: Headers {map: {…}}
 ok: true
 status: 200
 statusText: "OK"
 url: "/search/Alighieri"
 data: (...)
 __proto__: Object

 +++++++++++++++++++++++++++




 --------------------
 ONE ENTRY FROM IMGUR RESPONSE DATA ARRAY:
 --------------------

 "/search/Alighieri"
 data : Array(6)
 0 : account_id : 23588903
 account_url : "TophamHattNWR"
 ad_type : 0
 ad_url : ""
 animated : false
 bandwidth : 488840
 comment_count : 2
 datetime : 1440707779
 description : "Therefore, we must preserve it to the best of our ability. "
 downs : 4
 favorite : false
 height : 300
 id : "0h4uXVP"
 in_gallery : true
 in_most_viral : false
 is_ad : false
 is_album : false
 link : "http://i.imgur.com/0h4uXVP.png"
 nsfw : false
 points : 7
 score : 7
 section : ""
 size : 122210
 tags : (2) [{…}, {…}]
 title : "Dante Alighieri - "Nature""
 topic : "Funny"
 topic_id : 2
 type : "image/png"
 ups : 11
 views : 4
 vote : null
 width : 200
 __proto__ : Object

 ---------------------

 */