"use strict";

new Vue({
    el: '#app',
    data: {
      name: '',
      placeholder: 'ДД.ММ.ГГГГ',
      dateValue: '',
      date: 'ДД.ММ.ГГГГ',
      saves: localStorage.saves ? JSON.parse(localStorage.saves) : [],
      savesListDisplay: false,
      deleteMode: false
    },
    methods: {
      checkSymbol: function (ev) {
        if (ev.key == 'Backspace') {
          this.dateValue = this.dateValue.slice(0, this.dateValue.length - 1);
          if (this.dateValue.length == 2 || this.dateValue.length == 5) {
            this.dateValue = this.dateValue.slice(0, this.dateValue.length - 1);
          }
          this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
          ev.preventDefault();
          return false;
        }
        switch (this.dateValue.length) {
          case 0: {
            if (ev.key.match(/[0-3]/)) {
              this.dateValue = ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 1: {
            if (ev.key.match(/\d/)) {
              this.dateValue += ev.key + '.';
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 3: {
            if (ev.key.match(/[0-1]/)) {
              this.dateValue += ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 4: {
            if (ev.key.match(/\d/)) {
              this.dateValue += ev.key + '.';
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 6: {
            if (ev.key.match(/[1-2]/)) {
              this.dateValue += ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 7: {
            if (ev.key.match(/\d/)) {
              this.dateValue += ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 8: {
            if (ev.key.match(/\d/)) {
              this.dateValue += ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
          case 9: {
            if (ev.key.match(/\d/)) {
              this.dateValue += ev.key;
              this.date = this.dateValue + '' + this.placeholder.slice(this.dateValue.length);
            }
            break;
          };
        }
        ev.preventDefault();
      },
      changeMatrix: function (newMatrix) {
        if (!this.deleteMode) {
          this.date = newMatrix;
          this.dateValue = newMatrix;
        }
      },
      appearSavesList: function () {
          this.savesListDisplay = true;
      },
      calculate: function () {
        if (this.dateValue.match(/\d\d\.\d\d\.\d\d\d\d/) || this.name != '') {
          this.saves.push({
            date: this.date,
            name: this.name
          });
          localStorage.saves = JSON.stringify(this.saves);
        }
      },
      deleteMatrix: function(index) {
        this.saves.splice(index, 1);
      }
    }
})