module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, cijena: 0};
        }
        storedItem.qty++;
        storedItem.cijena = storedItem.item.cijena * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.cijena;
    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].cijena -= this.items[id].item.cijena;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.cijena;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].cijena;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};