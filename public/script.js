var PRICE = 9.99 // const in ES6
var LOAD_NUM = 5 // 10 // 10 items at a go

new Vue({
    el: '#app',
    data: {
        total: 0,
        results: [], // ALL search results
        items: [],
/* bye-bye:
            { id: 1, title: 'Item 1' },
            { id: 2, title: 'Item 2' },
            { id: 3, title: 'Item 3' }
        ],
*/
        noMoreItems: false, // no more search results ... bottom of scrolling
        /*
        Instructor code:  Lesson 55 ~02:50
        This code goes in the HTML v-if="" directive, actually.
        You then don't need any data property here in the JavaScript...
    1.      items.length === results.length // << ALL results now onto items = DONE = No More
    2.      items.length === results.length && results.length > 0 // << to avoid the initial case where both are 0
         */
        cartItems: [], // empty to begin. 'qty', 'price' are additional properties, only in the cart.
        newSearch: 'Italia', // Default Search!
        lastSearch: '',
        searchCount: 0,
        loading: false, // true << Nope. default to handle INITIAL case (First page load)
        price: PRICE
    },
    computed: {
      noMoreItemsComputed: function() {
          return this.items.length === this.results.length && this.results.length > 0
      }
    },
    methods: {
        appendItems: function () {
          // LESSON 51 LOAD_NUM more...
            console.log('append away 10')
            if (this.items.length < this.results.length) {
                // More to go...
                var appendNext = this.results.slice(this.items.length, this.items.length + LOAD_NUM)
                this.items = this.items.concat(appendNext)
            } else {
                // No more to go!

                // Instructor code: He just doesn't address this "else" condition at all.
                // Dealt with elsewhere: computed property for noMoreItemsComputed instead. Cleaner (seems ta be)

                // Actually: this 'else' condition will be seen upon "mounted()" - Not that big a deal... (I guess)
                console.log('appendItems: No more to go!')
                // this.noMoreItems = true // ! << Not using anymore
            }
        },
        onSubmit: function (eventPassed) {
            /* Lesson 59
            Instructor code: v. simple:
             Just checks this.newSearch.length
             if (this.newSearch.length) {
               // we're good. code goes here...
             } else {
               // we do (Absolutely) nothing
             }

             WR__ code: I did a LOT more. Cheers.
             */
            // Dealing with "Loading..."
            // this.loading = true // Move below re: logic to check search term is NOT EMPTY
            this.items = [] // empty out the page's results contents upon clicking the new search Submit

            /*
             Just for fun, (we used) old fashioned event object preventDefault() here in the invoked method.
             (Rather than using Vue.js's ".prevent" available over on the template directive, as in:  v-on:submit.prevent)
             */
            // eventPassed.preventDefault()

            console.log('onSubmit submitted, and this.newSearch is ', this.newSearch)
            if (!eventPassed) {
                // First time page load, we fire onSubmit() but with no actual Event ...
                // Just to get initial search results
                // using initial this.newSearch  ("Italia")

                this.loading = true

                // Actually, just run it, no param
                // Why? It simply references known var.
                // myHttpGet(this.newSearch)
                this.myHttpGet() // << will be "Italia" first time
            } else {
                // All other times, comes with Event from the Form:
                console.log('onSubmit submitted, and eventPassed is ', eventPassed)
                // eventPassed.target is the <form> element entire
                /*
                NOTE: Kinda lucky I found this, in the L-O-O-O-N-G list of nested properties on the Event object.  >> .target[0].value <<
                Sheesh.
                 */
                // eventPassed.target["0"].value is the search term! (e.g. "Italiana")
                // Weird: .target["0"] << wtf ??
                console.log('onSubmit submitted, and eventPassed.target["0"].value is ', eventPassed.target["0"].value)
                // O.K. to drop the double-quotes
                // (why "" work is the big Q.)
                console.log('onSubmit submitted, and eventPassed.target[0].value is ', eventPassed.target[0].value)

                // Mo' stuff: Not woikin'!
                // https://stackoverflow.com/questions/43754906/event-target-value-not-retrieving-value-properly
                console.log('onSubmit submitted, and eventPassed.target.getAttribute(\'value\') is ', eventPassed.target.getAttribute('value')) // null !?
                console.log('onSubmit submitted, and eventPassed.target[0].getAttribute(\'value\') is ', eventPassed.target[0].getAttribute('value')) // also null !?

                // Ensure search string NOT EMPTY
                if (!eventPassed.target[0].value) {
                    // BAD
                    // Q. Hmm, if we "do nothing," is that O.K. UX? We'll see.
                    // A. No!
                    this.results = [] // Empty out current search
                    // this.items = [] // Better empty 'em both, kid
                    this.searchCount = 0 // reset!
                } else {
                    // OK
                    this.loading = true
                    this.newSearch = eventPassed.target[0].value
                    // Actually, just run it, no param
                    // Why? It simply references known var.
                    // myHttpGet(this.newSearch)
                    this.myHttpGet() // << will be whatever user entered, subsequenttimes

                }

            }
        },
        myHttpGet: function() {

            this.$http
                // .get('/search/'.concat('Alighieri'))
                .get('/search/'.concat(this.newSearch))
                .then(function(response) {
                console.log(response)

                // Whamma-jamma:
                    // Lesson 49 ~02:49 LOAD SCROLLING - 10 at a time
                    this.results = response.data // ALL Search Results
                    // Now use appendItems() even for initial 10:
                    this.appendItems()
                    // this.items = response.data.slice(0,LOAD_NUM) // FIRST 10 ONLY
                    // Also: response.body


                    this.searchCount = response.data.length
                    this.lastSearch = this.newSearch
                    console.log('Here is one: ', this.items[1]) /*
                     .link: 'http://i.imgur.com/jD7m7oc.jpg'
                     .title: 'A monument to lab rats killed in experiments.'
                     */
                    this.loading = false
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
    // ****** LIFECYCLE HOOKS ****
    beforeCreate: function () {
        console.log('HOOK -01- beforeCreate')
        /*
        Too Early!
         [Vue warn]: Error in beforeCreate hook: "TypeError: this.onSubmit is not a function"
         */
        // this.onSubmit(this.newSearch)
    },
    created: function () {
        console.log('HOOK -02- created')
        // this.onSubmit(this.newSearch) // << No.
        // this.onSubmit('Switzerland') // << No.
        /*
        Worked okay. (below)
        Instructor used mounted() but said created() should work too. Okay.
         */
        this.onSubmit()
    },
    beforeMount: function () {
        console.log('HOOK -03- beforeMount')
    },
    mounted: function () {
        console.log('HOOK -04- mounted')
        /*
        Instructor: Lesson 41
        Worked. (of course)
         */
        /* N.B. The 'this' here, inside mounted(), is of course the Vue instance! :o)
        See below re: Lesson 51...
         */
       // this.onSubmit()

        // Yes, up here:
        var myVueThis = this // << presto change-o
        console.log('myVueThis up in mounted() ', myVueThis)
/*
 myVueThis up in mounted()  Vue$3 {_uid: 0, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: Vue$3, …}$attrs: (...)
 */

        // LESSON 50
// https://github.com/stutrek/scrollMonitor
// LESSON 51
        /* We initially placed this code BELOW / OUTSIDE OF the Vue instance ...
         Time to move it INSIDE (to mounted())

         Also - because scrollMonitor is a 3rd party JavaScript library that is *NOT* integrating with Vue.js per se, we must carefully treat the 'this' variable.
         'this' is usually the Vue instance, but inside of scrollMonitor's "watcher" the 'this' is that watcher.
         So we do the "this onto that" little sleight of hand and presto change-o, we are ALL SET:
         */
        var elem = document.getElementById('product-list-bottom')
        var watcher = scrollMonitor.create(elem)
        watcher.enterViewport(function() {
            // console.log('scroll monitor on the scene!') // << Yep.
            // Now time to DO something!
            // Hmm. No, not down in here:
            // var myThis = this
            // console.log('myThis! ', myThis)

            console.log('this in watcher callback? ', this)
            /*
             this in watcher callback?
             o {watchItem: div#product-list-bottom, container: t, offsets: {…}, callbacks: {…}, locked:
             */


            // this.appendItems() // NOPE append LOAD_NUM more ...
            /* Note: The next line does get executed upon mounting, EVEN THOUGH (in my humble opinion) our Element at that particular moment is NOT "in the Viewport". Eh - what do I know. Maybe it is... */
            myVueThis.appendItems() // Yep
        })




    },
    beforeUpdate: function() {
        console.log('HOOK -05- beforeUpdate')
    },
    updated: function () {
        console.log('HOOK -06- updated')
    },
    beforeDestroy: function() {
        console.log('HOOK -07- beforeDestroy')
    },
    destroyed: function () {
        console.log('HOOK -08- destroyed')
    },
    // ****** /LIFECYCLE HOOKS ****

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


// console.log(scrollMonitor)
/*
 HOOK -04- mounted

 script.js:186
 t {item: body, watchers: Array(0), viewportTop: 0, viewportBottom: 726, documentHeight: 952, …}
 DOMListener: ƒ function()contentHeight: 952destroy: ƒ function()documentHeight: 952eventTypes: (7) ["visibilityChange", "enterViewport", "fullyEnterViewport", "exitViewport", "partiallyExitViewport", "locationChange", "stateChange"]item: bodylatestEvent: nullrecalculateLocations: ƒ function()update: ƒ function()viewportBottom: 726viewportHeight: 726viewportTop: 0watchers: []__proto__: Object

 */

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