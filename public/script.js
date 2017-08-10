console.log('It works.');
console.log(Vue);

new Vue({
    el: '#app',
    data: {
        total: 0
    },
    methods: {
        addItem: function() {
            this.total += 9.99
            console.log('in addItem this.total post ', this.total)
        }
    }
})

