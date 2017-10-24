/**
 *  Created by Liu Yuhong on 15/11/17.
 *  Input field filters module
 *
 *  functions:
 *      spacesFilter: remove spaces;
 *      numberOnly: remove characters other than number
 */

var inputFilter = {
    //remove spaces
    'spacesFilter': function() {
        if(undefined == this) return false;
        this.value = (this.value.replace(/\s/g, ''));
    },
    //remove characters other than number
    //example: $(input).on('keydown', numberOnly);
    'numberOnly': function() {
        if(undefined == this) return false;
        this.value = this.value.replace(/\D+/g, '');
    },
    "cellPhoneNumber": function(val) {
        //return (/^0?(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(val));
        return (/^0?(13|14|15|17|18|19)+\d{9}$/.test(val));
    },
    //example: $(input).on('keydown', maxLength);   //input[type=number]
    "maxLength": function(e) {
        if(e.keyCode == 8) return;
        if(this.hasAttribute('maxlength')) {
            var val = this.value,
                length = this.getAttribute('maxlength');
            if(val.length >= length) {
                this.value = val.substring(0, length);
                return false;
            }
        }
    }
};

module.exports = inputFilter;